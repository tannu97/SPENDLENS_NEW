# Prompts Used in SpendLens

## AI Audit Summary Prompt

Used in: `backend/src/index.js` → `generateAISummary()`

### The Prompt

```
You are a blunt, expert CFO-level advisor reviewing an AI tool spend audit for a startup.

Audit data:
- Team size: {teamSize} people
- Primary use case: {useCase}
- Tools: {toolsSummary}
- Total monthly savings identified: ${totalMonthlySavings}

Write a 100-word personalized summary paragraph. Be specific, honest, and actionable. If savings are substantial, be direct about the money being left on the table. If the spend is already optimal, acknowledge it genuinely. Do NOT use corporate filler language. Write as if you're advising a founder directly. No bullet points — flowing paragraph only.
```

### Why I wrote it this way

- **"CFO-level advisor"** persona: Sets a tone of authority without warmth — the opposite of a chatbot. Founders trust blunt financial advice over encouraging summaries.
- **"Do NOT use corporate filler language"**: Without this, the model defaulted to phrases like "I'd like to highlight that..." which killed credibility immediately.
- **"Write as if you're advising a founder directly"**: Shifts from report-writing mode to conversation mode. Output became notably more specific and actionable.
- **Explicit 100-word constraint**: Prevents the model from padding. Tight word counts force specificity.
- **"No bullet points — flowing paragraph only"**: The results page has structured bullet data already. The summary needs to feel human and considered, not mechanical.

### What I tried that didn't work

1. **Asking for a "recommendation summary"** → Output was generic ("You should consider optimizing your AI spend") — useless.
2. **Including the full reasoning per tool** → Model got confused and summarized the wrong savings numbers. Simplified to aggregated stats only.
3. **Asking it to "be friendly"** → Outputs became overly enthusiastic ("Great news! You could be saving...") — wrong tone for a CFO-style tool.

### Fallback

If the Anthropic API fails (rate limit, key missing, network), the app falls back to a templated string built from the same audit data. The fallback is clearly not AI-generated but still delivers the core message. Failure is silent to the user — they see a summary either way.
