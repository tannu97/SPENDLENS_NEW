# SpendLens — AI Spend Audit Tool

SpendLens is a free web app that audits AI tool subscriptions (Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, Windsurf, and more) for startups and engineering teams, surfacing overspend, plan mismatches, and tool overlaps — then calculates exact monthly and annual savings. Built as a lead-generation asset for [Credex](https://credex.rocks).

**Screenshots / Demo:** _(add Loom/YouTube link here)_

**Live URL:** _(add deployed URL here)_

---

## Terminal Commands to Run Locally (VS Code)

### Prerequisites — install these first

```
Node.js v18+     https://nodejs.org
MySQL 8+         https://dev.mysql.com/downloads/mysql/
```

### Step 1 — Clone and open in VS Code

```bash
# Open VS Code terminal (Ctrl + ` or View > Terminal)
cd path/to/spendlens
```

### Step 2 — Create your MySQL database

Open MySQL shell (or MySQL Workbench) and run:

```sql
CREATE DATABASE spendlens CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3 — Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Then open `backend/.env` in VS Code and fill in:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=spendlens

ANTHROPIC_API_KEY=sk-ant-...        # optional — get free credits at anthropic.com
SMTP_USER=your@gmail.com            # optional — for confirmation emails
SMTP_PASS=your_gmail_app_password   # use App Password, not account password
```

### Step 4 — Install dependencies

```bash
# Terminal 1 — backend
cd backend
npm install

# Terminal 2 — frontend (open a second terminal with the + button)
cd frontend
npm install
```

### Step 5 — Run database migrations

```bash
# In the backend terminal:
cd backend
npm run db:migrate
```

You should see: `All migrations complete.`

### Step 6 — Start both servers

**Terminal 1 (backend):**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:3001

**Terminal 2 (frontend):**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

### Step 7 — Run tests

```bash
cd backend
npm test
```

---

## One-command setup (after configuring .env)

```bash
bash setup.sh
```

---

## Decisions

1. **MySQL over in-memory Map** — The original used `new Map()` which loses all data on restart. MySQL gives persistent audit storage, queryable leads, and a foundation for analytics dashboards. Trade-off: requires MySQL setup locally, but Render/PlanetScale make cloud deployment trivial.

2. **Nodemailer over Resend/Postmark SDK** — Nodemailer works with any SMTP provider (Gmail, Sendgrid, SES) using a single env config. Avoids vendor lock-in at prototype stage. Trade-off: slightly more configuration for the user vs a one-liner API call.

3. **Hardcoded audit rules over AI** — The audit engine uses explicit if/else logic, not an LLM. Finance-literate reasoning requires deterministic, traceable math — not probabilistic generation. AI is used only for the personalized summary paragraph where tone matters, not math.

4. **Vite + React over Next.js** — No server-side rendering needed for an SPA audit tool. Vite's HMR is faster for development iteration, bundle size is smaller, and deployment is a static file drop. Trade-off: no built-in SSR/ISR for OG tags (handled via meta tags on the share page).

5. **Honeypot over CAPTCHA for abuse protection** — A hidden `honeypot` field is invisible to humans but filled by bots. Zero UX friction vs hCaptcha which adds a solve step. Complemented by express-rate-limit. Trade-off: sophisticated bots can bypass honeypots, but at MVP scale this is sufficient.

---

## Project Structure

```
spendlens/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── pool.js          MySQL connection pool
│   │   │   └── migrate.js       Table creation migrations
│   │   ├── __tests__/
│   │   │   └── auditEngine.test.js
│   │   └── index.js             Express API + audit engine
│   ├── .env                     (gitignored — your credentials)
│   ├── .env.example             Template for credentials
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AuditPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── SharePage.jsx
│   │   ├── hooks/useAuditStore.js
│   │   ├── data/tools.js
│   │   └── index.css
│   └── package.json
├── .github/workflows/ci.yml
├── setup.sh
├── ARCHITECTURE.md
├── DEVLOG.md
├── ECONOMICS.md
├── GTM.md
├── LANDING_COPY.md
├── METRICS.md
├── PRICING_DATA.md
├── PROMPTS.md
├── REFLECTION.md
├── TESTS.md
└── USER_INTERVIEWS.md
```
