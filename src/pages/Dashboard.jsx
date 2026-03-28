import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Mail, MessageSquare, Play, Pause, Plus, Users, CheckCircle2, Search, Database, PenTool, Send, Eye, Calendar, Sparkles } from 'lucide-react';
import { MotionPage, StaggerGrid, MotionStatCard, MotionCard } from '../components/motion';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';

const PIPELINE_STEPS = [
  { key: 'sourced', label: 'Sourced' },
  { key: 'routed', label: 'Routed' },
  { key: 'copy', label: 'Copy Ready' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'tracked', label: 'Tracked' },
];

const useCountUp = (end, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    let animationFrame;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };
    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
};

const getEventIcon = (type) => {
  switch (type) {
    case 'source': return <Search size={14} className="blue" />;
    case 'enrich': return <Database size={14} className="cyan" />;
    case 'write': return <PenTool size={14} className="purple" />;
    case 'send': return <Send size={14} className="emerald" />;
    case 'open': return <Eye size={14} className="amber" />;
    case 'reply': return <MessageSquare size={14} className="emerald" />;
    case 'meeting': return <Calendar size={14} className="emerald" />;
    case 'signal': return <Sparkles size={14} className="blue" />;
    default: return <Activity size={14} className="cyan" />;
  }
};

const AIActivityFeed = () => {
  const [visibleEvents, setVisibleEvents] = useState([]);
  
  useEffect(() => {
    const initialEvents = [
      { id: 1, type: 'source', text: 'Sourced 47 prospects from LinkedIn SaaS Founders', time: '12s ago' },
      { id: 2, type: 'enrich', text: 'Enriched 43 contacts — 91% email match rate', time: '28s ago' },
      { id: 3, type: 'write', text: 'Generated variants for Sarah Chen @ CloudScale', time: '1m ago' },
      { id: 4, type: 'send', text: 'Delivered batch 1/3 — 14 messages sent', time: '2m ago' },
      { id: 5, type: 'open', text: 'David Chen opened your email (2nd view)', time: '3m ago' },
      { id: 6, type: 'reply', text: '🔥 Elena Rostova replied — positive intent', time: '4m ago' },
      { id: 7, type: 'signal', text: 'AI Signal: Open rate 58% — above baseline', time: '6m ago' },
    ];
    
    initialEvents.forEach((event, i) => {
      setTimeout(() => {
        setVisibleEvents(prev => [event, ...prev].slice(0, 8));
      }, i * 300);
    });
    
    let counter = 8;
    const interval = setInterval(() => {
      const types = ['open', 'open', 'reply', 'signal'];
      const type = types[Math.floor(Math.random() * types.length)];
      const names = ['Michael G.', 'Sarah C.', 'Alex D.', 'Jessica L.', 'Isabella R.'];
      const name = names[Math.floor(Math.random() * names.length)];
      
      let text = '';
      if (type === 'open') text = `${name} opened your email`;
      if (type === 'reply') text = `🔥 ${name} replied — scheduling meeting`;
      if (type === 'signal') text = `Pipeline health score increased to 92/100`;
      
      const newEvent = { id: counter++, type, text, time: 'Just now' };
      setVisibleEvents(prev => [newEvent, ...prev].slice(0, 8));
    }, Math.random() * 4000 + 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="activity-list feed-list" style={{ overflow: 'hidden' }}>
      <AnimatePresence initial={false}>
        {visibleEvents.map((event) => (
          <motion.div
            key={event.id}
            className="activity-item feed-item"
            initial={{ opacity: 0, y: -12, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
          >
            <div className="feed-icon-container" style={{ marginTop: '2px', background: 'var(--bg-glass)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              {getEventIcon(event.type)}
            </div>
            <div className="feed-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <span className="activity-text" style={{ fontSize: '13px', lineHeight: '1.4', color: 'var(--text-primary)' }}>{event.text}</span>
              <span className="activity-time" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{event.time}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

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
  const currentFlowStep = useMemo(() => {
    if (state.system.isGeneratingLeads) return 0;
    if (state.system.currentCampaign && state.campaigns.some((campaign) => campaign.id === state.system.currentCampaign && campaign.leadIds.length > 0)) return 1;
    if (state.system.isGeneratingMessages || state.messages.length > 0) return 2;
    if (state.analytics.replies > 0) return 4;
    if (state.system.isSendingEmails || state.analytics.sent > 0) return 3;
    return 0;
  }, [state]);

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

  const leadsCount = useCountUp(state.analytics.totalLeads);
  const campaignsCount = useCountUp(state.campaigns.length);
  const sentCount = useCountUp(state.analytics.emailsSent);
  const repliesCount = useCountUp(state.analytics.replies);

  return (
    <MotionPage>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Mission Control</h1>
          <p>Live pipeline status — from sourcing to reply.</p>
        </div>
        <div className="page-header-right" style={{ gap: 'var(--space-2)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => actions.generateLeads()}
            disabled={state.system.isGeneratingLeads}
            title="AI will pull and score prospects from configured data sources."
          >
            <Users size={16} /> {state.system.isGeneratingLeads ? 'Sourcing...' : 'Source Prospects'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleAssignToActiveCampaign}
            disabled={!activeCampaign || !unassignedLeadIds.length}
            title="Assign all unrouted prospects to the active sequence."
          >
            <Plus size={16} /> Route All ({unassignedLeadIds.length})
          </button>
          {activeCampaign && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => actions.runCampaign(activeCampaign.id)}
                disabled={busy || !activeCampaign.leadIds.length}
                title="Begin multi-step outreach for all assigned prospects."
              >
                <Play size={16} /> Execute Sequence
              </button>
              <button
                className="btn btn-danger"
                onClick={() => actions.pauseCampaign(activeCampaign.id)}
                disabled={!state.system.isSendingEmails}
                title="Pause delivery mid-sequence. Resumes from the current step."
              >
                <Pause size={16} /> Hold
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── TOP TIER: Hero Metrics (Staggered) ── */}
      <StaggerGrid className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <MotionStatCard className="metric-card">
          <div className="metric-icon blue"><Users size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{leadsCount}</div>
            <div className="metric-label">Prospects Sourced</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon cyan"><Activity size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{campaignsCount}</div>
            <div className="metric-label">Active Sequences</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon emerald"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{sentCount}</div>
            <div className="metric-label">Messages Delivered</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon purple"><MessageSquare size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{repliesCount}</div>
            <div className="metric-label">Conversations Started</div>
          </div>
        </MotionStatCard>
      </StaggerGrid>

      {/* ── MID TIER: Execution Pipeline ── */}
      <MotionCard className="card mt-6" delay={0.2}>
        <div className="card-header">
          <div>
            <div className="card-title">Execution Pipeline</div>
            <div className="card-subtitle">Source → Enrich → Write → Send → Track</div>
          </div>
        </div>
        <div className="pipeline-flow">
          {PIPELINE_STEPS.map((step, index) => {
            const isDone = index < currentFlowStep;
            const isActive = index === currentFlowStep;
            const stateClass = isDone ? 'done' : isActive ? 'active' : 'queued';
            return (
              <motion.div
                key={step.key}
                className="pipeline-step-wrapper"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.3 + index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className={`pipeline-step ${stateClass}`}>
                  <div className="pipeline-dot">
                    {isDone ? <CheckCircle2 size={14} /> : <span className="pipeline-dot-inner" />}
                  </div>
                  <strong>{step.label}</strong>
                  <div className="pipeline-status">
                    {isDone ? 'Complete' : isActive ? 'In Progress' : 'Queued'}
                  </div>
                </div>
                {index < PIPELINE_STEPS.length - 1 && (
                  <div className={`pipeline-connector ${isDone ? 'done' : ''}`} />
                )}
              </motion.div>
            );
          })}
        </div>
      </MotionCard>

      {/* ── MID TIER: Orchestration + AI Action Feed ── */}
      <div className="grid-2 mt-6" style={{ alignItems: 'start' }}>
        <MotionCard className="card" delay={0.35}>
          <div className="card-header">
            <div>
              <div className="card-title">Orchestration</div>
              <div className="card-subtitle">Pipeline control and sequence launcher.</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Sequence Name</label>
            <div className="flex-row gap-2">
              <input
                className="form-input"
                placeholder="e.g. SaaS Founders April Batch"
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
              />
              <button className="btn btn-success" onClick={handleCreateCampaign}>
                <Plus size={16} /> Launch
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <div className="badge badge-blue">
              <span className="live-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--cyan-400)', marginRight: 6, boxShadow: '0 0 8px var(--cyan-400)', animation: 'pulse 2s infinite' }}></span>
              Status: {state.system.status}
            </div>
            <div className="badge badge-neutral">
              Active Sequence: {activeCampaign ? activeCampaign.name : 'None selected'}
            </div>
            <div className="badge badge-emerald">
              Funnel: {state.analytics.funnel.leads} Sourced / {state.analytics.funnel.sent} Sent / {state.analytics.funnel.opened} Opened / {state.analytics.funnel.replied} Replied
            </div>
          </div>
        </MotionCard>

        <MotionCard className="card" delay={0.4} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 400 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card-title">AI Activity</div>
              <div className="card-subtitle">Real-time system workflow execution.</div>
            </div>
            <span className="badge badge-blue"><span className="live-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--cyan-400)', marginRight: 6, boxShadow: '0 0 8px var(--cyan-400)', animation: 'pulse 2s infinite' }}></span> Live</span>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <AIActivityFeed />
          </div>
        </MotionCard>
      </div>

      {/* ── BOTTOM TIER: Event Stream ── */}
      <MotionCard className="card mt-6" delay={0.5}>
        <div className="card-header">
          <div>
            <div className="card-title">Event Stream</div>
            <div className="card-subtitle">Real-time system events as they happen.</div>
          </div>
        </div>
        <div className="activity-list">
          {recentLogs.map((logLine, index) => (
            <motion.div
              key={`${logLine}-${index}`}
              className="activity-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.55 + index * 0.03 }}
            >
              <span className="activity-dot sent"></span>
              <span className="activity-text">{logLine}</span>
            </motion.div>
          ))}
          {recentLogs.length === 0 && (
            <div className="empty-state-block">
              <Activity size={32} className="empty-state-icon" />
              <h3>System idle</h3>
              <p>Events will stream here as the pipeline executes.</p>
            </div>
          )}
        </div>
      </MotionCard>
    </MotionPage>
  );
}
