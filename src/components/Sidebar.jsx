import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Rocket, Sparkles, Mail, BarChart3,
  TrendingUp, Settings, Zap, ChevronRight
} from 'lucide-react';

const navSections = [
  {
    title: 'Overview',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]
  },
  {
    title: 'Outreach',
    items: [
      { path: '/leads', icon: Users, label: 'Leads' },
      { path: '/campaigns', icon: Rocket, label: 'Campaigns' },
      { path: '/ai-engine', icon: Sparkles, label: 'AI Engine' },
      { path: '/email-engine', icon: Mail, label: 'Email Engine' },
    ]
  },
  {
    title: 'Insights',
    items: [
      { path: '/analytics', icon: BarChart3, label: 'Analytics' },
      { path: '/optimization', icon: TrendingUp, label: 'Optimization' },
    ]
  },
  {
    title: 'System',
    items: [
      { path: '/settings', icon: Settings, label: 'Settings' },
    ]
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap size={20} />
        </div>
        <div className="sidebar-brand">
          <h1>Zoka Works</h1>
          <span>Cold Email Engine</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div className="nav-section" key={section.title}>
            <div className="nav-section-title">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' active' : ''}`
                }
                end={item.path === '/dashboard'}
              >
                <item.icon className="nav-icon" size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">VK</div>
          <div className="sidebar-user-info">
            <div className="name">Vishav K.</div>
            <div className="role">Admin</div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </aside>
  );
}
