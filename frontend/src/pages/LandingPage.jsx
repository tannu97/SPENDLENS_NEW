import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, TrendingDown, Zap, Shield, BarChart2, ChevronDown, Activity } from 'lucide-react';

const TICKER_ITEMS = [
  { tool: 'Cursor Business', team: '4-person startup', saving: '$80/mo' },
  { tool: 'ChatGPT Team', team: '2-person studio', saving: '$20/mo' },
  { tool: 'Claude Max', team: 'Writing agency', saving: '$480/mo' },
  { tool: 'GitHub Copilot Enterprise', team: 'Dev shop', saving: '$240/mo' },
  { tool: 'Gemini Advanced', team: 'Research team', saving: '$60/mo' },
  { tool: 'Windsurf Teams', team: '3-person startup', saving: '$60/mo' },
];

const STATS = [
  { value: '$340', label: 'avg monthly overspend', suffix: '' },
  { value: '68', label: 'of startups overpay', suffix: '%' },
  { value: '2', label: 'minutes to audit', suffix: 'min' },
];

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const numericEnd = parseInt(end.replace(/\D/g, ''), 10);
    const prefix = end.replace(/[0-9]/g, '');
    let start = 0;
    const step = numericEnd / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, numericEnd);
      setCount(Math.floor(start));
      if (start >= numericEnd) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  const numericEnd = parseInt(end.replace(/\D/g, ''), 10);
  const prefix = end.replace(/[0-9]/g, '');
  return <span ref={ref}>{prefix}{started ? count : 0}{suffix}</span>;
}

function Ticker() {
  return (
    <div className="overflow-hidden py-3 border-y border-border relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10"
        style={{ background: 'linear-gradient(90deg, #020510, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10"
        style={{ background: 'linear-gradient(-90deg, #020510, transparent)' }} />
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            <span className="text-slate-500 font-mono text-xs">{item.tool}</span>
            <span className="text-slate-600 font-mono text-xs">·</span>
            <span className="text-slate-500 font-mono text-xs">{item.team}</span>
            <span className="text-slate-600 font-mono text-xs">→</span>
            <span className="text-emerald-400 font-mono font-medium text-xs tracking-wide">SAVE {item.saving}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function OceanDepth() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Deep ocean ambient glow from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%]"
        style={{
          background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(14,165,233,0.07) 0%, transparent 70%)',
        }}
      />
      {/* Mid depth accent */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Floating bioluminescent particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            left: (15 + i * 14) + '%',
            top: (20 + i * 10) + '%',
            background: i % 2 === 0 ? '#38bdf8' : '#2dd4bf',
            boxShadow: i % 2 === 0 ? '0 0 8px #38bdf8' : '0 0 8px #2dd4bf',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
      {/* Grid */}
      <div className="absolute inset-0 ocean-grid opacity-100" />
      {/* Scanline */}
      <div className="absolute inset-0 scanline" />
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(180deg, #020510, transparent)' }} />
    </div>
  );
}

function SonarPing() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="sonar-ring absolute w-full h-full" />
      <div className="sonar-ring-2 absolute w-full h-full" />
      <div className="sonar-ring-3 absolute w-full h-full" />
      <div className="w-2 h-2 rounded-full bg-accent"
        style={{ boxShadow: '0 0 10px #0ea5e9, 0 0 20px rgba(14,165,233,0.5)' }} />
    </div>
  );
}

