import type { IncomingMessage, ServerResponse } from 'node:http';

interface ImproveRequestBody {
  prompt?: string;
  taskType?: string;
  variation?: number;
}

// Daily free credit allowance (1,000 credits per user per day)
const DAILY_CREDIT_ALLOWANCE = 1000;

// In-memory credit tracking map: userKey -> { date: string, used: number }
const userDailyCredits = new Map<string, { date: string; used: number }>();

// In-memory anti-abuse burst rate limiting map (IP -> { count, resetTime })
const ipRateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 req/min burst ceiling

function checkBurstRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip);

  if (!record || now > record.resetTime) {
    ipRateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function getUserDate(req: IncomingMessage): string {
  const clientDate = req.headers['x-client-date'];
  if (typeof clientDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(clientDate.trim())) {
    return clientDate.trim();
  }
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function getUserIdentifier(req: IncomingMessage): string {
  const clientIp = getClientIp(req);
  const clientId = req.headers['x-client-id'];
  if (typeof clientId === 'string' && clientId.trim().length > 0) {
    return `${clientIp}:${clientId.trim().slice(0, 64)}`;
  }
  return clientIp;
}

/**
 * Retrieves current credit status for user, handling midnight reset
 * and synchronizing client usage across serverless instances.
 */
function getUserCredits(req: IncomingMessage) {
  const userKey = getUserIdentifier(req);
  const userDate = getUserDate(req);
  const record = userDailyCredits.get(userKey);

  // Client-reported usage from localStorage to synchronize across serverless cold starts
  let clientUsed = 0;
  const headerUsed = req.headers['x-client-used'];
  if (typeof headerUsed === 'string') {
    const parsed = parseInt(headerUsed, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 50000) {
      clientUsed = parsed;
    }
  }

  if (!record || record.date !== userDate) {
    // Midnight reset: initialize new daily record for userDate
    const initialUsed = Math.min(clientUsed, DAILY_CREDIT_ALLOWANCE);
    const newRecord = { date: userDate, used: initialUsed };
    userDailyCredits.set(userKey, newRecord);
    return {
      userKey,
      userDate,
      allowance: DAILY_CREDIT_ALLOWANCE,
      used: initialUsed,
      remaining: Math.max(0, DAILY_CREDIT_ALLOWANCE - initialUsed),
    };
  }

  // Take the highest confirmed count between server record and client state
  const effectiveUsed = Math.max(record.used, clientUsed);
  record.used = effectiveUsed;

  return {
    userKey,
    userDate,
    allowance: DAILY_CREDIT_ALLOWANCE,
    used: effectiveUsed,
    remaining: Math.max(0, DAILY_CREDIT_ALLOWANCE - effectiveUsed),
  };
}

/**
 * Deducts exactly 1 credit upon confirmed successful Groq API completion.
 */
function deductCredit(userKey: string, userDate: string, currentUsed: number) {
  const newUsed = currentUsed + 1;
  userDailyCredits.set(userKey, { date: userDate, used: newUsed });
  return {
    allowance: DAILY_CREDIT_ALLOWANCE,
    used: newUsed,
    remaining: Math.max(0, DAILY_CREDIT_ALLOWANCE - newUsed),
  };
}

// Helper to safely send JSON response
function sendJson(
  res: ServerResponse & { json?: (data: unknown) => void; status?: (code: number) => any },
  statusCode: number,
  data: unknown
) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(data);
    return;
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Helper to parse request body safely
async function parseBody(req: IncomingMessage & { body?: unknown }): Promise<ImproveRequestBody> {
  if (req.body && typeof req.body === 'object') {
    return req.body as ImproveRequestBody;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

/**
 * Intelligent rule-based fallback generator when Groq API key is unavailable,
 * rate limited, or times out.
 */
function generateFallbackAnalysis(prompt: string, taskType: string, variation: number = 0) {
  const trimmed = prompt.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const hasQuestion = trimmed.includes('?');
  const hasFormat = /format|table|bullet|json|list|markdown/i.test(trimmed);
  const hasPersona = /act as|you are|as a|role/i.test(trimmed);

  // Compute realistic scores
  const clarity = Math.min(95, Math.max(50, 60 + (wordCount > 10 ? 20 : 5) + (hasQuestion ? 10 : 0)));
  const context = Math.min(95, Math.max(45, 50 + (hasPersona ? 30 : 0) + (wordCount > 25 ? 15 : 0)));
  const specificity = Math.min(95, Math.max(40, 45 + (wordCount > 30 ? 25 : 5) + (hasFormat ? 15 : 0)));
  const completeness = Math.min(95, Math.max(40, 50 + (hasFormat ? 25 : 0) + (wordCount > 40 ? 20 : 0)));
  const overall = Math.round((clarity + context + specificity + completeness) / 4);

  const problems: string[] = [];
  if (!hasPersona) problems.push('Missing expert persona framing (e.g., "Act as a Senior Lead")');
  if (!hasFormat) problems.push('Lacks output format constraints (e.g., markdown headers, step-by-step, bullet points)');
  if (wordCount < 15) problems.push('Prompt is very brief; lacks necessary background context and edge-case guidance');
  if (!trimmed.includes('example') && !trimmed.includes('sample')) problems.push('No example or output benchmark provided');

  if (problems.length === 0) {
    problems.push('Could further define target audience expectations');
    problems.push('Could enforce specific length/token bounds');
  }

  const taskRoleMap: Record<string, string> = {
    Coding: 'Senior Principal Software Engineer & Systems Architect',
    Writing: 'Master Editor & Content Strategist',
    Research: 'Lead Research Scientist & Quantitative Analyst',
    Education: 'Senior Pedagogical Specialist & Educator',
    'Data Analysis': 'Lead Data Scientist & Business Intelligence Director',
    Career: 'Executive Career Coach & Technical Recruiter',
    Business: 'Management Consultant & Corporate Strategist',
    'Social Media': 'Growth Marketing Director & Viral Content Strategist',
    Email: 'Executive Communications Director',
    'Image Generation': 'World-Class Visual Artist & Prompt Engineer',
    General: 'Expert AI Systems Consultant',
  };

  const role = taskRoleMap[taskType] || taskRoleMap.General;

  let improvedPrompt = `Act as a ${role}.

CORE OBJECTIVE:
${trimmed}

KEY REQUIREMENTS:
1. Scope & Depth: Provide a thorough, production-grade response covering all core aspects and edge cases.
2. Structure: Organize the output logically using clear Markdown headings, bullet points, and code/example blocks where appropriate.
3. Quality Standards: Avoid superficial generalizations; give concrete, actionable, high-impact details.
4. Tone & Style: Maintain an authoritative, professional, and precise tone tailored for practical application.`;

  if (variation > 0) {
    improvedPrompt += `\n\nALTERNATIVE ANGLE (Variation ${variation}):
Focus heavily on edge-case stress testing, risk mitigation, and a step-by-step checklist execution model.`;
  }

  const whyBetter = [
    `Instantly establishes an authoritative ${role} persona`,
    'Structures output expectations with clear section boundaries',
    'Eliminates ambiguity by enforcing concrete, actionable requirements',
    'Directs the LLM to format response with professional Markdown headings',
  ];

  const suggestions = [
    'Define target user skill level to tailor output complexity',
    'Include negative constraints (e.g., "do not use deprecated APIs")',
    'Specify length bounds (e.g., "within 400 words" or "provide top 3")',
  ];

  return {
    id: `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    originalPrompt: trimmed,
    taskType,
    score: {
      overall,
      clarity,
      context,
      specificity,
      completeness,
    },
    problems,
    improvedPrompt,
    whyBetter,
    suggestions,
    createdAt: new Date().toISOString(),
    source: 'rule-based-fallback',
  };
}

export default async function handler(
  req: IncomingMessage & { method?: string; body?: unknown },
  res: ServerResponse & { json?: (data: unknown) => void; status?: (code: number) => any }
) {
  // CORS Headers for public tool access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-Id, X-Client-Date, X-Client-Used, X-Client-Timezone');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Health check & Documentation endpoint
  if (req.method === 'GET') {
    const userCredits = getUserCredits(req);
    return sendJson(res, 200, {
      status: 'ok',
      endpoint: '/api/improve',
      method: 'POST',
      provider: 'Groq Cloud API',
      model: 'openai/gpt-oss-120b',
      apiKeyConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
      dailyCreditAllowance: DAILY_CREDIT_ALLOWANCE,
      credits: userCredits,
      message: 'Groq Cloud API integration active. 1,000 daily free credits provided per user.',
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Burst Rate Limiting Check (DDoS / automated rapid spam protection)
  const clientIp = getClientIp(req);
  if (!checkBurstRateLimit(clientIp)) {
    return sendJson(res, 429, {
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Request burst ceiling reached. Please wait a minute before analyzing another prompt.',
    });
  }

  // 2. Server-Side Daily Credit Limit Enforcement (1,000 credits/day per user)
  const userCredits = getUserCredits(req);
  if (userCredits.used >= DAILY_CREDIT_ALLOWANCE) {
    return sendJson(res, 429, {
      error: 'CREDITS_EXHAUSTED',
      message: 'Daily free credit allowance reached (1,000/1,000 credits used). Your allowance resets at midnight in your local timezone.',
      credits: {
        allowance: DAILY_CREDIT_ALLOWANCE,
        used: DAILY_CREDIT_ALLOWANCE,
        remaining: 0,
        resetAt: 'midnight',
      },
    });
  }

  try {
    const body = await parseBody(req);
    const { prompt, taskType = 'General', variation = 0 } = body;

    // Validation checks - 0 credits deducted on failure
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return sendJson(res, 400, {
        error: 'INVALID_REQUEST',
        message: 'Please enter a valid prompt to improve.',
      });
    }

    if (prompt.length > 5000) {
      return sendJson(res, 400, {
        error: 'INVALID_REQUEST',
        message: 'Prompt exceeds the maximum character limit of 5,000 characters.',
      });
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    const model = process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b';

    const isApiKeyConfigured = Boolean(
      apiKey && apiKey.length > 0 && !apiKey.includes('your_groq_api_key')
    );

    // If Groq API key is not configured, return smart fallback without deducting credits
    if (!isApiKeyConfigured) {
      const fallback = generateFallbackAnalysis(prompt, taskType, variation);
      return sendJson(res, 200, {
        ...fallback,
        credits: userCredits,
      });
    }

    // Call Groq Cloud OpenAI-compatible chat completion endpoint
    const systemPrompt = `You are an elite AI prompt engineer and instruction optimization expert.
Your mission is to analyze the user's input prompt for the task category "${taskType}" and transform it into a high-performance, production-ready AI prompt.

CORE OPTIMIZATION PRINCIPLES:
1. PRESERVE INTENT: Faithfully maintain what the user wants to accomplish.
2. IDENTIFY WEAKNESSES: Identify 2-4 real shortcomings (missing context, missing output format, vagueness).
3. ELEVATE THE FOUR PILLARS: Clarity, Context, Specificity, Completeness.
4. PRACTICAL IMPROVED PROMPT: Ready to copy-paste into ChatGPT, Claude, or Gemini.
5. EXPLAIN WHY IT IS BETTER: 3-5 clear points.
6. ACTIONABLE SUGGESTIONS: 2-4 tips for future prompts.

${variation > 0 ? `VARIATION DIRECTIVE (Variation #${variation}): Focus on an alternative architectural or execution angle.` : ''}

You MUST return ONLY a JSON object matching this exact schema:
{
  "score": {
    "overall": number (0-100),
    "clarity": number (0-100),
    "context": number (0-100),
    "specificity": number (0-100),
    "completeness": number (0-100)
  },
  "problems": ["string", "string"],
  "improvedPrompt": "string (the complete production-ready optimized prompt)",
  "whyBetter": ["string", "string"],
  "suggestions": ["string", "string"]
}`;

    const userMessage = `Task Category: ${taskType}\nOriginal Input Prompt:\n${prompt.trim()}`;

    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: variation > 0 ? 0.7 : 0.4,
          max_tokens: 2048,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(15000), // 15-second request timeout
      });

      if (!groqRes.ok) {
        const errorText = await groqRes.text().catch(() => '');
        console.warn(`[Groq API Upstream Status ${groqRes.status}]: Using fallback engine. Detail: ${errorText.slice(0, 150)}`);

        // If rate-limited or quota exceeded upstream, use smart fallback without credit deduction
        const fallback = generateFallbackAnalysis(prompt, taskType, variation);
        return sendJson(res, 200, {
          ...fallback,
          credits: userCredits,
        });
      }

      const groqData = (await groqRes.json()) as any;
      const content = groqData?.choices?.[0]?.message?.content;

      if (!content) {
        console.warn('[Groq API Response]: Empty completion content, using fallback engine.');
        const fallback = generateFallbackAnalysis(prompt, taskType, variation);
        return sendJson(res, 200, {
          ...fallback,
          credits: userCredits,
        });
      }

      // Parse JSON from Groq output
      let parsed: any;
      try {
        const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        console.warn('[Groq API Response]: Failed to parse JSON, using fallback engine.');
        const fallback = generateFallbackAnalysis(prompt, taskType, variation);
        return sendJson(res, 200, {
          ...fallback,
          credits: userCredits,
        });
      }

      // Deduct 1 credit ONLY on genuine successful Groq API prompt-improvement request
      const updatedCredits = deductCredit(
        userCredits.userKey,
        userCredits.userDate,
        userCredits.used
      );

      const structuredResponse = {
        id: `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        originalPrompt: prompt.trim(),
        taskType,
        score: {
          overall: typeof parsed.score?.overall === 'number' ? parsed.score.overall : 84,
          clarity: typeof parsed.score?.clarity === 'number' ? parsed.score.clarity : 82,
          context: typeof parsed.score?.context === 'number' ? parsed.score.context : 80,
          specificity: typeof parsed.score?.specificity === 'number' ? parsed.score.specificity : 85,
          completeness: typeof parsed.score?.completeness === 'number' ? parsed.score.completeness : 83,
        },
        problems: Array.isArray(parsed.problems) && parsed.problems.length > 0
          ? parsed.problems
          : ['Needs additional context', 'Missing output format constraint'],
        improvedPrompt: parsed.improvedPrompt || prompt.trim(),
        whyBetter: Array.isArray(parsed.whyBetter) && parsed.whyBetter.length > 0
          ? parsed.whyBetter
          : ['Clear structure', 'Added expert persona', 'Defined expected output'],
        suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
          ? parsed.suggestions
          : ['Specify target audience', 'Provide example outputs'],
        createdAt: new Date().toISOString(),
        source: 'groq-api',
        credits: updatedCredits,
      };

      return sendJson(res, 200, structuredResponse);
    } catch (groqErr: any) {
      const isTimeout =
        groqErr?.name === 'TimeoutError' ||
        groqErr?.name === 'AbortError' ||
        groqErr?.message?.includes('timeout');
      console.warn(`[Groq Request Failed - ${isTimeout ? 'Timeout (15s)' : 'Network Error'}]: Using fallback engine.`);
      // Failed upstream request: do not deduct credits
      const fallback = generateFallbackAnalysis(prompt, taskType, variation);
      return sendJson(res, 200, {
        ...fallback,
        credits: userCredits,
      });
    }
  } catch (err: any) {
    console.error('[API Handler Error]:', err?.message || err);
    return sendJson(res, 500, {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong while improving your prompt. Please try again.',
    });
  }
}
