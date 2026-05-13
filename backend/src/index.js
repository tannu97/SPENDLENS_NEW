import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import pool, { testConnection } from './db/pool.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }));

// ─── Rate Limiting ───────────────────────────────────────────────────────────

const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please try again later.' },
});

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many lead submissions. Please try again later.' },
});

// ─── External Clients ────────────────────────────────────────────────────────

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// ─── Audit Engine ────────────────────────────────────────────────────────────

const TOOLS_PRICING = {
  cursor: {
    name: 'Cursor',
    plans: {
      hobby: { price: 0, label: 'Hobby (Free)' },
      pro: { price: 20, label: 'Pro' },
      business: { price: 40, label: 'Business' },
      enterprise: { price: 100, label: 'Enterprise' },
    },
  },
  github_copilot: {
    name: 'GitHub Copilot',
    plans: {
      individual: { price: 10, label: 'Individual' },
      business: { price: 19, label: 'Business' },
      enterprise: { price: 39, label: 'Enterprise' },
    },
  },
  claude: {
    name: 'Claude (Anthropic)',
    plans: {
      free: { price: 0, label: 'Free' },
      pro: { price: 20, label: 'Pro' },
      max: { price: 100, label: 'Max' },
      team: { price: 25, label: 'Team' },
      enterprise: { price: 60, label: 'Enterprise' },
      api: { price: null, label: 'API Direct' },
    },
  },
  chatgpt: {
    name: 'ChatGPT (OpenAI)',
    plans: {
      plus: { price: 20, label: 'Plus' },
      team: { price: 30, label: 'Team' },
      enterprise: { price: 60, label: 'Enterprise' },
      api: { price: null, label: 'API Direct' },
    },
  },
  anthropic_api: {
    name: 'Anthropic API',
    plans: { api: { price: null, label: 'API Direct' } },
  },
  openai_api: {
    name: 'OpenAI API',
    plans: { api: { price: null, label: 'API Direct' } },
  },
  gemini: {
    name: 'Gemini (Google)',
    plans: {
      pro: { price: 0, label: 'Pro (Free)' },
      ultra: { price: 20, label: 'Advanced (Ultra)' },
      api: { price: null, label: 'API Direct' },
    },
  },
  windsurf: {
    name: 'Windsurf (Codeium)',
    plans: {
      free: { price: 0, label: 'Free' },
      pro: { price: 15, label: 'Pro' },
      teams: { price: 35, label: 'Teams' },
      enterprise: { price: 60, label: 'Enterprise' },
    },
  },
};

