import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CheckCircle2, AlertCircle, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { currentUser, loginWithGoogle, loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAdminFallback, setShowAdminFallback] = useState(false);
  const [adminUser, setAdminUser] = useState('admin@identitylens.local');
  const [adminPassword, setAdminPassword] = useState('');

  const DEFAULT_GOOGLE_CLIENT_ID = '';
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem('identitylens_google_client_id') ||
    DEFAULT_GOOGLE_CLIENT_ID;

  const googleBtnContainerRef = useRef(null);

  // If already authenticated and onboarded, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      if (!currentUser.onboardingCompleted) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  // Initialize official Google Identity Services button
  useEffect(() => {
    if (!clientId) return;

    const handleGoogleCredentialResponse = async (response) => {
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

        setSuccessMessage(`Welcome, ${payload.name || payload.email}! Initializing identity session...`);

        const result = await loginWithGoogle(
          payload.email,
          payload.name,
          payload.picture,
          payload.sub,
          token
        );

        if (result.isFirstTime) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('Google auth processing error:', err);
        setErrorMessage('Failed to decode Google identity token.');
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
            width: 320,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        } catch (err) {
          console.error('GSI Render Error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      const timer = setTimeout(renderGoogleButton, 600);
      return () => clearTimeout(timer);
    }
  }, [clientId, loginWithGoogle, navigate]);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginWithCredentials(adminUser, adminPassword);
    if (res.success) {
      setSuccessMessage('Welcome back, Superadmin! Root credentials verified.');
      if (res.isFirstTime) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      setErrorMessage(res.error || 'Invalid admin credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.12), transparent 45%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.08), transparent 40%), var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="card animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(59, 130, 246, 0.15)',
          padding: '2.5rem 2rem',
          borderRadius: '16px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
              marginBottom: '1rem',
            }}
          >
            <Shield size={32} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            Identity<span style={{ color: 'var(--accent-blue)' }}>Lens</span>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Digital Identity Intelligence & Perimeter Defense Enclave
          </p>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={16} /> {successMessage}
          </div>
        )}

        {/* Main Sign In Area */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Sign In
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>
            Sign in securely with your Google Account to access zero-knowledge footprint auditing and automated removal.
          </p>

          {/* Official Google GSI Button Container */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: '44px',
              marginBottom: '1rem',
            }}
          >
            <div ref={googleBtnContainerRef} />
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            By signing in, you agree to IdentityLens zero-knowledge cryptographic terms and privacy policy.
          </div>
        </div>

        {/* Expandable Root Admin Fallback */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowAdminFallback(!showAdminFallback)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '4px',
            }}
          >
            <Key size={13} />
            <span>Superadmin Master Password</span>
            {showAdminFallback ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showAdminFallback && (
            <form onSubmit={handleAdminSubmit} style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.78rem' }}
                  placeholder="Admin Username or Email"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ fontSize: '0.78rem' }}
                  placeholder="Master Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Lock size={14} /> Authenticate Admin Credentials
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
