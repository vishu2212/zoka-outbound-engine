import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Mail, MessageSquare, Play, Pause, Plus, Users } from 'lucide-react';

export default function Dashboard() {
  const { state, actions } = useApp();
  const [campaignName, setCampaignName] = useState('');

  const activeCampaign = useMemo(() => {
    if (state.system.currentCampaign) {
      return state.campaigns.find((campaign) => campaign.id === state.system.currentCampaign) || null;
    }
    return state.campaigns[0] || null;
  }, [state.campaigns, state.system.currentCampaign]);

  const unassignedLeadIds = state.leads.filter((lead) => !lead.campaignId).map((lead) => lead.id);
  const recentLogs = state.logs.slice(0, 12);
  const busy = state.system.isGeneratingLeads || state.system.isGeneratingMessages || state.system.isSendingEmails;

  const handleCreateCampaign = () => {
    const id = actions.createCampaign(campaignName.trim() || undefined);
    setCampaignName('');
    if (unassignedLeadIds.length > 0) {
      actions.assignToCampaign(unassignedLeadIds, id);
    }
  };

  const handleAssignToActiveCampaign = () => {
    if (!activeCampaign || !unassignedLeadIds.length) return;
    actions.assignToCampaign(unassignedLeadIds, activeCampaign.id);
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Real-time outbound orchestration across leads, campaigns, AI, and delivery.</p>
        </div>
        <div className="page-header-right" style={{ gap: 'var(--space-2)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => actions.generateLeads()}
            disabled={state.system.isGeneratingLeads}
          >
            <Users size={16} /> {state.system.isGeneratingLeads ? 'Generating...' : 'Generate Leads'}
          </button>
          <button className="btn btn-secondary" onClick={handleAssignToActiveCampaign} disabled={!activeCampaign || !unassignedLeadIds.length}>
            <Plus size={16} /> Assign Unassigned ({unassignedLeadIds.length})
          </button>
          {activeCampaign && (
            <>
              <button className="btn btn-primary" onClick={() => actions.runCampaign(activeCampaign.id)} disabled={busy || !activeCampaign.leadIds.length}>
                <Play size={16} /> Run Campaign
              </button>
              <button className="btn btn-danger" onClick={() => actions.pauseCampaign(activeCampaign.id)} disabled={!state.system.isSendingEmails}>
                <Pause size={16} /> Pause
              </button>
            </>
          )}
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.totalLeads}</div>
            <div className="metric-label">Total Leads</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon cyan"><Activity size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.length}</div>
            <div className="metric-label">Campaigns</div>
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
              <div className="card-title">System Control</div>
              <div className="card-subtitle">Lead generation, campaign creation, and orchestration state.</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Campaign Name</label>
            <div className="flex-row gap-2">
              <input
                className="form-input"
                placeholder="e.g. SaaS Founders April Batch"
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
              />
              <button className="btn btn-success" onClick={handleCreateCampaign}>
                <Plus size={16} /> Create
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <div className="badge badge-blue">Status: {state.system.status}</div>
            <div className="badge badge-neutral">
              Active Campaign: {activeCampaign ? activeCampaign.name : 'None selected'}
            </div>
            <div className="badge badge-emerald">
              Funnel: {state.analytics.funnel.leads} Leads / {state.analytics.funnel.sent} Sent / {state.analytics.funnel.opened} Opened / {state.analytics.funnel.replied} Replied
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Leads</div>
              <div className="card-subtitle">Latest lead status in the workflow.</div>
            </div>
          </div>
          <div className="activity-list">
            {state.leads.slice(0, 10).map((lead) => (
              <div key={lead.id} className="activity-item">
                <span className={`activity-dot ${lead.status === 'Replied' ? 'replied' : lead.status === 'Opened' ? 'opened' : lead.status === 'Failed' || lead.status === 'No Email' ? 'bounced' : 'sent'}`}></span>
                <span className="activity-text">
                  <strong>{lead.name}</strong> at <strong>{lead.company}</strong> - {lead.status}
                </span>
                <span className="activity-time">{lead.stage}</span>
              </div>
            ))}
            {state.leads.length === 0 && (
              <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                <h3>No leads yet</h3>
                <p>Run "Generate Leads" to start the outbound flow.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">System Activity Log</div>
            <div className="card-subtitle">Persistent events across generation, assignment, AI, and delivery.</div>
          </div>
        </div>
        <div className="activity-list">
          {recentLogs.map((logLine, index) => (
            <div key={`${logLine}-${index}`} className="activity-item">
              <span className="activity-dot sent"></span>
              <span className="activity-text">{logLine}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
