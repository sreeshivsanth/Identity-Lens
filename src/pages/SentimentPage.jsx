import { useState } from 'react';
import {
  Brain,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Shield,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Flag,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import Header from '../components/Header';
import { useIdentityScan } from '../context/IdentityScanContext';
import { Link } from 'react-router-dom';

export default function SentimentPage() {
  const { sentimentData, activePersona, hasCompletedInitialScan } = useIdentityScan();
  const [filter, setFilter] = useState('all'); // 'all' | 'positive' | 'negative' | 'neutral'
  const [flaggedIds, setFlaggedIds] = useState([]);

  const mentions = sentimentData?.mentions || [];
  const filteredMentions = mentions.filter(
    (m) => filter === 'all' || m.sentiment === filter
  );

  const toggleFlag = (id) => {
    setFlaggedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const radarAspectData = (sentimentData?.topAspects || []).map((a) => ({
    aspect: a.name || a.aspect,
    score: a.score,
  }));

  return (
    <>
      <Header
        title="Perception AI & Sentiment Engine"
        subtitle="Aspect-based sentiment analysis, entity disambiguation, and Perspective API toxicity telemetry"
      />

      <div className="page-content">
        {/* Top Metric Cards */}
        <div className="stats-grid">
          <div className="stat-card emerald" id="sentiment-score-stat">
            <div className="stat-icon emerald">
              <Sparkles size={20} />
            </div>
            <div className="stat-value">{sentimentData.overallScore}/100</div>
            <div className="stat-label">Overall Digital Reputation</div>
            <div className="stat-change up">
              <TrendingUp size={12} /> +4 points this month
            </div>
          </div>

          <div className="stat-card cyan" id="positive-sentiment-stat">
            <div className="stat-icon cyan">
              <Smile size={20} />
            </div>
            <div className="stat-value">{sentimentData.positivePercentage}%</div>
            <div className="stat-label">Positive Sentiment Share</div>
            <div className="stat-change up">
              Dominant positive perception
            </div>
          </div>

          <div className="stat-card danger" id="negative-sentiment-stat">
            <div className="stat-icon danger">
              <Frown size={20} />
            </div>
            <div className="stat-value">{sentimentData.negativePercentage}%</div>
            <div className="stat-label">Negative Mentions</div>
            <div className="stat-change down">
              12% requires monitoring
            </div>
          </div>

          <div className="stat-card purple" id="toxicity-stat">
            <div className="stat-icon purple">
              <Shield size={20} />
            </div>
            <div className="stat-value">0.06</div>
            <div className="stat-label">Perspective Toxicity Index</div>
            <div className="stat-change up">
              Clean / Non-toxic profile
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid-2">
          {/* Sentiment Trend Bar Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Weekly Sentiment Trajectory</h3>
                <p className="card-subtitle">Volume distribution across last 4 audit windows</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sentimentData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,171,0.08)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(99, 115, 171, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                  }}
                />
                <Bar dataKey="positive" name="Positive %" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="neutral" name="Neutral %" fill="#64748b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="negative" name="Negative %" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart for Aspect Scores */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Aspect-Based Sentiment Dimensions</h3>
                <p className="card-subtitle">RoBERTa fine-tuned evaluation by professional domain</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarAspectData}>
                <PolarGrid stroke="rgba(99,115,171,0.15)" />
                <PolarAngleAxis dataKey="aspect" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Aspects List + Toxicity Metrics */}
        <div className="grid-2-1" style={{ marginBottom: '1.5rem' }}>
          {/* Aspect Breakdown Progress */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Aspect Health Breakdown</h3>
                <p className="card-subtitle">Categorized breakdown of community sentiment</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sentimentData.topAspects.map((aspect) => (
                <div key={aspect.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{aspect.name}</span>
                    <span style={{ color: aspect.score >= 70 ? 'var(--accent-emerald)' : aspect.score >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>
                      {aspect.score}/100 ({aspect.mentions} mentions)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${aspect.score >= 70 ? 'emerald' : aspect.score >= 50 ? 'purple' : 'danger'}`}
                      style={{ width: `${aspect.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Perspective API Toxicity Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Perspective API Metrics</h3>
                <p className="card-subtitle">AI Toxicity & Hostility model</p>
              </div>
              <Shield size={16} style={{ color: 'var(--accent-cyan)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { name: 'Toxicity', val: 0.08, status: 'Extremely Low', color: 'var(--accent-emerald)' },
                { name: 'Severe Toxicity', val: 0.01, status: 'Negligible', color: 'var(--accent-emerald)' },
                { name: 'Insult Likelihood', val: 0.05, status: 'Minimal', color: 'var(--accent-emerald)' },
                { name: 'Profanity Index', val: 0.02, status: 'Negligible', color: 'var(--accent-emerald)' },
                { name: 'Threat Score', val: 0.00, status: 'Zero Threat', color: 'var(--accent-emerald)' },
              ].map((metric) => (
                <div key={metric.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{metric.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {metric.val.toFixed(2)}
                    </span>
                    <span className="badge badge-low" style={{ fontSize: '0.62rem' }}>
                      {metric.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Mentions Feed */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Analyzed Public Mentions ({filteredMentions.length})</h3>
              <p className="card-subtitle">Raw mentions enriched with aspect classification and sentiment tags</p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: 'All Mentions' },
                { id: 'positive', label: 'Positive' },
                { id: 'neutral', label: 'Neutral' },
                { id: 'negative', label: 'Negative' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredMentions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <Sparkles size={36} style={{ color: 'var(--accent-cyan)', marginBottom: '8px', opacity: 0.5 }} />
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>No Public Mentions Recorded</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  No indexed forum, social, or developer discussions discovered for the active identity.
                </p>
                <Link to="/scan" className="btn btn-primary btn-sm">
                  Run Perception Scan
                </Link>
              </div>
            ) : (
              filteredMentions.map((mention) => (
              <div
                key={mention.id}
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${mention.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.25)' : 'var(--border-primary)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: 'var(--accent-cyan)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {mention.source}
                    </span>
                    {mention.subreddit && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{mention.subreddit}</span>
                    )}
                    <span
                      className={`badge ${mention.sentiment === 'positive' ? 'badge-low' : mention.sentiment === 'negative' ? 'badge-critical' : 'badge-neutral'}`}
                    >
                      {mention.sentiment} ({mention.score > 0 ? `+${mention.score}` : mention.score})
                    </span>
                    <span className="badge badge-info">{mention.aspect}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{mention.date}</span>
                    <button
                      onClick={() => toggleFlag(mention.id)}
                      className={`header-icon-btn ${flaggedIds.includes(mention.id) ? 'active' : ''}`}
                      style={{ width: '28px', height: '28px' }}
                      title="Flag for remediation or response"
                    >
                      <Flag size={13} style={{ color: flaggedIds.includes(mention.id) ? 'var(--accent-red)' : 'var(--text-muted)' }} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '6px' }}>
                  {mention.text || mention.snippet}
                </p>

                {mention.sentiment === 'negative' && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <AlertCircle size={12} />
                    <span>Recommended Action: Address latency in public discussions to raise Responsiveness score.</span>
                  </div>
                )}
              </div>
            )))}
          </div>
        </div>
      </div>
    </>
  );
}
