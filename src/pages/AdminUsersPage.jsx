import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  Crown,
  User,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Calendar,
  Phone,
  Globe,
  AtSign,
  CheckCircle2,
  Lock,
  X,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function AdminUsersPage() {
  const { currentUser, isAdmin, getAllRegisteredUsers } = useAuth();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);

  // Security guard: Only Superadmin can view this page
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [currentUser, isAdmin, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllRegisteredUsers();
      setUsersList(data || []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.googleSub?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.jurisdiction?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'ADMIN' && u.role === 'ADMIN') ||
      (roleFilter === 'USER' && u.role !== 'ADMIN');

    return matchesSearch && matchesRole;
  });

  const totalAdmins = usersList.filter((u) => u.role === 'ADMIN').length;
  const totalStandard = usersList.filter((u) => u.role !== 'ADMIN').length;

  if (!isAdmin) return null;

  return (
    <>
      <Header
        title="Google Accounts & User Directory"
        subtitle="Superadmin ledger of all authenticated Google profiles, Google IDs, demographics, and audit quotas"
      />

      <div className="page-content">
        {/* Metric Cards */}
        <div className="stats-grid animate-fade-in-up">
          <div className="stat-card cyan">
            <div className="stat-icon cyan">
              <Users size={20} />
            </div>
            <div className="stat-value">{usersList.length}</div>
            <div className="stat-label">Total Registered Accounts</div>
            <div className="stat-change up">Google OAuth Verified</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon purple">
              <Crown size={20} />
            </div>
            <div className="stat-value">{totalAdmins}</div>
            <div className="stat-label">Platform Superadmins</div>
            <div className="stat-change neutral">Root Authorization</div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon blue">
              <User size={20} />
            </div>
            <div className="stat-value">{totalStandard}</div>
            <div className="stat-label">Standard Users</div>
            <div className="stat-change up">Self-Identity Scanners</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon danger">
              <Shield size={20} />
            </div>
            <div className="stat-value">Zero-Knowledge</div>
            <div className="stat-label">Enclave Storage</div>
            <div className="stat-change up">Client-Side Salted</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.4rem', fontSize: '0.82rem' }}
                placeholder="Search by Name, Google Email, or Google ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-select"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles ({usersList.length})</option>
                <option value="ADMIN">Superadmins ({totalAdmins})</option>
                <option value="USER">Standard Users ({totalStandard})</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                Authenticated Google Identities Ledger
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Showing {filteredUsers.length} of {usersList.length} authenticated profiles
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem' }}>User Profile</th>
                  <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem' }}>Google Email</th>
                  <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem' }}>Google Account ID (`sub`)</th>
                  <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem' }}>Demographics</th>
                  <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem' }}>Quota</th>
                  <th style={{ textAlign: 'center', padding: '0.85rem 1.25rem' }}>Audit Dossier</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No authenticated accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isUserAdmin = u.role === 'ADMIN';
                    return (
                      <tr key={u.id || u.email}>
                        {/* Profile */}
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: isUserAdmin ? 'var(--accent-purple)' : 'var(--accent-blue)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                overflow: 'hidden',
                                flexShrink: 0,
                              }}
                            >
                              {u.avatarUrl ? (
                                <img
                                  src={u.avatarUrl}
                                  alt={u.name}
                                  referrerPolicy="no-referrer"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                (u.name || 'U').slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {u.name || 'Google User'}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {u.username ? `@${u.username}` : 'No handle set'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{u.email}</span>
                          </div>
                        </td>

                        {/* Google Sub ID */}
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <code
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '4px',
                              color: 'var(--accent-cyan)',
                              fontFamily: 'monospace',
                            }}
                          >
                            {u.googleSub || u.id}
                          </code>
                        </td>

                        {/* Role */}
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: isUserAdmin ? 'rgba(168, 85, 247, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                              color: isUserAdmin ? '#c084fc' : '#60a5fa',
                            }}
                          >
                            {isUserAdmin ? <Crown size={12} /> : <User size={12} />}
                            {isUserAdmin ? 'SUPERADMIN' : 'USER'}
                          </span>
                        </td>

                        {/* Demographics */}
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          <div>{u.age ? `Age: ${u.age}` : 'Age: N/A'}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.jurisdiction || 'Global'}</div>
                        </td>

                        {/* Quota */}
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem' }}>
                          <span style={{ color: isUserAdmin ? '#c084fc' : '#34d399', fontWeight: 600 }}>
                            {isUserAdmin ? 'Unlimited' : `${u.scan_count || 0} / ${u.quota || 35}`}
                          </span>
                        </td>

                        {/* Action */}
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                          >
                            <FileText size={12} /> View Dossier
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected User Dossier Drawer */}
        {selectedUser && (
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
              padding: '1.5rem',
            }}
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={20} style={{ color: 'var(--accent-blue)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    Google Identity Audit Dossier
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: selectedUser.role === 'ADMIN' ? 'var(--accent-purple)' : 'var(--accent-blue)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    overflow: 'hidden',
                  }}
                >
                  {selectedUser.avatarUrl ? (
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.name}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    (selectedUser.name || 'U').slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedUser.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {selectedUser.email}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                    Google Sub: {selectedUser.googleSub || selectedUser.id}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Age</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedUser.age || 'Not declared'}</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Phone Number</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedUser.phone || 'Not declared'}</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Jurisdiction</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedUser.jurisdiction || 'Global'}</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Handle</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>@{selectedUser.username || selectedUser.email.split('@')[0]}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedUser(null)} className="btn btn-secondary btn-sm">
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
