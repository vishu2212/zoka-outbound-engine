import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, TrendingDown, Mail, MousePointerClick, MessageSquare, AlertTriangle, Award } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsTimeSeries, sendTimeHeatmap } from '../data/mockCampaigns';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4'];

export default function Analytics() {
  const { state } = useApp();
  const { campaigns } = state;

  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalOpened = campaigns.reduce((a, c) => a + c.opened, 0);
  const totalReplied = campaigns.reduce((a, c) => a + c.replied, 0);
  const totalBounced = campaigns.reduce((a, c) => a + c.bounced, 0);

  const pieData = [
    { name: 'Opened (no reply)', value: totalOpened - totalReplied },
    { name: 'Replied', value: totalReplied },
    { name: 'Bounced', value: totalBounced },
    { name: 'Not Opened', value: totalSent - totalOpened },
  ];

  // Top performing emails
  const topEmails = campaigns
    .filter(c => c.sent > 0)
    .flatMap(c => c.sequence.map(s => ({ ...s, campaign: c.name })))
    .filter(s => s.sent > 0)
    .sort((a, b) => (b.replied / b.sent) - (a.replied / a.sent))
    .slice(0, 5);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Analytics</h1>
          <p>Track performance across all campaigns</p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalSent}</div>
            <div className="metric-label">Total Sent</div>
            <span className="metric-trend up"><TrendingUp size={12} /> +18% vs last month</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><MousePointerClick size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalSent ? ((totalOpened / totalSent) * 100).toFixed(1) : 0}%</div>
            <div className="metric-label">Open Rate</div>
            <span className="metric-trend up"><TrendingUp size={12} /> +3.2%</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><MessageSquare size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalSent ? ((totalReplied / totalSent) * 100).toFixed(1) : 0}%</div>
            <div className="metric-label">Reply Rate</div>
            <span className="metric-trend up"><TrendingUp size={12} /> +1.4%</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon rose"><AlertTriangle size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalSent ? ((totalBounced / totalSent) * 100).toFixed(1) : 0}%</div>
            <div className="metric-label">Bounce Rate</div>
            <span className="metric-trend down"><TrendingDown size={12} /> -0.8%</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Performance Over Time */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Email Performance Over Time</div>
              <div className="card-subtitle">Sent, opened, and replied trends</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={analyticsTimeSeries}>
                <defs>
                  <linearGradient id="aGradSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aGradOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aGradReplied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sent" stroke="#3b82f6" fill="url(#aGradSent)" strokeWidth={2} name="Sent" />
                <Area type="monotone" dataKey="opened" stroke="#10b981" fill="url(#aGradOpened)" strokeWidth={2} name="Opened" />
                <Area type="monotone" dataKey="replied" stroke="#8b5cf6" fill="url(#aGradReplied)" strokeWidth={2} name="Replied" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Engagement Breakdown</div>
              <div className="card-subtitle">Distribution of email outcomes</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2 mt-6" style={{ alignItems: 'start' }}>
        {/* Campaign Performance Table */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
            <div className="card-title">Campaign Performance</div>
            <div className="card-subtitle">Breakdown by campaign</div>
          </div>
          <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Sent</th>
                  <th>Opens</th>
                  <th>Replies</th>
                  <th>Bounces</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.filter(c => c.sent > 0).map((c) => (
                  <tr key={c.id}>
                    <td className="cell-primary" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</td>
                    <td>{c.sent}</td>
                    <td><span style={{ color: 'var(--accent-emerald)' }}>{c.openRate}%</span></td>
                    <td><span style={{ color: 'var(--accent-purple)' }}>{c.replyRate}%</span></td>
                    <td><span style={{ color: 'var(--accent-rose)' }}>{c.bounceRate}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Send Times Heatmap */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Best Send Times</div>
              <div className="card-subtitle">Open rates by day and hour</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-xs)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px', color: 'var(--text-muted)', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '8px', color: 'var(--text-muted)', textAlign: 'center' }}>Mon</th>
                  <th style={{ padding: '8px', color: 'var(--text-muted)', textAlign: 'center' }}>Tue</th>
                  <th style={{ padding: '8px', color: 'var(--text-muted)', textAlign: 'center' }}>Wed</th>
                  <th style={{ padding: '8px', color: 'var(--text-muted)', textAlign: 'center' }}>Thu</th>
                  <th style={{ padding: '8px', color: 'var(--text-muted)', textAlign: 'center' }}>Fri</th>
                </tr>
              </thead>
              <tbody>
                {sendTimeHeatmap.map((row) => (
                  <tr key={row.hour}>
                    <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{row.hour}</td>
                    {['mon', 'tue', 'wed', 'thu', 'fri'].map(day => {
                      const val = row[day];
                      const max = 22;
                      const intensity = val / max;
                      return (
                        <td key={day} style={{ padding: '4px', textAlign: 'center' }}>
                          <div style={{
                            width: '100%',
                            height: 28,
                            borderRadius: 4,
                            background: `rgba(16, 185, 129, ${intensity * 0.8})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-xs)',
                            fontWeight: 600,
                            color: intensity > 0.5 ? 'white' : 'var(--text-muted)',
                          }}>{val}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Performing Emails */}
      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Top Performing Emails</div>
            <div className="card-subtitle">Highest reply rate email steps</div>
          </div>
          <Award size={20} style={{ color: 'var(--accent-amber)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {topEmails.map((email, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: i === 0 ? 'var(--accent-amber-soft)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: i === 0 ? 'var(--accent-amber)' : 'var(--text-muted)', width: 24 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>{email.subject}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Step {email.step} · {email.campaign}</div>
              </div>
              <div className="flex-row gap-4">
                <span style={{ fontSize: 'var(--font-sm)' }}><strong>{email.sent > 0 ? ((email.opened / email.sent) * 100).toFixed(0) : 0}%</strong> opens</span>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-emerald)' }}><strong>{email.sent > 0 ? ((email.replied / email.sent) * 100).toFixed(0) : 0}%</strong> replies</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
