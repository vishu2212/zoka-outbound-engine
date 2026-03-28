import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Users, Search } from 'lucide-react';
import { MotionPage, StaggerGrid, MotionStatCard, MotionCard } from '../components/motion';

function statusBadge(status) {
  if (status === 'Replied') return 'badge-emerald';
  if (status === 'Opened') return 'badge-blue';
  if (status === 'Failed' || status === 'No Email') return 'badge-rose';
  if (status === 'Retrying') return 'badge-amber';
  return 'badge-neutral';
}

export default function Leads() {
  const { state, actions } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState(state.campaigns[0]?.id || '');
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredLeads = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return state.leads;
    return state.leads.filter((lead) =>
      `${lead.name} ${lead.company} ${lead.email} ${lead.status} ${lead.stage}`.toLowerCase().includes(normalized)
    );
  }, [search, state.leads]);

  const selectedCount = selectedIds.length;
  const missingEmails = state.leads.filter((lead) => !lead.email).length;

  const toggleLead = (leadId) => {
    setSelectedIds((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const toggleAllVisible = () => {
    if (filteredLeads.length === 0) return;
    const visibleIds = filteredLeads.map((lead) => lead.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? selectedIds.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...selectedIds, ...visibleIds])));
  };

  const handleAssignSelected = () => {
    const campaignId = Number(selectedCampaignId);
    if (!campaignId || selectedIds.length === 0) return;
    actions.assignToCampaign(selectedIds, campaignId);
    setSelectedIds([]);
  };

  return (
    <MotionPage>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Prospects</h1>
          <p>AI-sourced contacts, scored and ready for outreach.</p>
        </div>
        <div className="page-header-right">
          <button
            className="btn btn-primary"
            onClick={() => actions.generateLeads()}
            disabled={state.system.isGeneratingLeads}
            title="AI will pull and score prospects from configured data sources."
          >
            <Users size={16} /> {state.system.isGeneratingLeads ? 'Sourcing...' : 'Source Prospects'}
          </button>
        </div>
      </div>

      <StaggerGrid className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <MotionStatCard className="metric-card">
          <div className="metric-icon blue"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.leads.length}</div>
            <div className="metric-label">Prospects Sourced</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon amber"><Plus size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{missingEmails}</div>
            <div className="metric-label">Unverified Contacts</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon emerald"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{selectedCount}</div>
            <div className="metric-label">Marked for Action</div>
          </div>
        </MotionStatCard>
      </StaggerGrid>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Route to Sequence</div>
            <div className="card-subtitle">Route prospects into an active sequence.</div>
          </div>
        </div>
        <div className="flex-row gap-3 flex-wrap">
          <input
            className="form-input"
            style={{ maxWidth: 320 }}
            placeholder="Search by name, company, email, status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: 280 }}
            value={selectedCampaignId}
            onChange={(event) => setSelectedCampaignId(event.target.value)}
          >
            {state.campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name} ({campaign.leadIds.length} prospects)
              </option>
            ))}
          </select>
          <button className="btn btn-success" onClick={handleAssignSelected} disabled={!selectedCount || !selectedCampaignId}>
            Route Selected ({selectedCount})
          </button>
          <button className="btn btn-ghost" onClick={toggleAllVisible}>
            Select All Visible
          </button>
        </div>
      </div>

      <div className="desktop-table data-table-wrapper mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>Pick</th>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Score</th>
              <th>Status</th>
              <th>Stage</th>
              <th>Sequence</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => {
              const campaign = state.campaigns.find((item) => item.id === lead.campaignId);
              return (
                <tr key={lead.id}>
                  <td>
                    <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleLead(lead.id)} />
                  </td>
                  <td className="cell-primary">{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>{lead.email || 'Unverified'}</td>
                  <td>{lead.score}</td>
                  <td>
                    <span className={`badge ${statusBadge(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td>{lead.stage}</td>
                  <td>{campaign ? campaign.name : 'Unrouted'}</td>
                </tr>
              );
            })}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state-block">
                    <Users size={32} className="empty-state-icon" />
                    <h3>No prospects in the pipeline</h3>
                    <p>Source your first batch to activate the system.</p>
                    <button className="btn btn-primary btn-sm" onClick={() => actions.generateLeads()} disabled={state.system.isGeneratingLeads}>
                      Source Prospects →
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-cards mt-6">
        {filteredLeads.map((lead) => {
          const campaign = state.campaigns.find((item) => item.id === lead.campaignId);
          return (
            <div key={`mobile-${lead.id}`} className="mobile-data-card">
              <div className="mobile-data-card-row">
                <strong>{lead.name}</strong>
                <span className={`badge ${statusBadge(lead.status)}`}>{lead.status}</span>
              </div>
              <div className="mobile-data-card-row">
                <span>Company</span>
                <span>{lead.company}</span>
              </div>
              <div className="mobile-data-card-row">
                <span>Email</span>
                <span>{lead.email || 'Unverified'}</span>
              </div>
              <div className="mobile-data-card-row">
                <span>Score</span>
                <span>{lead.score}</span>
              </div>
              <div className="mobile-data-card-row">
                <span>Sequence</span>
                <span>{campaign ? campaign.name : 'Unrouted'}</span>
              </div>
              <label className="mobile-data-card-row">
                <span>Select</span>
                <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleLead(lead.id)} />
              </label>
            </div>
          );
        })}
      </div>
    </MotionPage>
  );
}
