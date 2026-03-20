import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, User, Mail, Key, Database, Download, RotateCcw, Save, Check } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { state, dispatch } = useApp();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(state.settings);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportAll = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'zoka-works-export.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      dispatch({ type: 'RESET' });
      setSettings({
        agencyName: 'Zoka Works',
        dailySendingLimit: 100,
        warmupEnabled: true,
        warmupDays: 21,
        trackOpens: true,
        trackReplies: true,
        apolloApiKey: '',
        openaiApiKey: '',
      });
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Configure your cold email engine</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary" onClick={handleExportAll}>
            <Download size={16} /> Export All Data
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {/* Profile */}
        <div className="settings-section">
          <div className="flex-row gap-2 mb-4">
            <User size={18} style={{ color: 'var(--accent-blue)' }} />
            <div>
              <h3>Agency Profile</h3>
              <p>Your agency identity and branding</p>
            </div>
          </div>
          <div className="settings-row">
            <div className="form-group">
              <label className="form-label">Agency Name</label>
              <input className="form-input" value={settings.agencyName} onChange={e => setSettings(p => ({ ...p, agencyName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Sender Name</label>
              <input className="form-input" defaultValue="Vishav K." />
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="settings-section">
          <div className="flex-row gap-2 mb-4">
            <Mail size={18} style={{ color: 'var(--accent-emerald)' }} />
            <div>
              <h3>Email Configuration</h3>
              <p>Sending limits and warm-up settings</p>
            </div>
          </div>
          <div className="settings-row">
            <div className="form-group">
              <label className="form-label">Daily Sending Limit (Total)</label>
              <input className="form-input" type="number" value={settings.dailySendingLimit} onChange={e => setSettings(p => ({ ...p, dailySendingLimit: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Warm-up Duration (Days)</label>
              <input className="form-input" type="number" value={settings.warmupDays} onChange={e => setSettings(p => ({ ...p, warmupDays: parseInt(e.target.value) || 21 }))} />
            </div>
          </div>
          <div className="settings-row" style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>Enable Warm-up</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Gradually increase sending volume for new inboxes</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.warmupEnabled} onChange={e => setSettings(p => ({ ...p, warmupEnabled: e.target.checked }))} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>Track Opens</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Insert tracking pixel in emails</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.trackOpens} onChange={e => setSettings(p => ({ ...p, trackOpens: e.target.checked }))} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 'var(--font-sm)' }}>Track Replies</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Monitor inbox for reply detection</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.trackReplies} onChange={e => setSettings(p => ({ ...p, trackReplies: e.target.checked }))} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="settings-section">
          <div className="flex-row gap-2 mb-4">
            <Key size={18} style={{ color: 'var(--accent-purple)' }} />
            <div>
              <h3>API Integrations</h3>
              <p>Connect external services</p>
            </div>
          </div>
          <div className="settings-row">
            <div className="form-group">
              <label className="form-label">Apollo API Key</label>
              <input className="form-input" type="password" placeholder="Enter your Apollo API key..." value={settings.apolloApiKey} onChange={e => setSettings(p => ({ ...p, apolloApiKey: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">OpenAI / Claude API Key</label>
              <input className="form-input" type="password" placeholder="Enter your AI API key..." value={settings.openaiApiKey} onChange={e => setSettings(p => ({ ...p, openaiApiKey: e.target.value }))} />
            </div>
          </div>
          <div style={{ background: 'var(--accent-blue-soft)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-sm)', color: 'var(--accent-blue)' }}>
            <strong>Note:</strong> API keys are stored locally in your browser. In production, these would be securely stored server-side.
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <div className="flex-row gap-2 mb-4">
            <Database size={18} style={{ color: 'var(--accent-amber)' }} />
            <div>
              <h3>Data Management</h3>
              <p>Export or reset your data</p>
            </div>
          </div>
          <div className="flex-row gap-4">
            <button className="btn btn-secondary" onClick={handleExportAll}>
              <Download size={16} /> Export All Data (JSON)
            </button>
            <button className="btn btn-danger" onClick={handleReset}>
              <RotateCcw size={16} /> Reset to Defaults
            </button>
          </div>
          <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600 }}>Storage:</span> {state.leads.length} leads · {state.campaigns.length} campaigns · {state.inboxes.length} inboxes
          </div>
        </div>
      </div>
    </div>
  );
}
