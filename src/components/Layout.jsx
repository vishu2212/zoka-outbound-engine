import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/leads': 'Leads',
  '/campaigns': 'Campaigns',
  '/ai-engine': 'AI Engine',
  '/email-engine': 'Email Engine',
  '/analytics': 'Analytics',
  '/optimization': 'Optimization',
  '/settings': 'Settings',
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

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
          <button className="topbar-icon-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
        </div>
      </div>
      <main className="main-content animate-fade-in" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
}
