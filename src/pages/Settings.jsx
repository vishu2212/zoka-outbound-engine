import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Download, RotateCcw, Save, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { state, actions } = useApp();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(state.settings);

  const handleSave = () => {
    actions.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleExport = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'zoka-outbound-system.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all system data to defaults?')) return;
    actions.resetSystem();
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Control simulation behavior, API keys, and persistence options.</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export State
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save</>}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex-row gap-2">
            <SettingsIcon size={18} />
            <div>
              <div className="card-title">System Configuration</div>
              <div className="card-subtitle">Persisted in localStorage.</div>
            </div>
          </div>
        </div>

        <div className="settings-row">
          <div className="form-group">
            <label className="form-label">Agency Name</label>
            <input className="form-input" value={settings.agencyName} onChange={(event) => setSettings((prev) => ({ ...prev, agencyName: event.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Sending Limit</label>
            <input
              className="form-input"
              type="number"
              value={settings.dailySendingLimit}
              onChange={(event) => setSettings((prev) => ({ ...prev, dailySendingLimit: Number(event.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="settings-row mt-4">
          <div className="form-group">
            <label className="form-label">Email Provider</label>
            <select className="form-select" value={settings.emailProvider} onChange={(event) => setSettings((prev) => ({ ...prev, emailProvider: event.target.value }))}>
              <option value="Mock SMTP">Mock SMTP</option>
              <option value="Gmail API">Gmail API</option>
              <option value="Outlook API">Outlook API</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Rate Limit (emails/min)</label>
            <input
              className="form-input"
              type="number"
              value={settings.rateLimitPerMinute}
              onChange={(event) => setSettings((prev) => ({ ...prev, rateLimitPerMinute: Number(event.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="settings-row mt-4">
          <div className="form-group">
            <label className="form-label">SMTP Host</label>
            <input className="form-input" value={settings.smtpHost} onChange={(event) => setSettings((prev) => ({ ...prev, smtpHost: event.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">SMTP Port</label>
            <input className="form-input" type="number" value={settings.smtpPort} onChange={(event) => setSettings((prev) => ({ ...prev, smtpPort: Number(event.target.value) || 0 }))} />
          </div>
        </div>

        <div className="settings-row mt-4">
          <div className="form-group">
            <label className="form-label">Apollo API Key</label>
            <input className="form-input" value={settings.apolloApiKey} onChange={(event) => setSettings((prev) => ({ ...prev, apolloApiKey: event.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">OpenAI API Key</label>
            <input className="form-input" value={settings.openaiApiKey} onChange={(event) => setSettings((prev) => ({ ...prev, openaiApiKey: event.target.value }))} />
          </div>
        </div>

        <div className="flex-row gap-4 mt-6">
          <button className="btn btn-danger" onClick={handleReset}>
            <RotateCcw size={16} /> Reset to Defaults
          </button>
          <span className="badge badge-neutral">
            Stored objects: {state.leads.length} leads, {state.campaigns.length} campaigns, {state.emails.length} emails
          </span>
        </div>
      </div>
    </div>
  );
}
