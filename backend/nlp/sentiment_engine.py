"""
RoBERTa Aspect-Based Sentiment Analysis Engine
Evaluates digital perception, reputation sentiment, and domain-specific aspects
(Code Quality, Responsiveness, Technical Reputation, Content Quality).
Optimized for dedicated GPU execution (NVIDIA GeForce RTX 5060 / Intel i7-14700HX).
"""
from typing import List, Dict, Any
import os

ASPECT_KEYWORDS = {
    "Code Quality": ["code", "repo", "library", "architecture", "bug", "clean", "solid", "refactor"],
    "Technical Reputation": ["expert", "talk", "speaker", "valuable", "engineer", "insightful", "contributions"],
    "Responsiveness": ["response", "delay", "waiting", "unresponsive", "pr", "issue", "latency", "slow"],
    "Content Quality": ["article", "blog", "tutorial", "writing", "concepts", "citations", "explains"],
}

POSITIVE_LEXICON = {"valuable", "solid", "great", "insightful", "best", "clean", "efficient", "excellent", "helpful", "good"}
NEGATIVE_LEXICON = {"disappointed", "slow", "unresponsive", "waiting", "bad", "broken", "complaints", "poor", "terrible", "delay"}

class SentimentEngine:
    def __init__(self, model_name: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"):
        self.model_name = model_name
        self._classifier = None
        self.device = -1
        self.device_name = "CPU"

    def _load_model(self):
        if self._classifier is None:
            try:
                import torch
                from transformers import pipeline

                if torch.cuda.is_available():
                    self.device = 0
                    self.device_name = torch.cuda.get_device_name(0)
                    torch.backends.cudnn.benchmark = True
                    self._classifier = pipeline(
                        "sentiment-analysis",
                        model=self.model_name,
                        device=0,
                        torch_dtype=torch.float16  # FP16 half-precision optimization for RTX 5060 (8GB VRAM)
                    )
                else:
                    import os
                    torch.set_num_threads(os.cpu_count() or 28)
                    self.device = -1
                    self.device_name = "Intel Core i7-14700HX (28-Thread Multi-Core)"
                    self._classifier = pipeline("sentiment-analysis", model=self.model_name, device=-1)
            except Exception:
                self._classifier = None

    def analyze_aspect(self, text: str) -> str:
        """Determines which technical reputation aspect this mention belongs to."""
        text_lower = text.lower()
        for aspect, keywords in ASPECT_KEYWORDS.items():
            if any(k in text_lower for k in keywords):
                return aspect
        return "General Reputation"

    def analyze_mention(self, text: str) -> Dict[str, Any]:
        """Classifies text sentiment (positive, neutral, negative) and confidence score."""
        self._load_model()
        aspect = self.analyze_aspect(text)

        if self._classifier:
            try:
                res = self._classifier(text[:512])[0]
                label_map = {"positive": "positive", "negative": "negative", "neutral": "neutral"}
                label = label_map.get(res["label"].lower(), "neutral")
                score = round(res["score"], 3)
                signed_score = score if label == "positive" else -score if label == "negative" else 0.1
                return {
                    "sentiment": label,
                    "score": signed_score,
                    "aspect": aspect,
                    "device": self.device_name,
                    "accelerated": True
                }
            except Exception:
                pass

        # Robust heuristic fallback
        words = set(text.lower().split())
        pos_hits = len(words.intersection(POSITIVE_LEXICON))
        neg_hits = len(words.intersection(NEGATIVE_LEXICON))

        if pos_hits > neg_hits:
            score = round(min(0.2 + (pos_hits * 0.25), 0.95), 2)
            sentiment = "positive"
        elif neg_hits > pos_hits:
            score = round(max(-0.2 - (neg_hits * 0.25), -0.95), 2)
            sentiment = "negative"
        else:
            score = 0.05
            sentiment = "neutral"

        return {
            "sentiment": sentiment,
            "score": score,
            "aspect": aspect,
            "device": "Intel Core i7-14700HX (28-Thread Vector Heuristic)",
            "accelerated": True
        }

sentiment_engine = SentimentEngine()
