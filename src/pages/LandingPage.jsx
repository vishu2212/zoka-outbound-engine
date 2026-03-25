import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Database, 
  Cpu, 
  Send, 
  BarChart, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Code,
  Layers,
  ShieldAlert
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-layout">
      {/* 2. TRANSPARENCY BANNER */}
      <div className="transparency-banner">
        <AlertTriangle size={16} className="banner-icon" />
        <span><strong>Engineering Prototype:</strong> This is a working prototype built to demonstrate outbound automation workflows and system capabilities.</span>
      </div>

      <div className="landing-container">
        {/* 1. HERO SECTION */}
        <header className="hero-section">
          <div className="prototype-badge">
            <span className="live-dot"></span> Live Demo
          </div>
          <h1 className="hero-title">Automated Outbound Infrastructure</h1>
          <p className="hero-subtitle">
            An end-to-end system designed to identify leads, enrich data, and execute highly personalized outreach sequences at scale.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              <Terminal size={18} />
              View Demo Dashboard
            </button>
            <a href="#contact" className="btn-secondary">
              Discuss Architecture
            </a>
          </div>
        </header>

        {/* 3. HOW THE SYSTEM WORKS */}
        <section className="section flow-section">
          <div className="section-header">
            <h2 className="section-title">System Workflow</h2>
            <p className="section-description">Autonomous pipeline from discovery to reply tracking.</p>
          </div>
          
          <div className="workflow-steps">
            {[
              { icon: <Database size={24}/>, title: 'Lead Identification', desc: 'Aggregates prospects from public sources.' },
              { icon: <Layers size={24}/>, title: 'Data Enrichment', desc: 'Appends firmographic and verified contact data.' },
              { icon: <Cpu size={24}/>, title: 'AI Personalization', desc: 'Generates context-aware message variants.' },
              { icon: <Send size={24}/>, title: 'Automated Outreach', desc: 'Executes sending based on optimized schedules.' },
              { icon: <BarChart size={24}/>, title: 'Reply Tracking', desc: 'Monitors inbox sentiment and engagement limits.' }
            ].map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {idx < 4 && <ArrowRight size={16} className="step-arrow" />}
              </div>
            ))}
          </div>
        </section>

        {/* 4. SAMPLE WORKFLOW RUN */}
        <section className="section simulation-section">
          <div className="section-header">
            <h2 className="section-title">Workflow Simulation</h2>
            <p className="section-description">Example execution payload & system response.</p>
          </div>

          <div className="simulation-grid">
            <div className="simulation-card input-card">
              <div className="card-header">
                <Code size={16} /> Runtime Input
              </div>
              <div className="card-body terminal-text">
                <p><span className="keyword">industry:</span> 'B2B SaaS Foundations'</p>
                <p><span className="keyword">target_audience:</span> 'VP of Engineering, CTO'</p>
                <p><span className="keyword">location:</span> 'North America, Remote'</p>
              </div>
            </div>

            <div className="simulation-card output-card">
              <div className="card-header">
                <Server size={16} /> Process Output
              </div>
              <div className="card-body">
                <div className="stat-row">
                  <span>Leads Extracted:</span>
                  <strong>1,245</strong>
                </div>
                <div className="stat-row">
                  <span>Enrichment Success:</span>
                  <strong>89.4% (1,113 Validated)</strong>
                </div>
                <div className="stat-row">
                  <span>AI Variants Generated:</span>
                  <strong>3 base frames, 1k+ dynamic nodes.</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. SAMPLE DATA OUTPUT */}
        <section className="section data-section">
          <div className="section-header">
            <h2 className="section-title">Enriched Data Sample</h2>
            <p className="section-description">Structured output post-enrichment and personalization engine logic.</p>
          </div>
          
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email (Mock)</th>
                  <th>Generated Message Snippet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sarah Jenkins</td>
                  <td>CloudScale Inc.</td>
                  <td>s.jenkins@cloudscale.ex</td>
                  <td>"Noticed CloudScale's recent push into serverless deployments. Our infrastructure tool handles..."</td>
                </tr>
                <tr>
                  <td>David Chen</td>
                  <td>Finix Analytics</td>
                  <td>dchen@finix.ex</td>
                  <td>"Saw your talk on data latency at DataCon. I built a pipeline system that reduces query time by..."</td>
                </tr>
                <tr>
                  <td>Elena Rostova</td>
                  <td>LogisTech Solutions</td>
                  <td>elena.r@logistech.ex</td>
                  <td>"As logistics tech scales, routing APIs become bottlenecks. We engineered a robust..."</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. SYSTEM ARCHITECTURE */}
        <section className="section architecture-section">
          <div className="section-header">
            <h2 className="section-title">Architecture Overview</h2>
            <p className="section-description">High-level components of the outbound engine.</p>
          </div>

          <div className="arch-grid">
            <div className="arch-node">
              <Database size={32} />
              <h4>1. Sourcing Layer</h4>
              <p>API integrations & scraping nodes pulling raw signals and basic contact objects.</p>
            </div>
            <div className="arch-node">
              <Layers size={32} />
              <h4>2. Enrichment & Validation</h4>
              <p>Waterfall logic against multiple data providers. SMTP ping validation to verify deliverability.</p>
            </div>
            <div className="arch-node">
              <Cpu size={32} />
              <h4>3. Prompt Processing</h4>
              <p>LLM agents parsing lead context matching against internal solution matrices to draft copy.</p>
            </div>
            <div className="arch-node">
              <Send size={32} />
              <h4>4. Execution Controller</h4>
              <p>Distribution across managed sender domains with throttled cron jobs for optimal inbox placement.</p>
            </div>
          </div>
        </section>

        {/* 7. USE CASES & 8. LIMITATIONS */}
        <section className="section split-section">
          <div className="split-col usecases">
            <h2 className="section-title">Ideal Use Cases</h2>
            <ul className="custom-list">
              <li><CheckCircle2 size={16}/> <strong>B2B Startups</strong> lacking internal lead generation teams.</li>
              <li><CheckCircle2 size={16}/> <strong>Agencies</strong> building automated growth operations for clients.</li>
              <li><CheckCircle2 size={16}/> <strong>SaaS Founders</strong> seeking highly targeted beta users.</li>
              <li><CheckCircle2 size={16}/> <strong>Consultancies</strong> identifying high-intent accounts.</li>
            </ul>
          </div>
          
          <div className="split-col limitations">
            <h2 className="section-title">System Limitations</h2>
            <div className="limit-box">
              <ShieldAlert size={20} className="limit-icon" />
              <div>
                <p><strong>Prototype constraints:</strong></p>
                <ul>
                  <li>Currently scaled for demonstration payloads.</li>
                  <li>Requires custom API keys and domain setups per client.</li>
                  <li>Not a plug-and-play SaaS—requires engineer-assisted onboarding.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. WHAT I CAN BUILD & 10. CTA */}
        <section className="section cta-section" id="contact">
          <div className="cta-content">
            <h2 className="section-title">Custom Infrastructure Available</h2>
            <p className="section-description">
              I specialize in moving beyond generic no-code tools to engineer robust, bespoke outbound systems tailored specifically to your data sources and sales flow.
            </p>
            
            <div className="service-tags">
              <span className="tag">Custom Outbound Systems</span>
              <span className="tag">Automated Lead Pipelines</span>
              <span className="tag">AI Outreach Workflows</span>
              <span className="tag">Infrastructure Setup</span>
            </div>

            <div className="cta-box">
              <h3>Let’s engineer your outbound system.</h3>
              <p>Discuss your architecture needs and see how this prototype scales to production.</p>
              <button className="btn-primary large">Book a Technical Call</button>
            </div>
          </div>
        </section>
        
        <footer className="landing-footer">
          <p>Built as an engineering demonstration.</p>
        </footer>
      </div>
    </div>
  );
}
