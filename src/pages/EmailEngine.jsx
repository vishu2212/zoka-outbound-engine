import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Plus, Trash2, Send, Clock, Shield, Activity, Inbox, AlertCircle, Check, RotateCw } from 'lucide-react';

export default function EmailEngine() {
  const { state, dispatch } = useApp();
  const [showAddInbox, setShowAddInbox] = useState(false);
  const [newInbox, setNewInbox] = useState({ email: '', provider: 'Gmail' });
  const [sendingLog, setSendingLog] = useState([
    { id: 1, status: 'sent', to: 'sarah.chen@growthloop.io', subject: 'Quick question about GrowthLoop', time: '10:32 AM', inbox: 'vishav@zokaworks.com' },
    { id: 2, status: 'sent', to: 'marcus@scalestack.com', subject: 'ScaleStack pipeline question', time: '10:34 AM', inbox: 'outreach@zokaworks.com' },
    { id: 3, status: 'queued', to: 'emma.patel@revhub.co', subject: 'Helping agencies like RevHub scale', time: '10:36 AM', inbox: 'vishav@zokaworks.com' },
    { id: 4, status: 'queued', to: 'james@outboundly.io', subject: 'Quick question about Outboundly', time: '10:38 AM', inbox: 'sales@zokaworks.com' },
    { id: 5, status: 'queued', to: 'priya@leadcraft.ai', subject: 'LeadCraft AI growth strategy', time: '10:40 AM', inbox: 'outreach@zokaworks.com' },
    { id: 6, status: 'failed', to: 'invalid-email-format', subject: 'Test email', time: '10:28 AM', inbox: 'vishav@zokaworks.com' },
  ]);

  const totalDailyLimit = state.inboxes.reduce((a, b) => a + b.dailyLimit, 0);
  const totalSentToday = state.inboxes.reduce((a, b) => a + b.sentToday, 0);
  const queuedCount = sendingLog.filter(l => l.status === 'queued').length;

  const handleAddInbox = () => {
    if (!newInbox.email) return;
    dispatch({
      type: 'ADD_INBOX',
      payload: { email: newInbox.email, provider: newInbox.provider, status: 'warming', dailyLimit: 20, sentToday: 0, warmupDay: 1, warmupTarget: 21, reputation: 50 }
    });
    setShowAddInbox(false);
    setNewInbox({ email: '', provider: 'Gmail' });
  };

  // Simulate sending animation
  const [activeSimulation, setActiveSimulation] = useState(false);

  const simulateSending = () => {
    setActiveSimulation(true);
    const interval = setInterval(() => {
      setSendingLog(prev => {
        const first = prev.find(l => l.status === 'queued');
        if (!first) { clearInterval(interval); setActiveSimulation(false); return prev; }
        return prev.map(l => l.id === first.id ? { ...l, status: 'sent' } : l);
      });
    }, 1500);
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Email Engine</h1>
          <p>Manage inboxes, sending queue, and warm-up schedule</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary" onClick={() => setShowAddInbox(true)}>
            <Plus size={16} /> Add Inbox
          </button>
          <button className="btn btn-primary" onClick={simulateSending} disabled={activeSimulation || queuedCount === 0}>
            <Send size={16} /> {activeSimulation ? 'Sending...' : `Send Queue (${queuedCount})`}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-icon blue"><Inbox size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.inboxes.length}</div>
            <div className="metric-label">Connected Inboxes</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><Send size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalSentToday}</div>
            <div className="metric-label">Sent Today</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon amber"><Clock size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{totalDailyLimit - totalSentToday}</div>
            <div className="metric-label">Remaining Capacity</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><Shield size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{Math.round(state.inboxes.reduce((a, b) => a + b.reputation, 0) / state.inboxes.length)}%</div>
            <div className="metric-label">Avg. Reputation</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Connected Inboxes */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Connected Inboxes</div>
            <span className="badge badge-blue">{state.inboxes.length} Inboxes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {state.inboxes.map((inbox) => (
              <div className="inbox-card" key={inbox.id}>
                <div className="inbox-avatar" style={{
                  background: inbox.provider === 'Gmail' ? 'var(--accent-rose-soft)' : 'var(--accent-blue-soft)',
                  color: inbox.provider === 'Gmail' ? 'var(--accent-rose)' : 'var(--accent-blue)',
                }}>
                  <Mail size={18} />
                </div>
                <div className="inbox-info">
                  <div className="inbox-email">{inbox.email}</div>
                  <div className="inbox-meta">
                    <span>{inbox.provider}</span>
                    <span>{inbox.sentToday}/{inbox.dailyLimit} today</span>
                  </div>
                  {/* Warm-up Progress */}
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <div className="flex-between" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                        Warm-up: Day {inbox.warmupDay}/{inbox.warmupTarget}
                      </span>
                      <span style={{ fontSize: 'var(--font-xs)', color: inbox.reputation >= 90 ? 'var(--accent-emerald)' : inbox.reputation >= 70 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                        {inbox.reputation}% rep
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${inbox.warmupDay >= inbox.warmupTarget ? 'success' : 'amber'}`} style={{ width: `${(inbox.warmupDay / inbox.warmupTarget) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className={`badge ${inbox.status === 'active' ? 'badge-emerald' : 'badge-amber'}`}>{inbox.status}</span>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => dispatch({ type: 'REMOVE_INBOX', payload: inbox.id })}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sending Queue & Activity */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Sending Activity</div>
            <div className="flex-row gap-2">
              {activeSimulation && <span className="badge badge-emerald"><Activity size={12} /> Live</span>}
            </div>
          </div>

          {/* Daily Send Progress */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Daily Send Progress</span>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{totalSentToday}/{totalDailyLimit}</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${(totalSentToday / totalDailyLimit) * 100}%` }}></div>
            </div>
          </div>

          {/* Inbox Rotation Status */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>INBOX ROTATION</h4>
            <div className="flex-row gap-2 flex-wrap">
              {state.inboxes.map((inbox, i) => (
                <span key={inbox.id} className={`badge ${i === 0 ? 'badge-emerald' : 'badge-neutral'}`}>
                  {i === 0 ? <><RotateCw size={10} /> </> : null}
                  {inbox.email.split('@')[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="activity-list">
            {sendingLog.map((log) => (
              <div className="activity-item" key={log.id}>
                <span className={`activity-dot ${log.status === 'sent' ? 'sent' : log.status === 'queued' ? 'opened' : 'bounced'}`}></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--font-sm)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{log.to}</span>
                  </div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    {log.subject} · via {log.inbox.split('@')[0]}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className={`badge ${log.status === 'sent' ? 'badge-emerald' : log.status === 'queued' ? 'badge-amber' : 'badge-rose'}`}>
                    {log.status === 'sent' ? <Check size={10} /> : log.status === 'queued' ? <Clock size={10} /> : <AlertCircle size={10} />}
                    {' '}{log.status}
                  </span>
                  <span className="activity-time">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Inbox Modal */}
      {showAddInbox && (
        <div className="modal-overlay" onClick={() => setShowAddInbox(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 className="modal-title">Add Email Inbox</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowAddInbox(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@company.com" value={newInbox.email} onChange={e => setNewInbox(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Provider</label>
                <select className="form-select" value={newInbox.provider} onChange={e => setNewInbox(p => ({ ...p, provider: e.target.value }))}>
                  <option value="Gmail">Gmail</option>
                  <option value="Outlook">Outlook</option>
                  <option value="SMTP">Custom SMTP</option>
                </select>
              </div>
              <div style={{ background: 'var(--accent-amber-soft)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-sm)', color: 'var(--accent-amber)' }}>
                <strong>Note:</strong> New inboxes start in warm-up mode with a daily limit of 20 emails. The limit gradually increases over 21 days.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddInbox(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddInbox}>
                <Plus size={16} /> Connect Inbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
