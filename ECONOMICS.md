# Unit Economics — SpendLens for Credex

## What a Converted Lead Is Worth

Credex sells discounted AI credits. Assume:
- Average deal: $2,400 one-time credit purchase (conservative — a 10-person team buying 6 months of Cursor credits at a 30% discount)
- Gross margin on credits: ~20% (thin, sourced from overforecast inventory)
- **Revenue per converted customer: ~$480**
- Repeat purchase rate: 40% within 6 months (teams re-buy when credits run out)
- **Blended LTV: ~$480 × 1.4 = $672 per customer**

## CAC by Channel

| Channel | Cost | Est. Conversion | CAC |
|---------|------|-----------------|-----|
| HN Show HN post | $0 (time: 2hrs) | 500 visits → 50 emails → 3 purchases | ~$0 cash, ~$20 time |
| Discord drops | $0 | 200 visits → 15 emails → 1 purchase | ~$0 |
| Twitter thread | $0 | 300 impressions → 30 clicks → 2 emails → 0.15 purchase | $0 |
| Credex customer email | $0 (existing list) | 200 sends → 40 audits → 5 consultations → 2 purchases | ~$0 |

**Blended CAC (MVP phase): <$50** (mostly founder time, no paid spend)

## Conversion Funnel

```
Landing page visit       → Audit started:        35% (high intent tool)
Audit started            → Audit completed:       70% (form is fast)
Audit completed          → Email captured:        15% overall
                           - High savings (>$500): 35% conversion
                           - Low savings (<$100):   8% conversion
Email captured           → Credex consultation:   20% (for high-savings leads)
Consultation booked      → Credit purchase:       30%
```

**From 1,000 visitors:**
- 350 start audit
- 245 complete audit
- ~37 emails captured
- ~7 consultation bookings (from high-savings cohort)
- ~2 credit purchases
- **Revenue: 2 × $480 = $960 from 1,000 visitors**
- **RPV: $0.96/visitor** — strong for a free tool with no ad spend

## Path to $1M ARR in 18 Months

$1M ARR = ~$83k/month revenue = ~173 purchases/month at $480 avg

Working backward:
- 173 purchases/month ← 577 consultations/month ← 2,885 email leads/month ← 19,233 audit completions/month
- 19,233 completions = ~27,000 visits/month to SpendLens

**What has to be true:**
1. The tool goes viral on HN or Product Hunt (plausible — 10k+ visits in week 1 from a good launch)
2. Credex closes 30% of consultations (requires a sharp sales motion — doable with 1 person)
3. Share URL mechanic drives 20%+ of new visits organically (the public share page is a full-funnel CTA)
4. Q2/Q3 2025 pricing changes from major vendors keep the audit relevant (they always do)

**Inputs that could collapse the model:**
- Consultation close rate drops to 10% → need 3x the visits
- AI tool vendors simplify pricing → fewer optimization opportunities → lower audit value
- Credex can't fulfill demand on popular credits → bottleneck isn't the tool, it's inventory

**The honest version**: $1M ARR in 18 months requires either a viral moment (HN/PH) or Credex's existing sales team using SpendLens as a cold outreach opener at scale. The unit economics work — the question is volume.
