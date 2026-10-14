import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  ShieldAlert,
  Brain,
  Trash2,
  Activity,
  Settings,
  Eye,
  ScanLine,
  FileText,
  Crown,
  User,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIdentityScan } from '../context/IdentityScanContext';

export default function Sidebar() {
  const location = useLocation();
  const { currentUser, isAdmin, setIsAuthModalOpen } = useAuth();
  const {
    scanResults,
    breachData,
    shadowAccounts,
    deletionQueue,
    hasCompletedInitialScan,
  } = useIdentityScan();

  // Dynamic result counts from real state
  const osintCount = scanResults?.length || 0;
  const breachCount = breachData?.length || 0;
  const shadowCount = shadowAccounts?.length || 0;
  const deletionCount = deletionQueue?.filter((d) => d.status !== 'confirmed-removed')?.length || 0;

  const navSections = [
    {
      label: 'Overview',
      items: [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/scan', icon: ScanLine, label: 'New Scan', badge: null },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        {
          path: '/osint',
          icon: Search,
          label: 'OSINT Results',
          badge: osintCount > 0 ? String(osintCount) : null,
        },
        {
          path: '/breaches',
          icon: ShieldAlert,
          label: 'Breach Monitor',
          badge: breachCount > 0 ? String(breachCount) : null,
          badgeType: 'danger',
        },
        { path: '/sentiment', icon: Brain, label: 'Perception AI' },
        {
          path: '/accounts',
          icon: Eye,
          label: 'Shadow Accounts',
          badge: shadowCount > 0 ? String(shadowCount) : null,
          badgeType: 'info',
        },
      ],
    },
    {
      label: 'Remediation',
      items: [
        {
          path: '/deletions',
          icon: Trash2,
          label: 'Deletion Queue',
          badge: deletionCount > 0 ? String(deletionCount) : null,
        },
        { path: '/reports', icon: FileText, label: 'Reports' },
      ],
    },
    {
      label: 'System',
      items: [
        { path: '/activity', icon: Activity, label: 'Activity Log' },
        { path: '/settings', icon: Settings, label: 'Settings' },
      ],
    },
  ];

  const adminSection = {
    label: 'Superadmin Enclave',
    items: [
      { path: '/admin/users', icon: Users, label: 'Google User Directory', badge: 'Admin', badgeType: 'info' },
    ],
  };

  const sectionsToRender = isAdmin ? [...navSections, adminSection] : navSections;

  return (
    <aside className="sidebar" id="sidebar-nav">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Eye />
        </div>
        <div className="sidebar-brand">
          <h1>IdentityLens</h1>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isAdmin ? 'Superadmin Node' : 'OSINT Intelligence'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sectionsToRender.map((section) => (
          <div className="nav-section" key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive && location.pathname === item.path ? 'active' : ''}`
                }
                end={item.path === '/'}
                id={`nav-${item.path.replace('/', '') || 'dashboard'}`}
              >
                <item.icon />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge ${item.badgeType === 'info' ? 'info' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div
          className="sidebar-user"
          id="sidebar-user-profile"
          onClick={() => setIsAuthModalOpen(true)}
          style={{
            cursor: 'pointer',
            border: `1px solid ${isAdmin ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
            background: isAdmin ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            transition: 'all 0.2s ease',
          }}
          title="Click to Switch User / View Admin Credentials"
        >
          <div
            className="user-avatar"
            style={{
              background: isAdmin ? 'var(--accent-purple)' : 'var(--accent-blue)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
          <div className="user-info">
            <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {currentUser?.name || 'User'}
              {currentUser?.provider === 'google' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#4285F4',
                    fontSize: '8px',
                    fontWeight: 900,
                  }}
                  title="Google OAuth Connected"
                >
                  G
                </span>
              )}
              {isAdmin && <Crown size={12} style={{ color: '#c084fc' }} />}
            </strong>
            <span style={{ fontSize: '0.68rem', color: isAdmin ? '#c084fc' : 'var(--text-muted)' }}>
              {currentUser?.provider === 'google' ? 'Google Account Connected' : (isAdmin ? 'Superadmin' : currentUser?.email || 'Google User')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