function Feature({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative group p-6 rounded-lg panel panel-hover transition-all duration-300"
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2), transparent)', opacity: 0 }}
      />
      <div className="absolute top-0 left-6 w-8 h-px bg-accent/30 group-hover:w-16 transition-all duration-300" />
      <div className="w-10 h-10 rounded flex items-center justify-center mb-4"
        style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
        <Icon size={16} className="text-accent" />
      </div>
      <h3 className="font-display font-semibold text-slate-200 mb-2 text-sm tracking-wide">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'INPUT STACK', desc: 'List AI tools you pay for — plan, seats, monthly spend.' },
    { n: '02', title: 'ENGINE SCANS', desc: 'Checks plan-fit, team size, use case alignment, cross-tool overlap.' },
    { n: '03', title: 'SAVINGS FOUND', desc: 'Instant breakdown with per-tool recommendations and reasoning.' },
    { n: '04', title: 'SHARE & ACT', desc: 'Get a unique share URL. Connect to Credex for deeper discounts.' },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="relative"
        >
          {i < 3 && (
            <div className="hidden md:block absolute top-7 left-full w-full h-px z-10"
              style={{ background: 'linear-gradient(90deg, rgba(14,165,233,0.3), transparent)', width: '100%' }} />
          )}
          <div className="w-14 h-14 rounded flex items-center justify-center mb-4 relative"
            style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <span className="font-mono text-accent font-bold text-sm">{step.n}</span>
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-accent/60" />
            <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-accent/60" />
          </div>
          <h3 className="font-display font-bold text-slate-200 mb-2 text-xs tracking-widest">{step.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

function SocialProof() {
  const quotes = [
    { quote: "Found $320/mo in savings in 90 seconds. The overlap detection between Cursor and Copilot was the aha moment.", name: "M.P.", role: "CTO, 8-person SaaS" },
    { quote: "Finally. A tool that doesn't try to upsell you on something before showing you the data.", name: "J.K.", role: "Engineering Manager" },
    { quote: "Used this before our Q2 planning. Saved $4k annually just by right-sizing our Claude plan.", name: "A.R.", role: "Founder, AI startup" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {quotes.map((q, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-lg panel relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent/40 to-transparent" />
          <p className="text-slate-400 text-sm leading-relaxed mb-4 italic">"{q.quote}"</p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-mono text-accent"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
              {q.name[0]}
            </div>
            <div>
              <div className="text-slate-300 text-xs font-medium">{q.name}</div>
              <div className="text-slate-600 text-xs">{q.role}</div>
            </div>
            <div className="ml-auto tag">MOCKED*</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-slate-200 overflow-x-hidden" style={{ background: '#020510' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50"
        style={{ background: 'rgba(2,5,16,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center relative"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)' }}>
              <Activity size={14} className="text-accent" />
              <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent/60" />
            </div>
            <span className="font-display font-bold text-sm tracking-widest text-slate-100">SPENDLENS</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-slate-600 text-xs font-mono">
              by <a href="https://credex.rocks" className="text-accent hover:text-accent-light transition-colors">CREDEX</a>
            </span>
            <button
              onClick={() => navigate('/audit')}
              className="btn-primary px-5 py-2.5 rounded flex items-center gap-2"
            >
              AUDIT STACK <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <OceanDepth />
        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded"
              style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 6px #2dd4bf' }} />
              <span className="font-mono text-xs text-accent tracking-widest">LIVE · FREE · NO SIGNUP</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <div className="font-mono text-xs text-slate-600 tracking-widest mb-4">// DIAGNOSTIC REPORT: AI SPEND ANALYSIS</div>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
              <span className="block text-slate-300">YOU'RE PROBABLY</span>
              <span className="block text-gradient glow-text">OVERPAYING</span>
              <span className="block text-slate-300">FOR AI.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Most startups overspend on AI tools by 30–60% — wrong plans, overlapping tools, seats no one uses.
            SpendLens finds it in under 2 minutes. Free, forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/audit')}
              className="btn-primary group px-10 py-4 rounded text-base flex items-center justify-center gap-3 glow-blue"
            >
              INITIATE AUDIT
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#how"
              className="btn-ghost px-10 py-4 rounded text-base flex items-center justify-center gap-2"
            >
              HOW IT WORKS <ChevronDown size={14} />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20"
          >
            {STATS.map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)' }} />
                <div className="font-display font-extrabold text-3xl sm:text-4xl text-gradient mb-1 pt-3">
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-slate-600 text-xs font-mono tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-8" style={{ background: 'linear-gradient(180deg, transparent, rgba(14,165,233,0.4))' }} />
          <ChevronDown size={14} className="text-accent/40" />
        </motion.div>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <div className="tag inline-block mb-4">PROTOCOL</div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl sm:text-4xl text-slate-100 tracking-tight"
          >
            FROM INPUT TO SAVINGS IN 4 STEPS
          </motion.h2>
        </div>
        <HowItWorks />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <div className="tag inline-block mb-4">CAPABILITIES</div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl sm:text-4xl text-slate-100 tracking-tight"
          >
            BUILT ON DEFENSIBLE LOGIC
          </motion.h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature icon={TrendingDown} title="PLAN-FIT ANALYSIS" desc="We check if you're on the right plan for your actual team size and use case — not just offering blanket discounts." delay={0} />
          <Feature icon={Zap} title="OVERLAP DETECTION" desc="Running Cursor and GitHub Copilot? We flag the redundancy and calculate the exact cost of the overlap." delay={0.05} />
          <Feature icon={BarChart2} title="TOOL ALTERNATIVES" desc="Where a cheaper tool genuinely matches your capability needs, we surface it — with honest reasoning, not marketing." delay={0.1} />
          <Feature icon={Shield} title="PRIVACY-FIRST" desc="No login to audit. Email captured after value is shown. Public share URLs strip all identifying details." delay={0.15} />
          <Feature icon={ArrowRight} title="SHAREABLE RESULTS" desc="Every audit gets a unique URL with Open Graph previews. Built for sharing in Slack, Twitter, and Notion." delay={0.2} />
          <Feature icon={Zap} title="AI SUMMARY" desc="Claude generates a personalized 100-word summary of your audit. Falls back gracefully if the API is unavailable." delay={0.25} />
        </div>
      </section>

      {/* Visual Audit Preview */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(14,165,233,0.15)', background: 'rgba(7,15,32,0.9)' }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/50" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50" />
          <div className="absolute inset-0 ocean-grid opacity-30" />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)' }} />

          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="tag mb-2">SAMPLE AUDIT OUTPUT</div>
                <h3 className="font-display font-bold text-xl text-slate-100 tracking-wide">5-PERSON DEV TEAM · CODING</h3>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-slate-600 mb-1 tracking-widest">SAVINGS IDENTIFIED</div>
                <div className="font-display font-extrabold text-3xl text-emerald-400"
                  style={{ textShadow: '0 0 20px rgba(45,212,191,0.4)' }}>$3,600/yr</div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { tool: 'Cursor Business (5 seats)', status: 'overspend', current: '$200', recommended: 'Cursor Pro (5 seats)', saving: '$100/mo', reason: 'Business tier adds org management features unused by sub-10 teams.' },
                { tool: 'GitHub Copilot Business (5 seats)', status: 'overlap', current: '$95', recommended: 'Remove (overlap with Cursor)', saving: '$95/mo', reason: 'Cursor Pro subsumes Copilot completions. Paying for both is redundant.' },
                { tool: 'ChatGPT Plus (5 seats)', status: 'optimal', current: '$100', recommended: 'Keep as-is', saving: '$0/mo', reason: 'GPT-4 access at $20/seat is efficient for your mixed usage pattern.' },
              ].map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded"
                  style={{
                    background: 'rgba(5,13,26,0.6)',
                    border: `1px solid ${row.status === 'overspend' ? 'rgba(244,63,94,0.2)' : row.status === 'overlap' ? 'rgba(245,158,11,0.2)' : 'rgba(45,212,191,0.15)'}`,
                  }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.status === 'overspend' ? 'bg-rose-400' : row.status === 'overlap' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ boxShadow: row.status === 'overspend' ? '0 0 6px #f43f5e' : row.status === 'overlap' ? '0 0 6px #f59e0b' : '0 0 6px #2dd4bf' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-slate-200 text-sm">{row.tool}</div>
                    <div className="text-slate-600 text-xs mt-0.5">{row.reason}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-slate-600 text-sm font-mono line-through">{row.current}</div>
                    <div className={`text-sm font-mono font-semibold ${row.saving === '$0/mo' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.status === 'optimal' ? '✓ OPTIMAL' : `-${row.saving}`}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social proof */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <div className="tag inline-block mb-2">FIELD REPORTS</div>
          <div className="text-xs text-slate-700 font-mono mt-2">* Testimonials are illustrative examples</div>
        </div>
        <SocialProof />
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-lg overflow-hidden p-12"
          style={{ background: 'rgba(7,15,32,0.95)', border: '1px solid rgba(14,165,233,0.2)' }}
        >
          {/* Corner marks */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent/40" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/40" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-accent/40" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/40" />
          <div className="absolute inset-0 ocean-grid opacity-20" />

          {/* Sonar ping in center background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
            <SonarPing />
          </div>

          <div className="relative z-10">
            <div className="tag inline-block mb-6">READY TO SCAN</div>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-4 text-gradient tracking-tight">
              FIND YOUR SAVINGS.
            </h2>
            <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto font-mono">
              Takes 2 minutes. Free forever. No account needed.
            </p>
            <button
              onClick={() => navigate('/audit')}
              className="btn-primary group px-12 py-5 rounded text-base flex items-center justify-center gap-3 mx-auto glow-blue"
            >
              START FREE AUDIT
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
              <Activity size={10} className="text-accent" />
            </div>
            <span className="font-display font-bold text-xs tracking-widest text-slate-400">SPENDLENS</span>
            <span className="text-slate-700 text-xs font-mono">· by Credex</span>
          </div>
          <p className="text-slate-700 text-xs font-mono">Pricing data sourced from official vendor pages. Verified weekly.</p>
        </div>
      </footer>
    </div>
  );
}
