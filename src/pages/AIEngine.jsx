import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, Sparkles } from 'lucide-react';

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
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>AI Engine</h1>
          <p>Generate personalized message variations from live lead profile data.</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Lead Input</div>
              <div className="card-subtitle">Select a lead to produce 2-3 personalized variants.</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lead</label>
            <select className="form-select" value={selectedLeadId} onChange={(event) => setSelectedLeadId(event.target.value)}>
              <option value="">Select lead...</option>
              {state.leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} - {lead.company}
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
                Email: {selectedLead.email || 'No Email'}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
                Campaign: {state.campaigns.find((campaign) => campaign.id === selectedLead.campaignId)?.name || 'Unassigned'}
              </p>
            </div>
          )}

          <button className="btn btn-primary btn-lg mt-4" style={{ width: '100%' }} onClick={handleGenerate} disabled={!selectedLead || state.system.isGeneratingMessages}>
            <Sparkles size={16} />
            {state.system.isGeneratingMessages ? 'Generating...' : 'Generate Messages'}
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Generated Output</div>
              <div className="card-subtitle">Persisted in global store and reused during campaign runs.</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={copyAll} disabled={!generatedRecord}>
              <Copy size={14} /> {copied ? 'Copied' : 'Copy All'}
            </button>
          </div>

          {!generatedRecord && (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <h3>No messages generated yet</h3>
              <p>Pick a lead and run generation to populate AI outputs.</p>
            </div>
          )}

          {generatedRecord && (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <div className="badge badge-purple">
                Personalization Score: {generatedRecord.personalizationScore}%
              </div>
              <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="card-title" style={{ marginBottom: 'var(--space-2)' }}>Why Generated</div>
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
                  <div className="ai-output-label">Variation</div>
                  <div className="ai-output-content">{variation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
