import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, Activity, Clock, Radio, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';

const pageTitles = {
  '/dashboard': 'Mission Control',
  '/leads': 'Prospects',
  '/campaigns': 'Sequences',
  '/ai-engine': 'AI Copywriter',
  '/email-engine': 'Delivery',
  '/analytics': 'Insights',
  '/optimization': 'Signals',
  '/settings': 'System',
};

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Layout() {
  const { state } = useApp();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const title = pageTitles[location.pathname] || 'Dashboard';
  const activeCampaign = state.campaigns.find((campaign) => campaign.id === state.system.currentCampaign);
  const lastRunLabel = state.system.lastRun ? new Date(state.system.lastRun).toLocaleString() : 'Never';

  return (
    <div className="app-layout">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {mobileNavOpen && <div className="sidebar-backdrop" onClick={() => setMobileNavOpen(false)}></div>}
      <div className="topbar">
        <div className="topbar-left">
          <button className="topbar-icon-btn mobile-menu-btn" onClick={() => setMobileNavOpen((prev) => !prev)}>
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
      <main className="main-content">
        {state.isDemoMode && (
          <div style={{ marginBottom: 'var(--space-4)' }} className="badge badge-amber">
            Simulated system — demo purposes only
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            {...pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
