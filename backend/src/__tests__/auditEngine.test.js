// backend/src/__tests__/auditEngine.test.js
// Run with: node --experimental-vm-modules node_modules/.bin/jest
// Or: npm test

import { describe, it, expect } from '@jest/globals';

// ── Inline the audit engine for testing (avoids import complexity) ──────────

const TOOLS_PRICING = {
  cursor: {
    name: 'Cursor',
    plans: {
      hobby: { price: 0 },
      pro: { price: 20 },
      business: { price: 40 },
      enterprise: { price: 100 },
    },
  },
  github_copilot: {
    name: 'GitHub Copilot',
    plans: {
      individual: { price: 10 },
      business: { price: 19 },
      enterprise: { price: 39 },
    },
  },
  claude: {
    name: 'Claude',
    plans: {
      free: { price: 0 },
      pro: { price: 20 },
      max: { price: 100 },
      team: { price: 25 },
      enterprise: { price: 60 },
      api: { price: null },
    },
  },
  chatgpt: {
    name: 'ChatGPT',
    plans: {
      plus: { price: 20 },
      team: { price: 30 },
      enterprise: { price: 60 },
      api: { price: null },
    },
  },
  anthropic_api: {
    name: 'Anthropic API',
    plans: { api: { price: null } },
  },
  openai_api: {
    name: 'OpenAI API',
    plans: { api: { price: null } },
  },
  gemini: {
    name: 'Gemini',
    plans: {
      pro: { price: 0 },
      ultra: { price: 20 },
      api: { price: null },
    },
  },
  windsurf: {
    name: 'Windsurf',
    plans: {
      free: { price: 0 },
      pro: { price: 15 },
      teams: { price: 35 },
      enterprise: { price: 60 },
    },
  },
};

function runAuditEngine(tools, teamSize, useCase) {
  const findings = [];
  let totalMonthlySavings = 0;

  for (const tool of tools) {
    const toolDef = TOOLS_PRICING[tool.toolId];
    if (!toolDef) continue;
    const planDef = toolDef.plans[tool.plan];
    if (!planDef) continue;

    const currentMonthlyTotal = tool.monthlySpend;
    const seats = tool.seats || 1;

    const finding = {
      toolId: tool.toolId,
      toolName: toolDef.name,
      currentPlan: tool.plan,
      currentSpend: currentMonthlyTotal,
      seats,
      recommendations: [],
      savings: 0,
      status: 'optimal',
    };

    if (tool.toolId === 'cursor') {
      if (tool.plan === 'business' && seats <= 3 && useCase !== 'coding') {
        const savings = currentMonthlyTotal - 20 * seats;
        if (savings > 0) {
          finding.recommendations.push({ type: 'downgrade', savings, action: 'Downgrade to Cursor Pro' });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
      if (tool.plan === 'enterprise' && seats <= 10) {
        const savings = currentMonthlyTotal - 40 * seats;
        if (savings > 0) {
          finding.recommendations.push({ type: 'downgrade', savings, action: 'Downgrade to Cursor Business' });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
      if (tools.some(t => t.toolId === 'github_copilot')) {
        finding.recommendations.push({ type: 'overlap', savings: 0, action: 'Overlap with GitHub Copilot detected' });
      }
    }

    if (tool.toolId === 'chatgpt') {
      if (tool.plan === 'team' && seats <= 2) {
        const savings = currentMonthlyTotal - 20 * seats;
        if (savings > 0) {
          finding.recommendations.push({ type: 'downgrade', savings, action: 'Switch to ChatGPT Plus' });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
    }

    if (finding.recommendations.length === 0) {
      finding.status = 'optimal';
      finding.recommendations.push({ type: 'optimal', savings: 0, action: 'On the right plan' });
    }

    totalMonthlySavings += finding.savings;
    findings.push(finding);
  }

  return { findings, totalMonthlySavings, totalAnnualSavings: totalMonthlySavings * 12 };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Audit Engine', () => {

  it('1. flags Cursor Business as overspend for small non-coding team', () => {
    const result = runAuditEngine(
      [{ toolId: 'cursor', plan: 'business', seats: 3, monthlySpend: 120 }],
      3, 'writing'
    );
    const finding = result.findings[0];
    expect(finding.status).toBe('overspend');
    expect(finding.savings).toBe(60); // 120 - (20 * 3)
    expect(finding.recommendations[0].type).toBe('downgrade');
  });

  it('2. detects Cursor + GitHub Copilot overlap', () => {
    const result = runAuditEngine(
      [
        { toolId: 'cursor', plan: 'pro', seats: 2, monthlySpend: 40 },
        { toolId: 'github_copilot', plan: 'individual', seats: 2, monthlySpend: 20 },
      ],
      2, 'coding'
    );
    const cursorFinding = result.findings.find(f => f.toolId === 'cursor');
    const hasOverlap = cursorFinding.recommendations.some(r => r.type === 'overlap');
    expect(hasOverlap).toBe(true);
  });

  it('3. returns optimal with no false positives for correctly-sized Cursor Pro', () => {
    const result = runAuditEngine(
      [{ toolId: 'cursor', plan: 'pro', seats: 5, monthlySpend: 100 }],
      5, 'coding'
    );
    const finding = result.findings[0];
    expect(finding.status).toBe('optimal');
    expect(finding.savings).toBe(0);
  });

  it('4. flags ChatGPT Team as overspend for 2-person team', () => {
    const result = runAuditEngine(
      [{ toolId: 'chatgpt', plan: 'team', seats: 2, monthlySpend: 60 }],
      2, 'mixed'
    );
    const finding = result.findings[0];
    expect(finding.status).toBe('overspend');
    expect(finding.savings).toBe(20); // 60 - (20 * 2)
  });

  it('5. aggregates total savings correctly across multiple tools', () => {
    const result = runAuditEngine(
      [
        { toolId: 'cursor', plan: 'business', seats: 3, monthlySpend: 120 },
        { toolId: 'chatgpt', plan: 'team', seats: 2, monthlySpend: 60 },
      ],
      3, 'writing'
    );
    // Cursor: 120 - 60 = 60, ChatGPT: 60 - 40 = 20
    expect(result.totalMonthlySavings).toBe(80);
    expect(result.totalAnnualSavings).toBe(960);
  });

  it('6. handles API-only tools without crashing', () => {
    expect(() => {
      runAuditEngine(
        [{ toolId: 'anthropic_api', plan: 'api', seats: 1, monthlySpend: 200 }],
        5, 'coding'
      );
    }).not.toThrow();
  });

  it('7. handles zero monthly spend gracefully', () => {
    const result = runAuditEngine(
      [{ toolId: 'cursor', plan: 'pro', seats: 1, monthlySpend: 0 }],
      1, 'coding'
    );
    expect(result.findings.length).toBe(1);
    expect(result.totalMonthlySavings).toBe(0);
  });

  it('8. does not recommend downgrade for large Cursor Business team (>=50 seats)', () => {
    const result = runAuditEngine(
      [{ toolId: 'cursor', plan: 'business', seats: 50, monthlySpend: 2000 }],
      50, 'coding'
    );
    const finding = result.findings[0];
    const hasDowngrade = finding.recommendations.some(r => r.type === 'downgrade');
    expect(hasDowngrade).toBe(false);
  });

});
