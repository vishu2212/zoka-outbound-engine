import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Mail, MessageSquare, MousePointerClick, Users, BarChart3 } from 'lucide-react';
import { MotionPage, StaggerGrid, MotionStatCard, MotionCard } from '../components/motion';

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
  const averageReplyRate = useMemo(() => {
    const activeCampaigns = state.campaigns.filter((campaign) => campaign.sentCount > 0);
    if (!activeCampaigns.length) return 0;
    const totalRate = activeCampaigns.reduce((sum, campaign) => sum + (campaign.sentCount ? (campaign.replyCount / campaign.sentCount) * 100 : 0), 0);
    return Number((totalRate / activeCampaigns.length).toFixed(1));
  }, [state.campaigns]);

  const insightText = state.analytics.replyRate >= averageReplyRate
    ? 'Pipeline performing above baseline. Current sequence copy and targeting are producing strong conversion.'
    : 'Below-baseline performance detected. Consider refining prospect targeting or adjusting AI copy parameters.';

  return (
    <MotionPage>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Insights</h1>
          <p>AI-derived performance signals across your outbound pipeline.</p>
        </div>
      </div>

      <StaggerGrid className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <MotionStatCard className="metric-card">
          <div className="metric-icon blue"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.totalLeads}</div>
            <div className="metric-label">Prospects Sourced</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon emerald"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.emailsSent}</div>
            <div className="metric-label">Messages Delivered</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon cyan"><MousePointerClick size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.openRate}%</div>
            <div className="metric-label" title="Percentage of delivered messages that were opened.">Engagement Rate</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon purple"><MessageSquare size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.replies}</div>
            <div className="metric-label">Conversations Started</div>
          </div>
        </MotionStatCard>
      </StaggerGrid>

      <div className="grid-2 mt-6" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Conversion Funnel</div>
              <div className="card-subtitle">End-to-end prospect journey.</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {[
              { label: 'Sourced', value: funnel.leads, className: 'var(--accent-blue)' },
              { label: 'Delivered', value: funnel.sent, className: 'var(--accent-emerald)' },
              { label: 'Engaged', value: funnel.opened, className: 'var(--accent-cyan)' },
              { label: 'Converted', value: funnel.replied, className: 'var(--accent-purple)' },
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
              <div className="card-title">Performance Snapshot</div>
              <div className="card-subtitle" title="Percentage of delivered messages that generated a reply.">End-to-end conversion health.</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <span className="badge badge-blue" title="Percentage of delivered messages that were opened.">Engagement Rate: {state.analytics.openRate}%</span>
            <span className="badge badge-purple" title="Percentage of delivered messages that generated a reply.">Conversion Rate: {state.analytics.replyRate}%</span>
            <span className="badge badge-emerald">
              Reply-to-Open: {funnel.opened ? ((funnel.replied / funnel.opened) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Sequence Analytics</div>
            <div className="card-subtitle">Per-sequence engagement breakdown.</div>
          </div>
        </div>
        {campaignBreakdown.length === 0 ? (
          <div className="empty-state-block">
            <BarChart3 size={32} className="empty-state-icon" />
            <h3>No data to analyze yet</h3>
            <p>Run a sequence and the system will surface patterns automatically.</p>
          </div>
        ) : (
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
        )}
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">AI Signal</div>
            <div className="card-subtitle" title="System-detected pattern based on current pipeline performance.">AI-detected pattern from current pipeline data.</div>
          </div>
        </div>
        <div className={`badge ${state.analytics.replyRate >= averageReplyRate ? 'badge-emerald' : 'badge-amber'}`}>
          {insightText}
        </div>
      </div>
    </MotionPage>
  );
}
