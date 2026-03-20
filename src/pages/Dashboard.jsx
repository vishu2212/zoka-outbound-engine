import { useApp } from '../context/AppContext';
import { Users, Rocket, Mail, MousePointerClick, MessageSquare, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsTimeSeries } from '../data/mockCampaigns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { state } = useApp();
  const { leads, campaigns, activity } = state;

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalOpened = campaigns.reduce((a, c) => a + c.opened, 0);
  const totalReplied = campaigns.reduce((a, c) => a + c.replied, 0);
  const totalBounced = campaigns.reduce((a, c) => a + c.bounced, 0);
  const avgOpenRate = totalSent ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;
  const avgReplyRate = totalSent ? ((totalReplied / totalSent) * 100).toFixed(1) : 0;
  const avgBounceRate = totalSent ? ((totalBounced / totalSent) * 100).toFixed(1) : 0;

  const metrics = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'blue', trend: '+12%', trendDir: 'up' },
    { label: 'Active Campaigns', value: activeCampaigns, icon: Rocket, color: 'purple', trend: '+2', trendDir: 'up' },
    { label: 'Emails Sent', value: totalSent.toLocaleString(), icon: Mail, color: 'cyan', trend: '+18%', trendDir: 'up' },
    { label: 'Open Rate', value: `${avgOpenRate}%`, icon: MousePointerClick, color: 'emerald', trend: '+3.2%', trendDir: 'up' },
    { label: 'Reply Rate', value: `${avgReplyRate}%`, icon: MessageSquare, color: 'amber', trend: '+1.4%', trendDir: 'up' },
    { label: 'Bounce Rate', value: `${avgBounceRate}%`, icon: AlertTriangle, color: 'rose', trend: '-0.8%', trendDir: 'down' },
  ];

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your outreach performance overview.</p>
        </div>
        <div className="page-header-right">
          <Link to="/campaigns" className="btn btn-primary">
            <Rocket size={16} /> New Campaign
          </Link>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((m) => (
          <div className="metric-card" key={m.label}>
            <div className={`metric-icon ${m.color}`}>
              <m.icon size={22} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
              <span className={`metric-trend ${m.trendDir}`}>
                {m.trendDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Performance Overview</div>
              <div className="card-subtitle">Email metrics over time</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={analyticsTimeSeries}>
                <defs>
                  <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradReplied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sent" stroke="#3b82f6" fill="url(#gradSent)" strokeWidth={2} />
                <Area type="monotone" dataKey="opened" stroke="#10b981" fill="url(#gradOpened)" strokeWidth={2} />
                <Area type="monotone" dataKey="replied" stroke="#8b5cf6" fill="url(#gradReplied)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Activity</div>
              <div className="card-subtitle">Latest email events</div>
            </div>
            <Link to="/analytics" className="btn btn-ghost btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="activity-list">
            {activity.slice(0, 8).map((item) => (
              <div className="activity-item" key={item.id}>
                <span className={`activity-dot ${item.type}`}></span>
                <span className="activity-text" dangerouslySetInnerHTML={{ __html: item.message }}></span>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Active Campaigns</div>
            <div className="card-subtitle">Currently running outreach campaigns</div>
          </div>
          <Link to="/campaigns" className="btn btn-ghost btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="data-table-wrapper" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Leads</th>
                <th>Sent</th>
                <th>Open Rate</th>
                <th>Reply Rate</th>
                <th>Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.filter(c => c.status === 'active' || c.status === 'completed').slice(0, 5).map((c) => (
                <tr key={c.id}>
                  <td className="cell-primary">{c.name}</td>
                  <td>
                    <span className={`badge ${c.status === 'active' ? 'badge-emerald' : c.status === 'completed' ? 'badge-blue' : 'badge-neutral'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.leads}</td>
                  <td>{c.sent}</td>
                  <td>{c.openRate}%</td>
                  <td>{c.replyRate}%</td>
                  <td>{c.bounceRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
