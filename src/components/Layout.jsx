import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, Activity, Clock, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/campaigns': 'Campaigns',
  '/ai-engine': 'AI Engine',
  '/email-engine': 'Email Engine',
  '/analytics': 'Analytics',
  '/optimization': 'Optimization',
  '/settings': 'Settings',
};

export default function Layout() {
  const { state } = useApp();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const activeCampaign = state.campaigns.find((campaign) => campaign.id === state.system.currentCampaign);
  const lastRunLabel = state.system.lastRun ? new Date(state.system.lastRun).toLocaleString() : 'Never';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="topbar">
        <div className="topbar-left">
          <h2 className="page-title">{title}</h2>
        </div>
        <div className="topbar-right">
          <div className="search-bar">
            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Search leads, campaigns..." />
          </div>
          <div className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={12} />
            System: {state.system.status}
          </div>
          <div className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Radio size={12} />
            {activeCampaign ? activeCampaign.name : 'No active campaign'}
          </div>
          <div className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={12} />
            Last run: {lastRunLabel}
          </div>
          <button className="topbar-icon-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
        </div>
      </div>
      <main className="main-content animate-fade-in" key={location.pathname}>
        {state.isDemoMode && (
          <div style={{ marginBottom: 'var(--space-4)' }} className="badge badge-amber">
            Simulated system — demo purposes only
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
