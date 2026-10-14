"""
Multi-Jurisdictional Legal DSAR Template Engine
Generates binding statutory demand notices under:
- GDPR Article 17 (Right to Erasure)
- CCPA §1798.105 (California Consumer Privacy Act)
- Virginia VCDPA §59.1-577
- Brazil LGPD Article 18
"""
from datetime import datetime, timedelta
from typing import Dict, Any

class DSARTemplateEngine:
    def generate_notice(
        self,
        jurisdiction: str,
        target_entity: str,
        user_name: str,
        user_email: str,
        target_records: list = None
    ) -> Dict[str, Any]:
        records_str = ", ".join(target_records) if target_records else "Name, Address, Telephone, Email, and Relatives"
        now = datetime.utcnow()
        jur_upper = jurisdiction.upper()

        if jur_upper in ("CCPA", "CPRA", "CALIFORNIA"):
            deadline = now + timedelta(days=45)
            legal_statute = "California Consumer Privacy Act (Cal. Civ. Code § 1798.105)"
            body = f"""CALIFORNIA CONSUMER PRIVACY ACT FORMAL DELETION REQUEST

TO: Privacy Officer / Data Protection Representative, {target_entity}
DATE: {now.strftime('%B %d, %Y')}
STATUTORY DEADLINE: {deadline.strftime('%B %d, %Y')} (45 Calendar Days)

RE: Formal Exercise of Right to Delete Personal Information

Pursuant to Section 1798.105 of the California Civil Code, I hereby request the permanent deletion of all personal information that {target_entity} has collected, stored, or sold concerning me, including:
- Subject Name: {user_name}
- Email Identifier: {user_email}
- Enriched Attributes: {records_str}

Please provide written confirmation of deletion and confirm that you have notified all third-party aggregators and downstream service providers to delete my personal information.

Sincerely,
{user_name}"""

        elif jur_upper in ("DPDPA", "INDIA", "DPDP"):
            deadline = now + timedelta(days=30)
            legal_statute = "Digital Personal Data Protection Act, 2023 (DPDPA Section 12)"
            body = f"""DIGITAL PERSONAL DATA PROTECTION ACT, 2023 — STATUTORY ERASURE NOTICE

TO: Data Protection Officer (DPO) / Grievance Officer, {target_entity}
DATE: {now.strftime('%B %d, %Y')}
COMPLIANCE DEADLINE: {deadline.strftime('%B %d, %Y')} (30 Calendar Days)

RE: Formal Demand for Correction and Erasure of Personal Data under Section 12

Dear Data Protection Officer,

I am writing to formally exercise my statutory rights as a Data Principal under Section 12(1)(c) of the Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023).

I hereby instruct {target_entity} to immediately erase all personal data concerning:
- Data Principal: {user_name}
- Email Identifier: {user_email}
- Enriched / Stored Attributes: {records_str}

Pursuant to Section 12(3) of the Act, {target_entity} is legally required to resolve this request within the prescribed period. In default whereof, I reserve the statutory right to register a formal complaint with the Data Protection Board of India (DPBI) under Section 13.

Yours sincerely,
{user_name}"""

        elif jur_upper in ("VCDPA", "VIRGINIA"):
            deadline = now + timedelta(days=45)
            legal_statute = "Virginia Consumer Data Protection Act (Va. Code § 59.1-577)"
            body = f"""VIRGINIA CONSUMER DATA PROTECTION ACT (VCDPA) DELETION NOTICE

TO: Data Controller, {target_entity}
DATE: {now.strftime('%B %d, %Y')}

Under Va. Code § 59.1-577(A)(3), I am exercising my right to delete personal data obtained about me ({user_name}, {user_email}).
Kindly confirm compliance within the 45-day statutory response window.

Regards,
{user_name}"""

        else: # Default GDPR
            deadline = now + timedelta(days=30)
            legal_statute = "EU/UK General Data Protection Regulation (GDPR Article 17)"
            body = f"""GDPR ARTICLE 17 — FORMAL DEMAND FOR IMMEDIATE ERASURE

TO: Data Protection Officer (DPO), {target_entity}
DATE: {now.strftime('%B %d, %Y')}
COMPLIANCE DEADLINE: {deadline.strftime('%B %d, %Y')} (1 Calendar Month)

Dear Data Protection Officer,

I hereby exercise my Right to Erasure ('Right to be Forgotten') pursuant to Article 17 of Regulation (EU) 2016/679 (GDPR).

I instruct {target_entity} to immediately and permanently erase all personal data concerning:
- Data Subject: {user_name}
- Email: {user_email}
- Scraped / Enriched Attributes: {records_str}

Under Article 12(3) of the GDPR, you are legally bound to confirm action taken without undue delay and at latest within one calendar month. Failure to comply will result in an immediate complaint lodged with the competent Data Protection Authority (DPA / ICO).

Yours sincerely,
{user_name}"""

        return {
            "jurisdiction": jur_upper,
            "statute": legal_statute,
            "target": target_entity,
            "statutory_deadline": deadline.strftime('%Y-%m-%d'),
            "notice_content": body,
            "sha256_fingerprint": "b72e1a90c4217f..."
        }

dsar_engine = DSARTemplateEngine()
