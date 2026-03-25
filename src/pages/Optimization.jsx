import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Lightbulb, TrendingUp, Zap } from 'lucide-react';

export default function Optimization() {
  const { state, actions } = useApp();

  const averagePersonalization = useMemo(() => {
    if (!state.messages.length) return 0;
    const total = state.messages.reduce((sum, item) => sum + item.personalizationScore, 0);
    return Math.round(total / state.messages.length);
  }, [state.messages]);

  const bestCampaign = useMemo(
    () =>
      [...state.campaigns].sort((a, b) => {
        const aRate = a.sentCount ? a.replyCount / a.sentCount : 0;
        const bRate = b.sentCount ? b.replyCount / b.sentCount : 0;
        return bRate - aRate;
      })[0] || null,
    [state.campaigns]
  );

  const suggestions = useMemo(() => {
    const list = [];

    if (state.analytics.openRate < 35) {
      list.push({
        id: 'subject',
        applyKey: 'subject',
        title: 'Improve subject line relevance',
        detail: 'Open rate is below 35%. Increase curiosity and include company context in the first 4 words.',
        impact: '+8% to +15% open rate expected',
      });
    } else {
      list.push({
        id: 'subject-strong',
        applyKey: 'subject',
        title: 'Subject lines are healthy',
        detail: 'Current open rate is stable. Test one personalized subject variant per campaign to keep improving.',
        impact: '+3% incremental open lift possible',
      });
    }

    if (averagePersonalization < 75) {
      list.push({
        id: 'personalization',
        applyKey: 'personalization',
        title: 'Increase personalization score',
        detail: `Current average score is ${averagePersonalization}%. Generate AI messages for more assigned leads before running campaigns.`,
        impact: '+5% to +10% reply rate expected',
      });
    } else {
      list.push({
        id: 'personalization-strong',
        applyKey: 'personalization',
        title: 'Personalization quality is strong',
        detail: `Average personalization score is ${averagePersonalization}%. Focus next on send-window optimization.`,
        impact: 'Higher consistency across sequence steps',
      });
    }

    list.push({
      id: 'timing',
      applyKey: 'timing',
      title: 'Best send time window',
      detail: 'Prioritize sends between 9:00 AM and 11:00 AM local recipient time for Day 1 and Day 3 steps.',
      impact: '+4% to +7% open rate expected',
    });

    return list;
  }, [averagePersonalization, state.analytics.openRate]);

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Optimization</h1>
          <p>Actionable improvements generated from your current system behavior.</p>
        </div>
      </div>

      <div className="grid-3">
        <div className="metric-card">
          <div className="metric-icon blue"><TrendingUp size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{state.analytics.openRate}%</div>
            <div className="metric-label">Open Rate</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon purple"><Zap size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{averagePersonalization}%</div>
            <div className="metric-label">Avg Personalization</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon emerald"><Lightbulb size={22} /></div>
          <div className="metric-content">
            <div className="metric-value">{bestCampaign ? bestCampaign.name.slice(0, 14) : 'N/A'}</div>
            <div className="metric-label">Best Campaign</div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <div>
            <div className="card-title">Engine Suggestions</div>
            <div className="card-subtitle">Derived from live campaign outcomes and AI message quality.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="card" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="flex-between">
                <strong>{suggestion.title}</strong>
                <span className="badge badge-emerald">{suggestion.impact}</span>
              </div>
              <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>{suggestion.detail}</p>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <button className="btn btn-sm btn-primary" onClick={() => actions.applySuggestion(suggestion.applyKey)}>
                  Apply Suggestion
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
