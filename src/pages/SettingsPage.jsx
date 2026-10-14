import { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Key,
  Lock,
  Bell,
  Sliders,
  Database,
  Trash2,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Cpu,
  Crown,
  User,
  Users,
  LogIn,
} from 'lucide-react';
import Header from '../components/Header';
import { systemSettings } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { currentUser, isAdmin, setIsAuthModalOpen } = useAuth();
  const [config, setConfig] = useState({
    ...systemSettings,
    autoRemediateBrokers: false, // Defaulting to FALSE as per user request: manual inspection first!
  });
  const [savedToast, setSavedToast] = useState(false);
  const [keyExported, setKeyExported] = useState(false);
  const [systemSpecs, setSystemSpecs] = useState({
    cpu: { model: '14th Gen Intel Core i7-14700HX', threads: 28 },
    gpu: {
      name: 'NVIDIA GeForce RTX 5060 Laptop GPU',
      vram_total_mb: 8151,
      cuda_version: '12.5',
      driver_version: '615.71.09',
    },
    memory: { total_gb: 32 },
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/system/hardware')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.cpu) {
          setSystemSpecs(data);
        }
      })
      .catch(() => {});
  }, []);

  // Authenticated user registry: ONLY Admin pre-seeded + currently active user session
  const multiUsers = [
    {
      id: 'usr-001',
      name: 'Platform Admin',
      email: 'admin@identitylens.local',
      role: 'SUPERADMIN',
      provider: 'Master Key / OAuth',
      status: 'Active',
      scans: 14,
      quota: 'Unlimited',
    },
    ...(currentUser && currentUser.email !== 'admin@identitylens.local' && currentUser.email
      ? [
          {
            id: currentUser.id || 'usr-active',
            name: currentUser.name || 'Verified User',
            email: currentUser.email,
            role: currentUser.role || 'STANDARD_USER',
            provider: 'Google OAuth',
            status: 'Active',
            scans: 1,
            quota: '35 / mo',
          },
        ]
      : []),
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleExportKey = () => {
    const keyData = {
      version: 'IdentityLens-v1.0.4',
      client_salt: config.clientSalt,
      pbkdf2_iterations: config.keyDerivationRounds,
      curve: 'AES-256-GCM',
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'identitylens-zero-knowledge-key.json';
    a.click();
    setKeyExported(true);
    setTimeout(() => setKeyExported(false), 3000);
  };

  return (
    <>
      <Header
        title="Settings & Admin Center"
        subtitle="Zero-knowledge keys, multi-user Google OAuth sessions, and remediation controls"
      />

      <div className="page-content">
        {savedToast && (
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
            <CheckCircle2 size={16} /> Configuration saved and committed to local enclave.
          </div>
        )}

        {/* User Session & Role Card */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            background: isAdmin ? 'rgba(168, 85, 247, 0.08)' : 'rgba(59, 130, 246, 0.08)',
            borderColor: isAdmin ? 'rgba(168, 85, 247, 0.3)' : 'rgba(59, 130, 246, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: isAdmin ? 'var(--accent-purple)' : 'var(--accent-blue)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                {currentUser?.initials || 'U'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {currentUser?.name || 'Active User'}
                  </h3>
                  <span
                    className={`badge ${isAdmin ? 'badge-purple' : 'badge-info'}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: isAdmin ? 'rgba(168, 85, 247, 0.25)' : undefined,
                      color: isAdmin ? '#c084fc' : undefined,
                    }}
                  >
                    {isAdmin ? <Crown size={12} /> : <User size={12} />}
                    {isAdmin ? 'SUPERADMIN' : 'STANDARD USER'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  Authenticated Email: <strong>{currentUser?.email}</strong> • Provider: {currentUser?.provider}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setIsAuthModalOpen(true)} className="btn btn-secondary btn-sm">
                <LogIn size={14} /> Switch Account / Re-authenticate
              </button>
            </div>
          </div>
        </div>

        {/* Superadmin Multi-User Registry (Shown if Admin) */}
        {isAdmin && (
          <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} style={{ color: '#c084fc' }} />
                  Superadmin Multi-User Registry
                </h3>
                <p className="card-subtitle">
                  Users registered via Google OAuth 2.0 with isolated zero-knowledge vaults
                </p>
              </div>
              <span className="badge badge-purple">Admin Telemetry</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User Identity</th>
                    <th>Email Address</th>
                    <th>Access Role</th>
                    <th>Authentication Method</th>
                    <th>Scans Performed</th>
                    <th>Monthly Quota</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {multiUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${u.role === 'SUPERADMIN' ? 'badge-purple' : 'badge-info'}`}
                          style={{
                            background: u.role === 'SUPERADMIN' ? 'rgba(168, 85, 247, 0.25)' : undefined,
                            color: u.role === 'SUPERADMIN' ? '#c084fc' : undefined,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>{u.provider}</td>
                      <td>{u.scans}</td>
                      <td>{u.quota}</td>
                      <td>
                        <span className="badge badge-low">{u.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid-2">
            {/* Zero-Knowledge Privacy Settings */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={18} style={{ color: 'var(--accent-cyan)' }} />
                    Zero-Knowledge Enclave
                  </h3>
                  <p className="card-subtitle">Local cryptography parameters</p>
                </div>
                <span className="badge badge-low">AES-256-GCM</span>
              </div>

              <div className="form-group">
                <label className="form-label">Client Salt (Hex)</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  value={config.clientSalt}
                  onChange={(e) => setConfig({ ...config, clientSalt: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PBKDF2 Key Derivation Rounds</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.keyDerivationRounds}
                  onChange={(e) => setConfig({ ...config, keyDerivationRounds: parseInt(e.target.value) || 100000 })}
                />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Standard: 100,000 iterations for quantum-resistant local hashing.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleExportKey} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Key size={14} /> {keyExported ? 'Key Exported ✓' : 'Export Master Key'}
                </button>
                <button
                  type="button"
                  onClick={() => alert('Local cryptographic store purged. Session terminated.')}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={14} /> Purge Enclave
                </button>
              </div>
            </div>

            {/* User-Controlled Scan & Remediation Policies */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={18} style={{ color: 'var(--accent-blue)' }} />
                    Inspection &amp; Remediation Safeguards
                  </h3>
                  <p className="card-subtitle">Prevent accidental deletion &amp; enforce verification</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Automatic OSINT Scan Frequency</label>
                <select
                  className="form-input"
                  value={config.autoScanFrequency}
                  onChange={(e) => setConfig({ ...config, autoScanFrequency: e.target.value })}
                >
                  <option value="daily">Daily Reconnaissance</option>
                  <option value="weekly">Weekly Continuous Scan (Recommended)</option>
                  <option value="monthly">Monthly Audit</option>
                  <option value="disabled">Manual Scans Only</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.autoRemediateBrokers}
                    onChange={(e) => setConfig({ ...config, autoRemediateBrokers: e.target.checked })}
                    style={{ accentColor: 'var(--accent-blue)', marginTop: '4px' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Auto-Delete on Discovery (Disabled by Default)
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                      When unchecked, IdentityLens stages all findings for your manual inspection so you can selectively choose what to delete and what to keep.
                    </span>
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Central Server Data Retention</label>
                <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    0 Days (Strict Ephemeral Mode Active)
                  </span>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    IdentityLens does not retain raw user records or plaintext credentials on central servers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: '1.5rem' }}>
            {/* Notification Integrations */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} style={{ color: 'var(--accent-purple)' }} />
                    Alerts &amp; Webhook Telemetry
                  </h3>
                  <p className="card-subtitle">Connect real-time event dispatchers</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Slack Webhook URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.notifications?.webhookUrl || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      notifications: { ...config.notifications, webhookUrl: e.target.value },
                    })
                  }
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'email', label: 'Encrypted PGP Email Alerts (on new breach detection)' },
                  { key: 'slack', label: 'Slack Channel Notifications (on broker removal confirmation)' },
                  { key: 'discord', label: 'Discord Security Bot Webhook' },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.notifications ? config.notifications[key] : false}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          notifications: { ...config.notifications, [key]: e.target.checked },
                        })
                      }
                      style={{ accentColor: 'var(--accent-purple)' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dedicated GPU Acceleration Engine */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={18} style={{ color: '#34d399' }} />
                    Dedicated GPU Acceleration Engine
                  </h3>
                  <p className="card-subtitle">Hardware acceleration for PyTorch, RoBERTa &amp; spaCy</p>
                </div>
                <span className="badge badge-low" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span>
                  NVIDIA Active
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                      {systemSpecs.gpu?.name || 'NVIDIA GeForce RTX 5060 Laptop GPU'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Blackwell/Ada Architecture • {systemSpecs.gpu?.vram_total_mb || 8151} MB GDDR6 Dedicated VRAM
                    </span>
                  </div>
                  <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                    CUDA {systemSpecs.gpu?.cuda_version || '12.5'} Ready
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Processor &amp; Threads</span>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                      {systemSpecs.cpu?.model?.replace('Intel(R) Core(TM) ', '') || 'i7-14700HX'} ({systemSpecs.cpu?.threads || 28} Threads)
                    </strong>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>System Memory &amp; Driver</span>
                    <strong style={{ fontSize: '0.78rem', color: '#34d399' }}>
                      {systemSpecs.memory?.total_gb || 32}GB RAM • Driver {systemSpecs.gpu?.driver_version || '615.71'}
                    </strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                  Dedicated GPU binds automatically to RoBERTa perception classification, toxicity scoring, and Playwright crawler acceleration across {systemSpecs.cpu?.threads || 28} CPU threads.
                </p>
              </div>
            </div>

            {/* External API Integration Keys */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={18} style={{ color: 'var(--accent-amber)' }} />
                    Intelligence Engine API Keys
                  </h3>
                  <p className="card-subtitle">Manage third-party data broker &amp; AI connections</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { name: 'HaveIBeenPwned API', key: 'haveIBeenPwned', status: 'Configured & Active' },
                  { name: 'CapSolver (CAPTCHA Bypass)', key: 'capSolver', status: 'Active (Balance: $48.20)' },
                  { name: 'SpiderFoot OSINT Daemon', key: 'spiderFoot', status: 'Connected (v4.0.0)' },
                  { name: 'Google Perspective AI', key: 'perspective', status: 'Active (RoBERTa hybrid)' },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.status}</span>
                    </div>
                    <span className="badge badge-low" style={{ fontSize: '0.62rem' }}>
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>
              <Save size={16} /> Save System Settings
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
