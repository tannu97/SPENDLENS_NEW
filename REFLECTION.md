# REFLECTION — SpendLens

> Answer all 5 questions, 150–400 words each. Be specific — vague answers score poorly.

---

## 1. The Hardest Bug You Hit This Week

**[Fill this in with your actual experience]**

The hardest bug was in the audit engine's overlap detection logic. When a user added both Cursor and GitHub Copilot, the overlap recommendation was being appended to *both* tool findings — so the same recommendation appeared twice on the results page, making it look like we were double-counting savings.

My first hypothesis was that the loop was mutating shared state. I added `console.log` at each step of the findings loop and found the recommendations array was being pushed to correctly — but the render was showing duplicates. Second hypothesis: React's key prop was wrong, causing re-renders to merge entries incorrectly. Checked — keys were correct.

The real issue: the overlap check ran inside the Cursor finding loop *and* inside the Copilot finding loop. The recommendation text was slightly different but both were showing up. Fix: refactored overlap detection to run *after* all per-tool findings were built, as a post-processing step. This meant one pass over the findings array for overlaps rather than embedding overlap checks inside each tool's rule set.

Lesson: cross-tool rules don't belong inside per-tool rule evaluation. The separation of concerns made the engine cleaner and easier to test.

---

## 2. A Decision You Reversed Mid-Week

**[Fill this in with your actual experience]**

I initially built the results page to fetch audit data from the backend on mount (using the `auditId` from the URL). This felt "correct" — single source of truth, clean URL-based state.

The problem: it introduced a loading state on the most important page of the product. Users who just submitted a form were waiting again, even though all the data was already computed. The perceived performance was terrible.

I reversed this by passing the full audit result through React Router's `location.state` on navigation from the audit form. The results page renders instantly with zero additional fetch. The fetch-on-mount path is kept as a fallback for users who navigate to the URL directly or reload the page.

The tradeoff: router state isn't persistent across hard refreshes. But for the primary happy path (form → results), instant rendering was worth it. The share URL (`/share/:auditId`) correctly fetches from the API since it's always a direct link.

---

## 3. What You'd Build in Week 2

**[Fill this in — be specific]**

Week 2 would focus on three things:

**PDF export**: The results page is screenshot-worthy already, but a proper PDF with the Credex logo, per-tool breakdown table, and a cover page summary would be something founders actually save and share with their board. `react-pdf` or a server-side Puppeteer render would work.

**Benchmark mode**: "Your AI spend per developer is $X — companies your size average $Y." This requires aggregating anonymized audit data I'd be collecting in week 1. Even with 50 audits, the benchmarks would be directionally useful and create a compelling reason to return.

**Shareable Twitter card**: Dynamic OG images generated per audit (via Satori or a Canvas render endpoint) that show the total savings number large and clear. The generic OG image is a missed viral opportunity — a card showing "$340/mo saved" with the SpendLens logo would drive meaningful click-through.

---

## 4. How You Used AI Tools

**[Fill this in honestly]**

Used Claude (Sonnet 4.5) throughout the week via the API and claude.ai.

**For**: Drafting the initial audit engine rule structure (then reviewed and corrected every number against official pricing pages), writing boilerplate Express middleware, generating Tailwind class combinations for the UI, and drafting the AI summary prompt.

**Didn't trust it for**: Pricing data. Claude's training data is months old — every price was manually verified against official vendor pages and cited in PRICING_DATA.md. The model confidently stated GitHub Copilot Individual was $10/month, which was right, but also said Claude Pro was $18/month, which was wrong (it's $20). Caught by cross-referencing the official page.

**One time the AI was wrong**: Asked Claude to generate the overlap detection logic. It produced a check that flagged Cursor + Copilot overlap but *also* flagged Claude + ChatGPT as an overlap. That's wrong — they're genuinely different tools with different capabilities, and flagging them as overlapping would make the audit useless. Rewrote that rule manually.

---

## 5. Self-Rating

| Dimension | Rating | Reason |
|-----------|--------|--------|
| Discipline | X/10 | [One sentence] |
| Code quality | X/10 | [One sentence] |
| Design sense | X/10 | [One sentence] |
| Problem-solving | X/10 | [One sentence] |
| Entrepreneurial thinking | X/10 | [One sentence] |
