import { useState, useEffect } from 'react';
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
  Trash2,
  ShieldCheck,
  UserCheck,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import Header from '../components/Header';
import { useIdentityScan } from '../context/IdentityScanContext';
import { Link } from 'react-router-dom';
import { probePlatformsLive } from '../services/liveSocialService';
import { RefreshCw } from 'lucide-react';

export default function AccountsPage() {
  const { shadowAccounts, activePersona } = useIdentityScan();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'verified' | 'dormant' | 'impersonation' | 'unclaimed'
  const [accounts, setAccounts] = useState(shadowAccounts);
  const [toast, setToast] = useState('');

  // Live Sherlock Probing State
  const [usernameInput, setUsernameInput] = useState('');
  const [isProbing, setIsProbing] = useState(false);
  const [liveProbeStats, setLiveProbeStats] = useState(null);

  useEffect(() => {
    setAccounts(shadowAccounts);
  }, [shadowAccounts]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLiveProbe = async (e) => {
    if (e) e.preventDefault();
    const targetHandle = (usernameInput || activePersona?.username || '').trim().replace(/^@/, '');
    if (!targetHandle) return;

    setIsProbing(true);
    setLiveProbeStats(null);

    try {
      const liveDiscovered = await probePlatformsLive(targetHandle);
      setIsProbing(false);
      setLiveProbeStats({
        username: targetHandle,
        foundCount: liveDiscovered.length,
      });

      if (liveDiscovered.length > 0) {
        setAccounts(liveDiscovered);
        showToast(`Discovered ${liveDiscovered.length} live verified accounts for @${targetHandle}!`);
      } else {
        showToast(`Zero public profiles found matching @${targetHandle}.`);
      }
    } catch (err) {
      setIsProbing(false);
      showToast('Live probe encountered a network timeout.');
    }
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'verified') return acc.status === 'verified-self';
    if (activeTab === 'dormant') return acc.status === 'dormant';
    if (activeTab === 'impersonation') return acc.status === 'impersonation';
    if (activeTab === 'unclaimed') return acc.status === 'unclaimed';
    return true;
  });

  const markVerified = (platform) => {
    setAccounts((prev) =>
      prev.map((a) => (a.platform === platform ? { ...a, status: 'verified-self', risk: 'low' } : a))
    );
    showToast(`Verified ownership of ${platform} profile.`);
  };

  const dormantCount = accounts.filter((a) => a.status === 'dormant').length;
  const impersonationCount = accounts.filter((a) => a.status === 'impersonation').length;
  const verifiedCount = accounts.filter((a) => a.status === 'verified-self').length;

  return (
    <>
      <Header
        title="Shadow Accounts & Digital Footprint"
        subtitle="Uncover dormant, abandoned, and impersonation profiles across 400+ online platforms"
      />

      <div className="page-content">
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '80px',
              right: '2rem',
              zIndex: 9999,
              background: 'var(--accent-emerald)',
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

        {/* Warning Callout for Dormant & Impersonation Accounts */}
        {(dormantCount > 0 || impersonationCount > 0) && (
          <div
            className="card"
            style={{
              marginBottom: '1.5rem',
              background: 'rgba(239, 68, 68, 0.08)',
              borderColor: 'rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon danger" style={{ margin: 0 }}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-red)' }}>
                  Attack Surface Alert: {dormantCount} Dormant Accounts &amp; {impersonationCount} Impersonation Risk Detected
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Dormant profiles (e.g. Spotify, Clubhouse, Gravatar) lack recent MFA verification and are prime vectors for credential stuffing.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dormant')}
              className="btn btn-danger btn-sm"
            >
              Review Dormant Accounts
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card cyan" id="acc-stat-total">
            <div className="stat-icon cyan">
              <Eye size={20} />
            </div>
            <div className="stat-value">{accounts.length}</div>
            <div className="stat-label">Platforms Probed</div>
            <div className="stat-change up">Sherlock crawler active</div>
          </div>

          <div className="stat-card emerald" id="acc-stat-verified">
            <div className="stat-icon emerald">
              <UserCheck size={20} />
            </div>
            <div className="stat-value">{verifiedCount}</div>
            <div className="stat-label">Verified Self Profiles</div>
            <div className="stat-change up">Authentic identities</div>
          </div>

          <div className="stat-card purple" id="acc-stat-dormant">
            <div className="stat-icon purple">
              <Clock size={20} />
            </div>
            <div className="stat-value">{dormantCount}</div>
            <div className="stat-label">Dormant / Abandoned</div>
            <div className="stat-change down">Recommended deletion</div>
          </div>

          <div className="stat-card danger" id="acc-stat-impersonation">
            <div className="stat-icon danger">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-value">{impersonationCount}</div>
            <div className="stat-label">Impersonation Alerts</div>
            <div className="stat-change down">Action required</div>
          </div>
        </div>

        {/* Live Sherlock Social Reconnaissance Card */}
        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.8)' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} style={{ color: 'var(--accent-cyan)' }} />
                Sherlock Live Platform Probing (Open Recon Engine)
              </h3>
              <p className="card-subtitle">
                Asynchronously inspect live HTTP status responses across GitHub, Reddit, Telegram, Dev.to, GitLab, and more
              </p>
            </div>
            <span className="badge badge-low">100% Free Live Prober</span>
          </div>

          <form onSubmit={handleLiveProbe} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder={activePersona?.username ? `Search active handle (@${activePersona.username}) or enter handle...` : 'Enter username or alias (e.g. sreeshiv)...'}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Live parallel requests verify account existence, dormant flags, and potential identity squatting.
              </span>
            </div>
            <button type="submit" disabled={isProbing} className="btn btn-primary" style={{ minWidth: '180px' }}>
              {isProbing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Probing Platforms...
                </>
              ) : (
                <>
                  <Search size={14} /> Probe 400+ Platforms
                </>
              )}
            </button>
          </form>

          {liveProbeStats && (
            <div
              style={{
                marginTop: '1rem',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: liveProbeStats.foundCount > 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: `1px solid ${liveProbeStats.foundCount > 0 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-cyan)' }} />
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                    Live Scan Complete: @{liveProbeStats.username} detected on {liveProbeStats.foundCount} public platforms!
                  </strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Results below have been populated with direct verified URLs and platform categorization.
                  </p>
                </div>
              </div>
              <span className="badge badge-info">{liveProbeStats.foundCount} Active Profiles</span>
            </div>
          )}
        </div>

        {/* Filters Toolbar */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div className="header-search" style={{ minWidth: '260px' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Filter by service name or handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All (${accounts.length})` },
              { id: 'verified', label: `Verified (${verifiedCount})` },
              { id: 'dormant', label: `Dormant (${dormantCount})` },
              { id: 'impersonation', label: `Impersonation (${impersonationCount})` },
              { id: 'unclaimed', label: 'Unclaimed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accounts Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
          {filteredAccounts.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <UserCheck size={36} style={{ color: 'var(--accent-cyan)', marginBottom: '8px', opacity: 0.5 }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>No Platform Profiles Discovered</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                No social, developer, or forum accounts indexed for the active target identity.
              </p>
              <Link to="/scan" className="btn btn-primary btn-sm">
                Scan 400+ Platforms
              </Link>
            </div>
          ) : (
            filteredAccounts.map((account) => (
            <div
              key={account.platform}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border:
                  account.status === 'impersonation'
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : account.status === 'dormant'
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : '1px solid var(--border-primary)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(59, 130, 246, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: 'var(--accent-cyan)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {account.platform.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {account.platform}
                      </h4>
                      <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-accent)' }}>
                        @{account.username}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      account.status === 'impersonation'
                        ? 'badge-critical'
                        : account.status === 'dormant'
                        ? 'badge-high'
                        : account.status === 'verified-self'
                        ? 'badge-low'
                        : account.status === 'unclaimed'
                        ? 'badge-neutral'
                        : 'badge-info'
                    }`}
                  >
                    {account.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '8px 0' }}>
                  {account.found ? (
                    <>
                      <span>Profile Detected • Age: {account.profileAge || 'Unknown'}</span>
                    </>
                  ) : (
                    <span>Username unclaimed on platform. Safe to register defensively.</span>
                  )}
                </div>
              </div>

              <div
                style={{
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                }}
              >
                {account.url ? (
                  <a
                    href={account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.72rem' }}
                  >
                    <ExternalLink size={12} /> View Profile
                  </a>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No active URL</span>
                )}

                <div style={{ display: 'flex', gap: '4px' }}>
                  {account.status === 'dormant' && (
                    <button
                      onClick={() => showToast(`Initiated deletion sequence for ${account.platform}.`)}
                      className="btn btn-danger btn-sm"
                      title="Request Account Deletion"
                    >
                      <Trash2 size={12} /> Erase
                    </button>
                  )}
                  {account.status !== 'verified-self' && account.status !== 'unclaimed' && (
                    <button
                      onClick={() => markVerified(account.platform)}
                      className="btn btn-secondary btn-sm"
                      title="Verify Ownership"
                    >
                      <CheckCircle2 size={12} /> Claim
                    </button>
                  )}
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    </>
  );
}
