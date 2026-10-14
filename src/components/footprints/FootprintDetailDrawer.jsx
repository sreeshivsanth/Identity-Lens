import {
  X,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Eye,
  Clock,
  Database,
  Lock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserCheck,
} from 'lucide-react';

export default function FootprintDetailDrawer({
  item,
  onClose,
  onQueueDelete,
  onMarkKeep,
}) {
  if (!item) return null;

  const isBroker = item.type === 'Data Broker';
  const isBreach = item.type === 'Breach Dump' || item.type === 'Dark Web Mention';
  const isKept = item.status === 'monitored' || item.status === 'kept';
  const isRemoved = item.status === 'confirmed-removed';
  const isPending = item.status === 'deletion-sent' || item.status === 'pending';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`badge badge-${item.riskLevel || 'medium'}`}>
                {item.riskLevel?.toUpperCase()} RISK
              </span>
              <span className="badge badge-info">{item.type}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {item.platform}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ padding: '1.5rem', flex: 1 }}>
          {/* Status Banner */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              background: isRemoved
                ? 'rgba(16, 185, 129, 0.1)'
                : isPending
                ? 'rgba(245, 158, 11, 0.1)'
                : isKept
                ? 'rgba(59, 130, 246, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${
                isRemoved
                  ? 'rgba(16, 185, 129, 0.3)'
                  : isPending
                  ? 'rgba(245, 158, 11, 0.3)'
                  : isKept
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'rgba(239, 68, 68, 0.3)'
              }`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {isRemoved ? (
                <CheckCircle2 size={16} style={{ color: '#34d399' }} />
              ) : isPending ? (
                <Clock size={16} style={{ color: '#fbbf24' }} />
              ) : isKept ? (
                <UserCheck size={16} style={{ color: '#60a5fa' }} />
              ) : (
                <AlertTriangle size={16} style={{ color: '#f87171' }} />
              )}
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {isRemoved
                  ? 'Verified Removed from Source (404 Confirmed)'
                  : isPending
                  ? 'Deletion Dispatched — Statutory Grace Period Active'
                  : isKept
                  ? 'Retained / Whitelisted by User Choice'
                  : 'Action Required — Available for Manual Inspection'}
              </strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              {isRemoved
                ? 'Playwright crawler verified record absence. No personal data detected.'
                : isPending
                ? 'Opt-out request submitted. Company has statutory 45-day compliance window.'
                : isKept
                ? 'You have chosen to keep this profile public. IdentityLens will monitor but not remove it.'
                : 'This footprint is exposed online. You may choose to delete it from the source or keep it.'}
            </p>
          </div>

          {/* Granular Exposed PII */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Detected Exposed Attributes
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {item.dataFound && item.dataFound.map((data, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Database size={12} style={{ color: 'var(--accent-cyan)' }} />
                  {data}
                </span>
              ))}
            </div>
          </div>

          {/* Source Details & Link */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Scraped Endpoint Reference
            </h4>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                https://{item.platform.toLowerCase().replace(/\s+/g, '')}.com/profiles/{item.id}
              </div>
              <a
                href={`https://${item.platform.toLowerCase().replace(/\s+/g, '')}.com`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <ExternalLink size={14} /> Open
              </a>
            </div>
          </div>

          {/* Remediation Feasibility Analysis */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Source Removal Protocol
            </h4>
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
              }}
            >
              {isBroker ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                    <ShieldAlert size={16} /> Autonomous Playwright Web Bot Supported
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    IdentityLens will deploy a headless browser worker to navigate {item.platform}'s suppression portal, solve CAPTCHA verification, and submit an automated opt-out.
                  </p>
                </div>
              ) : isBreach ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                    <AlertTriangle size={16} /> Historic Breach Dump (Non-erasable at Source)
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Breach feeds and dark web mirrors cannot be scrubbed directly. Recommended countermeasure: rotate leaked credentials and enable FIDO2 2FA.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                    <FileText size={16} /> Statutory Legal DSAR Erasure Notice
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Generates and transmits a legally certified GDPR Article 17 / CCPA §1798.105 deletion demand to the data controller.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={() => {
              onMarkKeep(item.id);
              onClose();
            }}
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '0.85rem' }}
          >
            <UserCheck size={16} /> Keep & Whitelist
          </button>
          <button
            onClick={() => {
              onQueueDelete(item.id);
              onClose();
            }}
            className="btn btn-primary"
            style={{
              flex: 1,
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderColor: '#ef4444',
            }}
          >
            <Trash2 size={16} /> Delete From Source
          </button>
        </div>
      </div>
    </div>
  );
}
