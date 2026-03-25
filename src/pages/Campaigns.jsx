import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pause, Play, Plus, RotateCw } from 'lucide-react';

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
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Campaigns</h1>
          <p>Control lifecycle execution from lead assignment to sent sequence outcomes.</p>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Plus size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.length}</div>
            <div className="metric-label">Total Campaigns</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><Play size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{activeCount}</div>
            <div className="metric-label">Active</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon amber"><Pause size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{pausedCount}</div>
            <div className="metric-label">Paused</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><RotateCw size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalSent}</div>
            <div className="metric-label">Sent Steps</div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Create Campaign</div>
            <div className="card-subtitle">New campaign can auto-attach unassigned leads.</div>
          </div>
        </div>
        <div className="flex-row gap-2 flex-wrap">
          <input
            className="form-input"
            style={{ maxWidth: 360 }}
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
            placeholder="Campaign name"
          />
          <button className="btn btn-success" onClick={handleCreate}>
            <Plus size={16} /> Create Campaign
          </button>
          <span className="badge badge-blue">Unassigned leads: {unassignedLeadIds.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
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
                    {campaign.leadIds.length} leads assigned • sequence: Day 1, Day 3, Day 7
                  </p>
                </div>
                <div className="flex-row gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => actions.runCampaign(campaign.id)} disabled={state.system.isSendingEmails || !campaign.leadIds.length}>
                    <Play size={14} /> Run
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => actions.pauseCampaign(campaign.id)}>
                    <Pause size={14} /> Pause
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => actions.retryFailedEmails(campaign.id)}>
                    <RotateCw size={14} /> Retry Failed
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => actions.assignToCampaign(unassignedLeadIds, campaign.id)} disabled={!unassignedLeadIds.length}>
                    Assign Unassigned
                  </button>
                </div>
              </div>

              <div className="grid-4 mt-4">
                <div className="badge badge-blue">Sent: {campaign.sentCount}</div>
                <div className="badge badge-emerald">Open Rate: {openRate}%</div>
                <div className="badge badge-purple">Reply Rate: {replyRate}%</div>
                <div className="badge badge-rose">Failure Rate: {failedRate}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
