import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Search, PenTool, Send, BarChart3,
  ArrowRight, CheckCircle2, Play, Users, MessageSquare,
  Target, Clock, Sparkles, ChevronRight, Monitor
} from 'lucide-react';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }
  })
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp">

      {/* ═══ HERO ═══ */}
      <section className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="lp-container">
          <motion.div className="lp-hero-badge" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Zap size={14} /> AI-Powered Outbound System
          </motion.div>

          <motion.h1 className="lp-hero-title" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            Your next 50 clients are<br />already in the pipeline.
          </motion.h1>

          <motion.p className="lp-hero-sub" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            ZOKA is the AI outbound engine that sources prospects, writes personalized copy,
            and executes multi-touch sequences — so you close deals instead of chasing them.
          </motion.p>

          <motion.div className="lp-hero-actions" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/dashboard')}>
              <Play size={16} /> See It Running
            </button>
            <a href="#offer" className="lp-btn lp-btn-outline">
              Book a Build <ChevronRight size={16} />
            </a>
          </motion.div>

          <motion.div className="lp-hero-proof" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <div className="lp-proof-item"><strong>12,000+</strong> prospects sourced</div>
            <span className="lp-proof-dot" />
            <div className="lp-proof-item"><strong>8,400+</strong> AI messages</div>
            <span className="lp-proof-dot" />
            <div className="lp-proof-item"><strong>340+</strong> meetings booked</div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section className="lp-section">
        <div className="lp-container">
          <motion.div className="lp-section-head" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-label">THE PROBLEM</span>
            <h2>Outbound is broken. You know it.</h2>
          </motion.div>

          <motion.div className="lp-problem-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { icon: <Clock size={24} />, title: 'Manual prospecting', desc: "You're spending 4 hours finding 20 leads. The math doesn't work." },
              { icon: <Target size={24} />, title: 'Generic outreach', desc: 'Templates get ignored. Personalization at scale is impossible manually.' },
              { icon: <Users size={24} />, title: 'Tool fatigue', desc: "You're stitching together 6 tools that don't talk to each other." },
              { icon: <BarChart3 size={24} />, title: 'No pipeline visibility', desc: "You have no idea what's working, what's broken, or what to fix." },
            ].map((item, i) => (
              <motion.div key={i} className="lp-problem-card" variants={fadeUp} custom={i}>
                <div className="lp-problem-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p className="lp-transition" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            What if your entire outbound pipeline ran itself?
          </motion.p>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section className="lp-section lp-section-alt">
        <div className="lp-container">
          <motion.div className="lp-section-head" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-label">THE SOLUTION</span>
            <h2>One engine. Full pipeline. Zero busywork.</h2>
            <p className="lp-section-sub">ZOKA replaces your entire outbound stack with a single AI-powered system.</p>
          </motion.div>

          <motion.div className="lp-solution-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { icon: <Search size={28} />, label: 'AI Prospecting', desc: 'Sources and scores leads from public data — automatically.', color: 'blue' },
              { icon: <PenTool size={28} />, label: 'AI Copywriting', desc: 'Writes personalized outreach using live prospect context.', color: 'purple' },
              { icon: <Send size={28} />, label: 'Sequence Execution', desc: 'Multi-step cadences that send, track, and retry — on autopilot.', color: 'emerald' },
              { icon: <BarChart3 size={28} />, label: 'Pipeline Intelligence', desc: "Real-time insights: what's converting, what's dying, what to fix.", color: 'cyan' },
            ].map((item, i) => (
              <motion.div key={i} className={`lp-solution-card lp-accent-${item.color}`} variants={fadeUp} custom={i}>
                <div className="lp-solution-icon">{item.icon}</div>
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="lp-section">
        <div className="lp-container">
          <motion.div className="lp-section-head" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-label">HOW IT WORKS</span>
            <h2>From zero to pipeline in 4 steps.</h2>
          </motion.div>

          <motion.div className="lp-steps-row" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { num: '01', title: 'Source', desc: 'AI finds your ideal prospects' },
              { num: '02', title: 'Route', desc: 'Prospects are routed into sequences' },
              { num: '03', title: 'Write', desc: 'AI generates personalized copy variants' },
              { num: '04', title: 'Send & Track', desc: 'Sequences execute, track, and optimize' },
            ].map((step, i) => (
              <motion.div key={i} className="lp-step" variants={fadeUp} custom={i}>
                <div className="lp-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < 3 && <div className="lp-step-connector" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ DEMO ═══ */}
      <section className="lp-demo">
        <div className="lp-demo-glow" />
        <div className="lp-container">
          <motion.div className="lp-section-head" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-label lp-label-live"><span className="lp-live-dot" /> LIVE SYSTEM</span>
            <h2>Step inside the engine.</h2>
            <p className="lp-section-sub">
              This isn't a mockup. Below is a live system — sourcing prospects,
              generating copy, and executing sequences in real time.
            </p>
          </motion.div>

          <motion.div className="lp-demo-chips" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="lp-chip"><Zap size={14} /> AI is active</div>
            <div className="lp-chip"><BarChart3 size={14} /> Live data</div>
            <div className="lp-chip"><Sparkles size={14} /> Real execution</div>
          </motion.div>

          <motion.div className="lp-demo-container" variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <div className="lp-demo-topbar">
              <div className="lp-demo-dots">
                <span /><span /><span />
              </div>
              <span className="lp-demo-url">zoka.works/dashboard</span>
              <div className="lp-demo-live-badge"><span className="lp-live-dot" /> Live</div>
            </div>
            <div className="lp-demo-frame">
              <iframe
                src="/dashboard"
                title="ZOKA Dashboard Demo"
                className="lp-demo-iframe"
              />
            </div>
          </motion.div>

          <motion.div className="lp-demo-cta" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p>Like what you see?</p>
            <h3>You don't need to build this. We build and operate it for you.</h3>
            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/dashboard')}>
              <Monitor size={16} /> Explore Full Dashboard
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHAT YOU GET ═══ */}
      <section className="lp-section lp-section-alt">
        <div className="lp-container">
          <motion.div className="lp-section-head" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-label">DELIVERABLES</span>
            <h2>Not a tool. A system that runs for you.</h2>
          </motion.div>

          <motion.div className="lp-benefits-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              'Full outbound engine — prospect sourcing → copy → delivery → tracking',
              'AI copywriting layer — every message personalized to the recipient',
              'Multi-step sequences — automated cadences with retry logic',
              'Real-time pipeline — see every prospect, message, and reply',
              `Performance intelligence — AI surfaces what's working and what's not`,
              'Continuous optimization — we tune the system based on live data',
            ].map((item, i) => (
              <motion.div key={i} className="lp-benefit" variants={fadeUp} custom={i}>
                <CheckCircle2 size={20} className="lp-benefit-check" />
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ OFFER ═══ */}
      <section className="lp-section" id="offer">
        <div className="lp-container">
          <motion.div className="lp-section-head" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-label">THE OFFER</span>
            <h2>We build your outbound engine. You close the deals.</h2>
            <p className="lp-section-sub">
              This isn't software you sign up for.
              It's a system we build, deploy, and operate — for your business.
            </p>
          </motion.div>

          <motion.div className="lp-offer-card" variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="lp-offer-header">
              <Sparkles size={20} />
              <h3>ZOKA Engine Build</h3>
            </div>
            <ul className="lp-offer-list">
              <li><CheckCircle2 size={16} /> Custom prospect targeting</li>
              <li><CheckCircle2 size={16} /> AI copy calibrated to your ICP</li>
              <li><CheckCircle2 size={16} /> Full sequence deployment</li>
              <li><CheckCircle2 size={16} /> Real-time pipeline dashboard</li>
              <li><CheckCircle2 size={16} /> 30-day optimization cycle</li>
            </ul>
            <button className="lp-btn lp-btn-primary lp-btn-lg">
              Book Your Build <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="lp-final-cta">
        <div className="lp-final-cta-glow" />
        <div className="lp-container">
          <motion.div className="lp-final-cta-content" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2>Your pipeline should be running by now.</h2>
            <p>Every day without a system is a day without pipeline.</p>
            <button className="lp-btn lp-btn-primary lp-btn-lg">
              Book Your Engine <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lp-footer">
        <div className="lp-container">
          <p>© 2026 Zoka Works · AI Outbound Infrastructure</p>
        </div>
      </footer>
    </div>
  );
}
