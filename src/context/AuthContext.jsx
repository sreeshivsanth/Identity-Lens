import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_ADMIN_USER = {
  id: 'admin-root',
  name: 'Platform Admin',
  email: 'admin@identitylens.local',
  initials: 'PA',
  role: 'ADMIN',
  provider: 'credentials',
  plan: 'Superadmin Enterprise',
  token: 'admin-jwt-token-identitylens-root',
  quota: 999999,
  age: 28,
  phone: '+1 555-0199',
  jurisdiction: 'Global (DPDPA / GDPR / CCPA)',
  username: 'admin',
  onboardingCompleted: false,
  legalNameVerified: true,
  lastLogin: new Date().toISOString(),
};

function getSavedOnboardingStatus(userId, email) {
  if (!userId && !email) return false;
  const byId = userId ? localStorage.getItem(`identitylens_onboarded_${userId}`) : null;
  const byEmail = email ? localStorage.getItem(`identitylens_onboarded_${email.toLowerCase().trim()}`) : null;
  return Boolean(byId === 'true' || byEmail === 'true');
}

function getSavedProfileDetails(userId, email) {
  try {
    const raw = (userId && localStorage.getItem(`identitylens_profile_${userId}`)) ||
                (email && localStorage.getItem(`identitylens_profile_${email.toLowerCase().trim()}`));
    if (raw) return JSON.parse(raw);
  } catch {
    return null;
  }
  return null;
}

