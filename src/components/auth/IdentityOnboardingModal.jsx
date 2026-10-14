import { useState } from 'react';
import { Shield, Lock, CheckCircle2, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function IdentityOnboardingModal() {
  const { currentUser, verifyLegalName } = useAuth();
  const [legalName, setLegalName] = useState('');
  const [error, setError] = useState('');

  // Only display for logged-in standard users who haven't verified their full legal name
  if (!currentUser || currentUser.role === 'ADMIN' || currentUser.legalNameVerified || currentUser.role === 'GUEST') {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = legalName.trim();
    if (!clean || clean.length < 2) {
      setError('Please provide your complete legal full name.');
      return;
    }
    verifyLegalName(clean);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.92)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--surface-color)',
          borderColor: 'rgba(59, 130, 246, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.2)',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <Shield size={28} style={{ color: 'var(--primary-color)' }} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Identity Verification & Anti-Misuse Enclave
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            To protect privacy and prevent unauthorized surveillance, cyber-stalking, or doxxing, standard accounts are legally restricted to auditing and defending <strong>their own personal identity</strong>.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Lock size={18} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Authenticated Google Identity: <br />
            <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email}</strong>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--danger-color)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Your Complete Legal Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. Jane Doe"
                value={legalName}
                onChange={(e) => {
                  setLegalName(e.target.value);
                  setError('');
                }}
                autoFocus
                required
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              This binds your Self-Defense Enclave. Target scans will be locked to this verified name.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          >
            <CheckCircle2 size={16} /> Confirm & Bind Self-Defense Identity
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Only Platform Superadmins have unrestricted authorization to scan third-party targets.
        </div>
      </div>
    </div>
  );
}
