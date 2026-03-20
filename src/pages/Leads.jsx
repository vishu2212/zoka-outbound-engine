import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apolloFilters } from '../data/mockLeads';
import { Search, Plus, Download, Trash2, Tag, Filter, CheckSquare, Square, RefreshCw, Shield, UserPlus, Globe } from 'lucide-react';

const statusColors = { new: 'badge-blue', contacted: 'badge-amber', replied: 'badge-emerald', bounced: 'badge-rose' };
const tagColors = { interested: 'badge-emerald', 'not-interested': 'badge-rose', 'no-reply': 'badge-neutral' };

export default function Leads() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [selected, setSelected] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showApolloModal, setShowApolloModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  const filtered = state.leads.filter(l => {
    if (search && !`${l.firstName} ${l.lastName} ${l.email} ${l.company}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTitle && !l.title.toLowerCase().includes(filterTitle.toLowerCase())) return false;
    if (filterIndustry && l.industry !== filterIndustry) return false;
    if (filterLocation && !l.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(l => l.id));

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Company', 'Title', 'Industry', 'Location', 'LinkedIn', 'Website', 'Status'];
    const rows = (selected.length ? state.leads.filter(l => selected.includes(l.id)) : filtered).map(l =>
      [l.firstName, l.lastName, l.email, l.company, l.title, l.industry, l.location, l.linkedIn, l.website, l.status]
    );
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'zoka-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleTag = (tag) => {
    dispatch({ type: 'TAG_LEADS', payload: { ids: selected, tag } });
    setShowTagModal(false);
    setSelected([]);
  };

  const handleDelete = () => {
    if (selected.length && confirm(`Delete ${selected.length} lead(s)?`)) {
      dispatch({ type: 'DELETE_LEADS', payload: selected });
      setSelected([]);
    }
  };

  const handleCleanData = (action) => {
    dispatch({ type: action });
  };

  const [newLead, setNewLead] = useState({ firstName: '', lastName: '', email: '', company: '', title: '', industry: 'B2B SaaS', location: '', linkedIn: '', website: '' });

  const handleAddLead = () => {
    if (!newLead.firstName || !newLead.email) return;
    dispatch({ type: 'ADD_LEAD', payload: { ...newLead, status: 'new', tags: [], emailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newLead.email), size: '10-25' } });
    setShowAddModal(false);
    setNewLead({ firstName: '', lastName: '', email: '', company: '', title: '', industry: 'B2B SaaS', location: '', linkedIn: '', website: '' });
  };

  const validCount = state.leads.filter(l => l.emailValid).length;
  const invalidCount = state.leads.filter(l => !l.emailValid).length;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Leads</h1>
          <p>Manage and enrich your B2B lead database</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary" onClick={() => setShowApolloModal(true)}>
            <Globe size={16} /> Import from Apollo
          </button>
          <button className="btn btn-secondary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} /> Add Lead
          </button>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Data Cleaning Panel */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="card-title">Data Cleaning & Enrichment</div>
        </div>
        <div className="flex-row flex-wrap gap-4">
          <button className="btn btn-secondary" onClick={() => handleCleanData('VALIDATE_EMAILS')}>
            <Shield size={16} /> Validate Emails
          </button>
          <button className="btn btn-secondary" onClick={() => handleCleanData('REMOVE_DUPLICATES')}>
            <RefreshCw size={16} /> Remove Duplicates
          </button>
          <div className="flex-row gap-4" style={{ marginLeft: 'auto' }}>
            <span className="badge badge-emerald">✓ {validCount} Valid</span>
            <span className="badge badge-rose">✗ {invalidCount} Invalid</span>
            <span className="badge badge-blue">{state.leads.length} Total</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-bar" style={{ width: 240 }}>
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input type="text" placeholder="Search leads..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <select className="form-select" style={{ width: 160 }} value={filterTitle} onChange={e => { setFilterTitle(e.target.value); setCurrentPage(1); }}>
          <option value="">All Titles</option>
          {apolloFilters.titles.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-select" style={{ width: 160 }} value={filterIndustry} onChange={e => { setFilterIndustry(e.target.value); setCurrentPage(1); }}>
          <option value="">All Industries</option>
          {apolloFilters.industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select className="form-select" style={{ width: 160 }} value={filterLocation} onChange={e => { setFilterLocation(e.target.value); setCurrentPage(1); }}>
          <option value="">All Locations</option>
          {apolloFilters.locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        {(search || filterTitle || filterIndustry || filterLocation) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterTitle(''); setFilterIndustry(''); setFilterLocation(''); setCurrentPage(1); }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex-row mb-4" style={{ background: 'var(--accent-blue-soft)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--accent-blue)' }}>{selected.length} selected</span>
          <button className="btn btn-sm btn-secondary" onClick={() => setShowTagModal(true)}>
            <Tag size={14} /> Tag
          </button>
          <button className="btn btn-sm btn-danger" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
          <button className="btn btn-sm btn-ghost" onClick={() => setSelected([])}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <button onClick={toggleAll} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {selected.length === paginated.length && paginated.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Title</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Status</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <button onClick={() => toggleSelect(lead.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {selected.includes(lead.id) ? <CheckSquare size={16} style={{ color: 'var(--accent-blue)' }} /> : <Square size={16} />}
                  </button>
                </td>
                <td className="cell-primary">{lead.firstName} {lead.lastName}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {lead.email}
                    {!lead.emailValid && <span style={{ color: 'var(--accent-rose)', fontSize: 'var(--font-xs)' }}>⚠</span>}
                  </span>
                </td>
                <td>{lead.company}</td>
                <td>{lead.title}</td>
                <td><span className="badge badge-blue">{lead.industry}</span></td>
                <td>{lead.location}</td>
                <td><span className={`badge ${statusColors[lead.status]}`}>{lead.status}</span></td>
                <td>
                  <div className="flex-row gap-2">
                    {lead.tags.map(t => <span key={t} className={`badge ${tagColors[t] || 'badge-neutral'}`}>{t}</span>)}
                    {lead.tags.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>—</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span className="pagination-info">Showing {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Lead</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="settings-row">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" value={newLead.firstName} onChange={e => setNewLead(p => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={newLead.lastName} onChange={e => setNewLead(p => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="settings-row">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" value={newLead.company} onChange={e => setNewLead(p => ({ ...p, company: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={newLead.title} onChange={e => setNewLead(p => ({ ...p, title: e.target.value }))} />
                </div>
              </div>
              <div className="settings-row">
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <select className="form-select" value={newLead.industry} onChange={e => setNewLead(p => ({ ...p, industry: e.target.value }))}>
                    {apolloFilters.industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={newLead.location} onChange={e => setNewLead(p => ({ ...p, location: e.target.value }))} />
                </div>
              </div>
              <div className="settings-row">
                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <input className="form-input" value={newLead.linkedIn} onChange={e => setNewLead(p => ({ ...p, linkedIn: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input className="form-input" value={newLead.website} onChange={e => setNewLead(p => ({ ...p, website: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddLead}>Add Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="modal-overlay" onClick={() => setShowTagModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3 className="modal-title">Tag {selected.length} Lead(s)</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowTagModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['interested', 'not-interested', 'no-reply'].map(tag => (
                  <button key={tag} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => handleTag(tag)}>
                    <span className={`badge ${tagColors[tag]}`} style={{ marginRight: 8 }}>●</span>
                    {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apollo Import Modal */}
      {showApolloModal && (
        <div className="modal-overlay" onClick={() => setShowApolloModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Import from Apollo</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowApolloModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' }}>Configure Apollo search filters to import leads.</p>
              <div className="form-group">
                <label className="form-label">Job Titles</label>
                <select className="form-select" multiple style={{ height: 100 }}>
                  {apolloFilters.titles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="settings-row">
                <div className="form-group">
                  <label className="form-label">Company Size</label>
                  <select className="form-select">
                    {apolloFilters.companySizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <select className="form-select">
                    {apolloFilters.locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select className="form-select">
                  {apolloFilters.industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowApolloModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'sent', message: '<strong>Apollo Import</strong> — 12 new leads imported', time: 'Just now' } });
                setShowApolloModal(false);
              }}>
                <Globe size={16} /> Import Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
