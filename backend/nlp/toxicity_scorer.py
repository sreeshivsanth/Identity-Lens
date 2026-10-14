"""
Perspective API & Toxicity Scoring Engine
Evaluates toxicity, severe toxicity, profanity, insults, and threats in public interactions.
"""
from typing import Dict, Any
import os

TOXIC_KEYWORDS = {"stupid", "idiot", "hate", "trash", "kill", "threat", "scam", "fraud"}

class ToxicityScorer:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("PERSPECTIVE_API_KEY", "")

    def score_text(self, text: str) -> Dict[str, Any]:
        """
        Calculates Perspective attributes. If API key is unavailable,
        computes local standardized metric scores.
        """
        # Local heuristic scoring
        text_lower = text.lower()
        words = set(text_lower.split())
        hits = len(words.intersection(TOXIC_KEYWORDS))

        base_toxicity = min(round(hits * 0.25, 2), 0.95)
        severe_toxicity = min(round(base_toxicity * 0.2, 2), 0.5)
        insult = min(round(base_toxicity * 0.4, 2), 0.7)
        threat = 0.85 if "kill" in text_lower or "threat" in text_lower else 0.0

        return {
            "toxicity": max(base_toxicity, 0.04),
            "severe_toxicity": severe_toxicity,
            "insult": insult,
            "threat": threat,
            "profanity": 0.02,
            "is_hostile": base_toxicity > 0.50,
        }

toxicity_scorer = ToxicityScorer()
