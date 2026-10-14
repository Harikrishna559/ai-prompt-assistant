# AI Prompt Improvement Assistant

> **Turn Simple Ideas into Powerful AI Prompts.**

A production-ready SaaS application for prompt engineering, auditing, and optimization. Powered by **Groq Cloud API** and **Meta Llama 3.3 70B Versatile**, designed with a modern Sky-Blue theme and 100% public access with browser local storage.

- **Live Website:** [https://ai-prompt-assistant-jet.vercel.app](https://ai-prompt-assistant-jet.vercel.app)
- **GitHub Repository:** [https://github.com/Harikrishna559/ai-prompt-assistant](https://github.com/Harikrishna559/ai-prompt-assistant)

---

## Key Features

- **Public SaaS (Zero Registration Required):** Use all prompt improver features, templates, and history instantly without signing up or logging in.
- **Groq Cloud API Engine:** High-performance prompt analysis using Groq LPUs and Meta Llama 3.3 70B Versatile with intelligent rule-based fallback protection.
- **Objective Quality Scoring:** Instant 0–100 score across 4 key dimensions: Clarity, Context, Specificity, and Completeness.
- **100% Private Browser History:** Saved prompt iterations remain strictly in your browser's `localStorage` — zero data synced to server databases.
- **Curated Template Library:** Battle-tested prompt blueprints across Coding, Writing, Education, Career, Business, and Data Analysis.
- **Premium Sky-Blue Design System:** Modern typography, subtle glassmorphism, responsive mobile layout, and dark mode support.
- **SEO Optimized:** Full Open Graph metadata, canonical URL tags, `robots.txt`, and XML sitemap for search engines.

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS (Sky-Blue design system), Lucide React icons
- **Backend / Serverless:** Vercel Serverless Functions (`api/improve.ts`), Node.js HTTP
- **AI Integration:** Groq Cloud Chat Completion API (`https://api.groq.com/openai/v1/chat/completions`)
- **Storage:** Client-side Browser LocalStorage Service (`src/services/localStorage.ts`)

---

## Environment Variables Configuration

Set the following environment variables in your local `.env` or Vercel Dashboard project settings:

```env
# Server-Side Only (Never exposed to client bundle)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

> **Note:** If `GROQ_API_KEY` is not provided, the serverless handler automatically uses its built-in rule-based optimization fallback engine so visitors never experience error pages.

---

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Harikrishna559/ai-prompt-assistant.git
   cd ai-prompt-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Google Search Console Verification Guide

To index and monitor `https://ai-prompt-assistant-jet.vercel.app` on Google Search:

1. **Log in to Google Search Console:**
   Go to [https://search.google.com/search-console](https://search.google.com/search-console).

2. **Add Property:**
   Select **URL prefix** and enter `https://ai-prompt-assistant-jet.vercel.app/`.

3. **Copy Verification Meta Tag:**
   Select the **HTML tag** verification method. Copy the generated tag:
   ```html
   <meta name="google-site-verification" content="YOUR_UNIQUE_VERIFICATION_KEY" />
   ```

4. **Update `index.html`:**
   Open `index.html` and replace `GOOGLE_SEARCH_CONSOLE_VERIFICATION_KEY` with your actual verification key:
   ```html
   <meta name="google-site-verification" content="YOUR_UNIQUE_VERIFICATION_KEY" />
   ```

5. **Deploy & Verify:**
   Commit, push to GitHub, and click **Verify** in Google Search Console.

6. **Submit Sitemap:**
   In Google Search Console, navigate to **Sitemaps** in the sidebar, enter `sitemap.xml` (full URL: `https://ai-prompt-assistant-jet.vercel.app/sitemap.xml`), and click **Submit**.
