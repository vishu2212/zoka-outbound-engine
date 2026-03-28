import { NavLink } from 'react-router-dom';
import {
  House, LayoutDashboard, Users, Rocket, Sparkles, Mail, BarChart3,
  TrendingUp, Settings, Zap, ChevronRight
} from 'lucide-react';

const navSections = [
  {
    title: 'Entry',
    items: [
      { path: '/', icon: House, label: 'Command Center' },
    ]
  },
  {
    title: 'Overview',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Mission Control' },
    ]
  },
  {
    title: 'Outreach',
    items: [
      { path: '/leads', icon: Users, label: 'Prospects' },
      { path: '/campaigns', icon: Rocket, label: 'Sequences' },
      { path: '/ai-engine', icon: Sparkles, label: 'AI Copywriter' },
      { path: '/email-engine', icon: Mail, label: 'Delivery' },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { path: '/analytics', icon: BarChart3, label: 'Insights' },
      { path: '/optimization', icon: TrendingUp, label: 'Signals' },
    ]
  },
  {
    title: 'System',
    items: [
      { path: '/settings', icon: Settings, label: 'System' },
    ]
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar${isOpen ? ' mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Zap size={20} />
        </div>
        <div className="sidebar-brand">
          <h1>Zoka Works</h1>
          <span>AI Outbound Engine</span>
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
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' active' : ''}`
                }
                end={item.path === '/' || item.path === '/dashboard'}
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
