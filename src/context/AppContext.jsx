/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const AppContext = createContext(null);
const STORAGE_KEY = 'zoka-outbound-system-v3';
const MAX_LOGS = 250;

const FIRST_NAMES = ['Sarah', 'Marcus', 'Emma', 'James', 'Priya', 'Daniel', 'Olivia', 'Ethan', 'Aisha', 'Ryan', 'Hannah', 'Alex', 'Michael', 'Sophie', 'Noah', 'Chloe', 'Liam', 'Isabella', 'Benjamin', 'Mia'];
const LAST_NAMES = ['Chen', 'Reid', 'Patel', 'Walker', 'Sharma', 'Brooks', 'Nguyen', 'Miller', 'Khan', 'Torres', 'Lee', 'Dubois', 'Grant', 'Williams', 'Anderson', 'Martin', "O'Brien", 'Rossi', 'Clark', 'Thompson'];
const COMPANY_PREFIX = ['Growth', 'Scale', 'Pipeline', 'Outbound', 'Lead', 'Revenue', 'Demand', 'Prospect', 'Client', 'Funnel', 'Close', 'Signal'];
const COMPANY_SUFFIX = ['Loop', 'Stack', 'HQ', 'Forge', 'Labs', 'Cloud', 'Bridge', 'Flow', 'Pilot', 'Works', 'Engine', 'Ops'];
const INDUSTRIES = ['B2B SaaS', 'Agency', 'Fintech', 'Martech', 'DevTools'];
const TITLES = ['Founder', 'CEO', 'Head of Growth', 'VP Sales', 'Growth Lead', 'RevOps Manager'];

