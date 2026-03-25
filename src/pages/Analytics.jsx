import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Mail, MessageSquare, MousePointerClick, Users } from 'lucide-react';

export default function Analytics() {
  const { state } = useApp();

  const campaignBreakdown = useMemo(
    () =>
      state.campaigns.map((campaign) => ({
        name: campaign.name.length > 18 ? `${campaign.name.slice(0, 18)}...` : campaign.name,
        sent: campaign.sentCount,
        opened: campaign.openCount,
        replied: campaign.replyCount,
        failed: campaign.failedCount,
      })),
    [state.campaigns]
  );

  const funnel = state.analytics.funnel;
  const maxFunnel = Math.max(funnel.leads, 1);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Analytics</h1>
          <p>Metrics are fully derived from live workflow execution and persisted state.</p>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.totalLeads}</div>
            <div className="metric-label">Leads</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.emailsSent}</div>
            <div className="metric-label">Emails Sent</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon cyan"><MousePointerClick size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.openRate}%</div>
            <div className="metric-label">Open Rate</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><MessageSquare size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.replies}</div>
            <div className="metric-label">Replies</div>
          </div>
        </div>
      </div>

      <div className="grid-2 mt-6" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Funnel</div>
              <div className="card-subtitle">Leads to Sent to Opened to Replied</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {[
              { label: 'Leads', value: funnel.leads, className: 'var(--accent-blue)' },
              { label: 'Sent', value: funnel.sent, className: 'var(--accent-emerald)' },
              { label: 'Opened', value: funnel.opened, className: 'var(--accent-cyan)' },
              { label: 'Replied', value: funnel.replied, className: 'var(--accent-purple)' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-1)' }}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.round((item.value / maxFunnel) * 100)}%`, background: item.className }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">System Conversion</div>
              <div className="card-subtitle">Global conversion quality from email activity.</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <span className="badge badge-blue">Open Rate: {state.analytics.openRate}%</span>
            <span className="badge badge-purple">Reply Rate: {state.analytics.replyRate}%</span>
            <span className="badge badge-emerald">
              Reply-to-Open: {funnel.opened ? ((funnel.replied / funnel.opened) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Campaign Breakdown</div>
            <div className="card-subtitle">Sent, opened, and replied counts per campaign.</div>
          </div>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={campaignBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sent" fill="#3b82f6" />
              <Bar dataKey="opened" fill="#10b981" />
              <Bar dataKey="replied" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
