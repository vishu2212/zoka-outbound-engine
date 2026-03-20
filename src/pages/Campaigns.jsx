import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { campaignTemplates } from '../data/mockCampaigns';
import { Rocket, Plus, Copy, Play, Pause, Clock, Mail, MousePointerClick, MessageSquare, AlertTriangle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const statusConfig = {
  active: { color: 'badge-emerald', label: 'Active' },
  paused: { color: 'badge-amber', label: 'Paused' },
  draft: { color: 'badge-neutral', label: 'Draft' },
  completed: { color: 'badge-blue', label: 'Completed' },
};

export default function Campaigns() {
  const { state, dispatch } = useApp();
  const [expandedId, setExpandedId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState({ name: '', templateId: 't1', leads: 0, abEnabled: false });

  const handleDuplicate = (id) => {
    dispatch({ type: 'DUPLICATE_CAMPAIGN', payload: id });
  };

  const handleStatusToggle = (campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : campaign.status === 'paused' ? 'active' : campaign.status;
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id: campaign.id, status: newStatus } });
  };

  const handleCreate = () => {
    const tpl = campaignTemplates.find(t => t.id === newCampaign.templateId);
    const seq = tpl ? tpl.steps.map((s, i) => ({ step: i + 1, type: 'email', subject: s.subject, delay: s.delay, sent: 0, opened: 0, replied: 0, variant: 'A' })) : [];
    dispatch({
      type: 'ADD_CAMPAIGN',
      payload: {
        name: newCampaign.name || 'New Campaign',
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        leads: newCampaign.leads || 0,
        sent: 0, opened: 0, replied: 0, bounced: 0,
        openRate: 0, replyRate: 0, bounceRate: 0,
        sequence: seq,
        abTest: { enabled: newCampaign.abEnabled, variants: {} },
        tags: [],
      }
    });
    setShowCreateModal(false);
    setCreateStep(1);
    setNewCampaign({ name: '', templateId: 't1', leads: 0, abEnabled: false });
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Campaigns</h1>
          <p>Create and manage your cold email sequences</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Rocket size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.length}</div>
            <div className="metric-label">Total Campaigns</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><Play size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.filter(c => c.status === 'active').length}</div>
            <div className="metric-label">Active</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon amber"><Pause size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.filter(c => c.status === 'paused').length}</div>
            <div className="metric-label">Paused</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.reduce((a, c) => a + c.sent, 0)}</div>
            <div className="metric-label">Total Emails Sent</div>
          </div>
        </div>
      </div>

      {/* Campaign Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {state.campaigns.map((campaign) => (
          <div className="card" key={campaign.id} style={{ padding: 0 }}>
            {/* Campaign Header */}
            <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {campaign.name}
                    <span className={`badge ${statusConfig[campaign.status]?.color}`}>{statusConfig[campaign.status]?.label}</span>
                    {campaign.abTest?.enabled && <span className="badge badge-purple">A/B</span>}
                  </div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                    Created {campaign.createdAt} · {campaign.leads} leads · {campaign.sequence.length} steps
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginRight: 'var(--space-4)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--accent-blue)' }}>{campaign.openRate}%</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Opens</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--accent-emerald)' }}>{campaign.replyRate}%</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Replies</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--accent-rose)' }}>{campaign.bounceRate}%</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Bounces</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                {(campaign.status === 'active' || campaign.status === 'paused') && (
                  <button className="btn btn-sm btn-secondary" onClick={e => { e.stopPropagation(); handleStatusToggle(campaign); }}>
                    {campaign.status === 'active' ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
                  </button>
                )}
                <button className="btn btn-sm btn-ghost" onClick={e => { e.stopPropagation(); handleDuplicate(campaign.id); }} title="Duplicate">
                  <Copy size={14} />
                </button>
                {expandedId === campaign.id ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === campaign.id && (
              <div style={{ borderTop: '1px solid var(--border-primary)', padding: 'var(--space-6)' }}>
                <div className="grid-2">
                  {/* Sequence Timeline */}
                  <div>
                    <h4 style={{ marginBottom: 'var(--space-4)', fontWeight: 600 }}>Sequence Steps</h4>
                    <div className="sequence-timeline">
                      {campaign.sequence.map((step, i) => (
                        <div className="sequence-step" key={i}>
                          <div className="step-connector">
                            <div className="step-dot">{step.step}</div>
                            {i < campaign.sequence.length - 1 && <div className="step-line"></div>}
                          </div>
                          <div className="step-content">
                            <h4>{step.subject}</h4>
                            <p>Sent: {step.sent} · Opened: {step.opened} · Replied: {step.replied}</p>
                            {step.delay > 0 && <div className="step-delay"><Clock size={12} /> Wait {step.delay} days</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* A/B Test Results */}
                  <div>
                    {campaign.abTest?.enabled && Object.keys(campaign.abTest.variants).length > 0 ? (
                      <>
                        <h4 style={{ marginBottom: 'var(--space-4)', fontWeight: 600 }}>A/B Test Results</h4>
                        {Object.entries(campaign.abTest.variants).map(([key, v]) => (
                          <div className="card" key={key} style={{ marginBottom: 'var(--space-3)', padding: 'var(--space-4)' }}>
                            <div className="flex-between mb-4">
                              <span className="badge badge-purple">Variant {key}</span>
                              {v.openRate > 0 && <span className="badge badge-emerald">
                                {v.openRate > (campaign.abTest.variants[key === 'A' ? 'B' : 'A']?.openRate || 0) ? '🏆 Winner' : ''}
                              </span>}
                            </div>
                            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>"{v.subject}"</p>
                            <div className="flex-row gap-4">
                              <span style={{ fontSize: 'var(--font-sm)' }}><strong>{v.openRate}%</strong> opens</span>
                              <span style={{ fontSize: 'var(--font-sm)' }}><strong>{v.replyRate}%</strong> replies</span>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <h4 style={{ marginBottom: 'var(--space-4)', fontWeight: 600 }}>Performance Summary</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                          <div>
                            <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Open Rate</span>
                              <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{campaign.openRate}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${campaign.openRate}%` }}></div></div>
                          </div>
                          <div>
                            <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Reply Rate</span>
                              <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>{campaign.replyRate}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill success" style={{ width: `${campaign.replyRate * 3}%` }}></div></div>
                          </div>
                          <div>
                            <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Bounce Rate</span>
                              <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>{campaign.bounceRate}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill amber" style={{ width: `${campaign.bounceRate * 5}%` }}></div></div>
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                            {campaign.tags.map(t => <span key={t} className="badge badge-neutral">{t}</span>)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {createStep === 1 ? 'Create Campaign' : createStep === 2 ? 'Select Template' : 'Configure & Launch'}
              </h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Step Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 'var(--font-xs)', fontWeight: 700,
                      background: s <= createStep ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                      color: s <= createStep ? 'white' : 'var(--text-muted)'
                    }}>{s}</div>
                    {s < 3 && <div style={{ width: 40, height: 2, background: s < createStep ? 'var(--accent-blue)' : 'var(--border-primary)' }}></div>}
                  </div>
                ))}
              </div>

              {createStep === 1 && (
                <>
                  <div className="form-group">
                    <label className="form-label">Campaign Name</label>
                    <input className="form-input" placeholder="e.g. SaaS Founders Outreach Q1" value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Leads</label>
                    <input className="form-input" type="number" placeholder="25" value={newCampaign.leads || ''} onChange={e => setNewCampaign(p => ({ ...p, leads: parseInt(e.target.value) || 0 }))} />
                  </div>
                </>
              )}

              {createStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {campaignTemplates.map(t => (
                    <div key={t.id} className="card" style={{
                      cursor: 'pointer',
                      borderColor: newCampaign.templateId === t.id ? 'var(--accent-blue)' : 'var(--border-primary)',
                      background: newCampaign.templateId === t.id ? 'var(--accent-blue-soft)' : 'var(--bg-card)',
                    }} onClick={() => setNewCampaign(p => ({ ...p, templateId: t.id }))}>
                      <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>{t.name}</div>
                      <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{t.steps.length} steps · {t.steps[t.steps.length - 1].delay} day sequence</div>
                      <div style={{ marginTop: 'var(--space-3)' }}>
                        {t.steps.map((s, i) => (
                          <span key={i} className="badge badge-neutral" style={{ marginRight: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            Step {s.step}: Day {s.delay}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {createStep === 3 && (
                <>
                  <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ marginBottom: 'var(--space-2)' }}>Campaign Summary</h4>
                    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
                      <strong>{newCampaign.name || 'New Campaign'}</strong> · {newCampaign.leads} leads · Template: {campaignTemplates.find(t => t.id === newCampaign.templateId)?.name}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-wrapper">
                      <input type="checkbox" checked={newCampaign.abEnabled} onChange={e => setNewCampaign(p => ({ ...p, abEnabled: e.target.checked }))} />
                      <span style={{ fontSize: 'var(--font-sm)' }}>Enable A/B Testing for subject lines</span>
                    </label>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => createStep > 1 ? setCreateStep(s => s - 1) : setShowCreateModal(false)}>
                {createStep > 1 ? 'Back' : 'Cancel'}
              </button>
              {createStep < 3 ? (
                <button className="btn btn-primary" onClick={() => setCreateStep(s => s + 1)}>
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleCreate}>
                  <Rocket size={16} /> Create Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
