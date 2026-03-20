import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockLeads } from '../data/mockLeads';
import { mockCampaigns } from '../data/mockCampaigns';

const AppContext = createContext();

const STORAGE_KEY = 'zoka-works-state';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
}

const defaultState = {
  leads: mockLeads,
  campaigns: mockCampaigns,
  inboxes: [
    { id: 1, email: 'vishav@zokaworks.com', provider: 'Gmail', status: 'active', dailyLimit: 50, sentToday: 23, warmupDay: 14, warmupTarget: 21, reputation: 92 },
    { id: 2, email: 'outreach@zokaworks.com', provider: 'Gmail', status: 'active', dailyLimit: 40, sentToday: 18, warmupDay: 21, warmupTarget: 21, reputation: 97 },
    { id: 3, email: 'sales@zokaworks.com', provider: 'Outlook', status: 'warming', dailyLimit: 25, sentToday: 8, warmupDay: 7, warmupTarget: 21, reputation: 78 },
  ],
  settings: {
    agencyName: 'Zoka Works',
    dailySendingLimit: 100,
    warmupEnabled: true,
    warmupDays: 21,
    trackOpens: true,
    trackReplies: true,
    apolloApiKey: '',
    openaiApiKey: '',
  },
  activity: [
    { id: 1, type: 'sent', message: 'Email sent to <strong>Sarah Chen</strong> at GrowthLoop', time: '2 min ago' },
    { id: 2, type: 'opened', message: '<strong>Marcus Reid</strong> opened "Quick question about ScaleStack"', time: '5 min ago' },
    { id: 3, type: 'replied', message: '<strong>Emma Patel</strong> replied to Campaign: Agency Leaders UK', time: '12 min ago' },
    { id: 4, type: 'sent', message: 'Follow-up sent to <strong>James Walker</strong> at Outboundly', time: '18 min ago' },
    { id: 5, type: 'opened', message: '<strong>Hannah Lee</strong> opened "Helping PipelinePro scale"', time: '25 min ago' },
    { id: 6, type: 'bounced', message: 'Email to <strong>Henry Wilson</strong> bounced (invalid address)', time: '32 min ago' },
    { id: 7, type: 'replied', message: '<strong>Sophie Williams</strong> replied: "Interested, let\'s chat!"', time: '45 min ago' },
    { id: 8, type: 'sent', message: 'Email sent to <strong>Ryan Torres</strong> at CloseDeal', time: '1 hr ago' },
    { id: 9, type: 'opened', message: '<strong>Lucas Brown</strong> opened "QuickPipe + Zoka Works"', time: '1.5 hr ago' },
    { id: 10, type: 'sent', message: 'Campaign "SaaS Founders Outreach Q1" — 5 emails queued', time: '2 hr ago' },
  ],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_LEAD':
      return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? { ...l, ...action.payload } : l) };
    case 'ADD_LEAD':
      return { ...state, leads: [{ ...action.payload, id: Date.now() }, ...state.leads] };
    case 'DELETE_LEADS':
      return { ...state, leads: state.leads.filter(l => !action.payload.includes(l.id)) };
    case 'TAG_LEADS':
      return { ...state, leads: state.leads.map(l => action.payload.ids.includes(l.id) ? { ...l, tags: [...new Set([...l.tags, action.payload.tag])] } : l) };
    case 'REMOVE_DUPLICATES':
      const seen = new Set();
      return { ...state, leads: state.leads.filter(l => { if (seen.has(l.email)) return false; seen.add(l.email); return true; }) };
    case 'VALIDATE_EMAILS':
      return { ...state, leads: state.leads.map(l => ({ ...l, emailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.email) })) };
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [{ ...action.payload, id: Date.now() }, ...state.campaigns] };
    case 'UPDATE_CAMPAIGN':
      return { ...state, campaigns: state.campaigns.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case 'DUPLICATE_CAMPAIGN': {
      const orig = state.campaigns.find(c => c.id === action.payload);
      if (!orig) return state;
      const dup = { ...orig, id: Date.now(), name: `${orig.name} (Copy)`, status: 'draft', sent: 0, opened: 0, replied: 0, bounced: 0, openRate: 0, replyRate: 0, bounceRate: 0 };
      return { ...state, campaigns: [dup, ...state.campaigns] };
    }
    case 'ADD_INBOX':
      return { ...state, inboxes: [...state.inboxes, { ...action.payload, id: Date.now() }] };
    case 'REMOVE_INBOX':
      return { ...state, inboxes: state.inboxes.filter(i => i.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'ADD_ACTIVITY':
      return { ...state, activity: [{ id: Date.now(), ...action.payload }, ...state.activity].slice(0, 50) };
    case 'RESET':
      return defaultState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, loadState() || defaultState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