function recordUserInRegistry(user) {
  try {
    const raw = localStorage.getItem('identitylens_registered_users_registry');
    const list = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    const entry = {
      id: user.id,
      googleSub: user.googleSub || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      age: user.age || null,
      phone: user.phone || null,
      jurisdiction: user.jurisdiction || 'Global',
      username: user.username || user.email.split('@')[0],
      onboardingCompleted: Boolean(user.onboardingCompleted),
      created_at: user.created_at || new Date().toISOString(),
      last_login: new Date().toISOString(),
      quota: user.quota || (user.role === 'ADMIN' ? 999999 : 35),
      scan_count: user.scan_count || 0,
    };
    if (index >= 0) {
      list[index] = { ...list[index], ...entry };
    } else {
      list.push(entry);
    }
    localStorage.setItem('identitylens_registered_users_registry', JSON.stringify(list));
  } catch {
    // storage error
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('identitylens_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && !parsed.email.includes('alex.morgan') && parsed.email !== 'user@example.com') {
          const hasOnboarded = getSavedOnboardingStatus(parsed.id, parsed.email);
          const savedProfile = getSavedProfileDetails(parsed.id, parsed.email);
          return {
            ...parsed,
            name: savedProfile?.name || parsed.name,
            age: savedProfile?.age || parsed.age || null,
            phone: savedProfile?.phone || parsed.phone || null,
            jurisdiction: savedProfile?.jurisdiction || parsed.jurisdiction || 'Global',
            username: savedProfile?.username || parsed.username || parsed.email.split('@')[0],
            onboardingCompleted: hasOnboarded || parsed.onboardingCompleted || false,
          };
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('identitylens_auth_user', JSON.stringify(currentUser));
      recordUserInRegistry(currentUser);
    } else {
      localStorage.removeItem('identitylens_auth_user');
    }
  }, [currentUser]);

  const loginWithGoogle = async (email, name = '', avatarUrl = null, sub = null, googleToken = null) => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === 'admin@identitylens.local' || cleanEmail.startsWith('admin');
    const cleanName = name.trim();
    const initials = cleanName
      ? cleanName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'GU';

    const userId = sub ? `google_${sub}` : `google_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
    const hasOnboarded = getSavedOnboardingStatus(userId, cleanEmail);
    const savedProfile = getSavedProfileDetails(userId, cleanEmail);

    const user = {
      id: userId,
      googleSub: sub || userId,
      name: savedProfile?.name || cleanName || (isAdmin ? 'Sree Shivsanth S' : 'Google User'),
      email: cleanEmail,
      initials: initials || (isAdmin ? 'SS' : 'GU'),
      role: isAdmin ? 'ADMIN' : 'USER',
      provider: 'google',
      avatarUrl: avatarUrl,
      plan: isAdmin ? 'Superadmin Enterprise' : 'Community Standard',
      token: googleToken || `google-token-${Date.now()}`,
      quota: isAdmin ? 999999 : 35,
      age: savedProfile?.age || null,
      phone: savedProfile?.phone || null,
      jurisdiction: savedProfile?.jurisdiction || 'Global',
      username: savedProfile?.username || cleanEmail.split('@')[0],
      onboardingCompleted: hasOnboarded,
      legalNameVerified: hasOnboarded,
      lastLogin: new Date().toISOString(),
    };

    // Asynchronously notify backend
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          sub: sub || user.id,
          avatar_url: avatarUrl,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          user.backendToken = data.token;
        }
      }
    } catch {
      // Backend offline, running client-side
    }

    setCurrentUser(user);
    recordUserInRegistry(user);
    setIsAuthModalOpen(false);

    return { user, isFirstTime: !hasOnboarded };
  };

  const loginWithCredentials = (usernameOrEmail, password) => {
    const ident = usernameOrEmail.trim().toLowerCase();
    if (
      (ident === 'admin@identitylens.local' || ident === 'admin') &&
      password === 'admin123'
    ) {
      const cleanEmail = 'admin@identitylens.local';
      const userId = 'admin-root';
      const hasOnboarded = getSavedOnboardingStatus(userId, cleanEmail);
      const savedProfile = getSavedProfileDetails(userId, cleanEmail);

      const user = {
        ...DEFAULT_ADMIN_USER,
        name: savedProfile?.name || DEFAULT_ADMIN_USER.name,
        age: savedProfile?.age || DEFAULT_ADMIN_USER.age,
        phone: savedProfile?.phone || DEFAULT_ADMIN_USER.phone,
        jurisdiction: savedProfile?.jurisdiction || DEFAULT_ADMIN_USER.jurisdiction,
        username: savedProfile?.username || DEFAULT_ADMIN_USER.username,
        onboardingCompleted: hasOnboarded,
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser(user);
      recordUserInRegistry(user);
      setIsAuthModalOpen(false);
      return { success: true, user, isFirstTime: !hasOnboarded };
    }
    return { success: false, error: 'Invalid admin credentials.' };
  };

  const completeOnboarding = async ({ name, age, phone, jurisdiction, username }) => {
    if (!currentUser) return;
    const cleanName = (name || currentUser.name || '').trim();
    const initials = cleanName
      ? cleanName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'GU';

    const profileData = {
      name: cleanName,
      age: age ? Number(age) : null,
      phone: phone ? phone.trim() : null,
      jurisdiction: jurisdiction || 'Global',
      username: username ? username.trim() : currentUser.email.split('@')[0],
    };

    const updated = {
      ...currentUser,
      ...profileData,
      initials: initials,
      onboardingCompleted: true,
      legalNameVerified: true,
    };

    // Save profile locally
    localStorage.setItem(`identitylens_onboarded_${updated.id}`, 'true');
    localStorage.setItem(`identitylens_onboarded_${updated.email.toLowerCase()}`, 'true');
    localStorage.setItem(`identitylens_profile_${updated.id}`, JSON.stringify(profileData));
    localStorage.setItem(`identitylens_profile_${updated.email.toLowerCase()}`, JSON.stringify(profileData));

    setCurrentUser(updated);
    recordUserInRegistry(updated);

    // Sync to backend
    try {
      await fetch('http://localhost:8000/api/v1/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: updated.id,
          name: cleanName,
          age: updated.age,
          phone: updated.phone,
          jurisdiction: updated.jurisdiction,
          username: updated.username,
        }),
      });
    } catch {
      // Backend offline
    }

    return updated;
  };

  const getAllRegisteredUsers = async () => {
    let backendUsers = [];
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/users', {
        headers: currentUser?.backendToken ? { Authorization: `Bearer ${currentUser.backendToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          backendUsers = data.users;
        }
      }
    } catch {
      // Backend offline
    }

    try {
      const raw = localStorage.getItem('identitylens_registered_users_registry');
      const localUsers = raw ? JSON.parse(raw) : [];

      // Merge backend and local registry
      const map = new Map();
      localUsers.forEach((u) => map.set(u.id || u.email, u));
      backendUsers.forEach((u) => {
        const existing = map.get(u.id || u.email) || {};
        map.set(u.id || u.email, { ...existing, ...u });
      });

      // Always ensure current user is present
      if (currentUser) {
        const existing = map.get(currentUser.id || currentUser.email) || {};
        map.set(currentUser.id || currentUser.email, { ...existing, ...currentUser });
      }

      return Array.from(map.values());
    } catch {
      return backendUsers;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('identitylens_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'ADMIN',
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        loginWithCredentials,
        completeOnboarding,
        getAllRegisteredUsers,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
