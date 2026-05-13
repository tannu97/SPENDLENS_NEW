import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Activity, Info, ChevronDown } from 'lucide-react';
import { TOOLS, USE_CASES, getToolById } from '../data/tools';
import { useAuditStore } from '../hooks/useAuditStore';

function ToolCard({ toolEntry, onUpdate, onRemove }) {
  const toolDef = getToolById(toolEntry.toolId);
  if (!toolDef) return null;
  const isApiOnly = toolDef.plans.length === 1 && toolDef.plans[0].id === 'api';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="group relative p-5 rounded-lg transition-all duration-200"
      style={{
        background: 'rgba(7,15,32,0.8)',
        border: '1px solid rgba(13,31,60,0.9)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(13,31,60,0.9)'}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center font-mono text-lg font-bold relative"
              style={{ backgroundColor: `${toolDef.color}15`, border: `1px solid ${toolDef.color}30`, color: toolDef.color }}>
              {toolDef.logo}
              <div className="absolute -top-px -left-px w-2 h-2 border-t border-l"
                style={{ borderColor: toolDef.color + '60' }} />
            </div>
            <div>
              <div className="font-display font-semibold text-slate-200 text-sm tracking-wide">{toolDef.name}</div>
              <div className="text-slate-600 text-xs font-mono capitalize tracking-wider">{toolDef.category}</div>
            </div>
          </div>
          <button onClick={onRemove}
            className="p-1.5 rounded text-slate-700 hover:text-rose-400 transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {!isApiOnly && (
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1.5 tracking-widest">PLAN</label>
              <div className="relative">
                <select
                  value={toolEntry.plan}
                  onChange={e => onUpdate({ plan: e.target.value })}
                  className="w-full appearance-none rounded-sm px-3 py-2 text-sm text-slate-200 cursor-pointer pr-8 input-field"
                >
                  <option value="">Select plan</option>
                  {toolDef.plans.map(p => (
                    <option key={p.id} value={p.id}>{p.label}{p.price !== null ? ` · $${p.price}/seat` : ''}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-accent/50 pointer-events-none" />
              </div>
            </div>
          )}

          {!isApiOnly && (
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1.5 tracking-widest">SEATS</label>
              <input
                type="number"
                min="1"
                max="9999"
                value={toolEntry.seats}
                onChange={e => onUpdate({ seats: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full rounded-sm px-3 py-2 text-sm input-field"
              />
            </div>
          )}

          <div className={isApiOnly ? 'sm:col-span-3' : ''}>
            <label className="block text-xs font-mono text-slate-600 mb-1.5 tracking-widest">MONTHLY ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-mono">$</span>
              <input
                type="number"
                min="0"
                value={toolEntry.monthlySpend || ''}
                placeholder="0"
                onChange={e => onUpdate({ monthlySpend: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-sm pl-7 pr-3 py-2 text-sm input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddToolModal({ onAdd, existing, onClose }) {
  const available = TOOLS.filter(t => !existing.includes(t.id));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(2,5,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-lg p-6 relative"
        style={{ background: '#070f20', border: '1px solid rgba(14,165,233,0.2)' }}
      >
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-accent/50" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-accent/50" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-accent/50" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-accent/50" />

        <h3 className="font-display font-bold text-sm tracking-widest mb-4 text-slate-100">ADD AI TOOL</h3>
        <div className="grid grid-cols-2 gap-2">
          {available.map(tool => (
            <button
              key={tool.id}
              onClick={() => { onAdd(tool.id); onClose(); }}
              className="flex items-center gap-3 p-3 rounded text-left transition-all duration-200"
              style={{ background: 'rgba(5,13,26,0.8)', border: '1px solid rgba(13,31,60,0.9)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)'; e.currentTarget.style.background = 'rgba(14,165,233,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(13,31,60,0.9)'; e.currentTarget.style.background = 'rgba(5,13,26,0.8)'; }}
            >
              <span className="w-8 h-8 rounded flex items-center justify-center font-mono text-sm font-bold"
                style={{ backgroundColor: `${tool.color}15`, border: `1px solid ${tool.color}30`, color: tool.color }}>
                {tool.logo}
              </span>
              <span className="text-slate-300 text-sm">{tool.name}</span>
            </button>
          ))}
        </div>
        {available.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-4 font-mono">ALL TOOLS ADDED</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function AuditPage() {
  const navigate = useNavigate();
  const { tools, teamSize, useCase, addTool, removeTool, updateTool, setTeamSize, setUseCase, reset } = useAuditStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSpend = tools.reduce((s, t) => s + (t.monthlySpend || 0), 0);
  const isValid = tools.length > 0 && tools.every(t => t.plan || t.toolId === 'anthropic_api' || t.toolId === 'openai_api');

  async function handleSubmit() {
    if (!isValid) { setError('Please select a plan for each tool you added.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: tools.map(t => ({
            toolId: t.toolId,
            plan: t.plan || 'api',
            seats: t.seats || 1,
            monthlySpend: t.monthlySpend || 0,
          })),
          teamSize,
          useCase,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed');
      navigate(`/results/${data.auditId}`, { state: data });
    } catch (err) {
      setError(err.message || 'Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-slate-200" style={{ background: '#020510' }}>
      {/* Header */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(2,5,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(13,31,60,0.8)' }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded flex items-center justify-center relative"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)' }}>
              <Activity size={12} className="text-accent" />
            </div>
            <span className="font-display font-bold text-xs tracking-widest text-slate-300">SPENDLENS</span>
          </button>
          <div className="flex items-center gap-4">
            {tools.length > 0 && (
              <span className="text-slate-600 text-xs font-mono">
                ${totalSpend.toLocaleString()}/mo tracked
              </span>
            )}
            {tools.length > 0 && (
              <button onClick={reset}
                className="text-xs text-slate-700 hover:text-rose-400 transition-colors font-mono tracking-wider">
                RESET
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="tag inline-block mb-4"
          >
            STEP 01 / 02 · STACK INPUT
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 mb-3 tracking-tight"
          >
            WHAT AI TOOLS DO YOU PAY FOR?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 leading-relaxed text-sm"
          >
            Add each tool, select your current plan, and enter how much you actually pay per month (including any annual discounts applied monthly).
          </motion.p>
        </div>

        {/* Context fields */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid sm:grid-cols-2 gap-4 mb-8 p-5 rounded-lg relative"
          style={{ background: 'rgba(7,15,32,0.8)', border: '1px solid rgba(13,31,60,0.9)' }}
        >
          <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-accent/30" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-accent/30" />
          <div>
            <label className="block text-xs font-mono text-slate-600 mb-2 tracking-widest">TEAM SIZE (PEOPLE)</label>
            <input
              type="number"
              min="1"
              max="9999"
              value={teamSize}
              onChange={e => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-sm px-3 py-2.5 text-sm input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-600 mb-2 tracking-widest">PRIMARY USE CASE</label>
            <div className="relative">
              <select
                value={useCase}
                onChange={e => setUseCase(e.target.value)}
                className="w-full appearance-none rounded-sm px-3 py-2.5 text-sm cursor-pointer pr-8 input-field"
              >
                {USE_CASES.map(u => <option key={u.id} value={u.id}>{u.icon} {u.label}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent/50 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Tools */}
        <div className="space-y-3 mb-6">
          <AnimatePresence mode="popLayout">
            {tools.map(t => (
              <ToolCard
                key={t.toolId}
                toolEntry={t}
                onUpdate={updates => updateTool(t.toolId, updates)}
                onRemove={() => removeTool(t.toolId)}
              />
            ))}
          </AnimatePresence>

          {tools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center rounded-lg"
              style={{ border: '1px dashed rgba(13,31,60,0.9)', background: 'rgba(5,13,26,0.4)' }}
            >
              <div className="text-accent/20 mb-2 text-3xl font-display font-bold">+</div>
              <p className="text-slate-700 text-sm font-mono tracking-wider">ADD YOUR FIRST AI TOOL</p>
            </motion.div>
          )}
        </div>

        {/* Add tool button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3.5 rounded flex items-center justify-center gap-2 text-sm font-mono text-slate-600 tracking-widest mb-8 transition-all duration-200"
          style={{ border: '1px dashed rgba(14,165,233,0.15)', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.35)'; e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.background = 'rgba(14,165,233,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.15)'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
        >
          <Plus size={14} />
          ADD AI TOOL
        </button>

        {/* Info box */}
        <div className="flex gap-3 p-4 rounded mb-8"
          style={{ background: 'rgba(5,13,26,0.6)', border: '1px solid rgba(13,31,60,0.7)' }}>
          <Info size={13} className="text-accent/40 flex-shrink-0 mt-0.5" />
          <p className="text-slate-600 text-xs leading-relaxed font-mono">
            Enter what you actually pay — including any negotiated rates. For API tools, enter your actual last month's bill. The audit is only as accurate as your input.
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded text-rose-400 text-sm font-mono text-xs"
              style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="btn-primary w-full py-4 rounded text-sm flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
          style={isValid && !loading ? {} : {}}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white"
              />
              SCANNING STACK...
            </>
          ) : (
            <>
              EXECUTE AUDIT
              <ArrowRight size={14} />
            </>
          )}
        </button>

        <p className="text-center text-slate-700 text-xs mt-4 font-mono tracking-wider">
          NO ACCOUNT REQUIRED · RESULTS IN UNDER 5 SECONDS
        </p>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddToolModal
            onAdd={addTool}
            existing={tools.map(t => t.toolId)}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
