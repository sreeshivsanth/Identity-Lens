import { useState } from 'react';
import {
  Search,
  Trash2,
  Download,
  CheckCircle2,
  Eye,
  AlertCircle,
  UserCheck,
  Shield,
} from 'lucide-react';
import Header from '../components/Header';
import FootprintDetailDrawer from '../components/footprints/FootprintDetailDrawer';
import { useIdentityScan } from '../context/IdentityScanContext';
import { Link } from 'react-router-dom';

const riskBadges = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

const statusBadges = {
  'deletion-sent': { label: 'Deletion Dispatched', cls: 'badge-high' },
  'confirmed-removed': { label: 'Confirmed Removed', cls: 'badge-low' },
  'statutory-in-flight': { label: 'In-Flight', cls: 'badge-medium' },
  pending: { label: 'Action Required', cls: 'badge-medium' },
  monitored: { label: 'Retained by Choice', cls: 'badge-info' },
  'retained-by-choice': { label: 'Retained by Choice', cls: 'badge-info' },
  kept: { label: 'Retained by Choice', cls: 'badge-info' },
};

export default function OsintPage() {
  const { scanResults, deleteFootprints, keepFootprints, activePersona, hasCompletedInitialScan } = useIdentityScan();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'kept' | 'deleting' | 'removed'
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeDrawerItem, setActiveDrawerItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const results = scanResults;

  // Status Metrics for Residual Ledger
  const totalCount = results.length;
  const removedCount = results.filter((r) => r.status === 'confirmed-removed').length;
  const deletingCount = results.filter((r) => r.status === 'deletion-sent').length;
  const keptCount = results.filter((r) => r.status === 'monitored' || r.status === 'kept').length;
  const pendingCount = results.filter((r) => r.status === 'pending').length;

  // Filtering
  const filteredResults = results.filter((item) => {
    const matchesSearch =
      item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dataFound.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRisk = riskFilter === 'all' || item.riskLevel === riskFilter;

    let matchesTab = true;
    if (activeTab === 'pending') matchesTab = item.status === 'pending';
    else if (activeTab === 'kept') matchesTab = item.status === 'monitored' || item.status === 'kept';
    else if (activeTab === 'deleting') matchesTab = item.status === 'deletion-sent';
    else if (activeTab === 'removed') matchesTab = item.status === 'confirmed-removed';

    return matchesSearch && matchesRisk && matchesTab;
  });

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredResults.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredResults.map((r) => r.id));
    }
  };

  const handleSelectBrokers = () => {
    const brokerIds = filteredResults.filter((r) => r.type === 'Data Broker').map((r) => r.id);
    setSelectedItems(brokerIds);
    showToast(`Selected ${brokerIds.length} data broker footprints.`);
  };

  const handleSelectHighRisk = () => {
    const highRiskIds = filteredResults
      .filter((r) => r.riskLevel === 'critical' || r.riskLevel === 'high')
      .map((r) => r.id);
    setSelectedItems(highRiskIds);
    showToast(`Selected ${highRiskIds.length} high/critical risk footprints.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // User-Controlled Action: Delete Selected
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) return;
    deleteFootprints(selectedItems);
    showToast(`Dispatched deletion protocols for ${selectedItems.length} selected entities.`);
    setSelectedItems([]);
  };

  // User-Controlled Action: Keep / Whitelist Selected
  const handleBatchKeep = () => {
    if (selectedItems.length === 0) return;
    keepFootprints(selectedItems);
    showToast(`Marked ${selectedItems.length} entities as Retained / Whitelisted by User.`);
    setSelectedItems([]);
  };

  // Single Item Actions from Drawer
  const handleSingleDelete = (id) => {
    deleteFootprints([id]);
    showToast(`Queued source removal for single record.`);
  };

  const handleSingleKeep = (id) => {
    keepFootprints([id]);
    showToast(`Marked entity as Retained by User.`);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredResults, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `identitylens-osint-findings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Exported OSINT findings to encrypted JSON.');
  };

  return (
    <>
      <Header
        title="Footprint Inventory & Audit"
        subtitle="Inspect, select, and remediate personal digital exposures (No automated deletion)"
      />

      <div className="page-content">
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '80px',
              right: '2rem',
              zIndex: 9999,
              background: 'var(--accent-blue)',
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
            <CheckCircle2 size={16} /> {toastMessage}
          </div>
        )}

        {/* Residual Footprint Ledger Overview */}
        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                Residual Exposure Ledger
              </h3>
              <p className="card-subtitle" style={{ fontSize: '0.78rem', margin: '2px 0 0' }}>
                Track cleaned footprints vs. footprints retained or left behind
              </p>
            </div>
            <span className="badge badge-low" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={12} /> User-Controlled Remediation Active
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Discovered
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                {totalCount}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase' }}>
                Verified Removed (Cleaned)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                {removedCount}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase' }}>
                In-Flight (Statutory Grace)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>
                {deletingCount}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#818cf8', textTransform: 'uppercase' }}>
                Retained / Left Behind
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#818cf8', marginTop: '2px' }}>
                {keptCount}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#f87171', textTransform: 'uppercase' }}>
                Action Required (Pending)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f87171', marginTop: '2px' }}>
                {pendingCount}
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Selection Control Bar */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.5rem',
          }}
        >
          {/* Top Row: Search and Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
              <div className="header-search" style={{ width: '100%' }}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search platforms or exposed PII attributes (e.g. phone, address)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                className="form-input"
                style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Risk Tiers</option>
                <option value="critical">Critical Risk</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>

              <button onClick={exportJSON} className="btn btn-secondary btn-sm">
                <Download size={14} /> Export Encrypted JSON
              </button>
            </div>
          </div>

          {/* Ledger Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.75rem',
              marginBottom: '1rem',
              overflowX: 'auto',
            }}
          >
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            >
              All Records ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`btn btn-sm ${activeTab === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Action Required ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('kept')}
              className={`btn btn-sm ${activeTab === 'kept' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Left Behind / Kept ({keptCount})
            </button>
            <button
              onClick={() => setActiveTab('deleting')}
              className={`btn btn-sm ${activeTab === 'deleting' ? 'btn-primary' : 'btn-ghost'}`}
            >
              In Progress ({deletingCount})
            </button>
            <button
              onClick={() => setActiveTab('removed')}
              className={`btn btn-sm ${activeTab === 'removed' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Verified Cleaned ({removedCount})
            </button>
          </div>

          {/* Quick Selection Chips & Batch Action Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>
                Quick Selection:
              </span>
              <button onClick={handleSelectAll} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                {selectedItems.length === filteredResults.length && filteredResults.length > 0
                  ? 'Deselect All'
                  : 'Select All Filtered'}
              </button>
              <button onClick={handleSelectBrokers} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                Select Brokers Only
              </button>
              <button onClick={handleSelectHighRisk} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                Select High Risk Only
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleBatchKeep}
                disabled={selectedItems.length === 0}
                className="btn btn-secondary btn-sm"
                style={{ opacity: selectedItems.length === 0 ? 0.6 : 1 }}
              >
                <UserCheck size={14} /> Keep / Whitelist Selected ({selectedItems.length})
              </button>
              <button
                onClick={handleBatchDelete}
                disabled={selectedItems.length === 0}
                className="btn btn-primary btn-sm"
                style={{
                  opacity: selectedItems.length === 0 ? 0.6 : 1,
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderColor: '#ef4444',
                }}
              >
                <Trash2 size={14} /> Delete Selected ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>

        {/* Footprint Findings Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Footprint Records ({filteredResults.length})</h3>
              <p className="card-subtitle">
                Select specific records to remove or inspect details before taking action
              </p>
            </div>
            {selectedItems.length > 0 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-blue)',
                  fontWeight: 600,
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                }}
              >
                {selectedItems.length} selected for action
              </span>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredResults.length && filteredResults.length > 0}
                      onChange={handleSelectAll}
                      style={{ accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                    />
                  </th>
                  <th>Target Platform</th>
                  <th>Classification</th>
                  <th>Exposed PII Attributes</th>
                  <th>Risk Tier</th>
                  <th>Remediation Status</th>
                  <th style={{ textAlign: 'right' }}>Inspection</th>
                </tr>
              </thead>
              <tbody>
                {totalCount === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                      <Shield size={36} style={{ color: 'var(--text-muted)', marginBottom: '10px', opacity: 0.5 }} />
                      <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>No Footprints Discovered Yet</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                        No data broker or OSINT records indexed for the active persona. Launch a reconnaissance scan to populate.
                      </p>
                      <Link to="/scan" className="btn btn-primary btn-sm">
                        Launch OSINT Scan
                      </Link>
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                      <AlertCircle size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                      <p style={{ color: 'var(--text-secondary)' }}>No exposures matched your current filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    const statusInfo = statusBadges[item.status] || { label: item.status, cls: 'badge-info' };
                    return (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : undefined,
                        }}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(item.id)}
                            style={{ accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.platform}</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {item.id}</span>
                        </td>
                        <td>
                          <span className="badge badge-info">{item.type}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {item.dataFound.map((data, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {data}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${riskBadges[item.riskLevel]}`}>
                            {item.riskLevel.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setActiveDrawerItem(item)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                          >
                            <Eye size={13} /> Inspect
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
      </div>

      {/* Slide-Over Inspection Drawer */}
      <FootprintDetailDrawer
        item={activeDrawerItem}
        onClose={() => setActiveDrawerItem(null)}
        onQueueDelete={handleSingleDelete}
        onMarkKeep={handleSingleKeep}
      />
    </>
  );
}
