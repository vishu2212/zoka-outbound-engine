import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { aiPersonalizationExamples, toneOptions, emailTemplates } from '../data/mockEmails';
import { Sparkles, RefreshCw, Copy, Check, Send, User, Building, Briefcase } from 'lucide-react';

export default function AIEngine() {
  const { state } = useApp();
  const [selectedLead, setSelectedLead] = useState(null);
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState('');

  const handleGenerate = () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    setGenerated(null);

    // Simulate AI generation with delay
    setTimeout(() => {
      const lead = state.leads.find(l => l.id === parseInt(selectedLead));
      if (!lead) { setIsGenerating(false); return; }

      // Check if we have a pre-built example
      const example = aiPersonalizationExamples.find(e => e.leadId === lead.id);

      if (example) {
        setGenerated({
          personalization: example.personalization,
          subjectLine: example.subjectLine,
          emailBody: example.emailBody,
        });
      } else {
        // Generate dynamic content based on lead data
        const toneMap = {
          professional: {
            opener: `I came across ${lead.company} while researching innovative ${lead.industry} companies, and I was impressed by what you're building.`,
            cta: 'Would you be open to a brief 15-minute conversation this week?',
            sign: 'Best regards',
          },
          casual: {
            opener: `Hey! I've been following what ${lead.company} is doing in the ${lead.industry} space — really cool stuff.`,
            cta: 'Would love to chat if you have 10 minutes this week. No pressure!',
            sign: 'Cheers',
          },
          bold: {
            opener: `${lead.company} is clearly making moves in ${lead.industry}. Here's why we should talk:`,
            cta: 'Let\'s do a quick 10-min call. I guarantee you\'ll find it valuable.',
            sign: 'Talk soon',
          },
        };

        const t = toneMap[tone];
        setGenerated({
          personalization: t.opener,
          subjectLine: `${lead.firstName}, quick thought on ${lead.company}'s growth`,
          emailBody: `Hi ${lead.firstName},\n\n${t.opener}\n\nAs ${lead.title} at ${lead.company}, you know how critical a predictable pipeline is for growth. That's exactly what we build at Zoka Works.\n\nWe run end-to-end cold outreach campaigns that consistently book 30-50 qualified meetings per month for ${lead.industry} companies.\n\n${t.cta}\n\n${t.sign},\nVishav\nZoka Works`,
        });
      }

      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>AI Personalization Engine</h1>
          <p>Generate hyper-personalized cold emails using AI</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Input Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Configure Generation</div>
          </div>

          <div className="form-group">
            <label className="form-label">Select Lead</label>
            <select className="form-select" value={selectedLead || ''} onChange={e => { setSelectedLead(e.target.value); setGenerated(null); }}>
              <option value="">Choose a lead...</option>
              {state.leads.filter(l => l.emailValid).map(l => (
                <option key={l.id} value={l.id}>{l.firstName} {l.lastName} — {l.company}</option>
              ))}
            </select>
          </div>

          {/* Lead Preview */}
          {selectedLead && (() => {
            const lead = state.leads.find(l => l.id === parseInt(selectedLead));
            if (!lead) return null;
            return (
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                <div className="flex-row gap-4" style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--font-sm)', color: 'white' }}>
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{lead.firstName} {lead.lastName}</div>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{lead.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                  <span className="flex-row gap-2"><Briefcase size={14} /> {lead.title}</span>
                  <span className="flex-row gap-2"><Building size={14} /> {lead.company}</span>
                  <span className="badge badge-blue">{lead.industry}</span>
                </div>
              </div>
            );
          })()}

          <div className="form-group">
            <label className="form-label">Tone</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {toneOptions.map(t => (
                <button key={t.id} className={`tag ${tone === t.id ? 'active' : ''}`} onClick={() => { setTone(t.id); setGenerated(null); }}>
                  {t.label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              {toneOptions.find(t => t.id === tone)?.description}
            </p>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleGenerate} disabled={!selectedLead || isGenerating}>
            {isGenerating ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Generating...</> : <><Sparkles size={18} /> Generate Personalized Email</>}
          </button>

          {/* Email Templates */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>SAVED TEMPLATES</h4>
            {emailTemplates.map(t => (
              <div key={t.id} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-2)', cursor: 'pointer' }} className="card" onClick={() => {}}>
                <div style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>{t.subject}</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                  Tone: {t.tone} · {t.personalization}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output Panel */}
        <div>
          {isGenerating && (
            <div className="ai-output" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <div className="ai-typing" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                <span></span><span></span><span></span>
              </div>
              <p style={{ color: 'var(--text-tertiary)' }}>AI is crafting your personalized email...</p>
            </div>
          )}

          {generated && !isGenerating && (
            <>
              {/* Personalization Snippet */}
              <div className="ai-output" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="ai-output-label">
                  <Sparkles size={14} /> Personalization Snippet
                </div>
                <div className="ai-output-content">{generated.personalization}</div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={() => handleCopy('pers', generated.personalization)}>
                  {copied === 'pers' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>

              {/* Subject Line */}
              <div className="ai-output" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="ai-output-label">
                  <Sparkles size={14} /> Subject Line
                </div>
                <div className="ai-output-content" style={{ fontWeight: 600, fontSize: 'var(--font-lg)' }}>{generated.subjectLine}</div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={() => handleCopy('subj', generated.subjectLine)}>
                  {copied === 'subj' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>

              {/* Email Body */}
              <div className="ai-output" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="ai-output-label">
                  <Sparkles size={14} /> Email Body
                </div>
                <div className="ai-output-content">{generated.emailBody}</div>
                <div className="flex-row gap-2" style={{ marginTop: 'var(--space-3)' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleCopy('body', generated.emailBody)}>
                    {copied === 'body' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={handleGenerate}>
                    <RefreshCw size={14} /> Regenerate
                  </button>
                </div>
              </div>

              <button className="btn btn-success btn-lg" style={{ width: '100%' }}>
                <Send size={18} /> Use in Campaign
              </button>
            </>
          )}

          {!generated && !isGenerating && (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <Sparkles size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)', opacity: 0.3 }} />
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-lg)', marginBottom: 'var(--space-2)' }}>No Email Generated Yet</h3>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>Select a lead and click Generate to create a personalized cold email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
