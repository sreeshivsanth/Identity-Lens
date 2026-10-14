import {
  Shield,
  AlertTriangle,
  Trash2,
  Radio,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Play,
  User,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ScoreRing from '../components/ScoreRing';
import { useIdentityScan } from '../context/IdentityScanContext';
import { useAuth } from '../context/AuthContext';

const statusLabels = {
  'deletion-sent': { text: 'Deletion Sent', class: 'badge-high' },
  'confirmed-removed': { text: 'Removed ✓', class: 'badge-low' },
  'pending': { text: 'Pending', class: 'badge-medium' },
  'monitored': { text: 'Monitored', class: 'badge-info' },
  'retained-by-choice': { text: 'Retained', class: 'badge-info' },
  'statutory-in-flight': { text: 'In-Flight', class: 'badge-medium' },
};

const riskLabels = {
  critical: { text: 'Critical', class: 'badge-critical' },
  high: { text: 'High', class: 'badge-high' },
  medium: { text: 'Medium', class: 'badge-medium' },
  low: { text: 'Low', class: 'badge-low' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(99, 115, 171, 0.2)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.78rem',
      }}>
        <p style={{ color: '#94a3b8', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: payload[0].color, fontWeight: 600 }}>
          Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const {
    exposureScore,
    dashboardStats,
    scanResults,
    activityLog,
    hasCompletedInitialScan,
    activePersona,
  } = useIdentityScan();

  const statCards = [
    {
      label: 'Total Exposures',
      value: dashboardStats.totalExposures.value,
      change: dashboardStats.totalExposures.change,
      direction: dashboardStats.totalExposures.direction,
      icon: AlertTriangle,
      color: 'danger',
    },
    {
      label: 'Breaches Detected',
      value: dashboardStats.breachesDetected.value,
      change: dashboardStats.breachesDetected.change,
      direction: dashboardStats.breachesDetected.direction,
      icon: Shield,
      color: 'purple',
    },
    {
      label: 'Deletions Sent',
      value: dashboardStats.deletionsSent.value,
      change: dashboardStats.deletionsSent.change,
      direction: dashboardStats.deletionsSent.direction,
      icon: Trash2,
      color: 'cyan',
    },
    {
      label: 'Active Monitors',
      value: dashboardStats.activeMonitors.value,
      change: dashboardStats.activeMonitors.change,
      direction: dashboardStats.activeMonitors.direction,
      icon: Radio,
      color: 'emerald',
    },
  ];

  const recentResults = scanResults.slice(0, 6);

  // Dynamic breakdown data for bar chart
  const breakdownData = [
    { category: 'Breaches', value: exposureScore.breakdown?.breachExposure || 0, fill: '#ef4444' },
    { category: 'Brokers', value: exposureScore.breakdown?.dataBrokerPresence || 0, fill: '#f97316' },
    { category: 'Social Accounts', value: exposureScore.breakdown?.shadowAccounts || 0, fill: '#3b82f6' },
    { category: 'Perception Risk', value: exposureScore.breakdown?.negativeSentiment || 0, fill: '#a855f7' },
    { category: 'Dark Web', value: exposureScore.breakdown?.darkWebMentions || 0, fill: '#ec4899' },
  ];

  return (
    <>
      <Header
        title="Intelligence Dashboard"
        subtitle={
          activePersona
            ? `Active Target: ${activePersona.fullName} (${activePersona.email})`
            : 'Zero-knowledge digital exposure and perimeter defense center'
        }
      />
      <div className="page-content">
        {/* Google Authenticated Session Bar */}
        {currentUser?.provider === 'google' && (
          <div
            className="card animate-fade-in-up"
            style={{
              padding: '0.75rem 1.25rem',
              marginBottom: '1.25rem',
              background: 'rgba(66, 133, 244, 0.08)',
              border: '1px solid rgba(66, 133, 244, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
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
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Verified Google Account: <strong>{currentUser.name}</strong></span>
                  <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                    Active • Superadmin
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Authenticated via Google OAuth 2.0 • Email: {currentUser.email}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Zero-Knowledge Enclave Active
              </span>
            </div>
          </div>
        )}

        {/* Clean Slate Prompt if no scan has been executed yet */}
        {!hasCompletedInitialScan && (
          <div
            className="card animate-fade-in-up"
            style={{
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(168, 85, 247, 0.08))',
              borderColor: 'rgba(59, 130, 246, 0.3)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div
                  className="stat-icon cyan"
                  style={{ width: '48px', height: '48px', margin: 0, borderRadius: '12px' }}
                >
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Zero-Footprint Baseline • Ready for Reconnaissance
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.5 }}>
                    No digital footprint indexed yet. Launch an OSINT scan to query 3,000+ data brokers, breach caches, and perception indices for your identity.
                  </p>
                </div>
              </div>
              <Link to="/scan" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>
                <Play size={16} /> Launch First OSINT Scan
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid animate-fade-in-up">
          {statCards.map((stat, i) => (
            <div className={`stat-card ${stat.color} stagger-${i + 1}`} key={stat.label} id={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
              <div className={`stat-icon ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.direction === 'down' && stat.label !== 'Active Monitors' ? 'up' : stat.direction === 'up' && stat.label !== 'Active Monitors' ? 'down' : 'up'}`}>
                {stat.direction === 'down' ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {stat.value === 0 ? 'Clean Baseline' : `${Math.abs(stat.change)} change`}
              </div>
            </div>
          ))}
        </div>

        {/* Score + Trend Chart */}
        <div className="grid-2-1 animate-fade-in-up stagger-2">
          <div className="card" id="exposure-trend-card">
            <div className="card-header">
              <div>
                <div className="card-title">Exposure Trend & History</div>
                <div className="card-subtitle">
                  {activePersona ? `Historical exposure tracking for ${activePersona.fullName}` : 'Baseline tracking'}
                </div>
              </div>
              <Link to="/reports" className="btn btn-ghost btn-sm">
                View Reports <ArrowRight size={14} />
              </Link>
            </div>
            {exposureScore.history && exposureScore.history.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={exposureScore.history}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,171,0.08)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No historical trend data yet. Execute a scan to plot reduction telemetry.
              </div>
            )}
          </div>

          <div className="card" id="exposure-score-card">
            <div className="card-header">
              <div>
                <div className="card-title">Digital Exposure Index</div>
                <div className="card-subtitle">Real-time composite risk rating</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
              <ScoreRing score={exposureScore.current} previousScore={exposureScore.previous} size={150} />
              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {exposureScore.current === 0
                  ? 'Baseline Unindexed (Zero Exposure)'
                  : exposureScore.current < 40
                  ? 'Low Exposure • Perimeter Defended'
                  : exposureScore.current < 70
                  ? 'Moderate Exposure • Remediation Recommended'
                  : 'High Exposure • Urgent Removals Required'}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Breakdown & Recent Exposures */}
        <div className="grid-1-1 animate-fade-in-up stagger-3">
          {/* Risk Breakdown */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Risk Vector Breakdown</div>
                <div className="card-subtitle">Severity weighting across categories</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={breakdownData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,171,0.08)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={100} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent OSINT Findings */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Discovered Surface Footprints</div>
                <div className="card-subtitle">
                  {recentResults.length > 0 ? `Showing ${recentResults.length} indexed endpoints` : 'No footprints indexed'}
                </div>
              </div>
              <Link to="/osint" className="btn btn-ghost btn-sm">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recentResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentResults.map((result) => (
                  <div
                    key={result.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {result.platform}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {result.dataFound?.join(' • ') || result.type}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${riskLabels[result.riskLevel]?.class || 'badge-low'}`}>
                        {riskLabels[result.riskLevel]?.text || result.riskLevel}
                      </span>
                      <span className={`badge ${statusLabels[result.status]?.class || 'badge-info'}`}>
                        {statusLabels[result.status]?.text || result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <Shield size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
                <p style={{ fontSize: '0.82rem' }}>No data broker footprints recorded in current session.</p>
                <Link to="/scan" className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>
                  <Play size={12} /> Scan Identity
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card animate-fade-in-up stagger-4" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Live Security Activity Log</div>
              <div className="card-subtitle">Zero-knowledge audit events and telemetry</div>
            </div>
            <Link to="/activity" className="btn btn-ghost btn-sm">
              Full Activity Log <ArrowRight size={14} />
            </Link>
          </div>
          {activityLog && activityLog.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activityLog.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                  }}
                >
                  <div className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    {act.type.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {act.detail}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No audit activities recorded. Execute an OSINT scan to begin tracking events.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
