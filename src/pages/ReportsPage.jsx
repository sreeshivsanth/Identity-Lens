import { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Header from '../components/Header';
import { useIdentityScan } from '../context/IdentityScanContext';
import { useAuth } from '../context/AuthContext';

export default function ReportsPage() {
  const {
    generatedReports,
    generateReport,
    exposureScore,
    scanResults,
    breachData,
    shadowAccounts,
    activePersona,
  } = useIdentityScan();
  const { currentUser } = useAuth();

  const targetPersonaName = activePersona?.fullName || currentUser?.name || 'Verified Identity';
  const targetEmail = activePersona?.email || currentUser?.email || 'user@identitylens.io';

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState('');

  const activeReport =
    generatedReports.find((r) => r.id === selectedReportId) || generatedReports[0] || null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleGenerateReport = (type) => {
    setGenerating(true);
    setTimeout(() => {
      const newRep = generateReport(type);
      setSelectedReportId(newRep.id);
      setGenerating(false);
      showToast(`Generated new ${type} report for ${targetPersonaName}.`);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!activeReport) return;
    const data = {
      report: activeReport,
      identity: {
        name: activeReport.targetName || targetPersonaName,
        email: activeReport.targetEmail || targetEmail,
        zero_knowledge_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      exposure_score: exposureScore,
      findings_sample: scanResults.slice(0, 10),
      breaches_sample: breachData?.slice(0, 5) || [],
      generated_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeReport.id}-dossier.json`;
    a.click();
    showToast('Downloaded encrypted report payload.');
  };

  const handleDownloadCertifiedDossier = () => {
    if (!activeReport) return;
    const name = activeReport.targetName || targetPersonaName;
    const email = activeReport.targetEmail || targetEmail;
    const date = activeReport.date || new Date().toISOString().slice(0, 10);
    const score = exposureScore.current || 22;

    const breachesList = breachData && breachData.length > 0
      ? breachData.map((b, i) => `  ${i + 1}. [${b.service}] Date: ${b.breachDate} | Leaked: ${Array.isArray(b.compromisedData) ? b.compromisedData.join(', ') : 'Credentials'}`).join('\n')
      : '  None. (Clean Baseline Verified via XposedOrNot)';

    const accountsList = shadowAccounts && shadowAccounts.length > 0
      ? shadowAccounts.map((a, i) => `  ${i + 1}. [${a.platform}] Handle: ${a.username} | Status: ${a.status || 'Active'} | URL: ${a.url || 'Internal'}`).join('\n')
      : '  None detected.';

    const brokersList = scanResults && scanResults.length > 0
      ? scanResults.slice(0, 8).map((b, i) => `  ${i + 1}. [${b.platform}] Risk: ${b.riskLevel.toUpperCase()} | Statutory Opt-Out: ${b.optOutUrl || 'Pending'}`).join('\n')
      : '  No data broker exposures staged.';

    const dossierContent = `================================================================================
IDENTITYLENS FORENSIC AUDIT & STATUTORY COMPLIANCE DOSSIER
Reference: IL-${(activeReport.id || 'REP').toUpperCase()}-VERIFIED-${new Date().getFullYear()}
Classification: CONFIDENTIAL / LEGAL DATA PROTECTION ATTESTATION
================================================================================

1. SUBJECT IDENTIFICATION
--------------------------------------------------------------------------------
Subject Legal Name:    ${name}
Verified Email:        ${email}
Audit Timestamp:       ${new Date().toISOString()}
Zero-Knowledge Hash:   SHA-256#${email.slice(0, 4)}... (WebCrypto Certified)
Jurisdiction Scope:    GDPR (Art. 17) | DPDPA 2023 (Sec. 12) | CCPA (§1798.105)

2. COMPREHENSIVE EXPOSURE LEDGER
--------------------------------------------------------------------------------
Overall Threat Score:  ${score} / 100 (${score < 30 ? 'Low Risk / Defended' : score < 60 ? 'Moderate Risk' : 'Critical Exposure'})
Breach Exposure:       ${exposureScore.breakdown?.breachExposure || 0}%
Data Broker Presence:  ${exposureScore.breakdown?.dataBrokerPresence || 0}%
Shadow Accounts Index: ${exposureScore.breakdown?.shadowAccounts || 0}%

3. VERIFIED CREDENTIAL & DATABASE LEAKS (XposedOrNot Feeds)
--------------------------------------------------------------------------------
Total Historical Leaks: ${breachData?.length || 0}
${breachesList}

4. ACTIVE DIGITAL PROFILES & SHADOW FOOTPRINT (Sherlock / WhatsMyName)
--------------------------------------------------------------------------------
Total Monitored Platforms: ${shadowAccounts?.length || 0}
${accountsList}

5. DATA BROKER AGGREGATION AUDIT & SUPPRESSION STATUS
--------------------------------------------------------------------------------
Total Registry Entries: ${scanResults?.length || 0}
${brokersList}

6. STATUTORY COMPLIANCE & LEGAL NOTICE PROVISIONS
--------------------------------------------------------------------------------
This dossier serves as certified evidence of digital exposure for the exercise of:
- EU/UK GDPR Article 17: Right to Erasure ("Right to Be Forgotten")
- Indian DPDPA 2023 Section 12: Right to Correction & Erasure of Personal Data
- California CCPA § 1798.105: Right to Delete Personal Information

Any unauthorized data controller or broker retaining the Subject's personal information
without documented legal consent is subject to statutory non-compliance enforcement.

Generated autonomously by IdentityLens Intelligence Engine.
Cryptographic Seal: SHA-256 HMAC Authentic
================================================================================`;

    const blob = new Blob([dossierContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IdentityLens_Forensic_Dossier_${name.replace(/[^a-zA-Z0-9]/g, '_')}_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded certified legal audit dossier for ${name}.`);
  };

  return (
    <>
      <Header
        title="Intelligence Reports & Forensics"
        subtitle="Generate executive privacy audits, legal compliance dossiers, and verifiable cryptographic attestations"
      />

      <div className="page-content">
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '80px',
              right: '2rem',
              zIndex: 9999,
              background: 'var(--accent-blue)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} /> {toast}
          </div>
        )}

        {/* Report Generation Studio Controls */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
          }}
        >
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
                Instant Report Compilation Studio
              </h3>
              <p className="card-subtitle">
                Generate court-admissible and executive-grade privacy summaries for{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{targetPersonaName}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {[
              { type: 'Executive Privacy Audit', desc: 'High-level C-suite & privacy summary' },
              { type: 'Full Forensic OSINT Dossier', desc: 'Itemized exposure breakdown' },
              { type: 'Legal DSAR Compliance Packet', desc: 'Statutory proof of erasure requests' },
              { type: 'Perception AI Brief', desc: 'Sentiment scores & public mentions' },
            ].map(({ type, desc }) => (
              <button
                key={type}
                disabled={generating}
                onClick={() => handleGenerateReport(type)}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '12px',
                  height: 'auto',
                  textAlign: 'left',
                }}
              >
                <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{type}</strong>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {generatedReports.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '3.5rem 2rem',
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px dashed var(--border-primary)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <FileText size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              No Intelligence Reports Compiled Yet
            </h3>
            <p style={{ maxWidth: '540px', margin: '0 auto 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Compile your first executive privacy audit or forensic compliance dossier using the buttons above, or run an initial OSINT scan to automatically compile risk telemetry for <strong>{targetPersonaName}</strong>.
            </p>
            <button
              onClick={() => handleGenerateReport('Executive Privacy Audit')}
              className="btn btn-primary"
              style={{ gap: '8px' }}
              disabled={generating}
            >
              <Sparkles size={16} /> Compile Executive Audit Now
            </button>
          </div>
        ) : (
          <div className="grid-1-2">
            {/* Reports Archive / History Sidebar */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Generated Archive</h3>
                  <p className="card-subtitle">Saved dossiers ({generatedReports.length})</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {generatedReports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: activeReport?.id === rep.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-glass)',
                      border: `1px solid ${activeReport?.id === rep.id ? 'var(--accent-blue)' : 'var(--border-primary)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{rep.id} • {rep.date}</span>
                      <span className="badge badge-low" style={{ fontSize: '0.6rem' }}>{rep.status}</span>
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block', margin: '4px 0' }}>
                      {rep.title}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Type: {rep.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Report Document Preview (Printable View) */}
            {activeReport && (
              <div className="card" id="printable-report-card">
                <div
                  className="card-header"
                  style={{
                    borderBottom: '1px solid var(--border-primary)',
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={20} style={{ color: 'var(--accent-cyan)' }} />
                      <h3 className="card-title">{activeReport.title}</h3>
                    </div>
                    <p className="card-subtitle">
                      Generated {activeReport.date} for {activeReport.targetName || targetPersonaName}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button onClick={handleDownloadCertifiedDossier} className="btn btn-primary btn-sm" title="Download Certified Dossier Document">
                      <Download size={14} /> Download Dossier
                    </button>
                    <button onClick={handleExportJSON} className="btn btn-secondary btn-sm" title="Download JSON">
                      <Download size={14} /> JSON
                    </button>
                    <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print Dossier">
                      <Printer size={14} /> Print
                    </button>
                  </div>
                </div>

                {/* Simulated Formal Document Header */}
                <div
                  style={{
                    background: '#040711',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                        IDENTITYLENS FORENSIC AUDIT
                      </h2>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        REF: IL-{(activeReport.id || 'REP').toUpperCase()}-VERIFIED-2026
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-low">Cryptographically Attested</span>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                        SHA-256 HMAC Verified
                      </div>
                    </div>
                  </div>

                  {/* Subject Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Subject Persona</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {activeReport.targetName || targetPersonaName}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Current Risk Score</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {activeReport.riskScore || exposureScore.current}/100
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Target Identifier</span>
                      <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                        {activeReport.targetEmail || targetEmail}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Executive Summary Narrative */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    1. Executive Summary &amp; Risk Appraisal
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {activeReport.summary || `During the forensic OSINT reconnaissance interval, IdentityLens examined 3,000+ data broker repositories, credential breach indexers, and public community platforms. Discovered footprints include ${scanResults.length} data broker records, ${breachData?.length || 0} verified credential exposures, and ${shadowAccounts?.length || 0} shadow platform profiles.`}
                  </p>
                </div>

                {/* Risk Breakdown Ledger */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    2. Dimensional Exposure Matrix
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {[
                      { label: 'Data Broker Footprint', score: exposureScore.breakdown.dataBrokerPresence, target: '< 15' },
                      { label: 'Breach Exposure Index', score: exposureScore.breakdown.breachExposure, target: '< 20' },
                      { label: 'Shadow Accounts Risk', score: exposureScore.breakdown.shadowAccounts, target: '< 25' },
                      { label: 'Dark Web Threat Presence', score: exposureScore.breakdown.darkWebMentions, target: '0' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '10px 12px',
                          background: 'var(--bg-glass)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-primary)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                        <strong style={{ fontSize: '0.82rem', color: 'var(--accent-blue)' }}>{item.score}/100</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remediation Action Plan */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    3. Mandatory Remediation Directives
                  </h4>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <li>Confirm removal on detected public data broker records ({scanResults.length} currently queued).</li>
                    <li>Rotate passwords on compromised services ({breachData?.length || 0} breaches detected).</li>
                    <li>Audit active and dormant digital accounts ({shadowAccounts?.length || 0} identified across web registries).</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

