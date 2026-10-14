"""
Composite Risk Score Calculator
Calculates overall Digital Exposure Score (0 - 100, where lower is better).
Weights:
- Breach Severity: 35%
- Data Broker Presence: 30%
- Shadow Accounts / Dormant Profiles: 15%
- Negative Sentiment & Hostility: 10%
- Dark Web Mentions: 10%
"""
from typing import Dict, Any, List

class RiskScoreCalculator:
    def calculate_score(
        self,
        breaches: List[Dict[str, Any]],
        broker_findings: List[Dict[str, Any]],
        accounts: List[Dict[str, Any]],
        sentiment_metrics: Dict[str, Any],
        darkweb_findings: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        
        # 1. Breach Subscore (0-100)
        breach_points = 0
        for b in breaches:
            sev = b.get("severity", "medium").lower()
            if sev == "critical":
                breach_points += 30
            elif sev == "high":
                breach_points += 15
            else:
                breach_points += 5
        breach_score = min(breach_points, 100)

        # 2. Broker Subscore (0-100)
        unremediated_brokers = [b for b in broker_findings if b.get("status") != "confirmed-removed"]
        broker_score = min(len(unremediated_brokers) * 12, 100)

        # 3. Shadow / Dormant Accounts Subscore (0-100)
        dormant_or_impersonation = [a for a in accounts if a.get("status") in ("dormant", "impersonation")]
        account_score = min(len(dormant_or_impersonation) * 20, 100)

        # 4. Sentiment / Toxicity Subscore (0-100)
        neg_percent = sentiment_metrics.get("negativePercentage", 10)
        sentiment_score = min(int(neg_percent * 2.5), 100)

        # 5. Dark Web Subscore (0-100)
        darkweb_score = min(len(darkweb_findings) * 40, 100)

        # Weighted composite:
        composite = (
            (breach_score * 0.35) +
            (broker_score * 0.30) +
            (account_score * 0.15) +
            (sentiment_score * 0.10) +
            (darkweb_score * 0.10)
        )
        total = int(round(composite))

        tier = "Critical" if total >= 70 else "High" if total >= 50 else "Moderate" if total >= 25 else "Low"

        return {
            "exposure_score": total,
            "risk_tier": tier,
            "breakdown": {
                "breachExposure": breach_score,
                "dataBrokerPresence": broker_score,
                "shadowAccounts": account_score,
                "negativeSentiment": sentiment_score,
                "darkWebMentions": darkweb_score,
            },
            "recommendation": (
                "Prioritize password rotation on breached services and dispatch DSAR opt-outs to remaining brokers."
                if total > 20 else "Identity posture is well-hardened. Maintain weekly monitoring."
            )
        }

risk_calculator = RiskScoreCalculator()
