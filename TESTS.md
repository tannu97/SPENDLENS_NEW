# Tests — SpendLens

## Running Tests

```bash
cd backend
npm test
```

## Test Files

| File | Coverage | How to Run |
|------|----------|------------|
| `src/__tests__/auditEngine.test.js` | Core audit logic — plan-fit, overlap, alternatives | `npm test` |

---

## Test Cases

### 1. Cursor Business downgrade for small team
- Input: Cursor Business, 3 seats, $120/mo, non-coding use case
- Expected: `status: 'overspend'`, recommendation to downgrade to Pro, savings = $60/mo

### 2. Cursor + Copilot overlap detection
- Input: Both Cursor Pro and GitHub Copilot Individual in same audit
- Expected: Overlap recommendation present in Cursor finding

### 3. Optimal plan detection — no false positives
- Input: Cursor Pro, 5 seats, $100/mo, coding use case
- Expected: `status: 'optimal'`, savings = 0

### 4. ChatGPT Team downgrade for 2-person team
- Input: ChatGPT Team, 2 seats, $60/mo
- Expected: recommendation to switch to Plus, savings = $20/mo

### 5. Multiple tools — total savings aggregation
- Input: Cursor Business (3 seats) + ChatGPT Team (2 seats)
- Expected: totalMonthlySavings = $60 + $20 = $80

### 6. API-only tool — no plan error
- Input: Anthropic API, $200/mo
- Expected: finding with info recommendation, no crash

### 7. Zero spend — graceful handling
- Input: Cursor Pro, 1 seat, $0/mo
- Expected: no crash, finding with optimal or info status

### 8. Large team — enterprise recommendation retained
- Input: Cursor Business, 50 seats, $2000/mo
- Expected: no downgrade recommendation (Business is appropriate at scale)
