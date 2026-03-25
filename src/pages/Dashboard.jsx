import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Database, 
  Cpu, 
  Send,
  Layers,
  ArrowRight,
  ShieldAlert,
  Code
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState('Idle');
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ leads: 0, enriched: 0, generated: 0, replies: 0 });
  
  // Real-time Simulation Effect
  useEffect(() => {
    let step = 0;
    const sequence = [
      { time: 1000, log: 'System initialized. Authenticating API gateways...', status: 'Active' },
      { time: 2500, log: 'Target ICP: B2B SaaS Founders (US). Querying sources...', leads: 0 },
      { time: 4000, log: 'Extraction started. Parsing LinkedIn & Apollo databases.', leads: 14 },
      { time: 5500, log: 'Pagination continued. Aggregating results.', leads: 42 },
      { time: 7000, log: 'Extraction complete (42 leads). Beginning enrichment phase.', enriched: 0 },
      { time: 8500, log: 'SMTP pinging active. Verifying domains.', enriched: 12 },
      { time: 10000, log: 'Enrichment complete: 28 valid emails found, 14 bounced or catch-all.', enriched: 28 },
      { time: 11500, log: 'Spawning LLM prompt instances for personalization.', generated: 0 },
      { time: 13000, log: 'Generating hyper-personalized opening lines based on recent funding.', generated: 15 },
      { time: 14500, log: 'Message generation complete (28 constraints met).', generated: 28 },
      { time: 16000, log: 'Dispatching to mailing queues. Throttle set to 40/hr.', status: 'Completed', replies: 5 }
    ];

    const timeouts = sequence.map(s => {
      return setTimeout(() => {
        const now = new Date();
        const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        
        setLogs(prev => [...prev, `${timeStr} ${s.log}`]);
        
        if (s.status) setSystemStatus(s.status);
        setMetrics(prev => ({
          leads: s.leads !== undefined ? s.leads : prev.leads,
          enriched: s.enriched !== undefined ? s.enriched : prev.enriched,
          generated: s.generated !== undefined ? s.generated : prev.generated,
          replies: s.replies !== undefined ? s.replies : prev.replies,
        }));
      }, s.time);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const realisticData = [
    { name: 'Michael Chen', company: 'NexusTech', email: 'm.chen@nexustech.io', status: 'Sent' },
    { name: 'Sarah Miller', company: 'CloudWorks', email: 'sarah@cloudworks.co', status: 'Replied' },
    { name: 'David Hoffman', company: 'Finix Data', email: 'No Email Found (Catch-all)', status: 'Pending' },
    { name: 'Elena Rostova', company: 'LogisTech', email: 'erostova@logistech.com', status: 'Sent' },
  ];

  return (
    <div className="dashboard-layout animate-fade-in">
      
      {/* 6. DEMO MODE BADGE */}
      <div className="demo-banner">
        <AlertCircle size={16} />
        <span><strong>Demo Mode</strong> — Simulated workflow for demonstration purposes</span>
      </div>

      <div className="dashboard-container">
        {/* 1. SYSTEM STATUS BAR */}
        <div className="system-status-bar">
          <div className="status-left">
            <span className={`status-indicator pulsing ${systemStatus.toLowerCase()}`}></span>
            <strong>System {systemStatus}</strong>
            <span className="status-divider">|</span>
            <Clock size={14} /> Last Run: Just now
          </div>
          <div className="status-right">
            Total Processed Today: {metrics.leads} leads
          </div>
        </div>

        <div className="grid-layout">
          {/* Main Left Column */}
          <div className="col-main">
            
            {/* 2. CURRENT WORKFLOW PANEL */}
            <div className="system-card">
              <div className="card-top">
                <h3><Activity size={18} /> Current Workflow Execution</h3>
                <span className={`badge badge-${systemStatus === 'Completed' ? 'emerald' : 'blue'}`}>
                  {systemStatus === 'Completed' ? 'Finished' : 'Running'}
                </span>
              </div>
              <div className="workflow-metrics">
                <div className="w-metric">
                  <span>Target ICP</span>
                  <strong>B2B SaaS Founders, US</strong>
                </div>
                <div className="w-metric">
                  <span>Leads Extracted</span>
                  <strong>{metrics.leads}</strong>
                </div>
                <div className="w-metric">
                  <span>Emails Enriched</span>
                  <strong>{metrics.enriched}</strong>
                </div>
                <div className="w-metric">
                  <span>Messages Generated</span>
                  <strong>{metrics.generated}</strong>
                </div>
              </div>
            </div>

            {/* 3. REALISTIC DATA TABLE */}
            <div className="system-card">
              <div className="card-top">
                <h3><Database size={18} /> Enriched Output Sample</h3>
              </div>
              <div className="table-responsive">
                <table className="demo-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Email Status</th>
                      <th>Pipeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realisticData.map((row, i) => (
                      <tr key={i}>
                        <td className="font-semibold text-light">{row.name}</td>
                        <td>{row.company}</td>
                        <td className={row.email.includes('No Email') ? 'text-dim' : 'text-success'}>
                          {row.email}
                        </td>
                        <td>
                          <span className={`status-pill ${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. MESSAGE GENERATION PREVIEW */}
            <div className="system-card">
              <div className="card-top">
                <h3><Cpu size={18} /> AI Message Generation Snippets</h3>
              </div>
              <div className="message-previews">
                <div className="msg-box">
                  <div className="msg-header">Variant A (To: Michael Chen)</div>
                  <p>"Notice NexusTech just rolled out the v2 API portal. Have you solved the infrastructure lag we discussed in similar setups? Our system auto-scales..."</p>
                </div>
                <div className="msg-box">
                  <div className="msg-header">Variant B (To: Sarah Miller)</div>
                  <p>"Saw CloudWorks' recent seed round update. Usually scale brings email deliverability issues. We engineer infrastructure that prevents..."</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="col-side">
            
            {/* 7. SMALL METRICS PANEL */}
            <div className="system-card metrics-card">
              <h3><Activity size={18} /> Live Telemetry</h3>
              <ul className="telemetry-list">
                <li>Processed: <strong>{metrics.leads}</strong></li>
                <li>Valid Emails: <strong>{metrics.enriched}</strong></li>
                <li>Sent: <strong>{metrics.generated}</strong></li>
                <li>Replies (Sim): <strong>{metrics.replies}</strong></li>
              </ul>
            </div>

            {/* 4. ACTIVITY LOG */}
            <div className="system-card terminal-card">
              <div className="card-top terminal-header">
                <h3><Terminal size={18} /> System Activity Log</h3>
              </div>
              <div className="terminal-body">
                {logs.map((log, i) => (
                  <div key={i} className="log-line">{log}</div>
                ))}
                {systemStatus !== 'Completed' && (
                  <div className="log-line blinking-cursor">_</div>
                )}
              </div>
            </div>

            {/* 8. SAMPLE WORKFLOW INPUT -> OUTPUT */}
            <div className="system-card">
              <div className="card-top">
                <h3><Code size={18} /> Payload Execution</h3>
              </div>
              <div className="payload-box">
                <div className="pl-section">
                  <span className="pl-label">INPUT</span>
                  <code>{`{ role: "CTO", loc: "US" }`}</code>
                </div>
                <ArrowRight size={14} className="pl-arrow" />
                <div className="pl-section">
                  <span className="pl-label">OUTPUT</span>
                  <code>{`{ valid: ${metrics.enriched}, sent: ${metrics.generated} }`}</code>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTIONS (9, 10, 11, 12) */}
        
        <div className="divider" />

        {/* 9. SYSTEM ARCHITECTURE & 10. LIMITATIONS */}
        <div className="grid-2-col pt-4">
          <div className="system-card arch-card">
            <h3><Layers size={18} /> System Architecture</h3>
            <div className="arch-layers">
              <div className="arch-layer">
                <strong>Data Source Layer</strong>
                <p>APIs / scraping nodes pulling raw signal.</p>
              </div>
              <div className="arch-layer">
                <strong>Processing Layer</strong>
                <p>Waterfall enrichment & SMTP verification.</p>
              </div>
              <div className="arch-layer">
                <strong>AI Personalization Layer</strong>
                <p>LLM agents parsing context for copy drafting.</p>
              </div>
              <div className="arch-layer">
                <strong>Outreach Automation Layer</strong>
                <p>Throttled distribution across managed sender domains.</p>
              </div>
            </div>
          </div>

          <div className="system-card limits-card">
            <h3><ShieldAlert size={18} /> System Constraints</h3>
            <ul className="limits-list">
              <li><AlertCircle size={14}/> <strong>Prototype stage (v1):</strong> Built as an engineering demonstration.</li>
              <li><AlertCircle size={14}/> <strong>Validation limits:</strong> Not yet battle-tested at large scale (100k+ emails).</li>
              <li><AlertCircle size={14}/> <strong>Customization required:</strong> Requires client-specific infrastructure and domain setups. This is an engineered service, not plug-and-play SaaS.</li>
            </ul>
          </div>
        </div>

        {/* 11. SERVICE POSITIONING & 12. CTA */}
        <div className="system-card cta-panel">
          <div className="cta-content">
            <h2>Custom Infrastructure Engineering</h2>
            <p>I build bespoke outbound systems, robust lead pipelines, and AI-powered outreach workflows tailored to your specific data sources.</p>
            <div className="cta-actions">
              <a href="mailto:vishu2212@example.com" className="btn-engineered primary">Contact Engineering</a>
              <a href="#" className="btn-engineered secondary">Book Architecture Call</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
