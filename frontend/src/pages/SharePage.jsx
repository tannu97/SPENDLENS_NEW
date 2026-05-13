import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getToolById } from '../data/tools';

const STATUS_ICON = { overspend: XCircle, overlap: AlertTriangle, optimal: CheckCircle, review: AlertTriangle };
const STATUS_COLOR = { overspend: 'text-rose-400', overlap: 'text-amber-400', optimal: 'text-emerald-400', review: 'text-amber-400' };
const STATUS_BORDER = { overspend: 'rgba(244,63,94,0.2)', overlap: 'rgba(245,158,11,0.2)', optimal: 'rgba(45,212,191,0.15)', review: 'rgba(245,158,11,0.2)' };

export default function SharePage() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/audit/${auditId}`)
      .then(r => r.json())
      .then(data => { setAudit(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [auditId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020510' }}>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full border border-border border-t-accent"
          />
          <span className="font-mono text-xs text-slate-700 tracking-widest">LOADING...</span>
        </div>
      </div>
    );
  }

  if (!audit || audit.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: '#020510' }}>
        <div className="tag mb-4">LINK EXPIRED</div>
        <h2 className="font-display font-bold text-2xl text-slate-100 mb-2 tracking-tight">AUDIT NOT FOUND</h2>
        <p className="text-slate-500 mb-6 font-mono text-sm">This link may have expired.</p>
        <button onClick={() => navigate('/audit')} className="btn-primary px-6 py-3 rounded text-xs">RUN YOUR OWN AUDIT</button>
      </div>
    );
  }

  const { findings = [], totalMonthlySavings = 0, totalAnnualSavings = 0, teamSize, useCase } = audit;

  return (
    <div className="min-h-screen text-slate-200" style={{ background: '#020510' }}>
      {/* Nav */}
      <nav className="border-b border-border" style={{ background: 'rgba(2,5,16,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)' }}>
              <Activity size={12} className="text-accent" />
            </div>
            <span className="font-display font-bold text-xs tracking-widest">SPENDLENS</span>
          </div>
          <button
            onClick={() => navigate('/audit')}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded text-xs"
          >
            AUDIT MY STACK <ArrowRight size={11} />
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="tag inline-block mb-4">
            SHARED AUDIT · {teamSize}-PERSON · {useCase}
          </div>
          {totalMonthlySavings > 0 ? (
            <>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl mb-3 text-gradient tracking-tight"
                style={{ textShadow: '0 0 30px rgba(14,165,233,0.2)' }}>
                ${totalMonthlySavings}/mo
              </h1>
              <p className="text-slate-500 text-base font-mono">in identified savings · ${totalAnnualSavings.toLocaleString()}/year</p>
            </>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl mb-3 text-emerald-400 tracking-tight">
                OPTIMIZED ✓
              </h1>
              <p className="text-slate-500 text-base font-mono">This team's AI spend is well-optimized</p>
            </>
          )}
        </motion.div>

        {/* Findings */}
        <div className="space-y-2 mb-10">
          {findings.map((finding, i) => {
            const toolDef = getToolById(finding.toolId);
            const Icon = STATUS_ICON[finding.status] || CheckCircle;
            const color = STATUS_COLOR[finding.status] || 'text-emerald-400';
            const border = STATUS_BORDER[finding.status] || 'rgba(45,212,191,0.15)';

            return (
              <motion.div
                key={finding.toolId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-4 rounded"
                style={{ background: 'rgba(7,15,32,0.8)', border: `1px solid ${border}` }}
              >
                <div className="w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: `${toolDef?.color || '#666'}15`, border: `1px solid ${toolDef?.color || '#666'}30`, color: toolDef?.color || '#aaa' }}>
                  {toolDef?.logo || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-slate-200 text-sm">{finding.toolName}</div>
                  <div className="text-slate-600 text-xs font-mono">{finding.currentPlan} · ${finding.currentSpend}/mo</div>
                </div>
                <div className="flex items-center gap-2">
                  {finding.savings > 0 && (
                    <span className="font-mono text-sm text-emerald-400 font-bold">−${finding.savings}/mo</span>
                  )}
                  <Icon size={14} className={color} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-lg p-8 text-center overflow-hidden"
          style={{ background: 'rgba(7,15,32,0.95)', border: '1px solid rgba(14,165,233,0.2)' }}
        >
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-accent/40" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-accent/40" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-accent/40" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-accent/40" />
          <div className="absolute inset-0 ocean-grid opacity-20" />
          <div className="relative z-10">
            <div className="tag inline-block mb-4">FREE AI SPEND AUDIT</div>
            <h2 className="font-display font-bold text-2xl text-slate-100 mb-2 tracking-tight">
              WHAT'S YOUR AI STACK COSTING YOU?
            </h2>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto font-mono">
              Most startups overpay by 30–60%. Find out in 2 minutes. No signup required.
            </p>
            <button
              onClick={() => navigate('/audit')}
              className="btn-primary px-8 py-3.5 rounded text-sm flex items-center gap-2 mx-auto glow-blue"
            >
              RUN FREE AUDIT <ArrowRight size={13} />
            </button>
            <p className="text-slate-700 text-xs mt-3 font-mono">by Credex · credex.rocks</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
