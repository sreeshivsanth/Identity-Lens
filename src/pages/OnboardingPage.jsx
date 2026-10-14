import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Calendar, Phone, AtSign, Globe, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OnboardingPage() {
  const { currentUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [jurisdiction, setJurisdiction] = useState('India (DPDP Act 2023)');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    // If user has ALREADY completed onboarding, skip directly to dashboard!
    if (currentUser.onboardingCompleted) {
      navigate('/', { replace: true });
      return;
    }

    // Pre-populate with verified Google metadata
    if (currentUser.name && !fullName) {
      setFullName(currentUser.name);
    }
    if (currentUser.email && !username) {
      setUsername(currentUser.email.split('@')[0]);
    }
    if (currentUser.phone && !phone) {
      setPhone(currentUser.phone);
    }
    if (currentUser.age && !age) {
      setAge(currentUser.age.toString());
    }
  }, [currentUser, navigate, fullName, username, phone, age]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your complete legal name.');
      return;
    }
    if (!age || Number(age) < 13 || Number(age) > 120) {
      setError('Please enter a valid age (13 or older).');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setError('Please provide a primary contact phone number for data broker removal.');
      return;
    }
    if (!username.trim()) {
      setError('Please provide a primary username for OSINT handle discovery.');
      return;
    }

    setSaving(true);
    try {
      await completeOnboarding({
        name: fullName.trim(),
        age: Number(age),
        phone: phone.trim(),
        jurisdiction: jurisdiction,
        username: username.trim().toLowerCase(),
      });
      // Redirect to dashboard now that onboarding is complete
      navigate('/', { replace: true });
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at 50% 15%, rgba(59, 130, 246, 0.15), transparent 50%), radial-gradient(circle at 80% 85%, rgba(168, 85, 247, 0.1), transparent 45%), var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        className="card animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(59, 130, 246, 0.18)',
          borderRadius: '18px',
          padding: '2.5rem',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '1rem',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            1st-Time Identity Initialization
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Welcome, <strong>{currentUser.name}</strong>! Configure your defensive baseline parameters. This setup is only required once.
          </p>
        </div>

        {/* Verified Google Identity Banner */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#4285F4', fontWeight: 900, fontSize: '14px' }}>G</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified Google Account:</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
              {currentUser.email}
            </div>
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '10px',
              background: currentUser.role === 'ADMIN' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(59, 130, 246, 0.25)',
              color: currentUser.role === 'ADMIN' ? '#c084fc' : '#60a5fa',
            }}
          >
            {currentUser.role === 'ADMIN' ? 'SUPERADMIN' : 'STANDARD USER'}
          </span>
        </div>

        {/* Error notification */}
        {error && (
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
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Profile Setup Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Legal Full Name */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} style={{ color: 'var(--accent-blue)' }} /> Full Legal Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sree Shivsanth S"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ color: 'var(--accent-cyan)' }} /> Age *
              </label>
              <input
                type="number"
                min="13"
                max="120"
                className="form-input"
                placeholder="e.g. 21"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Phone Number */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} style={{ color: 'var(--accent-purple)' }} /> Phone Number *
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. +91 98401 23456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Used for data broker suppression queries.
              </span>
            </div>

            {/* Primary Username */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AtSign size={14} style={{ color: 'var(--accent-pink)' }} /> Primary Handle *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. sreeshiv"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                For 400+ platform probes.
              </span>
            </div>
          </div>

          {/* Legal Jurisdiction */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} style={{ color: '#34d399' }} /> Primary Legal Jurisdiction *
            </label>
            <select
              className="form-select"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
            >
              <option value="India (DPDP Act 2023)">India (Digital Personal Data Protection Act)</option>
              <option value="European Union (GDPR)">European Union (GDPR Article 17 Erasure)</option>
              <option value="United States (CCPA/CPRA)">United States — California (CCPA/CPRA)</option>
              <option value="United States (Virginia VCDPA)">United States — Virginia (VCDPA)</option>
              <option value="United Kingdom (UK GDPR)">United Kingdom (Data Protection Act / UK GDPR)</option>
              <option value="Canada (PIPEDA)">Canada (PIPEDA)</option>
              <option value="Global">Global / International</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
            }}
          >
            {saving ? (
              'Initializing Enclave...'
            ) : (
              <>
                <CheckCircle2 size={18} /> Save Profile & Launch Dashboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          🔒 Your details are hashed locally via AES-256-GCM. Subsequent logins with this Google account will automatically bypass this screen.
        </div>
      </div>
    </div>
  );
}
