import { useApp } from '../context/AppContext';
import { TrendingUp, Sparkles, ArrowUp, ArrowDown, Lightbulb, BarChart3, Target, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const aiSuggestions = [
  {
    id: 1,
    type: 'subject',
    title: 'Subject Line Optimization',
    current: 'Quick question about {{company}}',
    suggested: '{{firstName}}, I noticed something about {{company}}',
    reason: 'Personalized subject lines with the recipient\'s name see 26% higher open rates. Adding curiosity ("I noticed something") increases engagement.',
    impact: '+12% predicted open rate',
    confidence: 'High',
  },
  {
    id: 2,
    type: 'body',
    title: 'Email Body Optimization',
    current: 'We help companies like yours generate 30-50 qualified meetings per month...',
    suggested: 'We recently helped a company in the {{industry}} space book 42 meetings in 30 days. Here\'s how...',
    reason: 'Specific numbers and social proof outperform generic claims. Mentioning industry makes it feel more relevant.',
    impact: '+8% predicted reply rate',
    confidence: 'Medium',
  },
  {
    id: 3,
    type: 'timing',
    title: 'Send Time Optimization',
    current: 'Sending at 10:00 AM EST',
    suggested: 'Send between 9:00-9:30 AM recipient\'s local time',
    reason: 'Analysis shows 9 AM sends have 18% higher open rates on Tuesday and Thursday versus other times.',
    impact: '+5% predicted open rate',
    confidence: 'High',
  },
  {
    id: 4,
    type: 'sequence',
    title: 'Follow-up Timing',
    current: 'Follow-up after 3 days',
    suggested: 'Follow-up after 2 days for Step 2, 4 days for Step 3',
    reason: 'Shorter delays between Step 1 and 2 capture leads while your initial email is still fresh. Longer delays for Step 3 avoid appearing pushy.',
    impact: '+6% predicted reply rate',
    confidence: 'Medium',
  },
];

export default function Optimization() {
  const { state } = useApp();
  const { campaigns } = state;

  const activeCampaigns = campaigns.filter(c => c.sent > 0);
  const bestCampaign = [...activeCampaigns].sort((a, b) => b.replyRate - a.replyRate)[0];
  const worstCampaign = [...activeCampaigns].sort((a, b) => a.replyRate - b.replyRate)[0];

  const comparisonData = activeCampaigns.map(c => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + '...' : c.name,
    openRate: c.openRate,
    replyRate: c.replyRate,
  }));

  // A/B Test results
  const abCampaigns = campaigns.filter(c => c.abTest?.enabled && Object.keys(c.abTest.variants).length > 0);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Optimization</h1>
          <p>AI-powered insights to improve your outreach performance</p>
        </div>
      </div>

      {/* Best vs Worst Comparison */}
      {bestCampaign && worstCampaign && bestCampaign.id !== worstCampaign.id && (
        <div className="grid-2 mb-6">
          <div className="comparison-card">
            <div className="comparison-header" style={{ background: 'var(--accent-emerald-soft)' }}>
              <div className="flex-row gap-2">
                <ArrowUp size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>Best Performing</span>
              </div>
              <span className="badge badge-emerald">🏆 Winner</span>
            </div>
            <div className="comparison-body">
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)' }}>{bestCampaign.name}</h4>
              <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--accent-emerald)' }}>{bestCampaign.openRate}%</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Open Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--accent-purple)' }}>{bestCampaign.replyRate}%</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Reply Rate</div>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
                {bestCampaign.sent} sent · {bestCampaign.replied} replies · {bestCampaign.sequence.length} steps
              </div>
            </div>
          </div>

          <div className="comparison-card">
            <div className="comparison-header" style={{ background: 'var(--accent-rose-soft)' }}>
              <div className="flex-row gap-2">
                <ArrowDown size={16} style={{ color: 'var(--accent-rose)' }} />
                <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>Needs Improvement</span>
              </div>
              <span className="badge badge-rose">Optimize</span>
            </div>
            <div className="comparison-body">
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)' }}>{worstCampaign.name}</h4>
              <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--accent-rose)' }}>{worstCampaign.openRate}%</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Open Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--accent-rose)' }}>{worstCampaign.replyRate}%</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Reply Rate</div>
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
                {worstCampaign.sent} sent · {worstCampaign.replied} replies · {worstCampaign.sequence.length} steps
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Comparison Chart */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <div className="card-title">Campaign Comparison</div>
            <div className="card-subtitle">Open rate vs reply rate by campaign</div>
          </div>
          <BarChart3 size={20} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={comparisonData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="openRate" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Open Rate %" />
              <Bar dataKey="replyRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Reply Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="card mb-6">
        <div className="card-header">
          <div className="flex-row gap-2">
            <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} />
            <div>
              <div className="card-title">AI-Powered Recommendations</div>
              <div className="card-subtitle">Smart suggestions to improve your campaign performance</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {aiSuggestions.map((suggestion) => (
            <div key={suggestion.id} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--border-primary)' }}>
              <div className="flex-between mb-4">
                <div className="flex-row gap-2">
                  <span style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: suggestion.type === 'subject' ? 'var(--accent-blue-soft)' :
                      suggestion.type === 'body' ? 'var(--accent-purple-soft)' :
                      suggestion.type === 'timing' ? 'var(--accent-amber-soft)' : 'var(--accent-emerald-soft)',
                    color: suggestion.type === 'subject' ? 'var(--accent-blue)' :
                      suggestion.type === 'body' ? 'var(--accent-purple)' :
                      suggestion.type === 'timing' ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {suggestion.type === 'subject' ? <Target size={16} /> :
                     suggestion.type === 'body' ? <Sparkles size={16} /> :
                     suggestion.type === 'timing' ? <Zap size={16} /> : <TrendingUp size={16} />}
                  </span>
                  <span style={{ fontWeight: 600 }}>{suggestion.title}</span>
                </div>
                <div className="flex-row gap-2">
                  <span className="badge badge-emerald">{suggestion.impact}</span>
                  <span className={`badge ${suggestion.confidence === 'High' ? 'badge-blue' : 'badge-amber'}`}>
                    {suggestion.confidence} confidence
                  </span>
                </div>
              </div>

              <div className="grid-2 gap-4" style={{ marginBottom: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', fontWeight: 600 }}>CURRENT</div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-rose)', background: 'var(--accent-rose-soft)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                    {suggestion.current}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', fontWeight: 600 }}>SUGGESTED</div>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-emerald)', background: 'var(--accent-emerald-soft)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                    {suggestion.suggested}
                  </div>
                </div>
              </div>

              <div className="flex-row gap-2" style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>
                <Lightbulb size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                {suggestion.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A/B Test Results */}
      {abCampaigns.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">A/B Test Results</div>
              <div className="card-subtitle">Statistical analysis of variant performance</div>
            </div>
          </div>

          {abCampaigns.map((campaign) => (
            <div key={campaign.id} style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)' }}>{campaign.name}</h4>
              <div className="grid-2 gap-4">
                {Object.entries(campaign.abTest.variants).map(([key, v]) => {
                  const otherKey = key === 'A' ? 'B' : 'A';
                  const other = campaign.abTest.variants[otherKey];
                  const isWinner = other && v.openRate > other.openRate;
                  return (
                    <div key={key} style={{
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isWinner ? 'var(--accent-emerald)' : 'var(--border-primary)'}`,
                      background: isWinner ? 'var(--accent-emerald-soft)' : 'var(--bg-card)',
                    }}>
                      <div className="flex-between mb-4">
                        <span className="badge badge-purple">Variant {key}</span>
                        {isWinner && <span className="badge badge-emerald">🏆 Winner</span>}
                      </div>
                      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>"{v.subject}"</p>
                      <div className="flex-row gap-4">
                        <div>
                          <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{v.openRate}%</div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Open Rate</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{v.replyRate}%</div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Reply Rate</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
