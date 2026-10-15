# AI Prompt Improvement Assistant

> **Turn Simple Ideas into Powerful AI Prompts.**

A production-grade prompt engineering, auditing, and optimization application. Powered by **Groq Cloud API** and **openai/gpt-oss-120b**, styled with a distinctive **editorial visual identity** (warm parchment, deep forest green, terracotta, and charcoal ink), and offering **100% public, registration-free access** with 1,000 daily free credits.

- **Live Website:** [https://ai-prompt-assistant-jet.vercel.app](https://ai-prompt-assistant-jet.vercel.app)
- **GitHub Repository:** [https://github.com/Harikrishna559/ai-prompt-assistant](https://github.com/Harikrishna559/ai-prompt-assistant)

---

## Key Features

- **100% Public Access (No Login Required):** All pages and features (Home, Improve Prompt, Templates, Dashboard, History, About) are freely accessible without accounts, sign-ups, or login barriers.
- **Groq Cloud API Integration (`openai/gpt-oss-120b`):** Ultra-fast OpenAI-compatible chat completions running on Groq LPUs with resilient, zero-failure rule-based fallback protection.
- **1,000 Daily Free Credits:** Generous daily allowance of 1,000 prompt improvements per user with server-side enforcement, automated local timezone midnight resets, and real-time visual progress monitoring.
- **Objective Quality Scoring:** Instant 0–100 score across 4 key dimensions: Clarity, Context, Specificity, and Completeness, with actionable diagnostic breakdowns.
- **Distinctive Editorial Design Identity:** Warm parchment foundations (`#FAF9F5`), deep forest green primary accents (`#1F4A41`), selective terracotta highlights (`#BD5734`), responsive collapsible sidebar, and full dark mode.
- **100% Private Browser History:** Saved prompt blueprints and analytics telemetry remain strictly in your browser's `localStorage` — zero personal data transmitted to third parties.
- **Curated Template Library:** Domain-specific blueprints across Coding, Writing, Education, Career, Business, Data Analysis, and Social Media.

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS (editorial palette), Lucide React icons
- **Backend / Serverless:** Vercel Serverless Functions (`api/improve.ts`), Node.js HTTP
- **AI Provider:** Groq Cloud Chat Completion API (`openai/gpt-oss-120b`)
- **Testing:** Native Node.js test runner (`node:test`, `node:assert`)
- **Storage:** Client-side Browser LocalStorage (`src/services/localStorage.ts`, `src/services/credits.ts`)

---

## Daily Free Credits Architecture

The application provides **1,000 free credits per user per day**:
1. **Deduction Policy:** Exactly 1 credit is deducted **only** when a genuine Groq Cloud API improvement succeeds.
2. **Zero Deduction on Errors:** Validation errors, upstream timeouts, 5xx server errors, or fallback executions consume **0 credits**.
3. **Local Midnight Reset:** Allowance automatically replenishes at 00:00 (midnight) in the user's detected local timezone.
4. **Server-Side Enforcement:** `api/improve.ts` enforces the 1,000 daily ceiling using IP-level tracking and client synchronization, returning HTTP 429 `CREDITS_EXHAUSTED` when depleted.
5. **Burst Ceiling Protection:** Anti-abuse burst limiter restricts rapid automated bursts (30 requests/minute per IP) separately from daily credits.

> **Anonymous Browser Limit Note:** Because the platform is 100% public without user accounts, the credit system operates as a best-effort anonymous limit based on browser client tokens and IP-level ceilings. For enterprise or commercial multi-tenant setups requiring tamper-proof per-user limits across devices, integrating persistent key-value storage (such as Upstash Redis or Vercel KV) is recommended.

---

## Environment Variables Configuration

Configure the following environment variables in your Vercel Project Settings or local `.env` file:

```env
# Server-Side Only (Never exposed to client bundle)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

> **Security Note:** `GROQ_API_KEY` is maintained strictly on the server in `api/improve.ts`. It is never bundled into client JavaScript or exposed in API response payloads. If the key is omitted, the application seamlessly activates its rule-based heuristic fallback engine so public visitors are never presented with broken pages.

---

## Local Development & Testing

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Harikrishna559/ai-prompt-assistant.git
   cd ai-prompt-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```

4. **Run automated test suite:**
   ```bash
   npm test
   ```

5. **Run linter:**
   ```bash
   npm run lint
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## Vercel Deployment

Deployments are automated through GitHub integration on the `master` branch:
1. Pushes to `master` automatically trigger a production build on Vercel.
2. Ensure `GROQ_API_KEY` is configured in Vercel under **Settings → Environment Variables** (Environment: Production).
3. The serverless API endpoint `/api/improve` is automatically served by Vercel's serverless function runtime.
