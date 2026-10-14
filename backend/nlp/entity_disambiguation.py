"""
Entity Disambiguation Engine
Determines whether an uncovered online profile (e.g., 'Alex Morgan' on Github vs Reddit vs Spokeo)
belongs to the genuine target user or is a namesake / homonym false-positive.
"""
from typing import Dict, Any, List

def calculate_similarity(a: str, b: str) -> float:
    """Jaccard character 3-gram similarity for robust namesake disambiguation."""
    if not a or not b:
        return 0.0
    a_clean = a.lower().strip()
    b_clean = b.lower().strip()
    if a_clean == b_clean:
        return 1.0

    a_grams = set([a_clean[i:i+3] for i in range(len(a_clean)-2)])
    b_grams = set([b_clean[i:i+3] for i in range(len(b_clean)-2)])
    if not a_grams or not b_grams:
        return 1.0 if a_clean in b_clean or b_clean in a_clean else 0.0
    intersection = len(a_grams.intersection(b_grams))
    union = len(a_grams.union(b_grams))
    return intersection / union if union > 0 else 0.0

class EntityDisambiguationEngine:
    def disambiguate_profile(
        self,
        target_persona: Dict[str, Any],
        discovered_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluates match confidence between target persona and discovered online entity.
        Returns confidence score [0.0 - 1.0] and match decision.
        """
        score = 0.0
        weights = {"username": 0.40, "email": 0.35, "name": 0.15, "location": 0.10}

        # 1. Username comparison
        target_user = target_persona.get("username", "")
        disc_user = discovered_profile.get("username", "")
        user_sim = calculate_similarity(target_user, disc_user)
        score += user_sim * weights["username"]

        # 2. Email domain / prefix comparison
        target_email = target_persona.get("email", "")
        disc_email = discovered_profile.get("email", "")
        if target_email and disc_email:
            email_sim = 1.0 if target_email.lower() == disc_email.lower() else calculate_similarity(target_email, disc_email)
            score += email_sim * weights["email"]

        # 3. Name comparison
        target_name = target_persona.get("fullName", "")
        disc_name = discovered_profile.get("name", "")
        if target_name and disc_name:
            name_sim = calculate_similarity(target_name, disc_name)
            score += name_sim * weights["name"]

        confidence = round(min(score, 1.0), 3)
        is_match = confidence >= 0.65
        
        return {
            "confidence_score": confidence,
            "is_target_identity": is_match,
            "match_status": "Verified Target" if confidence >= 0.85 else "Likely Associate" if confidence >= 0.65 else "Homonym / Namesake False-Positive",
            "action_recommended": "Queue Opt-Out" if is_match else "Ignore / Whitelist",
        }

disambiguation_engine = EntityDisambiguationEngine()
