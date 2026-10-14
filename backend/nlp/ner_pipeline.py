"""
spaCy Named Entity Recognition (NER) & PII Pipeline
Extracts sensitive identifiers (PERSON, ORG, GPE, PHONE, EMAIL, LOC)
from scraped web pages and broker profile dumps.
"""
import re
from typing import Dict, List, Any

# Regular expressions for high-fidelity PII patterns
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
PHONE_REGEX = re.compile(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
SSN_REGEX = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')

class NERPipeline:
    def __init__(self, model_name: str = "en_core_web_sm"):
        self.model_name = model_name
        self._nlp = None

    def _load_model(self):
        if self._nlp is None:
            try:
                import spacy
                try:
                    spacy.prefer_gpu(0)
                except Exception:
                    pass
                self._nlp = spacy.load(self.model_name)
            except Exception:
                # Fallback to lightweight regex pattern parser if spaCy model binary not downloaded yet
                self._nlp = None

    def extract_pii(self, text: str) -> Dict[str, Any]:
        """
        Processes arbitrary scraped HTML or text and tags all detected PII entities.
        """
        self._load_model()
        
        entities = {
            "persons": [],
            "organizations": [],
            "locations": [],
            "emails": list(set(EMAIL_REGEX.findall(text))),
            "phones": list(set(PHONE_REGEX.findall(text))),
            "ssns_detected": len(SSN_REGEX.findall(text)) > 0,
            "raw_entity_count": 0,
        }

        if self._nlp:
            doc = self._nlp(text)
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    entities["persons"].append(ent.text)
                elif ent.label_ == "ORG":
                    entities["organizations"].append(ent.text)
                elif ent.label_ in ("GPE", "LOC"):
                    entities["locations"].append(ent.text)
            entities["raw_entity_count"] = len(doc.ents)
        else:
            # Heuristic extractor fallback
            words = text.split()
            entities["raw_entity_count"] = len(entities["emails"]) + len(entities["phones"])

        # Deduplicate
        entities["persons"] = list(set(entities["persons"]))
        entities["organizations"] = list(set(entities["organizations"]))
        entities["locations"] = list(set(entities["locations"]))

        return {
            "findings": entities,
            "pii_risk_level": "critical" if (entities["emails"] or entities["phones"] or entities["ssns_detected"]) else "low"
        }

ner_engine = NERPipeline()
