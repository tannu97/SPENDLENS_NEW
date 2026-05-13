# Metrics — SpendLens

## North Star Metric

**Audit completions per week**

Why: An audit completion means a user got value (they saw their results). Every downstream metric — leads captured, consultations booked, credit purchases — is a multiplier on audit completions. If completions grow, revenue can grow. If completions plateau, no amount of conversion optimization helps.

"Audits started" is a vanity metric (anyone can start). "Emails captured" is too narrow (most value comes from users who audit but don't convert to email). Completions are the right fulcrum.

---

## 3 Input Metrics That Drive Completions

**1. Audit start rate (visitors → audit started)**
- Target: >30%
- Signal: Is the landing page convincing? Is the value prop clear?
- Lever: Headline copy, social proof, specificity of the savings claims

**2. Form completion rate (audit started → audit submitted)**
- Target: >65%
- Signal: Is the form too long? Too confusing?
- Lever: UX of tool-adding flow, progressive disclosure, auto-fill where possible

**3. Share/viral coefficient (completions → new visits from share)**
- Target: >0.2 (each 5 completions drives 1 new visit from a shared link)
- Signal: Are users sharing their audit URLs?
- Lever: Quality of results page, shareability of the outcome ("I found $320/mo saved" is tweet-able)

---

## What to Instrument First

1. **Pageview → audit start conversion** (Google Analytics or Plausible)
2. **Tool add funnel** (which tool gets added first, where users drop off)
3. **Audit submit → results view** (should be near 100%; failures indicate backend issues)
4. **Email capture rate by savings tier** (do high-savings users convert more? By how much?)
5. **Share link clicks** (are people actually opening shared audits?)

---

## Pivot Trigger

If **audit completion rate drops below 40%** after 500 sessions, the form UX has a problem. Specific hypothesis to investigate: users don't understand what "monthly spend" means for per-seat plans, or the plan picker is confusing. Run 5 user interviews before shipping any changes.

If **email capture rate is below 5%** after 100 completions, the results page isn't delivering enough perceived value. Either the savings identified are too small (wrong user targeting) or the presentation isn't compelling enough. Check median savings found — if it's under $50/mo, we're targeting the wrong users.
