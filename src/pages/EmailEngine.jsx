import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Pause, Play, RotateCw } from 'lucide-react';

function badgeForStatus(status, deliveryStatus) {
  if (deliveryStatus === 'No Email') return 'badge-rose';
  if (deliveryStatus === 'Retrying') return 'badge-amber';
  if (status === 'replied') return 'badge-purple';
  if (status === 'opened') return 'badge-emerald';
  if (status === 'sent') return 'badge-blue';
  if (status === 'failed') return 'badge-rose';
  return 'badge-neutral';
}

export default function EmailEngine() {
  const { state, actions } = useApp();
  const [campaignId, setCampaignId] = useState(state.campaigns[0]?.id || '');
  const selectedCampaignId = Number(campaignId);

  const selectedCampaign = useMemo(
    () => state.campaigns.find((campaign) => campaign.id === selectedCampaignId) || null,
    [selectedCampaignId, state.campaigns]
  );

  const campaignEmails = useMemo(
    () =>
      state.emails
        .filter((email) => email.campaignId === selectedCampaignId)
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)),
    [selectedCampaignId, state.emails]
  );

  const sentCount = campaignEmails.filter((email) => email.status === 'sent' || email.status === 'opened' || email.status === 'replied').length;
  const openedCount = campaignEmails.filter((email) => email.status === 'opened' || email.status === 'replied').length;
  const repliedCount = campaignEmails.filter((email) => email.status === 'replied').length;
  const failedCount = campaignEmails.filter((email) => email.status === 'failed').length;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Email Engine</h1>
          <p>Execute Day 1/3/7 sequence delivery with failure handling and retries.</p>
        </div>
        <div className="page-header-right">
          <select className="form-select" value={campaignId} onChange={(event) => setCampaignId(event.target.value)} style={{ minWidth: 280 }}>
            {state.campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => actions.sendEmails(selectedCampaignId)} disabled={!selectedCampaign || !selectedCampaign.leadIds.length || state.system.isSendingEmails}>
            <Play size={16} /> {state.system.isSendingEmails ? 'Sending...' : 'Send Sequence'}
          </button>
          <button className="btn btn-secondary" onClick={() => actions.pauseCampaign(selectedCampaignId)} disabled={!state.system.isSendingEmails}>
            <Pause size={16} /> Pause
          </button>
          <button className="btn btn-ghost" onClick={() => actions.retryFailedEmails(selectedCampaignId)} disabled={!failedCount}>
            <RotateCw size={16} /> Retry Failed
          </button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{sentCount}</div>
            <div className="metric-label">Sent</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{openedCount}</div>
            <div className="metric-label">Opened</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{repliedCount}</div>
            <div className="metric-label">Replied</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon rose"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{failedCount}</div>
            <div className="metric-label">Failed</div>
          </div>
        </div>
      </div>

      <div className="grid-2 mt-6" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Sequence Definition</div>
              <div className="card-subtitle">Three-step send schedule used by the simulator.</div>
            </div>
          </div>
          <div className="sequence-timeline">
            <div className="sequence-step">
              <div className="step-connector">
                <div className="step-dot">1</div>
                <div className="step-line"></div>
              </div>
              <div className="step-content">
                <h4>Day 1 Intro</h4>
                <p>Initial personalized outreach email.</p>
              </div>
            </div>
            <div className="sequence-step">
              <div className="step-connector">
                <div className="step-dot">2</div>
                <div className="step-line"></div>
              </div>
              <div className="step-content">
                <h4>Day 3 Follow-up</h4>
                <p>Contextual follow-up with proof point.</p>
              </div>
            </div>
            <div className="sequence-step">
              <div className="step-connector">
                <div className="step-dot">3</div>
              </div>
              <div className="step-content">
                <h4>Day 7 Reminder</h4>
                <p>Final reminder if no reply yet.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Campaign Delivery Summary</div>
              <div className="card-subtitle">{selectedCampaign ? selectedCampaign.name : 'No campaign selected'}</div>
            </div>
          </div>
          {selectedCampaign && (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <span className="badge badge-blue">Leads assigned: {selectedCampaign.leadIds.length}</span>
              <span className="badge badge-emerald">Sent count: {selectedCampaign.sentCount}</span>
              <span className="badge badge-purple">Reply count: {selectedCampaign.replyCount}</span>
              <span className="badge badge-rose">Failed count: {selectedCampaign.failedCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="data-table-wrapper mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Step</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {campaignEmails.map((email) => {
              const lead = state.leads.find((item) => item.id === email.leadId);
              return (
                <tr key={email.id}>
                  <td className="cell-primary">{lead ? lead.name : `Lead #${email.leadId}`}</td>
                  <td>{email.sequenceLabel}</td>
                  <td>
                    <span className={`badge ${badgeForStatus(email.status, email.deliveryStatus)}`}>
                      {email.deliveryStatus || email.status}
                    </span>
                  </td>
                  <td>{email.attempts || 0}</td>
                  <td>{email.updatedAt ? new Date(email.updatedAt).toLocaleTimeString() : '-'}</td>
                </tr>
              );
            })}
            {!campaignEmails.length && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No delivery events yet for this campaign.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
