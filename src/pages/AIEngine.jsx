import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, Sparkles } from 'lucide-react';
import { MotionPage, MotionCard } from '../components/motion';

export default function AIEngine() {
  const { state, actions } = useApp();
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedLead = useMemo(
    () => state.leads.find((lead) => lead.id === Number(selectedLeadId)) || null,
    [selectedLeadId, state.leads]
  );
  const generatedRecord = useMemo(
    () => state.messages.find((message) => message.leadId === Number(selectedLeadId)) || null,
    [selectedLeadId, state.messages]
  );

  const handleGenerate = async () => {
    if (!selectedLeadId) return;
    await actions.generateMessages(Number(selectedLeadId));
  };

  const copyAll = async () => {
    if (!generatedRecord) return;
    const payload = generatedRecord.variations.join('\n\n---\n\n');
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <MotionPage>
      <div className="page-header">
        <div className="page-header-left">
          <h1>AI Copywriter</h1>
          <p>Generate context-aware copy from live prospect signals.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Select Prospect</div>
              <div className="card-subtitle">Choose a prospect to generate AI-written variants.</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Prospect</label>
            <select className="form-select" value={selectedLeadId} onChange={(event) => setSelectedLeadId(event.target.value)}>
              <option value="">Select prospect...</option>
              {state.leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} — {lead.company}
                </option>
              ))}
            </select>
          </div>

          {selectedLead && (
            <div className="card" style={{ marginTop: 'var(--space-4)', background: 'var(--bg-tertiary)' }}>
              <div className="card-title">{selectedLead.name}</div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
                {selectedLead.title} at {selectedLead.company}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
                Email: {selectedLead.email || 'Unverified'}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
                Sequence: {state.campaigns.find((campaign) => campaign.id === selectedLead.campaignId)?.name || 'Unrouted'}
              </p>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg mt-4"
            style={{ width: '100%' }}
            onClick={handleGenerate}
            disabled={!selectedLead || state.system.isGeneratingMessages}
            title="AI analyzes the prospect's profile and crafts personalized message variants."
          >
            <Sparkles size={16} />
            {state.system.isGeneratingMessages ? 'Generating...' : 'Generate Copy'}
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">AI-Generated Copy</div>
              <div className="card-subtitle">Saved to system memory. Reused across sequences.</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={copyAll} disabled={!generatedRecord}>
              <Copy size={14} /> {copied ? 'Copied' : 'Copy to Clipboard'}
            </button>
          </div>

          {!generatedRecord && (
            <div className="empty-state-block">
              <Sparkles size={32} className="empty-state-icon" />
              <h3>Waiting for input</h3>
              <p>Select a prospect and generate personalized copy.</p>
            </div>
          )}

          {generatedRecord && (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <div className="badge badge-purple" title="How closely the AI matched the copy to the prospect's specific context.">
                Personalization Score: {generatedRecord.personalizationScore}%
              </div>
              <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="card-title" style={{ marginBottom: 'var(--space-2)' }}>Personalization Logic</div>
                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                  {generatedRecord.reasoning?.map((reason) => (
                    <div key={reason} style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                      • {reason}
                    </div>
                  ))}
                </div>
              </div>
              {generatedRecord.variations.map((variation, index) => (
                <div key={`${generatedRecord.leadId}-${index}`} className="ai-output">
                  <div className="ai-output-label">Variant {index + 1}</div>
                  <div className="ai-output-content">{variation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MotionPage>
  );
}