export function runAuditEngine(tools, teamSize, useCase) {
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
      currentPlan: planDef.label,
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
          finding.recommendations.push({
            type: 'downgrade',
            action: 'Downgrade to Cursor Pro',
            reason: `Business plan adds org management features unnecessary for teams of ${seats} not focused on coding. Pro gives full AI capabilities at $20/seat vs $40/seat.`,
            newSpend: 20 * seats,
            savings,
          });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
      if (tool.plan === 'enterprise' && seats <= 10) {
        const savings = currentMonthlyTotal - 40 * seats;
        if (savings > 0) {
          finding.recommendations.push({
            type: 'downgrade',
            action: 'Downgrade to Cursor Business',
            reason: `Enterprise pricing (~$100/seat) is designed for 50+ seat deployments. At ${seats} seats, Business at $40/seat provides identical AI features.`,
            newSpend: 40 * seats,
            savings,
          });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
    }

    if (tool.toolId === 'chatgpt') {
      if (tool.plan === 'team' && seats <= 2) {
        const savings = currentMonthlyTotal - 20 * seats;
        if (savings > 0) {
          finding.recommendations.push({
            type: 'downgrade',
            action: 'Switch to ChatGPT Plus (individual)',
            reason: `Team costs $30/seat vs $20/seat for Plus. For ${seats} users without shared workspace needs, Plus delivers identical GPT-4 access at 33% less.`,
            newSpend: 20 * seats,
            savings,
          });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
    }

    if (tool.toolId === 'claude') {
      if (tool.plan === 'max' && useCase === 'writing') {
        const savings = currentMonthlyTotal - 20 * seats;
        if (savings > 0) {
          finding.recommendations.push({
            type: 'downgrade',
            action: 'Downgrade to Claude Pro',
            reason: `Claude Max ($100/seat) is optimized for heavy coding/research workloads. For writing use cases, Pro ($20/seat) is sufficient — saving $80/seat monthly.`,
            newSpend: 20 * seats,
            savings,
          });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
      if (tool.plan === 'team' && seats < 5) {
        finding.recommendations.push({
          type: 'info',
          action: 'Note: Claude Team requires 5-seat minimum',
          reason: `With fewer than 5 active users, you may be paying for unused seats. Consider Claude Pro per individual or consolidate active users to meet the minimum.`,
          newSpend: currentMonthlyTotal,
          savings: 0,
        });
      }
    }

    if (tool.toolId === 'github_copilot') {
      if (tool.plan === 'enterprise' && seats <= 15 && useCase !== 'coding') {
        const savings = currentMonthlyTotal - 19 * seats;
        if (savings > 0) {
          finding.recommendations.push({
            type: 'downgrade',
            action: 'Downgrade to GitHub Copilot Business',
            reason: `Copilot Enterprise ($39/seat) adds custom org-level fine-tuning valuable at 50+ developer orgs. Business ($19/seat) covers all core coding assistance for your ${seats}-seat team.`,
            newSpend: 19 * seats,
            savings,
          });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
      if (useCase === 'coding' && seats >= 3) {
        finding.recommendations.push({
          type: 'alternative',
          action: 'Consider Cursor Pro as primary coding assistant',
          reason: `Cursor Pro ($20/seat) includes completions plus agentic multi-file editing. Teams report 20-30% productivity gains switching from Copilot to Cursor for complex codebases.`,
          newSpend: currentMonthlyTotal,
          savings: 0,
        });
      }
    }

    if (tool.toolId === 'gemini' && tool.plan === 'ultra') {
      if (useCase === 'writing' || useCase === 'research') {
        const altSpend = 20 * seats;
        const savings = currentMonthlyTotal - altSpend > 0 ? currentMonthlyTotal - altSpend : 0;
        finding.recommendations.push({
          type: 'alternative',
          action: 'Evaluate Claude Pro as primary writing/research tool',
          reason: `Gemini Advanced ($20/seat) bundles 2TB Google Drive. Claude Pro ($20/seat) consistently outperforms on long-document reasoning. If not actively using the Workspace bundle, the AI value per dollar is higher with Claude.`,
          newSpend: altSpend,
          savings,
        });
        if (savings > 0) {
          finding.savings += savings;
          finding.status = 'review';
        }
      }
    }

    if (tool.toolId === 'windsurf') {
      if (tool.plan === 'teams' && seats <= 5 && useCase === 'coding') {
        const savings = currentMonthlyTotal - 15 * seats;
        if (savings > 0) {
          finding.recommendations.push({
            type: 'downgrade',
            action: 'Downgrade to Windsurf Pro',
            reason: `Windsurf Teams ($35/seat) is admin-oriented. For teams under 5 with no compliance needs, Pro ($15/seat) provides identical AI cascade — saving $20/seat/month.`,
            newSpend: 15 * seats,
            savings,
          });
          finding.savings += savings;
          finding.status = 'overspend';
        }
      }
    }

    // Overlap detection
    if (tool.toolId === 'cursor' && tools.some(t => t.toolId === 'github_copilot')) {
      finding.recommendations.push({
        type: 'overlap',
        action: 'Potential overlap: Cursor + GitHub Copilot',
        reason: `Cursor includes its own AI model access and effectively replaces GitHub Copilot for code completion. Running both pays for duplicate capability. Most teams using Cursor drop Copilot within 30 days.`,
        newSpend: currentMonthlyTotal,
        savings: 0,
      });
    }

    if (finding.recommendations.length === 0) {
      finding.status = 'optimal';
      finding.recommendations.push({
        type: 'optimal',
        action: 'You are on the right plan',
        reason: `${toolDef.name} ${planDef.label} aligns with your team size (${seats} seats) and ${useCase} use case. No immediate action required.`,
        newSpend: currentMonthlyTotal,
        savings: 0,
      });
    }

    totalMonthlySavings += finding.savings;
    findings.push(finding);
  }

  return { findings, totalMonthlySavings, totalAnnualSavings: totalMonthlySavings * 12 };
}

// ─── AI Summary ──────────────────────────────────────────────────────────────

async function generateAISummary(auditData) {
  const { findings, totalMonthlySavings, teamSize, useCase } = auditData;
  const toolsSummary = findings
    .map(f => `${f.toolName}: spending $${f.currentSpend}/mo, savings potential $${f.savings}/mo`)
    .join('; ');

  const prompt = `You are a blunt, expert CFO-level advisor reviewing an AI tool spend audit for a startup.

Audit data:
- Team size: ${teamSize} people
- Primary use case: ${useCase}
- Tools: ${toolsSummary}
- Total monthly savings identified: $${totalMonthlySavings}

Write a 100-word personalized summary paragraph. Be specific, honest, and actionable. If savings are substantial, be direct about money left on the table. If spend is already optimal, acknowledge it genuinely. Do NOT use corporate filler language. Write as if advising a founder directly. No bullet points — flowing paragraph only.`;

  try {
    if (!anthropic) throw new Error('No API key');
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });
    return { summary: response.content[0].text, generated: true };
  } catch {
    const savingsText =
      totalMonthlySavings > 500
        ? `You have a significant $${totalMonthlySavings}/month savings opportunity — that is $${totalMonthlySavings * 12} annually.`
        : totalMonthlySavings > 0
        ? `There is a $${totalMonthlySavings}/month optimization available — worth capturing as your team scales.`
        : `Your current AI tool stack is well-optimized for your team size and use case.`;

    return {
      summary: `${savingsText} Your ${teamSize}-person team is using AI tools for ${useCase} work. ${findings.length} tools reviewed. The biggest lever is right-sizing plans to actual usage rather than buying headroom you have not needed. Revisit this audit quarterly as your team grows.`,
      generated: false,
    };
  }
}

// ─── Email ───────────────────────────────────────────────────────────────────

async function sendConfirmationEmail(email, auditId, totalMonthlySavings) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${auditId}`;
  const isHighSavings = totalMonthlySavings > 500;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Your SpendLens Audit</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
  <div style="background:#0f0f17;border-radius:12px;padding:32px;color:#e2e8f0;">
    <h2 style="margin:0 0 4px 0;font-size:22px;">SpendLens <span style="color:#64748b;font-weight:400;font-size:14px;">by Credex</span></h2>
    <h1 style="font-size:24px;font-weight:700;margin:20px 0 8px 0;">Your audit is saved.</h1>
    <p style="color:#94a3b8;margin-bottom:24px;">We found <strong style="color:#34d399;">$${totalMonthlySavings}/month</strong> in potential savings for your stack.</p>
    <a href="${shareUrl}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:24px;">View Full Report</a>
    ${isHighSavings ? `<div style="background:#1e1b4b;border:1px solid #3730a3;border-radius:8px;padding:20px;margin-bottom:24px;">
      <h3 style="color:#a5b4fc;margin:0 0 8px 0;">Capture more savings with Credex</h3>
      <p style="color:#94a3b8;margin:0;font-size:14px;">With $${totalMonthlySavings}/mo identified, you qualify for a Credex consultation. We source discounted AI credits from companies that overforecast.</p>
      <a href="https://credex.rocks" style="display:inline-block;color:#a5b4fc;margin-top:12px;font-size:14px;">Book consultation at credex.rocks</a>
    </div>` : ''}
    <p style="color:#475569;font-size:12px;margin:0;">SpendLens by Credex | credex.rocks</p>
  </div>
</body>
</html>`;

  try {
    await mailer.sendMail({
      from: `SpendLens <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your SpendLens Audit — $${totalMonthlySavings}/mo savings found`,
      html,
    });
  } catch (err) {
    console.warn('Email send failed:', err.message);
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.post('/api/audit', auditLimiter, async (req, res) => {
  try {
    const { tools, teamSize, useCase } = req.body;
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: 'Invalid input: tools array required' });
    }

    const auditResult = runAuditEngine(tools, teamSize || 1, useCase || 'mixed');
    const summaryResult = await generateAISummary({ ...auditResult, teamSize, useCase });

    const auditId = uuidv4();
    const publicAudit = {
      id: auditId,
      findings: auditResult.findings,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      summary: summaryResult.summary,
      aiGenerated: summaryResult.generated,
      teamSize,
      useCase,
      createdAt: new Date().toISOString(),
    };

    await pool.execute(
      `INSERT INTO audits (id, team_size, use_case, tools_input, findings, total_monthly_savings, total_annual_savings, summary, ai_generated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        auditId,
        teamSize || 1,
        useCase || 'mixed',
        JSON.stringify(tools),
        JSON.stringify(auditResult.findings),
        auditResult.totalMonthlySavings,
        auditResult.totalAnnualSavings,
        summaryResult.summary,
        summaryResult.generated ? 1 : 0,
      ]
    );

    res.json({ auditId, ...publicAudit });
  } catch (err) {
    console.error('Audit error:', err);
    res.status(500).json({ error: 'Audit processing failed. Please try again.' });
  }
});

app.get('/api/audit/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM audits WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Audit not found' });

    const row = rows[0];
    res.json({
      id: row.id,
      teamSize: row.team_size,
      useCase: row.use_case,
      findings: typeof row.findings === 'string' ? JSON.parse(row.findings) : row.findings,
      totalMonthlySavings: parseFloat(row.total_monthly_savings),
      totalAnnualSavings: parseFloat(row.total_annual_savings),
      summary: row.summary,
      aiGenerated: Boolean(row.ai_generated),
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error('Fetch audit error:', err);
    res.status(500).json({ error: 'Failed to fetch audit.' });
  }
});

app.post('/api/leads', leadLimiter, async (req, res) => {
  try {
    const { email, company, role, auditId, honeypot } = req.body;

    if (honeypot) return res.status(200).json({ success: true });

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const leadId = uuidv4();

    let totalMonthlySavings = 0;
    if (auditId) {
      const [rows] = await pool.execute(
        'SELECT total_monthly_savings FROM audits WHERE id = ?',
        [auditId]
      );
      if (rows.length) totalMonthlySavings = parseFloat(rows[0].total_monthly_savings);
    }

    await pool.execute(
      `INSERT INTO leads (id, email, company, role, audit_id) VALUES (?, ?, ?, ?, ?)`,
      [leadId, email, company || null, role || null, auditId || null]
    );

    await sendConfirmationEmail(email, auditId, totalMonthlySavings);

    await pool.execute('UPDATE leads SET email_sent = TRUE WHERE id = ?', [leadId]);

    res.json({ success: true, message: 'Audit report saved. Check your inbox.' });
  } catch (err) {
    console.error('Lead capture error:', err);
    res.status(500).json({ error: 'Failed to save. Please try again.' });
  }
});

app.get('/api/health', async (_, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'disconnected' });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────

const ok = await testConnection();
if (!ok) {
  console.warn('MySQL not reachable. Run: npm run db:migrate after fixing .env credentials.');
}

app.listen(PORT, () => console.log(`SpendLens API running on :${PORT}`));
