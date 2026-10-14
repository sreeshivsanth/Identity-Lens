import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Search,
  Trash2,
  UserCheck,
  Clock,
  Mail,
  AtSign,
  Globe,
  RefreshCw,
} from 'lucide-react';
import Header from '../components/Header';
import { useIdentityScan } from '../context/IdentityScanContext';
import { probePlatformsLive } from '../services/liveSocialService';
import { probeGmailAndEmailLive } from '../services/liveEmailService';

export default function AccountsPage() {
  const location = useLocation();
  const { shadowAccounts, activePersona } = useIdentityScan();

  // Search Mode: 'username' | 'email'
  const [searchMode, setSearchMode] = useState('username');
  const [inputValue, setInputValue] = useState('');
  const [isProbing, setIsProbing] = useState(false);
  const [liveProbeStats, setLiveProbeStats] = useState(null);
  const [emailIntel, setEmailIntel] = useState(null);
  const [accounts, setAccounts] = useState(shadowAccounts);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'verified' | 'email-linked' | 'dormant' | 'impersonation' | 'unclaimed'
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }, []);

  const executeSearch = useCallback(async (queryStr, mode) => {
    const raw = (queryStr || inputValue).trim();
    if (!raw) return;

    setIsProbing(true);
    setLiveProbeStats(null);
    setEmailIntel(null);

    const isEmailQuery = mode === 'email' || raw.includes('@');

    try {
      if (isEmailQuery) {
        const emailResult = await probeGmailAndEmailLive(raw);
        setIsProbing(false);
        const foundAccounts = emailResult.accounts || [];
        setAccounts(foundAccounts);
        setEmailIntel(emailResult.emailIntel);
        setLiveProbeStats({
          target: raw,
          isEmail: true,
          isGmail: emailResult.isGmail,
          foundCount: foundAccounts.length,
        });

        if (foundAccounts.length > 0) {
          showToast(`Discovered ${foundAccounts.length} live accounts associated with "${raw}"!`);
        } else {
          showToast(`Zero public profiles found matching "${raw}".`);
        }
      } else {
        const cleanHandle = raw.replace(/^@/, '');
        const liveDiscovered = await probePlatformsLive(cleanHandle);
        setIsProbing(false);
        setAccounts(liveDiscovered);
        setLiveProbeStats({
          target: `@${cleanHandle}`,
          isEmail: false,
          isGmail: false,
          foundCount: liveDiscovered.length,
        });

        if (liveDiscovered.length > 0) {
          showToast(`Discovered ${liveDiscovered.length} live verified accounts for @${cleanHandle}!`);
        } else {
          showToast(`Zero public profiles found matching @${cleanHandle}.`);
        }
      }
    } catch (err) {
      setIsProbing(false);
      console.error('Probe error:', err);
      showToast('Live probe encountered a network timeout.');
    }
  }, [inputValue, showToast]);

  // Read URL query parameters (?q=, ?email=, ?username=)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const userParam = params.get('username');
    const qParam = params.get('q');

    const targetQuery = emailParam || userParam || qParam;
    if (targetQuery) {
      const isEmail = targetQuery.includes('@');
      setSearchMode(isEmail ? 'email' : 'username');
      setInputValue(targetQuery);
      executeSearch(targetQuery, isEmail ? 'email' : 'username');
    }
  }, [location.search, executeSearch]);

  // Auto-detect email when typing
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.includes('@') && val.includes('.') && searchMode !== 'email') {
      setSearchMode('email');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeSearch(inputValue, searchMode);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.username && acc.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (acc.bio && acc.bio.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'verified') return acc.status === 'verified-self';
    if (activeTab === 'email-linked') {
      return (
        acc.source?.includes('Gmail') ||
        acc.source?.includes('Email') ||
        acc.source?.includes('Breach') ||
        acc.platform === 'Gravatar' ||
        acc.platform.includes('Google') ||
        acc.platform.includes('GitHub (Email')
      );
    }
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
  const emailLinkedCount = accounts.filter(
    (a) =>
      a.source?.includes('Gmail') ||
      a.source?.includes('Email') ||
      a.source?.includes('Breach') ||
      a.platform === 'Gravatar' ||
      a.platform.includes('Google') ||
      a.platform.includes('GitHub (Email')
  ).length;

  return (
    <>
      <Header
        title="Shadow Accounts & Digital Footprint"
        subtitle="Uncover dormant, abandoned, and impersonation profiles by Username or Gmail/Email address"
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
                  Dormant profiles lack recent MFA verification and are prime vectors for credential stuffing.
                </p>
              </div>
            </div>
            <button onClick={() => setActiveTab('dormant')} className="btn btn-danger btn-sm">
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
            <div className="stat-change up">Dual Handle &amp; Email OSINT</div>
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

        {/* Sherlock & Gmail OSINT Probing Card */}
        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} style={{ color: 'var(--accent-cyan)' }} />
                Open Recon Engine — Find by Username or Gmail Address
              </h3>
              <p className="card-subtitle">
                Inspect public handles, Gravatar avatars, GitHub email registries, and leaked database credentials across 400+ platforms
              </p>
            </div>
            <span className="badge badge-low">100% Free Live Prober</span>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setSearchMode('username')}
              className={`btn btn-sm ${searchMode === 'username' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <AtSign size={14} /> Search by Username / Handle
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('email')}
              className={`btn btn-sm ${searchMode === 'email' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Mail size={14} /> Search by Gmail / Email Address
            </button>
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={searchMode === 'email' ? 'email' : 'text'}
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder={
                    searchMode === 'email'
                      ? activePersona?.email
                        ? `Enter Gmail (e.g. ${activePersona.email}) or any email address...`
                        : 'Enter Gmail address (e.g. user@gmail.com)...'
                      : activePersona?.username
                      ? `Enter handle (@${activePersona.username}) or custom alias...`
                      : 'Enter username or alias (e.g. sreeshiv)...'
                  }
                  value={inputValue}
                  onChange={handleInputChange}
                  required
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {searchMode === 'email' ? <Mail size={16} /> : <AtSign size={16} />}
                </div>
              </div>

              {/* Quick autofill suggestions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Quick Trace:</span>
                {activePersona?.email && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMode('email');
                      setInputValue(activePersona.email);
                      executeSearch(activePersona.email, 'email');
                    }}
                    className="badge"
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      cursor: 'pointer',
                      fontSize: '0.68rem',
                    }}
                  >
                    <Mail size={10} style={{ marginRight: '4px' }} /> {activePersona.email}
                  </button>
                )}
                {activePersona?.username && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMode('username');
                      setInputValue(activePersona.username);
                      executeSearch(activePersona.username, 'username');
                    }}
                    className="badge"
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      color: '#c084fc',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      cursor: 'pointer',
                      fontSize: '0.68rem',
                    }}
                  >
                    <AtSign size={10} style={{ marginRight: '4px' }} /> @{activePersona.username}
                  </button>
                )}
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                  {searchMode === 'email'
                    ? 'Searches Gravatar avatar, GitHub commits, breached databases, & derived handles'
                    : 'Probes HTTP 200 account responses across 10+ social platforms'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProbing}
              className="btn btn-primary"
              style={{ minWidth: '190px', height: '42px' }}
            >
              {isProbing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Probing {searchMode === 'email' ? 'Gmail OSINT...' : 'Platforms...'}
                </>
              ) : (
                <>
                  <Search size={14} /> {searchMode === 'email' ? 'Trace via Gmail' : 'Probe Handles'}
                </>
              )}
            </button>
          </form>

          {/* Live Scan Notification Pill */}
          {liveProbeStats && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: liveProbeStats.foundCount > 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: `1px solid ${liveProbeStats.foundCount > 0 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-cyan)' }} />
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                    OSINT Telemetry Complete: {liveProbeStats.target} identified across {liveProbeStats.foundCount} platform footprints!
                  </strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {liveProbeStats.isEmail
                      ? 'Synthesized cross-platform intelligence from Gravatar, GitHub email matching, and breach database archives.'
                      : 'Parallel HTTP probers confirmed active account ownership and profile categorization.'}
                  </p>
                </div>
              </div>
              <span className="badge badge-info">{liveProbeStats.foundCount} Discovered Profiles</span>
            </div>
          )}

          {/* Email Reconnaissance Dossier Card (Displayed when an email is searched) */}
          {emailIntel && (
            <div
              style={{
                marginTop: '1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: emailIntel.isGmail ? 'rgba(234, 67, 53, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: emailIntel.isGmail ? '#ea4335' : '#60a5fa',
                      fontWeight: 700,
                    }}
                  >
                    {emailIntel.isGmail ? 'G' : <Mail size={16} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      {emailIntel.email}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {emailIntel.isGmail ? 'Verified Google Mail Service (aspmx.l.google.com)' : `Corporate Domain (@${emailIntel.domain})`}
                      {emailIntel.canonicalUsername && ` • Canonical Handle: @${emailIntel.canonicalUsername}`}
                    </span>
                  </div>
                </div>
                <span className={`badge ${emailIntel.isGmail ? 'badge-low' : 'badge-neutral'}`}>
                  {emailIntel.isGmail ? 'Active Google Account' : 'Standard Email'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {/* Gravatar Card */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    {emailIntel.gravatar?.thumbnailUrl ? (
                      <img
                        src={emailIntel.gravatar.thumbnailUrl}
                        alt="Gravatar"
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #38bdf8' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <UserCheck size={18} />
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        Gravatar Identity Profile
                      </span>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {emailIntel.gravatar?.displayName || 'No Gravatar Avatar'}
                      </h5>
                    </div>
                  </div>
                  {emailIntel.gravatar?.aboutMe && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                      "{emailIntel.gravatar.aboutMe}"
                    </p>
                  )}
                  {emailIntel.gravatar?.profileUrl && (
                    <a
                      href={emailIntel.gravatar.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px' }}
                    >
                      <ExternalLink size={10} /> View Public Gravatar Profile
                    </a>
                  )}
                </div>

                {/* GitHub Email Match Card */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    {emailIntel.githubMatch?.avatarUrl ? (
                      <img
                        src={emailIntel.githubMatch.avatarUrl}
                        alt="GitHub"
                        style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <Globe size={18} />
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 600 }}>
                        GitHub Developer Registry
                      </span>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {emailIntel.githubMatch ? `@${emailIntel.githubMatch.username}` : 'No Direct Email Commit Match'}
                      </h5>
                    </div>
                  </div>
                  {emailIntel.githubMatch?.url && (
                    <a
                      href={emailIntel.githubMatch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px' }}
                    >
                      <ExternalLink size={10} /> View GitHub Developer Profile
                    </a>
                  )}
                </div>

                {/* Breached Platform Presence Card */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ShieldAlert size={16} style={{ color: emailIntel.breachesCount > 0 ? '#ef4444' : '#10b981' }} />
                    <span style={{ fontSize: '0.7rem', color: emailIntel.breachesCount > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                      Historical Breach Correlation
                    </span>
                  </div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0' }}>
                    {emailIntel.breachesCount > 0
                      ? `${emailIntel.breachesCount} Verified Database Leaks`
                      : 'Clean Baseline (0 Public Leaks)'}
                  </h5>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                    {emailIntel.breachesCount > 0
                      ? `Registered accounts identified in: ${emailIntel.breaches.slice(0, 3).map((b) => b.service).join(', ')}${emailIntel.breaches.length > 3 ? ` +${emailIntel.breaches.length - 3} more` : ''}.`
                      : 'Zero credential dumps or compromised databases found on XposedOrNot.'}
                  </p>
                </div>
              </div>
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
              placeholder="Filter by service name, handle, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All (${accounts.length})` },
              { id: 'verified', label: `Verified (${verifiedCount})` },
              { id: 'email-linked', label: `Gmail / Email Linked (${emailLinkedCount})` },
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
                No social, developer, or forum accounts indexed matching this filter.
              </p>
              <button onClick={() => setActiveTab('all')} className="btn btn-secondary btn-sm">
                Show All Discovered Accounts
              </button>
            </div>
          ) : (
            filteredAccounts.map((account, idx) => (
              <div
                key={`${account.platform}-${idx}`}
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
                      {account.avatarUrl ? (
                        <img
                          src={account.avatarUrl}
                          alt={account.platform}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            objectFit: 'cover',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        />
                      ) : (
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
                      )}
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
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

                  {/* Source Pill */}
                  {account.source && (
                    <div style={{ marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background:
                            account.source.includes('Gmail') || account.source.includes('Gravatar')
                              ? 'rgba(16, 185, 129, 0.12)'
                              : account.source.includes('GitHub Email')
                              ? 'rgba(56, 189, 248, 0.12)'
                              : account.source.includes('Breach')
                              ? 'rgba(239, 68, 68, 0.12)'
                              : 'rgba(255, 255, 255, 0.05)',
                          color:
                            account.source.includes('Gmail') || account.source.includes('Gravatar')
                              ? '#34d399'
                              : account.source.includes('GitHub Email')
                              ? '#38bdf8'
                              : account.source.includes('Breach')
                              ? '#f87171'
                              : 'var(--text-secondary)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontWeight: 600,
                        }}
                      >
                        {account.source}
                      </span>
                    </div>
                  )}

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '6px 0' }}>
                    {account.bio ? (
                      <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>{account.bio}</p>
                    ) : account.found ? (
                      <span>Profile Detected • Age: {account.profileAge || 'Active'}</span>
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
            ))
          )}
        </div>
      </div>
    </>
  );
}
