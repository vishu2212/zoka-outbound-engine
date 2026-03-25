import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Cpu, Database, Mail, Rocket } from 'lucide-react';

const workflow = [
  { label: 'Leads', icon: Database, desc: 'Generate and qualify prospects with missing-email handling.' },
  { label: 'Campaign', icon: Rocket, desc: 'Assign leads and orchestrate campaign execution.' },
  { label: 'AI', icon: Cpu, desc: 'Generate personalized message variants with scoring.' },
  { label: 'Email', icon: Mail, desc: 'Run Day 1/3/7 sequence with failures and retries.' },
  { label: 'Analytics', icon: BarChart3, desc: 'Track funnel conversion and campaign outcomes.' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', padding: 'var(--space-8)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 'var(--space-8)' }}>
        <div className="card">
          <span className="badge badge-amber">Simulated system for demonstration purposes</span>
          <h1 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
            Outbound Automation System Demo
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 760 }}>
            This demo shows connected SaaS behavior across lead generation, campaign orchestration,
            AI message generation, email sequence simulation, analytics, and optimization.
            It is intentionally transparent: all data is simulated and persisted locally.
          </p>
          <div className="flex-row gap-3 flex-wrap mt-6">
            <Link className="btn btn-primary btn-lg" to="/dashboard">
              View Demo <ArrowRight size={16} />
            </Link>
            <a className="btn btn-secondary btn-lg" href="#workflow">
              Review Workflow
            </a>
          </div>
        </div>

        <section id="workflow" className="card">
          <div className="card-header">
            <div>
              <div className="card-title">System Workflow</div>
              <div className="card-subtitle">Leads to Campaign to AI to Email to Analytics</div>
            </div>
          </div>
          <div className="grid-3">
            {workflow.map((step) => (
              <div key={step.label} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex-row gap-2" style={{ marginBottom: 'var(--space-2)' }}>
                  <step.icon size={16} />
                  <strong>{step.label}</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Capabilities</div>
              <div className="card-subtitle">Connected behavior across all product areas.</div>
            </div>
          </div>
          <div className="grid-2">
            <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
              <strong>Operational Controls</strong>
              <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                Generate Leads, Create Campaign, Assign Leads, Run Campaign, Pause Campaign, Retry Failed Sends.
              </p>
            </div>
            <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
              <strong>System Transparency</strong>
              <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                Global logs, state persistence, simulated delays, and visible status transitions at every stage.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
