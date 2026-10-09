import type { IncomingMessage, ServerResponse } from 'node:http';

interface ImproveRequestBody {
  prompt?: string;
  taskType?: string;
  variation?: number;
}

// In-memory rate limiting map (IP -> { count, resetTime })
const ipRateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function checkRateLimit(ip: string): boolean {
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
    req.on('error', () => resolve({}));
  });
}

/**
 * Intelligent rule-based fallback generator when NVIDIA API key is unavailable or rate limited.
 */
function generateFallbackAnalysis(prompt: string, taskType: string, variation: number = 0) {
  const trimmed = prompt.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const hasQuestion = trimmed.includes('?');
  const hasFormat = /format|table|bullet|json|list|markdown/i.test(trimmed);
  const hasPersona = /act as|you are|as a|role/i.test(trimmed);

  // Compute realistic scores
  let clarity = Math.min(95, Math.max(50, 60 + (wordCount > 10 ? 20 : 5) + (hasQuestion ? 10 : 0)));
  let context = Math.min(95, Math.max(45, 50 + (hasPersona ? 30 : 0) + (wordCount > 25 ? 15 : 0)));
  let specificity = Math.min(95, Math.max(40, 45 + (wordCount > 30 ? 25 : 5) + (hasFormat ? 15 : 0)));
  let completeness = Math.min(95, Math.max(40, 50 + (hasFormat ? 25 : 0) + (wordCount > 40 ? 20 : 0)));
  let overall = Math.round((clarity + context + specificity + completeness) / 4);

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

  return {
    id: `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
    whyBetter: [
      `Establishes explicit expert role persona (${role})`,
      'Adds clear structural constraints and markdown formatting guidelines',
      'Prevents ambiguous or superficial AI responses by demanding concrete depth',
      'Provides clear execution bounds and quality benchmarks',
    ],
    suggestions: [
      'Specify target audience experience level for tailored answers',
      'Include 1-2 positive or negative output examples',
      'Explicitly state desired output length or line count',
    ],
    createdAt: new Date().toISOString(),
    source: 'nvidia-fallback-engine',
  };
}

/**
 * Server-side NVIDIA NIM API Handler
 * Endpoint: POST /api/improve
 */
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse & { json?: (data: unknown) => void; status?: (code: number) => any }
) {
  // GET endpoint status check
  if (req.method === 'GET') {
    const rawKey = process.env.NVIDIA_API_KEY?.trim();
    const hasKey = Boolean(rawKey && rawKey.length > 0 && !rawKey.includes('your_nvidia_api_key'));
    const modelName = process.env.NVIDIA_MODEL?.trim() || 'meta/llama-3.3-70b-instruct';
    return sendJson(res, 200, {
      status: 'ok',
      endpoint: '/api/improve',
      method: 'POST',
      provider: 'NVIDIA NIM API',
      model: modelName,
      apiKeyConfigured: hasKey,
      message: hasKey
        ? 'NVIDIA NIM API integration active.'
        : 'NVIDIA NIM API key pending. Smart fallback engine active for public visitors.',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  // Rate Limiting Check
  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    return sendJson(res, 429, {
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait a minute before analyzing another prompt.',
    });
  }

  try {
    const body = await parseBody(req);
    const { prompt, taskType = 'General', variation = 0 } = body;

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

    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    const model = process.env.NVIDIA_MODEL?.trim() || 'meta/llama-3.3-70b-instruct';

    const isApiKeyConfigured = Boolean(
      apiKey && apiKey.length > 0 && !apiKey.includes('your_nvidia_api_key')
    );

    // If NVIDIA API key is not configured, return smart fallback instantly
    if (!isApiKeyConfigured) {
      const fallback = generateFallbackAnalysis(prompt, taskType, variation);
      return sendJson(res, 200, fallback);
    }

    // Call NVIDIA NIM OpenAI-compatible chat completion endpoint
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
  "problems": ["problem 1", "problem 2"],
  "improvedPrompt": "complete rewritten prompt",
  "whyBetter": ["reason 1", "reason 2"],
  "suggestions": ["tip 1", "tip 2"]
}`;

    const userMessage = `Analyze and improve this ${taskType} prompt:\n\n"""\n${prompt.trim()}\n"""`;

    try {
      const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: variation > 0 ? 0.8 : 0.6,
          top_p: 0.9,
          max_tokens: 2048,
          response_format: { type: 'json_object' },
        }),
      });

      if (!nvidiaRes.ok) {
        const errorText = await nvidiaRes.text();
        console.warn(`[NVIDIA API Error ${nvidiaRes.status}]:`, errorText.slice(0, 300));

        // If rate-limited or quota exceeded upstream, use smart fallback so user is never blocked
        const fallback = generateFallbackAnalysis(prompt, taskType, variation);
        return sendJson(res, 200, fallback);
      }

      const nvidiaData = (await nvidiaRes.json()) as any;
      const content = nvidiaData?.choices?.[0]?.message?.content;

      if (!content) {
        const fallback = generateFallbackAnalysis(prompt, taskType, variation);
        return sendJson(res, 200, fallback);
      }

      // Parse JSON from NVIDIA output
      let parsed: any;
      try {
        const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        const fallback = generateFallbackAnalysis(prompt, taskType, variation);
        return sendJson(res, 200, fallback);
      }

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
        source: 'nvidia-nim-api',
      };

      return sendJson(res, 200, structuredResponse);
    } catch (nvidiaErr: any) {
      console.warn('[NVIDIA Request Failed - Using Fallback Engine]:', nvidiaErr?.message || nvidiaErr);
      const fallback = generateFallbackAnalysis(prompt, taskType, variation);
      return sendJson(res, 200, fallback);
    }
  } catch (err: any) {
    console.error('[API Handler Error]:', err?.message || err);
    return sendJson(res, 500, {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong while improving your prompt. Please try again.',
    });
  }
}
