import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Share2, Mail, ExternalLink, CheckCircle,
  AlertTriangle, XCircle, ArrowRight, Sparkles, Copy, Check
} from 'lucide-react';
import { getToolById } from '../data/tools';

function CountUp({ target, prefix = '', suffix = '', duration = 1500 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || target === 0) { setValue(target); return; }
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.floor(start));
      if (start >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);

  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>;
}

const STATUS_CONFIG = {
  overspend: { icon: XCircle, color: 'text-rose-400', borderColor: 'rgba(244,63,94,0.2)', bgColor: 'rgba(244,63,94,0.04)', label: 'OVERSPEND', dot: '#f43f5e' },
  overlap: { icon: AlertTriangle, color: 'text-amber-400', borderColor: 'rgba(245,158,11,0.2)', bgColor: 'rgba(245,158,11,0.04)', label: 'OVERLAP', dot: '#f59e0b' },
  optimal: { icon: CheckCircle, color: 'text-emerald-400', borderColor: 'rgba(45,212,191,0.15)', bgColor: 'rgba(45,212,191,0.03)', label: 'OPTIMAL', dot: '#2dd4bf' },
  review: { icon: AlertTriangle, color: 'text-amber-400', borderColor: 'rgba(245,158,11,0.2)', bgColor: 'rgba(245,158,11,0.04)', label: 'REVIEW', dot: '#f59e0b' },
};

function RecommendationRow({ rec, i }) {
  const typeConfig = {
    downgrade: { badge: 'DOWNGRADE', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
    overlap: { badge: 'OVERLAP', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    alternative: { badge: 'ALTERNATIVE', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)' },
    optimal: { badge: 'OPTIMAL', color: '#2dd4bf', bg: 'rgba(45,212,191,0.08)' },
    info: { badge: 'NOTE', color: '#64748b', bg: 'rgba(100,116,139,0.08)' },
  };
  const tc = typeConfig[rec.type] || typeConfig.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.08 }}
      className="flex flex-col sm:flex-row sm:items-start gap-3 py-3 border-t"
      style={{ borderColor: 'rgba(13,31,60,0.8)' }}
    >
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold flex-shrink-0 tracking-widest"
        style={{ color: tc.color, background: tc.bg, border: `1px solid ${tc.color}30` }}>
        {tc.badge}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-slate-200 text-sm font-medium mb-0.5">{rec.action}</div>
        <div className="text-slate-600 text-xs leading-relaxed font-mono">{rec.reason}</div>
      </div>
      {rec.savings > 0 && (
        <div className="text-emerald-400 font-mono font-bold text-sm flex-shrink-0"
          style={{ textShadow: '0 0 10px rgba(45,212,191,0.3)' }}>
          −${rec.savings.toLocaleString()}/mo
        </div>
      )}
    </motion.div>
  );
}

