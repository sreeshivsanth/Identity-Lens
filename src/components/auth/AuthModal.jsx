import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Mail,
  Key,
  X,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Crown,
  User,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const {
    currentUser,
    isAdmin,
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    loginWithCredentials,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('google'); // 'google' | 'admin'
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);

  // Real Google OAuth Client ID state
  const DEFAULT_GOOGLE_CLIENT_ID = '';
  const [clientId, setClientId] = useState(() => {
    return (
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('identitylens_google_client_id') ||
      DEFAULT_GOOGLE_CLIENT_ID
    );
  });
  const [inputClientId, setInputClientId] = useState(clientId || DEFAULT_GOOGLE_CLIENT_ID);
  const [isEditingClientId, setIsEditingClientId] = useState(false);

  const googleBtnContainerRef = useRef(null);

  // Initialize official Google Identity Services button
  useEffect(() => {
    if (!isAuthModalOpen || activeTab !== 'google' || !clientId) return;

    const handleGoogleCredentialResponse = (response) => {
      try {
        const token = response.credential;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        loginWithGoogle(
          payload.email,
          payload.name,
          payload.picture,
          payload.sub,
          token
        );
        setSuccessMessage(`Authenticated via Google as ${payload.name || payload.email}!`);
        setTimeout(() => setSuccessMessage(''), 2000);
      } catch (err) {
        setErrorMessage('Failed to decode Google credential payload.');
      }
    };

    const renderGoogleButton = () => {
      if (window.google?.accounts?.id && googleBtnContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId.trim(),
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'filled_blue',
            size: 'large',
            width: 340,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        } catch (err) {
          console.error('Google GSI render error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      const timer = setTimeout(renderGoogleButton, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, clientId, isAuthModalOpen, loginWithGoogle]);

  if (!isAuthModalOpen) return null;

  const handleSaveClientId = (e) => {
    e.preventDefault();
    const cleanId = inputClientId.trim();
    if (!cleanId) {
      setErrorMessage('Please enter a valid Google OAuth Client ID.');
      return;
    }
    localStorage.setItem('identitylens_google_client_id', cleanId);
    setClientId(cleanId);
    setIsEditingClientId(false);
    setSuccessMessage('Google Client ID registered! Loading live sign-in button...');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      setErrorMessage('Please provide a Google email address.');
      return;
    }
    const name = googleName.trim() || googleEmail.split('@')[0];
    loginWithGoogle(googleEmail.trim(), name);
    setSuccessMessage(`Signed in via Google as ${googleEmail}!`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginWithCredentials(adminUser, adminPassword);
    if (res.success) {
      setSuccessMessage('Welcome back, Superadmin! Root credentials verified.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } else {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  const handleQuickGoogleAdmin = () => {
    loginWithGoogle('admin@identitylens.local', 'Platform Admin');
    setSuccessMessage('Signed in via Google OAuth as Superadmin!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleQuickGoogleStandard = () => {
    loginWithGoogle('colleague.analyst@gmail.com', 'Analyst User');
    setSuccessMessage('Signed in via Google OAuth as Standard User!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                IdentityLens Authentication
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Multi-User Google Sign-In & Superadmin Enclave
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Active User Status */}
        <div
          style={{
            background: isAdmin ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            border: `1px solid ${isAdmin ? 'rgba(168, 85, 247, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isAdmin ? 'var(--accent-purple)' : 'var(--accent-blue)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                overflow: 'hidden',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                currentUser.initials
              )}
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {currentUser.name}
                {currentUser?.provider === 'google' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: 'rgba(66, 133, 244, 0.2)',
                      color: '#60a5fa',
                      border: '1px solid rgba(66, 133, 244, 0.3)',
                    }}
                  >
                    Google OAuth
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {currentUser.email}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: isAdmin ? 'rgba(168, 85, 247, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                color: isAdmin ? '#c084fc' : '#60a5fa',
              }}
            >
              {isAdmin ? <Crown size={12} /> : <User size={12} />}
              {isAdmin ? 'SUPERADMIN' : 'STANDARD USER'}
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'google' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: '0.82rem' }}
            onClick={() => {
              setActiveTab('google');
              setErrorMessage('');
            }}
          >
            <Mail size={16} /> Sign in with Google
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, fontSize: '0.82rem' }}
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage('');
            }}
          >
            <Crown size={16} /> Superadmin Credentials
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={14} /> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle2 size={14} /> {successMessage}
          </div>
        )}

        {/* Tab 1: Google OAuth Form */}
        {activeTab === 'google' && (
          <div>
            {/* Active Session Display if user is ALREADY signed in via Google */}
            {currentUser?.provider === 'google' && !showSwitchAccount ? (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#34d399',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    marginBottom: '6px',
                  }}
                >
                  <CheckCircle2 size={18} /> Google Account Connected & Verified
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  Active session: <strong>{currentUser.name}</strong> (<span style={{ color: '#60a5fa' }}>{currentUser.email}</span>)
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowSwitchAccount(true)}
                  >
                    <User size={14} /> Switch / Re-authenticate
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      logout();
                      setSuccessMessage('Signed out successfully.');
                      setTimeout(() => setSuccessMessage(''), 2000);
                    }}
                  >
                    <LogIn size={14} style={{ transform: 'rotate(180deg)' }} /> Sign Out
                  </button>
                </div>
              </div>
            ) : !clientId || isEditingClientId ? (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--accent-blue)',
                    }}
                  >
                    <Settings size={15} /> Google Cloud OAuth 2.0 Setup
                  </div>
                  {clientId && (
                    <button
                      type="button"
                      onClick={() => setIsEditingClientId(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  Paste your <strong>OAuth 2.0 Web Client ID</strong> from Google Cloud Console to enable official live Google Sign-In:
                </p>
                <form onSubmit={handleSaveClientId} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, fontSize: '0.76rem' }}
                    placeholder="e.g. 123456789-...apps.googleusercontent.com"
                    value={inputClientId}
                    onChange={(e) => setInputClientId(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    Save & Activate
                  </button>
                </form>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Sign in securely with your verified Google Account:
                </div>
                {/* Official Google GSI Button Container */}
                <div
                  ref={googleBtnContainerRef}
                  style={{ minHeight: '44px', display: 'flex', justifyContent: 'center' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingClientId(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '0.25rem',
                    }}
                  >
                    <Settings size={12} /> Configure Google Client ID
                  </button>
                  {showSwitchAccount && (
                    <button
                      type="button"
                      onClick={() => setShowSwitchAccount(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#60a5fa',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        marginTop: '0.25rem',
                      }}
                    >
                      Return to Active Session
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Admin Direct Credentials */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Admin Email / Username</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Admin Master Password</label>
              <div style={{ position: 'relative' }}>
                <Key
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Configured in backend <code>.env</code> (ADMIN_ROOT_PASSWORD)
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                borderColor: '#9333ea',
              }}
            >
              <Crown size={16} /> Authenticate Superadmin Enclave
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