const DEFAULT_SEQUENCE = [
  { day: 1, label: 'Day 1 Intro' },
  { day: 3, label: 'Day 3 Follow-up' },
  { day: 7, label: 'Day 7 Reminder' },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(list) {
  return list[randomInt(0, list.length - 1)];
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function nowIso() {
  return new Date().toISOString();
}

function nowClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function pushLog(logs, message) {
  return [`[${nowClock()}] ${message}`, ...logs].slice(0, MAX_LOGS);
}

function buildMessageVariations(lead) {
  const firstName = lead.name.split(' ')[0];
  return [
    `Hi ${firstName}, noticed ${lead.company} is scaling in ${lead.industry}. We help teams like yours build outbound systems that produce qualified replies every week.`,
    `${firstName}, saw what ${lead.company} is doing in ${lead.industry}. Worth sharing a playbook that consistently converts cold outbound into warm pipeline.`,
    `Quick one for ${lead.company}: we've helped similar ${lead.industry} teams improve reply quality by tightening targeting and sequence timing. Open to a short chat?`,
  ];
}

function buildLead(id) {
  const firstName = randomPick(FIRST_NAMES);
  const lastName = randomPick(LAST_NAMES);
  const company = `${randomPick(COMPANY_PREFIX)}${randomPick(COMPANY_SUFFIX)}`;
  const domain = company.toLowerCase();
  const hasEmail = Math.random() > 0.18;

  return {
    id,
    name: `${firstName} ${lastName}`,
    company,
    email: hasEmail ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}.io` : '',
    title: randomPick(TITLES),
    industry: randomPick(INDUSTRIES),
    status: hasEmail ? 'New' : 'No Email',
    stage: hasEmail ? 'generated' : 'missing-email',
    score: randomInt(45, 98),
    campaignId: null,
    createdAt: nowIso(),
  };
}

function computeAnalytics(nextState) {
  const totalLeads = nextState.leads.length;
  const sent = nextState.emails.filter((item) => item.status === 'sent' || item.status === 'opened' || item.status === 'replied').length;
  const opened = nextState.emails.filter((item) => item.status === 'opened' || item.status === 'replied').length;
  const replied = nextState.emails.filter((item) => item.status === 'replied').length;

  const openRate = sent > 0 ? Number(((opened / sent) * 100).toFixed(1)) : 0;
  const replyRate = sent > 0 ? Number(((replied / sent) * 100).toFixed(1)) : 0;

  return {
    totalLeads,
    sent,
    opened,
    emailsSent: sent,
    openRate,
    replies: replied,
    replyRate,
    funnel: {
      leads: totalLeads,
      sent,
      opened,
      replied,
    },
  };
}

function buildDemoLeads() {
  const demoProfiles = [
    { name: 'Sarah Chen', company: 'CloudScale Inc', title: 'VP Sales', industry: 'B2B SaaS', status: 'Replied', stage: 'replied' },
    { name: 'Marcus Reid', company: 'PipelineForge', title: 'CEO', industry: 'Agency', status: 'Replied', stage: 'replied' },
    { name: 'Emma Patel', company: 'GrowthStack', title: 'Head of Growth', industry: 'Martech', status: 'Replied', stage: 'replied' },
    { name: 'James Walker', company: 'RevenueHQ', title: 'Founder', industry: 'B2B SaaS', status: 'Replied', stage: 'replied' },
    { name: 'Priya Sharma', company: 'DemandFlow', title: 'Growth Lead', industry: 'B2B SaaS', status: 'Replied', stage: 'replied' },
    { name: 'Daniel Brooks', company: 'ScaleBridge', title: 'CEO', industry: 'Agency', status: 'Replied', stage: 'replied' },
    { name: 'Olivia Nguyen', company: 'FunnelPilot', title: 'VP Sales', industry: 'Martech', status: 'Replied', stage: 'replied' },
    { name: 'Ethan Miller', company: 'OutboundOps', title: 'RevOps Manager', industry: 'DevTools', status: 'Replied', stage: 'replied' },
    { name: 'David Chen', company: 'FinixAnalytics', title: 'CTO', industry: 'Fintech', status: 'Opened', stage: 'opened' },
    { name: 'Elena Rostova', company: 'LogisTech', title: 'VP Engineering', industry: 'B2B SaaS', status: 'Opened', stage: 'opened' },
    { name: 'Ryan Torres', company: 'SignalEngine', title: 'Founder', industry: 'DevTools', status: 'Opened', stage: 'opened' },
    { name: 'Hannah Lee', company: 'ProspectLabs', title: 'Head of Growth', industry: 'Martech', status: 'Opened', stage: 'opened' },
    { name: 'Alex Dubois', company: 'CloseWorks', title: 'CEO', industry: 'Agency', status: 'Opened', stage: 'opened' },
    { name: 'Michael Grant', company: 'LeadCloud', title: 'Growth Lead', industry: 'B2B SaaS', status: 'Opened', stage: 'opened' },
    { name: 'Sophie Williams', company: 'ClientForge', title: 'VP Sales', industry: 'Fintech', status: 'Opened', stage: 'opened' },
    { name: 'Noah Anderson', company: 'ScaleOps', title: 'Founder', industry: 'DevTools', status: 'Opened', stage: 'opened' },
    { name: 'Chloe Martin', company: 'GrowthLoop', title: 'Head of Growth', industry: 'Martech', status: 'Opened', stage: 'opened' },
    { name: 'Liam Clark', company: 'RevenuePilot', title: 'CEO', industry: 'B2B SaaS', status: 'Opened', stage: 'opened' },
    { name: 'Isabella Rossi', company: 'DemandBridge', title: 'VP Sales', industry: 'Agency', status: 'Opened', stage: 'opened' },
    { name: 'Benjamin Khan', company: 'FunnelStack', title: 'Founder', industry: 'Fintech', status: 'Opened', stage: 'opened' },
    { name: 'Mia Thompson', company: 'OutboundLabs', title: 'Growth Lead', industry: 'B2B SaaS', status: 'Opened', stage: 'opened' },
    { name: 'Aisha Brooks', company: 'PipelineOps', title: 'RevOps Manager', industry: 'DevTools', status: 'Opened', stage: 'opened' },
  ];

  const sentProfiles = [
    { name: 'Jason Park', company: 'ScaleForge', title: 'CEO', industry: 'B2B SaaS', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Rachel Kim', company: 'GrowthEngine', title: 'VP Sales', industry: 'Agency', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Thomas Rivera', company: 'LeadBridge', title: 'Founder', industry: 'Martech', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Natalie Webb', company: 'ClientStack', title: 'Head of Growth', industry: 'B2B SaaS', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Chris Davis', company: 'FunnelForge', title: 'CEO', industry: 'Fintech', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Jessica Liu', company: 'RevenueFlow', title: 'Growth Lead', industry: 'DevTools', status: 'Sent', stage: 'day-3-sent' },
    { name: 'Andrew Scott', company: 'DemandHQ', title: 'VP Sales', industry: 'B2B SaaS', status: 'Sent', stage: 'day-3-sent' },
    { name: 'Lauren Chang', company: 'ProspectOps', title: 'Founder', industry: 'Agency', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Kevin Patel', company: 'ScalePilot', title: 'RevOps Manager', industry: 'Martech', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Amy Foster', company: 'OutboundHQ', title: 'CEO', industry: 'B2B SaaS', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Matt Collins', company: 'SignalFlow', title: 'Head of Growth', industry: 'DevTools', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Sarah Jensen', company: 'CloseCloud', title: 'VP Sales', industry: 'Fintech', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Brandon Lee', company: 'LeadStack', title: 'Founder', industry: 'B2B SaaS', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Michelle Tran', company: 'ClientOps', title: 'Growth Lead', industry: 'Agency', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Derek Hoffman', company: 'GrowthPilot', title: 'CEO', industry: 'Martech', status: 'Sent', stage: 'day-1-sent' },
    { name: 'Nicole Adams', company: 'PipelineWorks', title: 'VP Sales', industry: 'B2B SaaS', status: 'Sent', stage: 'day-1-sent' },
  ];

  const newProfiles = [
    { name: 'Victor Hayes', company: 'FunnelOps', title: 'Founder', industry: 'DevTools', status: 'Assigned', stage: 'assigned' },
    { name: 'Diana Cruz', company: 'ScaleEngine', title: 'Head of Growth', industry: 'B2B SaaS', status: 'Assigned', stage: 'assigned' },
    { name: 'Robert Yang', company: 'DemandForge', title: 'CEO', industry: 'Fintech', status: 'Assigned', stage: 'assigned' },
    { name: 'Samantha Reeves', company: 'RevenueStack', title: 'VP Sales', industry: 'Agency', status: 'New', stage: 'generated' },
    { name: 'Tyler Nash', company: 'ProspectFlow', title: 'Growth Lead', industry: 'B2B SaaS', status: 'New', stage: 'generated' },
    { name: 'Kayla Bennett', company: 'OutboundForge', title: 'RevOps Manager', industry: 'Martech', status: 'New', stage: 'generated' },
    { name: 'Owen Murphy', company: 'SignalWorks', title: 'Founder', industry: 'DevTools', status: 'New', stage: 'generated' },
    { name: 'Zoe Carter', company: 'LeadForge', title: 'CEO', industry: 'B2B SaaS', status: 'New', stage: 'generated' },
    { name: 'Justin Brooks', company: 'ClientBridge', title: 'VP Sales', industry: 'Agency', status: 'New', stage: 'generated' },
  ];

  const allProfiles = [...demoProfiles, ...sentProfiles, ...newProfiles];
  const createdAt = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  return allProfiles.map((profile, i) => {
    const domain = profile.company.toLowerCase().replace(/\s+/g, '');
    const firstName = profile.name.split(' ')[0].toLowerCase();
    const lastName = profile.name.split(' ')[1].toLowerCase();
    return {
      id: i + 1,
      name: profile.name,
      company: profile.company,
      email: `${firstName}.${lastName}@${domain}.io`,
      title: profile.title,
      industry: profile.industry,
      status: profile.status,
      stage: profile.stage,
      score: randomInt(68, 97),
      campaignId: profile.stage === 'generated' ? null : (i < 30 ? 1 : 2),
      createdAt,
    };
  });
}

function buildDemoEmails(leads) {
  const emails = [];
  let emailId = 1;
  const baseTime = Date.now() - 90 * 60 * 1000;

  leads.forEach((lead) => {
    if (lead.stage === 'generated' || lead.stage === 'assigned') return;

    const status =
      lead.stage === 'replied' ? 'replied' :
      lead.stage === 'opened' ? 'opened' : 'sent';

    emails.push({
      id: emailId++,
      leadId: lead.id,
      campaignId: lead.campaignId || 1,
      stepDay: 1,
      sequenceLabel: 'Day 1 Intro',
      status,
      deliveryStatus: status === 'replied' ? 'Replied' : status === 'opened' ? 'Opened' : 'Sent',
      openedAt: status !== 'sent' ? new Date(baseTime + emailId * 60000).toISOString() : null,
      replied: status === 'replied',
      attempts: 1,
      updatedAt: new Date(baseTime + emailId * 60000).toISOString(),
    });
  });

  return emails;
}

function defaultState() {
  const leads = buildDemoLeads();
  const emails = buildDemoEmails(leads);

  const assignedLeadIds1 = leads.filter((l) => l.campaignId === 1).map((l) => l.id);
  const assignedLeadIds2 = leads.filter((l) => l.campaignId === 2).map((l) => l.id);

  const sent1 = emails.filter((e) => e.campaignId === 1 && (e.status === 'sent' || e.status === 'opened' || e.status === 'replied')).length;
  const opened1 = emails.filter((e) => e.campaignId === 1 && (e.status === 'opened' || e.status === 'replied')).length;
  const replied1 = emails.filter((e) => e.campaignId === 1 && e.status === 'replied').length;

  const sent2 = emails.filter((e) => e.campaignId === 2 && (e.status === 'sent' || e.status === 'opened' || e.status === 'replied')).length;
  const opened2 = emails.filter((e) => e.campaignId === 2 && (e.status === 'opened' || e.status === 'replied')).length;
  const replied2 = emails.filter((e) => e.campaignId === 2 && e.status === 'replied').length;

  const now = new Date();
  const logTime = (minsAgo) => {
    const d = new Date(now.getTime() - minsAgo * 60000);
    return `[${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}]`;
  };

  const state = {
    isDemoMode: true,
    leads,
    campaigns: [
      {
        id: 1,
        name: 'SaaS Founders Sprint',
        status: 'active',
        leadIds: assignedLeadIds1,
        sentCount: sent1,
        openCount: opened1,
        replyCount: replied1,
        failedCount: 0,
        sequence: DEFAULT_SEQUENCE,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        name: 'Agency Growth Outreach',
        status: 'active',
        leadIds: assignedLeadIds2,
        sentCount: sent2,
        openCount: opened2,
        replyCount: replied2,
        failedCount: 0,
        sequence: DEFAULT_SEQUENCE,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    messages: leads.filter((l) => l.stage !== 'generated').map((l) => buildMessageRecord(l)),
    emails,
    logs: [
      `${logTime(1)} Reply received from Olivia Nguyen`,
      `${logTime(2)} Open detected from Isabella Rossi`,
      `${logTime(3)} Email sent to Derek Hoffman (Day 1 Intro)`,
      `${logTime(4)} AI messages generated for SaaS Founders Sprint`,
      `${logTime(6)} Batch 3/3 delivered — 16 messages sent`,
      `${logTime(8)} Open detected from Hannah Lee`,
      `${logTime(10)} Reply received from Emma Patel — positive intent`,
      `${logTime(12)} Batch 2/3 delivered — 14 messages sent`,
      `${logTime(15)} AI Signal: Open rate 58% — above baseline`,
      `${logTime(18)} Enriched 43 contacts — 91% email match rate`,
      `${logTime(22)} Sourced 47 prospects from LinkedIn SaaS Founders`,
      `${logTime(25)} System ready — demo environment loaded`,
    ],
    analytics: {
      totalLeads: 0,
      emailsSent: 0,
      openRate: 0,
      replies: 0,
      replyRate: 0,
      funnel: { leads: 0, sent: 0, opened: 0, replied: 0 },
    },
    system: {
      status: 'active',
      lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      currentCampaign: 1,
      isPaused: false,
      isGeneratingLeads: false,
      isGeneratingMessages: false,
      isSendingEmails: false,
    },
    settings: {
      agencyName: 'Zoka Works',
      dailySendingLimit: 150,
      warmupEnabled: true,
      warmupDays: 21,
      trackOpens: true,
      trackReplies: true,
      emailProvider: 'Mock SMTP',
      smtpHost: 'smtp.demo.zoka.local',
      smtpPort: 587,
      rateLimitPerMinute: 25,
      preferredSendWindow: '09:00-11:00',
      subjectGuidanceEnabled: false,
      minPersonalizationScore: 70,
      apolloApiKey: '',
      openaiApiKey: '',
    },
  };

  state.analytics = computeAnalytics(state);
  return state;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const merged = {
      ...defaultState(),
      ...parsed,
      system: { ...defaultState().system, ...(parsed.system || {}) },
      settings: { ...defaultState().settings, ...(parsed.settings || {}) },
      analytics: { ...defaultState().analytics, ...(parsed.analytics || {}) },
    };
    merged.analytics = computeAnalytics(merged);
    return merged;
  } catch {
    return defaultState();
  }
}

function buildMessageRecord(lead) {
  const scoreBase = lead.email ? randomInt(72, 96) : randomInt(45, 65);
  return {
    leadId: lead.id,
    variations: buildMessageVariations(lead).slice(0, randomInt(2, 3)),
    personalizationScore: scoreBase,
    reasoning: [
      `Matched role "${lead.title}" with outbound pain points in ${lead.industry}.`,
      lead.email ? 'Lead has a valid email, so direct CTA language was prioritized.' : 'Lead is missing verified email, so softer language was generated for fallback channels.',
      `Lead quality score ${lead.score}/100 influenced confidence and directness.`,
    ],
    generatedAt: nowIso(),
  };
}

export function AppProvider({ children }) {
  const [state, rawSetState] = useState(loadState);
  const stateRef = useRef(state);
  const isMountedRef = useRef(true);
  const nextIdsRef = useRef({ lead: 1, campaign: 1, email: 1 });

  const setState = (updater) => {
    rawSetState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!next || next === prev) return prev;
      const computed = computeAnalytics(next);
      if (
        next.analytics?.totalLeads === computed.totalLeads &&
        next.analytics?.emailsSent === computed.emailsSent &&
        next.analytics?.openRate === computed.openRate &&
        next.analytics?.replies === computed.replies &&
        next.analytics?.replyRate === computed.replyRate &&
        next.analytics?.funnel?.leads === computed.funnel.leads &&
        next.analytics?.funnel?.sent === computed.funnel.sent &&
        next.analytics?.funnel?.opened === computed.funnel.opened &&
        next.analytics?.funnel?.replied === computed.funnel.replied
      ) {
        return next;
      }
      return { ...next, analytics: computed };
    });
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const maxLeadId = state.leads.reduce((max, lead) => Math.max(max, lead.id), 0);
    const maxCampaignId = state.campaigns.reduce((max, campaign) => Math.max(max, campaign.id), 0);
    const maxEmailId = state.emails.reduce((max, email) => Math.max(max, email.id || 0), 0);
    nextIdsRef.current = {
      lead: maxLeadId + 1,
      campaign: maxCampaignId + 1,
      email: maxEmailId + 1,
    };
  }, [state.leads, state.campaigns, state.emails]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write issues in demo mode.
    }
  }, [state]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function nextId(type) {
    const current = nextIdsRef.current[type];
    nextIdsRef.current[type] += 1;
    return current;
  }

  function updateAnalytics() {
    setState((prev) => ({ ...prev, analytics: computeAnalytics(prev) }));
  }

  async function generateLeads(targetCount) {
    const count = targetCount || randomInt(20, 50);
    setState((prev) => ({
      ...prev,
      system: { ...prev.system, status: 'running', isGeneratingLeads: true },
      logs: pushLog(prev.logs, `Lead generation started (${count})`),
    }));

    const createdLeads = Array.from({ length: count }, () => buildLead(nextId('lead')));
    const chunkSize = 5;

    for (let index = 0; index < createdLeads.length; index += chunkSize) {
      if (!isMountedRef.current) return;
      await sleep(randomInt(180, 380));
      const chunk = createdLeads.slice(index, index + chunkSize);
      const processed = Math.min(index + chunk.length, count);
      const shouldLog = processed === count || processed % 10 === 0;

      setState((prev) => ({
        ...prev,
        leads: [...prev.leads, ...chunk],
        logs: shouldLog ? pushLog(prev.logs, `Leads generated so far: ${processed}/${count}`) : prev.logs,
      }));
    }

    setState((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        status: 'active',
        isGeneratingLeads: false,
        lastRun: nowIso(),
      },
      logs: pushLog(prev.logs, `Leads generated (${count})`),
    }));
  }

  function createCampaign(name) {
    const campaignId = nextId('campaign');
    const campaignName = name?.trim() || `Campaign ${campaignId}`;
    const campaign = {
      id: campaignId,
      name: campaignName,
      status: 'draft',
      leadIds: [],
      sentCount: 0,
      openCount: 0,
      replyCount: 0,
      failedCount: 0,
      sequence: DEFAULT_SEQUENCE,
      createdAt: nowIso(),
    };

    setState((prev) => ({
      ...prev,
      campaigns: [campaign, ...prev.campaigns],
      logs: pushLog(prev.logs, `Campaign created: ${campaign.name}`),
    }));

    return campaignId;
  }

  function assignToCampaign(leadIds, campaignId) {
    if (!leadIds.length) return;
    const leadSet = new Set(leadIds);

    setState((prev) => {
      const campaign = prev.campaigns.find((item) => item.id === campaignId);
      if (!campaign) return prev;

      const campaigns = prev.campaigns.map((item) => {
        if (item.id === campaignId) {
          const mergedLeadIds = Array.from(new Set([...item.leadIds, ...leadIds]));
          return { ...item, leadIds: mergedLeadIds };
        }
        return { ...item, leadIds: item.leadIds.filter((id) => !leadSet.has(id)) };
      });

      const leads = prev.leads.map((lead) => {
        if (!leadSet.has(lead.id)) return lead;
        return {
          ...lead,
          campaignId,
          stage: lead.email ? 'assigned' : 'missing-email',
          status: lead.email ? 'Assigned' : 'No Email',
        };
      });

      return {
        ...prev,
        campaigns,
        leads,
        system: { ...prev.system, currentCampaign: campaignId, status: 'active' },
        logs: pushLog(prev.logs, `Assigned ${leadIds.length} leads to campaign "${campaign.name}"`),
      };
    });
  }

  async function generateMessages(leadId) {
    setState((prev) => ({
      ...prev,
      system: { ...prev.system, status: 'running', isGeneratingMessages: true },
    }));

    await sleep(randomInt(400, 900));
    const lead = stateRef.current.leads.find((item) => item.id === leadId);
    if (!lead) {
      setState((prev) => ({
        ...prev,
        system: { ...prev.system, isGeneratingMessages: false, status: 'active' },
      }));
      return null;
    }

    const record = buildMessageRecord(lead);

    setState((prev) => ({
      ...prev,
      messages: prev.messages.some((item) => item.leadId === leadId)
        ? prev.messages.map((item) => (item.leadId === leadId ? record : item))
        : [record, ...prev.messages],
      leads: prev.leads.map((item) =>
        item.id === leadId
          ? { ...item, stage: 'messaged', status: item.email ? 'Messaged' : 'No Email' }
          : item
      ),
      system: {
        ...prev.system,
        isGeneratingMessages: false,
        status: 'active',
        lastRun: nowIso(),
      },
      logs: pushLog(prev.logs, `Messages generated for ${lead.name}`),
    }));

    return record;
  }

  async function sendEmails(campaignId) {
    const snapshot = stateRef.current;
    const campaign = snapshot.campaigns.find((item) => item.id === campaignId);
    if (!campaign) return;

    if (snapshot.system.isSendingEmails) return;

    setState((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        status: 'running',
        currentCampaign: campaignId,
        isPaused: false,
        isSendingEmails: true,
      },
      campaigns: prev.campaigns.map((item) =>
        item.id === campaignId ? { ...item, status: 'active' } : item
      ),
      logs: pushLog(prev.logs, `Email sequence started for "${campaign.name}"`),
    }));

    const localLeadIds = [...campaign.leadIds];

    for (const leadId of localLeadIds) {
      if (!isMountedRef.current) return;
      const liveState = stateRef.current;
      if (liveState.system.isPaused || !liveState.system.isSendingEmails) {
        break;
      }

      const lead = liveState.leads.find((item) => item.id === leadId);
      if (!lead) continue;

      if (!lead.email) {
        setState((prev) => ({
          ...prev,
          leads: prev.leads.map((item) =>
            item.id === leadId ? { ...item, status: 'No Email', stage: 'missing-email' } : item
          ),
          campaigns: prev.campaigns.map((item) =>
            item.id === campaignId ? { ...item, failedCount: item.failedCount + 1 } : item
          ),
          emails: [
            {
              id: nextId('email'),
              leadId,
              campaignId,
              stepDay: 1,
              sequenceLabel: 'Day 1 Intro',
              status: 'failed',
              deliveryStatus: 'No Email',
              openedAt: null,
              replied: false,
              attempts: 0,
              updatedAt: nowIso(),
            },
            ...prev.emails,
          ],
          logs: pushLog(prev.logs, `Skipped ${lead.name}: missing email`),
        }));
        continue;
      }

      if (!liveState.messages.some((item) => item.leadId === leadId)) {
        await generateMessages(leadId);
      }

      let leadReplied = false;

      for (const step of DEFAULT_SEQUENCE) {
        if (!isMountedRef.current) return;
        const current = stateRef.current;
        if (current.system.isPaused || !current.system.isSendingEmails || leadReplied) break;

        const emailId = nextId('email');
        setState((prev) => ({
          ...prev,
          emails: [
            {
              id: emailId,
              leadId,
              campaignId,
              stepDay: step.day,
              sequenceLabel: step.label,
              status: 'pending',
              deliveryStatus: 'Pending',
              openedAt: null,
              replied: false,
              attempts: 0,
              updatedAt: nowIso(),
            },
            ...prev.emails,
          ],
        }));

        await sleep(randomInt(220, 520));

        let sendSucceeded = Math.random() > 0.12;
        let attempts = 1;

        if (!sendSucceeded) {
          setState((prev) => ({
            ...prev,
            leads: prev.leads.map((item) =>
              item.id === leadId ? { ...item, status: 'Retrying', stage: 'retrying' } : item
            ),
            emails: prev.emails.map((item) =>
              item.id === emailId
                ? { ...item, status: 'pending', deliveryStatus: 'Retrying', attempts, updatedAt: nowIso() }
                : item
            ),
            logs: pushLog(prev.logs, `Send failed for ${lead.name} (${step.label}), retrying`),
          }));

          await sleep(randomInt(180, 380));
          attempts += 1;
          sendSucceeded = Math.random() > 0.35;
        }

        if (!sendSucceeded) {
          setState((prev) => ({
            ...prev,
            leads: prev.leads.map((item) =>
              item.id === leadId ? { ...item, status: 'Failed', stage: 'send-failed' } : item
            ),
            campaigns: prev.campaigns.map((item) =>
              item.id === campaignId ? { ...item, failedCount: item.failedCount + 1 } : item
            ),
            emails: prev.emails.map((item) =>
              item.id === emailId
                ? { ...item, status: 'failed', deliveryStatus: 'Failed', attempts, updatedAt: nowIso() }
                : item
            ),
            logs: pushLog(prev.logs, `Send failed permanently for ${lead.name}`),
          }));
          break;
        }

        setState((prev) => ({
          ...prev,
          leads: prev.leads.map((item) =>
            item.id === leadId ? { ...item, status: 'Sent', stage: `day-${step.day}-sent` } : item
          ),
          campaigns: prev.campaigns.map((item) =>
            item.id === campaignId ? { ...item, sentCount: item.sentCount + 1 } : item
          ),
          emails: prev.emails.map((item) =>
            item.id === emailId
              ? { ...item, status: 'sent', deliveryStatus: 'Sent', attempts, updatedAt: nowIso() }
              : item
          ),
          logs: pushLog(prev.logs, `Email sent to ${lead.name} (${step.label})`),
        }));

        await sleep(randomInt(100, 250));
        const opened = Math.random() < 0.58;
        if (opened) {
          const replied = Math.random() < 0.21;
          setState((prev) => ({
            ...prev,
            leads: prev.leads.map((item) =>
              item.id === leadId
                ? {
                    ...item,
                    status: replied ? 'Replied' : 'Opened',
                    stage: replied ? 'replied' : 'opened',
                  }
                : item
            ),
            campaigns: prev.campaigns.map((item) =>
              item.id === campaignId
                ? {
                    ...item,
                    openCount: item.openCount + 1,
                    replyCount: replied ? item.replyCount + 1 : item.replyCount,
                  }
                : item
            ),
            emails: prev.emails.map((item) =>
              item.id === emailId
                ? {
                    ...item,
                    status: replied ? 'replied' : 'opened',
                    deliveryStatus: replied ? 'Replied' : 'Opened',
                    openedAt: nowIso(),
                    replied,
                    updatedAt: nowIso(),
                  }
                : item
            ),
            logs: pushLog(
              prev.logs,
              replied ? `Reply received from ${lead.name}` : `Open detected from ${lead.name}`
            ),
          }));
          if (replied) {
            leadReplied = true;
          }
        }
      }
    }

    setState((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        status: 'active',
        isSendingEmails: false,
        isPaused: false,
        lastRun: nowIso(),
      },
      campaigns: prev.campaigns.map((item) =>
        item.id === campaignId
          ? {
              ...item,
              status: item.replyCount > 0 || item.sentCount > 0 ? 'active' : item.status,
            }
          : item
      ),
      logs: pushLog(prev.logs, `Email engine completed for "${campaign.name}"`),
    }));
  }

  async function runCampaign(campaignId) {
    const campaign = stateRef.current.campaigns.find((item) => item.id === campaignId);
    if (!campaign) return;
    if (!campaign.leadIds.length) {
      setState((prev) => ({
        ...prev,
        logs: pushLog(prev.logs, `Campaign "${campaign.name}" has no assigned leads`),
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        status: 'running',
        currentCampaign: campaignId,
        isPaused: false,
      },
      campaigns: prev.campaigns.map((item) =>
        item.id === campaignId ? { ...item, status: 'active' } : item
      ),
      logs: pushLog(prev.logs, `Campaign run started: "${campaign.name}"`),
    }));

    const missingMessages = campaign.leadIds.filter(
      (leadId) => !stateRef.current.messages.some((item) => item.leadId === leadId)
    );

    if (missingMessages.length) {
      setState((prev) => ({
        ...prev,
        system: { ...prev.system, isGeneratingMessages: true },
      }));

      for (const leadId of missingMessages) {
        if (!isMountedRef.current) return;
        if (stateRef.current.system.isPaused) break;
        await generateMessages(leadId);
        await sleep(120);
      }

      setState((prev) => ({
        ...prev,
        system: { ...prev.system, isGeneratingMessages: false, status: 'running' },
        logs: pushLog(prev.logs, `AI messages generated for campaign "${campaign.name}"`),
      }));
    }

    await sendEmails(campaignId);
  }

  function pauseCampaign(campaignId) {
    const campaign = stateRef.current.campaigns.find((item) => item.id === campaignId);
    if (!campaign) return;
    setState((prev) => ({
      ...prev,
      system: { ...prev.system, isPaused: true, isSendingEmails: false, status: 'active' },
      campaigns: prev.campaigns.map((item) =>
        item.id === campaignId ? { ...item, status: 'paused' } : item
      ),
      logs: pushLog(prev.logs, `Campaign paused: "${campaign.name}"`),
    }));
  }

  async function retryFailedEmails(campaignId) {
    const failed = stateRef.current.emails.filter(
      (item) => item.campaignId === campaignId && item.status === 'failed'
    );
    if (!failed.length) {
      setState((prev) => ({
        ...prev,
        logs: pushLog(prev.logs, 'No failed emails to retry'),
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      system: { ...prev.system, status: 'running', isSendingEmails: true, isPaused: false },
      logs: pushLog(prev.logs, `Retrying ${failed.length} failed email(s)`),
    }));

    for (const email of failed) {
      if (!isMountedRef.current) return;
      await sleep(randomInt(150, 300));
      const success = Math.random() > 0.25;

      setState((prev) => ({
        ...prev,
        emails: prev.emails.map((item) =>
          item.id === email.id
            ? {
                ...item,
                status: success ? 'sent' : 'failed',
                deliveryStatus: success ? 'Sent' : 'Failed',
                openedAt: success ? item.openedAt : null,
                replied: success ? item.replied : false,
                attempts: (item.attempts || 1) + 1,
                updatedAt: nowIso(),
              }
            : item
        ),
        campaigns: prev.campaigns.map((item) =>
          item.id === email.campaignId
            ? {
                ...item,
                sentCount: success ? item.sentCount + 1 : item.sentCount,
              }
            : item
        ),
        logs: pushLog(
          prev.logs,
          success ? `Retry succeeded for lead #${email.leadId}` : `Retry failed for lead #${email.leadId}`
        ),
      }));
    }

    setState((prev) => ({
      ...prev,
      system: { ...prev.system, status: 'active', isSendingEmails: false, lastRun: nowIso() },
    }));
  }

  function updateSettings(payload) {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...payload },
      logs: pushLog(prev.logs, 'Settings updated'),
    }));
  }

  function applySuggestion(suggestionId) {
    setState((prev) => {
      const nextSettings = { ...prev.settings };
      if (suggestionId === 'subject') {
        nextSettings.subjectGuidanceEnabled = true;
      }
      if (suggestionId === 'personalization') {
        nextSettings.minPersonalizationScore = 80;
      }
      if (suggestionId === 'timing') {
        nextSettings.preferredSendWindow = '09:00-11:00';
      }

      return {
        ...prev,
        settings: nextSettings,
        logs: pushLog(prev.logs, `Optimization applied: ${suggestionId}`),
      };
    });
  }

  function resetSystem() {
    setState(defaultState());
  }

  const value = {
    state,
    actions: {
      generateLeads,
      createCampaign,
      assignToCampaign,
      generateMessages,
      runCampaign,
      sendEmails,
      pauseCampaign,
      retryFailedEmails,
      applySuggestion,
      updateAnalytics,
      updateSettings,
      resetSystem,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
