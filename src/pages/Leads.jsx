import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Users } from 'lucide-react';

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
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Leads</h1>
          <p>Generate leads, track quality, and assign records into active campaigns.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary" onClick={() => actions.generateLeads()} disabled={state.system.isGeneratingLeads}>
            <Users size={16} /> {state.system.isGeneratingLeads ? 'Generating...' : 'Generate Leads'}
          </button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.leads.length}</div>
            <div className="metric-label">Total Leads</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon amber"><Plus size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{missingEmails}</div>
            <div className="metric-label">Missing Emails</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{selectedCount}</div>
            <div className="metric-label">Selected</div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Lead Assignment</div>
            <div className="card-subtitle">Select leads and assign them to a campaign workflow.</div>
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
                {campaign.name} ({campaign.leadIds.length} leads)
              </option>
            ))}
          </select>
          <button className="btn btn-success" onClick={handleAssignSelected} disabled={!selectedCount || !selectedCampaignId}>
            Assign Selected ({selectedCount})
          </button>
          <button className="btn btn-ghost" onClick={toggleAllVisible}>
            Toggle Visible
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
              <th>Campaign</th>
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
                  <td>{lead.email || 'No Email'}</td>
                  <td>{lead.score}</td>
                  <td>
                    <span className={`badge ${statusBadge(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td>{lead.stage}</td>
                  <td>{campaign ? campaign.name : 'Unassigned'}</td>
                </tr>
              );
            })}
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
                <span>{lead.email || 'No Email'}</span>
              </div>
              <div className="mobile-data-card-row">
                <span>Score</span>
                <span>{lead.score}</span>
              </div>
              <div className="mobile-data-card-row">
                <span>Campaign</span>
                <span>{campaign ? campaign.name : 'Unassigned'}</span>
              </div>
              <label className="mobile-data-card-row">
                <span>Select</span>
                <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleLead(lead.id)} />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
