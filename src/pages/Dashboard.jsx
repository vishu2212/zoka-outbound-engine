import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Mail, MessageSquare, Play, Pause, Plus, Users, CheckCircle2, Sparkles, Rocket } from 'lucide-react';
import { MotionPage, StaggerGrid, MotionStatCard, MotionCard } from '../components/motion';
import { motion } from 'framer-motion';
import './Dashboard.css';

const PIPELINE_STEPS = [
  { key: 'sourced', label: 'Sourced' },
  { key: 'routed', label: 'Routed' },
  { key: 'copy', label: 'Copy Ready' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'tracked', label: 'Tracked' },
];

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
            <div className="metric-value">{state.analytics.totalLeads}</div>
            <div className="metric-label">Prospects Sourced</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon cyan"><Activity size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.campaigns.length}</div>
            <div className="metric-label">Active Sequences</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon emerald"><Mail size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.emailsSent}</div>
            <div className="metric-label">Messages Delivered</div>
          </div>
        </MotionStatCard>
        <MotionStatCard className="metric-card">
          <div className="metric-icon purple"><MessageSquare size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.replies}</div>
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

      {/* ── MID TIER: Orchestration + Latest Prospects ── */}
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
            <div className="badge badge-blue">Status: {state.system.status}</div>
            <div className="badge badge-neutral">
              Active Sequence: {activeCampaign ? activeCampaign.name : 'None selected'}
            </div>
            <div className="badge badge-emerald">
              Funnel: {state.analytics.funnel.leads} Sourced / {state.analytics.funnel.sent} Sent / {state.analytics.funnel.opened} Opened / {state.analytics.funnel.replied} Replied
            </div>
          </div>
        </MotionCard>

        <MotionCard className="card" delay={0.4}>
          <div className="card-header">
            <div>
              <div className="card-title">Latest Prospects</div>
              <div className="card-subtitle">Latest prospect movement across the pipeline.</div>
            </div>
          </div>
          <div className="activity-list">
            {state.leads.slice(0, 10).map((lead, i) => (
              <motion.div
                key={lead.id}
                className="activity-item"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + i * 0.04 }}
              >
                <span className={`activity-dot ${lead.status === 'Replied' ? 'replied' : lead.status === 'Opened' ? 'opened' : lead.status === 'Failed' || lead.status === 'No Email' ? 'bounced' : 'sent'}`}></span>
                <span className="activity-text">
                  <strong>{lead.name}</strong> at <strong>{lead.company}</strong> — {lead.status}
                </span>
                <span className="activity-time">{lead.stage}</span>
              </motion.div>
            ))}
            {state.leads.length === 0 && (
              <div className="empty-state-block">
                <Users size={32} className="empty-state-icon" />
                <h3>No prospects in the pipeline</h3>
                <p>Source your first batch to activate the system.</p>
                <button className="btn btn-primary btn-sm" onClick={() => actions.generateLeads()} disabled={state.system.isGeneratingLeads}>
                  Source Prospects →
                </button>
              </div>
            )}
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
