import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pause, Play, Plus, RotateCw, Rocket } from 'lucide-react';
import { MotionPage, StaggerGrid, MotionStatCard, MotionCard } from '../components/motion';

function statusClass(status) {
  if (status === 'active') return 'badge-emerald';
  if (status === 'paused') return 'badge-amber';
  if (status === 'draft') return 'badge-neutral';
  return 'badge-blue';
}

export default function Campaigns() {
  const { state, actions } = useApp();
  const [campaignName, setCampaignName] = useState('');

  const unassignedLeadIds = useMemo(
    () => state.leads.filter((lead) => !lead.campaignId).map((lead) => lead.id),
    [state.leads]
  );

  const activeCount = state.campaigns.filter((campaign) => campaign.status === 'active').length;
  const pausedCount = state.campaigns.filter((campaign) => campaign.status === 'paused').length;
  const totalSent = state.campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0);

  const handleCreate = () => {
    const campaignId = actions.createCampaign(campaignName || undefined);
    setCampaignName('');
    if (unassignedLeadIds.length) {
      actions.assignToCampaign(unassignedLeadIds, campaignId);
    }
  };

  return (
    <MotionPage>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Sequences</h1>
          <p>Orchestrate multi-step outreach across your prospect pipeline.</p>
        </div>
      </div>

      <StaggerGrid className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <MotionStatCard className="metric-card">
          <div className="metric-icon blue"><Plus size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.length}</div>
            <div className="metric-label">Total Sequences</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon emerald"><Play size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{activeCount}</div>
            <div className="metric-label">Running</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon amber"><Pause size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{pausedCount}</div>
            <div className="metric-label">On Hold</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon purple"><RotateCw size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalSent}</div>
            <div className="metric-label">Touchpoints Executed</div>
          </div>
        </MotionStatCard>
      </StaggerGrid>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Launch Sequence</div>
            <div className="card-subtitle">New sequences auto-attach unrouted prospects.</div>
          </div>
        </div>
        <div className="flex-row gap-2 flex-wrap">
          <input
            className="form-input"
            style={{ maxWidth: 360 }}
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
            placeholder="e.g. SaaS Founders April Batch"
          />
          <button className="btn btn-success" onClick={handleCreate}>
            <Plus size={16} /> Launch
          </button>
          <span className="badge badge-blue">Unrouted prospects: {unassignedLeadIds.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
        {state.campaigns.length === 0 && (
          <div className="card">
            <div className="empty-state-block">
              <Rocket size={32} className="empty-state-icon" />
              <h3>No sequences running</h3>
              <p>Create a sequence to begin outreach.</p>
            </div>
          </div>
        )}
        {state.campaigns.map((campaign) => {
          const openRate = campaign.sentCount > 0 ? ((campaign.openCount / campaign.sentCount) * 100).toFixed(1) : '0.0';
          const replyRate = campaign.sentCount > 0 ? ((campaign.replyCount / campaign.sentCount) * 100).toFixed(1) : '0.0';
          const failedRate = campaign.sentCount > 0 ? ((campaign.failedCount / campaign.sentCount) * 100).toFixed(1) : '0.0';

          return (
            <div key={campaign.id} className="card">
              <div className="flex-between">
                <div>
                  <div className="flex-row gap-2" style={{ marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ margin: 0 }}>{campaign.name}</h3>
                    <span className={`badge ${statusClass(campaign.status)}`}>{campaign.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
                    {campaign.leadIds.length} prospects assigned • cadence: Day 1, Day 3, Day 7
                  </p>
                </div>
                <div className="flex-row gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => actions.runCampaign(campaign.id)}
                    disabled={state.system.isSendingEmails || !campaign.leadIds.length}
                    title="Begin multi-step outreach for all assigned prospects."
                  >
                    <Play size={14} /> Execute
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => actions.pauseCampaign(campaign.id)} title="Pause delivery mid-sequence.">
                    <Pause size={14} /> Hold
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => actions.retryFailedEmails(campaign.id)} title="Re-attempt delivery for failed messages.">
                    <RotateCw size={14} /> Retry Failures
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => actions.assignToCampaign(unassignedLeadIds, campaign.id)} disabled={!unassignedLeadIds.length}>
                    Route Unrouted
                  </button>
                </div>
              </div>

              <div className="grid-4 mt-4">
                <div className="badge badge-blue">Delivered: {campaign.sentCount}</div>
                <div className="badge badge-emerald">Engagement: {openRate}%</div>
                <div className="badge badge-purple">Conversion: {replyRate}%</div>
                <div className="badge badge-rose">Failures: {failedRate}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </MotionPage>
  );
}