function FindingCard({ finding, index }) {
  const toolDef = getToolById(finding.toolId);
  const sc = STATUS_CONFIG[finding.status] || STATUS_CONFIG.optimal;
  const Icon = sc.icon;
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${sc.borderColor}`, background: sc.bgColor }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-5 text-left transition-all"
        style={{ background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 relative"
            style={{ backgroundColor: `${toolDef?.color || '#666'}15`, border: `1px solid ${toolDef?.color || '#666'}30`, color: toolDef?.color || '#aaa' }}>
            {toolDef?.logo || '?'}
            <div className="absolute -top-px -left-px w-2 h-2 border-t border-l"
              style={{ borderColor: (toolDef?.color || '#666') + '40' }} />
          </div>
          <div>
            <div className="font-display font-semibold text-slate-200 text-sm tracking-wide">{finding.toolName}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-mono tracking-widest ${sc.color}`}>{sc.label}</span>
              <span className="text-slate-700 text-xs">·</span>
              <span className="text-slate-600 text-xs font-mono">{finding.currentPlan} · ${finding.currentSpend}/mo</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {finding.savings > 0 && (
            <div className="text-right hidden sm:block">
              <div className="text-emerald-400 font-mono font-bold text-sm">−${finding.savings}/mo</div>
              <div className="text-slate-700 text-xs font-mono">−${finding.savings * 12}/yr</div>
            </div>
          )}
          <Icon size={15} className={sc.color} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {finding.recommendations.map((rec, i) => (
                <RecommendationRow key={i} rec={rec} i={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LeadCapture({ auditId, totalSavings }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [hp, setHp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) { setErr('Enter a valid email'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, role, auditId, honeypot: hp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
    } catch (err) {
      setErr(err.message || 'Failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" style={{ filter: 'drop-shadow(0 0 10px rgba(45,212,191,0.4))' }} />
        <div className="font-display font-bold text-sm tracking-widest text-slate-100 mb-1">REPORT SAVED</div>
        <p className="text-slate-500 text-sm font-mono">Check your inbox. We'll be in touch if Credex credits can unlock more savings.</p>
      </motion.div>
    );
  }

  const isHighSavings = totalSavings > 500;

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-display font-bold text-sm tracking-widest text-slate-100 mb-2">
          {isHighSavings ? 'UNLOCK DEEPER SAVINGS WITH CREDEX' : 'GET NOTIFIED WHEN NEW OPTIMIZATIONS APPLY'}
        </h3>
        <p className="text-slate-500 text-sm font-mono leading-relaxed">
          {isHighSavings
            ? `You're leaving $${totalSavings}/mo on the table. Credex sells discounted AI credits from companies that overforecast — often 20–40% below retail.`
            : "Your stack is well-optimized. Leave your email and we'll notify you when better options apply to your tools."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={hp} onChange={e => setHp(e.target.value)} name="website" />
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-sm px-4 py-3 text-sm input-field placeholder-slate-700"
        />
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Company (optional)" value={company} onChange={e => setCompany(e.target.value)}
            className="rounded-sm px-3 py-2.5 text-sm input-field placeholder-slate-700" />
          <input type="text" placeholder="Role (optional)" value={role} onChange={e => setRole(e.target.value)}
            className="rounded-sm px-3 py-2.5 text-sm input-field placeholder-slate-700" />
        </div>
        {err && <p className="text-rose-400 text-xs font-mono">{err}</p>}
        <button type="submit" disabled={loading}
          className={`btn-primary w-full py-3 rounded text-xs flex items-center justify-center gap-2 ${isHighSavings ? 'glow-blue' : 'opacity-80'}`}>
          <Mail size={12} />
          {loading ? 'PROCESSING...' : isHighSavings ? 'BOOK CREDEX CONSULTATION' : 'NOTIFY ME'}
        </button>
      </form>
    </div>
  );
}

export default function ResultsPage() {
  const { auditId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!audit && auditId) {
      fetch(`/api/audit/${auditId}`)
        .then(r => r.json())
        .then(setAudit)
        .catch(() => setAudit(null))
        .finally(() => setLoading(false));
    }
  }, [auditId, audit]);

  async function copyShareLink() {
    const url = `${window.location.origin}/share/${auditId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020510' }}>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full border border-border border-t-accent"
          />
          <span className="font-mono text-xs text-slate-700 tracking-widest">SCANNING...</span>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: '#020510' }}>
        <div className="tag mb-4">404</div>
        <h2 className="font-display font-bold text-2xl text-slate-100 mb-2 tracking-tight">AUDIT NOT FOUND</h2>
        <p className="text-slate-500 mb-6 font-mono text-sm">This audit may have expired or the URL is incorrect.</p>
        <button onClick={() => navigate('/audit')} className="btn-primary px-6 py-3 rounded text-xs">RUN NEW AUDIT</button>
      </div>
    );
  }

  const { findings = [], totalMonthlySavings = 0, totalAnnualSavings = 0, summary, teamSize, useCase } = audit;
  const isHighSavings = totalMonthlySavings > 500;
  const isOptimal = totalMonthlySavings === 0;
  const overSpendCount = findings.filter(f => f.status !== 'optimal').length;

  return (
    <div className="min-h-screen text-slate-200" style={{ background: '#020510' }}>
      {/* Nav */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(2,5,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(13,31,60,0.8)' }}>
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded flex items-center justify-center"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)' }}>
              <Activity size={12} className="text-accent" />
            </div>
            <span className="font-display font-bold text-xs tracking-widest text-slate-300">SPENDLENS</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              className="btn-ghost flex items-center gap-2 px-4 py-2 rounded text-xs"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'COPIED' : 'SHARE'}
            </button>
            <button
              onClick={() => navigate('/audit')}
              className="btn-primary px-4 py-2 rounded text-xs"
            >
              NEW AUDIT
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero savings card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-lg overflow-hidden mb-8"
          style={{
            border: isOptimal ? '1px solid rgba(45,212,191,0.25)' : isHighSavings ? '1px solid rgba(14,165,233,0.3)' : '1px solid rgba(245,158,11,0.25)',
            background: 'rgba(7,15,32,0.9)',
          }}
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2"
            style={{ borderColor: isOptimal ? 'rgba(45,212,191,0.5)' : 'rgba(14,165,233,0.5)' }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2"
            style={{ borderColor: isOptimal ? 'rgba(45,212,191,0.5)' : 'rgba(14,165,233,0.5)' }} />
          <div className="absolute inset-0 ocean-grid opacity-20" />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${isOptimal ? 'rgba(45,212,191,0.4)' : 'rgba(14,165,233,0.5)'}, transparent)` }} />

          <div className="relative z-10 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="tag mb-3">
                  AUDIT COMPLETE · {findings.length} TOOL{findings.length !== 1 ? 'S' : ''} · {teamSize}-PERSON · {useCase}
                </div>
                {isOptimal ? (
                  <>
                    <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-400 mb-2 tracking-tight"
                      style={{ textShadow: '0 0 20px rgba(45,212,191,0.3)' }}>
                      STACK OPTIMIZED ✓
                    </h1>
                    <p className="text-slate-500 font-mono text-sm">Your current AI stack is optimized for your team size and use case.</p>
                  </>
                ) : (
                  <>
                    <div className="font-mono text-xs text-slate-600 mb-2 tracking-widest">SAVINGS IDENTIFIED</div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-display font-extrabold text-5xl sm:text-6xl text-gradient"
                        style={{ textShadow: '0 0 30px rgba(14,165,233,0.3)' }}>
                        $<CountUp target={totalMonthlySavings} />/mo
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm font-mono">
                      That's <span className="text-emerald-400 font-bold">${(totalAnnualSavings).toLocaleString()}/year</span> — across {overSpendCount} optimization{overSpendCount !== 1 ? 's' : ''}.
                    </p>
                  </>
                )}
              </div>

              {!isOptimal && (
                <div className="flex flex-row sm:flex-col gap-3 flex-shrink-0">
                  <div className="text-center p-4 rounded"
                    style={{ background: 'rgba(5,13,26,0.8)', border: '1px solid rgba(13,31,60,0.9)' }}>
                    <div className="font-mono font-bold text-lg text-emerald-400">${totalMonthlySavings}</div>
                    <div className="text-slate-700 text-xs mt-1 font-mono tracking-wider">PER MONTH</div>
                  </div>
                  <div className="text-center p-4 rounded"
                    style={{ background: 'rgba(5,13,26,0.8)', border: '1px solid rgba(13,31,60,0.9)' }}>
                    <div className="font-mono font-bold text-lg text-emerald-400">${(totalAnnualSavings).toLocaleString()}</div>
                    <div className="text-slate-700 text-xs mt-1 font-mono tracking-wider">PER YEAR</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* AI Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-lg mb-8 relative"
            style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.15)' }}
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent/40" />
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={12} className="text-accent" />
              <span className="tag">AI-GENERATED SUMMARY</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-mono italic">{summary}</p>
          </motion.div>
        )}

        {/* Credex CTA for high savings */}
        {isHighSavings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative p-6 rounded-lg mb-8 overflow-hidden"
            style={{ border: '1px solid rgba(14,165,233,0.25)', background: 'rgba(14,165,233,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(14,165,233,0.4), rgba(6,182,212,0.3), transparent)' }} />
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-accent/50" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="tag mb-2">POWERED BY CREDEX</div>
                <h3 className="font-display font-bold text-sm text-slate-100 mb-1 tracking-wide">CAPTURE EVEN MORE WITH DISCOUNTED AI CREDITS</h3>
                <p className="text-slate-500 text-sm font-mono leading-relaxed">Credex sells AI infrastructure credits at 20–40% below retail — sourced from companies that overforecast.</p>
              </div>
              <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 px-5 py-3 rounded text-xs flex items-center gap-2 glow-blue">
                TALK TO CREDEX <ExternalLink size={11} />
              </a>
            </div>
          </motion.div>
        )}

        {/* Per-tool breakdown */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="font-display font-bold text-xs tracking-widest text-slate-400">PER-TOOL BREAKDOWN</div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(13,31,60,0.9), transparent)' }} />
          </div>
          <div className="space-y-3">
            {findings.map((finding, i) => (
              <FindingCard key={finding.toolId} finding={finding} index={i} />
            ))}
          </div>
        </div>

        {/* Lead capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 sm:p-8 rounded-lg mb-6 relative"
          style={{ background: 'rgba(7,15,32,0.9)', border: '1px solid rgba(13,31,60,0.9)' }}
        >
          <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-accent/20" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-accent/20" />
          <LeadCapture auditId={auditId} totalSavings={totalMonthlySavings} />
        </motion.div>

        {/* Share section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ border: '1px solid rgba(13,31,60,0.8)', background: 'rgba(5,13,26,0.6)' }}
        >
          <div>
            <div className="text-slate-300 font-mono text-xs font-bold tracking-widest mb-0.5">SHARE THIS AUDIT</div>
            <div className="text-slate-700 text-xs font-mono">Personal info stripped. Tools and savings amounts only.</div>
          </div>
          <button onClick={copyShareLink}
            className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded text-xs">
            {copied ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
            {copied ? 'LINK COPIED' : 'COPY SHARE LINK'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
