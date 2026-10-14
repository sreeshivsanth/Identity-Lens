"""
IdentityLens Multi-User Authentication & RBAC Service
Supports Google OAuth 2.0 / OpenID Connect & Superadmin credentials.
"""
import hmac
import hashlib
import base64
import json
import time
from typing import Optional, Dict, Any, List
from config import settings

class AuthService:
    def __init__(self):
        self.secret_key = settings.ADMIN_JWT_SECRET.encode("utf-8")
        # In-memory multi-user store with default admin pre-seeded
        self.users: Dict[str, Dict[str, Any]] = {
            "admin-root": {
                "id": "admin-root",
                "email": settings.ADMIN_ROOT_USERNAME,
                "name": "Platform Admin",
                "role": "ADMIN",
                "avatar_url": None,
                "created_at": time.time(),
                "last_login": time.time(),
                "scan_count": 14,
                "quota": 999999,
            }
        }
        self.admin_emails = [e.strip().lower() for e in settings.ADMIN_EMAILS.split(",") if e.strip()]

    def _generate_token(self, payload: Dict[str, Any], exp_seconds: int = 86400 * 7) -> str:
        """Generates a secure HMAC-SHA256 signed session token."""
        header = {"alg": "HS256", "typ": "JWT"}
        payload_copy = payload.copy()
        payload_copy["exp"] = int(time.time()) + exp_seconds
        
        encoded_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
        encoded_payload = base64.urlsafe_b64encode(json.dumps(payload_copy).encode()).decode().rstrip("=")
        
        signature = hmac.new(
            self.secret_key,
            f"{encoded_header}.{encoded_payload}".encode(),
            hashlib.sha256
        ).digest()
        encoded_sig = base64.urlsafe_b64encode(signature).decode().rstrip("=")
        
        return f"{encoded_header}.{encoded_payload}.{encoded_sig}"

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verifies session token integrity and expiration."""
        try:
            parts = token.split(".")
            if len(parts) != 3:
                return None
            encoded_header, encoded_payload, encoded_sig = parts
            
            # Recalculate signature
            expected_sig = hmac.new(
                self.secret_key,
                f"{encoded_header}.{encoded_payload}".encode(),
                hashlib.sha256
            ).digest()
            expected_encoded_sig = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")
            
            if not hmac.compare_digest(encoded_sig, expected_encoded_sig):
                return None
            
            # Decode payload
            padding = "=" * ((4 - len(encoded_payload) % 4) % 4)
            payload = json.loads(base64.urlsafe_b64decode(encoded_payload + padding).decode())
            
            if payload.get("exp", 0) < time.time():
                return None
            
            return payload
        except Exception:
            return None

    def admin_login(self, username_or_email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticates superadmin using credentials."""
        target_user = settings.ADMIN_ROOT_USERNAME.strip().lower()
        if (username_or_email.strip().lower() == target_user or username_or_email.strip().lower() == "admin") and password == settings.ADMIN_ROOT_PASSWORD:
            admin_user = self.users.get("admin-root")
            admin_user["last_login"] = time.time()
            token = self._generate_token({
                "sub": admin_user["id"],
                "email": admin_user["email"],
                "name": admin_user["name"],
                "role": "ADMIN"
            })
            return {
                "token": token,
                "user": admin_user
            }
        return None

    def authenticate_google(self, email: str, name: str, sub: str, avatar_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Authenticates or provisions a multi-user via Google OAuth 2.0.
        Promotes to ADMIN if email matches configured admin emails.
        """
        norm_email = email.strip().lower()
        is_admin = norm_email in self.admin_emails or norm_email == settings.ADMIN_ROOT_USERNAME.lower()
        role = "ADMIN" if is_admin else "USER"
        user_id = f"google_{sub}"
        
        if user_id not in self.users:
            self.users[user_id] = {
                "id": user_id,
                "google_sub": sub,
                "email": email,
                "name": name or "Google User",
                "role": role,
                "avatar_url": avatar_url,
                "age": None,
                "phone": None,
                "jurisdiction": "Global",
                "username": None,
                "onboarding_completed": False,
                "created_at": time.time(),
                "last_login": time.time(),
                "scan_count": 0,
                "quota": 999999 if is_admin else 35,
            }
        else:
            self.users[user_id]["last_login"] = time.time()
            self.users[user_id]["role"] = role
            self.users[user_id]["google_sub"] = sub
            if avatar_url:
                self.users[user_id]["avatar_url"] = avatar_url
            if name and not self.users[user_id].get("name"):
                self.users[user_id]["name"] = name
                
        user_data = self.users[user_id]
        token = self._generate_token({
            "sub": user_data["id"],
            "email": user_data["email"],
            "name": user_data["name"],
            "role": user_data["role"]
        })
        
        return {
            "token": token,
            "user": user_data
        }

    def update_user_profile(self, user_id: str, name: str, age: Optional[int] = None, phone: Optional[str] = None, jurisdiction: Optional[str] = None, username: Optional[str] = None) -> Dict[str, Any]:
        """Updates demographics upon 1st time login onboarding."""
        target_id = user_id
        if target_id not in self.users:
            for uid, u in self.users.items():
                if u.get("id") == user_id or u.get("email") == user_id:
                    target_id = uid
                    break

        if target_id in self.users:
            user = self.users[target_id]
            user["name"] = name
            if age is not None:
                user["age"] = age
            if phone:
                user["phone"] = phone
            if jurisdiction:
                user["jurisdiction"] = jurisdiction
            if username:
                user["username"] = username
            user["onboarding_completed"] = True
            return {"status": "SUCCESS", "user": user}
            
        return {"status": "NOT_FOUND", "detail": f"User {user_id} not registered yet"}

    def list_all_users(self) -> List[Dict[str, Any]]:
        """Returns all registered platform users for Admin overview."""
        return list(self.users.values())

auth_service = AuthService()
