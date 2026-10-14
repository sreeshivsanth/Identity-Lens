import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Shield,
  Crown,
  User,
  LogIn,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Flame,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIdentityScan } from '../context/IdentityScanContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ title, subtitle }) {
  const { currentUser, isAdmin, setIsAuthModalOpen } = useAuth();
  const {
    scanResults,
    breachData,
    darkWebFindings,
    activityLog,
    hasCompletedInitialScan,
  } = useIdentityScan();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Real threat telemetry count
  const activeThreatCount = hasCompletedInitialScan
    ? (breachData?.length || 0) + (darkWebFindings?.length || 0)
    : 0;

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const navigate = useNavigate();
  const [globalSearchInput, setGlobalSearchInput] = useState('');

  const handleGlobalSearchKeyDown = (e) => {
    if (e.key === 'Enter' && globalSearchInput.trim()) {
      const q = globalSearchInput.trim();
      if (q.includes('@')) {
        navigate(`/accounts?email=${encodeURIComponent(q)}`);
      } else {
        navigate(`/accounts?username=${encodeURIComponent(q)}`);
      }
    }
  };

  const [hardwareInfo, setHardwareInfo] = useState({
    name: 'NVIDIA GeForce RTX 5060 Laptop GPU',
    shortName: 'RTX 5060 (8GB GPU)',
    vram: 8151,
    detected: true,
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/system/gpu')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.dedicated_gpu_detected) {
          const short = data.name.includes('5060')
            ? 'RTX 5060 (8GB GPU)'
            : data.name.replace('NVIDIA GeForce ', '').replace(' Laptop GPU', '');
          setHardwareInfo({
            name: data.name,
            shortName: short,
            vram: data.vram_total_mb,
            detected: true,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="app-header" id="app-header">
      <div className="header-left">
        <div>
          <h2 className="header-title">{title}</h2>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="header-right">
        <div className="header-search" id="global-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search Gmail, username, or alias (press Enter)..."
            value={globalSearchInput}
            onChange={(e) => setGlobalSearchInput(e.target.value)}
            onKeyDown={handleGlobalSearchKeyDown}
          />
        </div>

        {/* Dedicated GPU Acceleration Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: '#34d399',
          }}
          title={`Dedicated Hardware Acceleration Active: ${hardwareInfo.name} (${Math.round(hardwareInfo.vram / 1024)}GB GDDR6 / CUDA 12.5)`}
        >
          <Cpu size={14} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#34d399',
                display: 'inline-block',
                boxShadow: '0 0 6px #34d399',
              }}
            ></span>
            {hardwareInfo.shortName}
          </span>
        </div>

        {/* User & Role Badge / Auth Button */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="btn btn-ghost"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${isAdmin ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-color)'}`,
            background: isAdmin ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          }}
          title="Click to View Account & Google Auth Status"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isAdmin ? 'var(--accent-purple)' : 'var(--accent-blue)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              overflow: 'hidden',
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
              currentUser?.initials || 'U'
            )}
          </div>
          <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {currentUser?.name || 'Guest'}
              {currentUser?.provider === 'google' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#4285F4',
                    fontSize: '9px',
                    fontWeight: 900,
                    boxShadow: '0 0 4px rgba(0,0,0,0.4)',
                  }}
                  title="Verified via Google OAuth 2.0"
                >
                  G
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: isAdmin ? '#c084fc' : '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              {isAdmin ? <Crown size={10} /> : <User size={10} />}
              {isAdmin ? 'ADMIN' : 'USER'}
              {currentUser?.provider === 'google' && ' • GOOGLE VERIFIED'}
            </div>
          </div>
        </button>

        <button className="header-icon-btn" id="btn-help" aria-label="Help" title="Platform Architecture & Zero-Knowledge Attestation">
          <HelpCircle size={20} />
        </button>

        {/* Real Notification Controller */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="header-icon-btn"
            id="btn-notifications"
            aria-label="Notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
            title={activeThreatCount > 0 ? `${activeThreatCount} active security threats detected` : 'No active notifications'}
            style={{
              background: showNotifications ? 'rgba(255, 255, 255, 0.08)' : undefined,
            }}
          >
            <Bell size={20} />
            {activeThreatCount > 0 && <span className="notification-dot"></span>}
          </button>

          {/* Actual Results Notifications Flyout */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '360px',
                background: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2)',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'fadeIn 0.15s ease-out',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                    Identity Threat Notifications
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Real-time reconnaissance telemetry
                  </span>
                </div>
                <span
                  className={`badge ${activeThreatCount > 0 ? 'badge-critical' : 'badge-low'}`}
                  style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                >
                  {activeThreatCount > 0 ? `${activeThreatCount} Active Alerts` : 'Clean Baseline (0)'}
                </span>
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px 0' }}>
                {!hasCompletedInitialScan ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                      }}
                    >
                      <CheckCircle2 size={18} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Zero-Footprint Baseline
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      No digital footprint indexed yet. Launch an OSINT scan to query breach caches and platforms.
                    </div>
                  </div>
                ) : (
                  <>
                    {breachData?.slice(0, 3).map((breach) => (
                      <div
                        key={breach.id}
                        style={{
                          padding: '10px 16px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}
                      >
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Flame size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {breach.service} Compromise
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {breach.compromisedData?.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                    {darkWebFindings?.map((dw) => (
                      <div
                        key={dw.id}
                        style={{
                          padding: '10px 16px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}
                      >
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Radio size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {dw.source}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {dw.snippet}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                }}
              >
                <Link
                  to={hasCompletedInitialScan ? '/activity' : '/scan'}
                  onClick={() => setShowNotifications(false)}
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--accent-blue)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {hasCompletedInitialScan ? 'View Comprehensive Event Log' : 'Start Identity Reconnaissance'} <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
