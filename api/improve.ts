import type { IncomingMessage, ServerResponse } from 'node:http';
import { GoogleGenAI } from '@google/genai';

interface ImproveRequestBody {
  prompt?: string;
  taskType?: string;
  variation?: number;
}

// Helper to safely send JSON response in any server environment (Node, Connect, Vercel)
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

// Helper to parse request body safely from incoming stream or pre-parsed body
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
 * Server-side Gemini API Handler
 * Endpoint: POST /api/improve
 *
 * Security:
 * - Reads process.env.GEMINI_API_KEY strictly on the server side.
 * - Never returns, logs, or exposes the API key to client-side code.
 */
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse & { json?: (data: unknown) => void; status?: (code: number) => any }
) {
  // Safe health/status check via GET for diagnostics and smoke testing
  if (req.method === 'GET') {
    const rawKey = process.env.GEMINI_API_KEY?.trim();
    const hasKey = Boolean(rawKey && rawKey.length > 0 && rawKey !== 'your_gemini_api_key_here');
    return sendJson(res, 200, {
      status: 'ok',
      endpoint: '/api/improve',
      method: 'POST',
      apiKeyConfigured: hasKey,
      message: hasKey
        ? 'Gemini API foundation is live and API key is detected.'
        : 'Gemini API foundation is live. GEMINI_API_KEY is not configured yet (add it to .env).',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = await parseBody(req);
    const { prompt, taskType = 'General', variation = 0 } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return sendJson(res, 400, { error: 'Prompt is required and cannot be empty.' });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isApiKeyConfigured = Boolean(
      apiKey && apiKey.length > 0 && apiKey !== 'your_gemini_api_key_here'
    );

    // If API key is configured, execute real server-side Gemini call
    if (isApiKeyConfigured && apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are an expert AI prompt engineer.
Analyze the user's input prompt for the specified task type ("${taskType}").
Evaluate its clarity, context, specificity, and completeness on a 0-100 scale.
Identify 2-4 concrete weaknesses, rewrite it into an effective, production-grade AI prompt, explain why your version is superior with 3-5 clear points, and provide 2-4 actionable suggestions for future prompts.
Variation index: ${variation}.

You MUST return ONLY a valid JSON object matching this exact schema:
{
  "score": {
    "overall": number (0-100),
    "clarity": number (0-100),
    "context": number (0-100),
    "specificity": number (0-100),
    "completeness": number (0-100)
  },
  "problems": string[] (2 to 4 items),
  "improvedPrompt": string (the complete rewritten prompt),
  "whyBetter": string[] (3 to 5 items),
  "suggestions": string[] (2 to 4 items)
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Analyze and improve this prompt:\n"""${prompt.trim()}"""`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: variation > 0 ? 0.85 : 0.7,
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);

        const structuredResponse = {
          id: `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          originalPrompt: prompt.trim(),
          taskType,
          score: {
            overall: typeof parsed.score?.overall === 'number' ? parsed.score.overall : 82,
            clarity: typeof parsed.score?.clarity === 'number' ? parsed.score.clarity : 80,
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
            : ['Clear structure', 'Added constraints', 'Defined expected output'],
          suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
            ? parsed.suggestions
            : ['Specify target audience', 'Provide example outputs'],
          createdAt: new Date().toISOString(),
          source: 'gemini-api',
        };

        return sendJson(res, 200, structuredResponse);
      } catch (geminiError: any) {
        console.error('[Gemini Server Error]:', geminiError?.message || 'API call failed');
        return sendJson(res, 502, {
          error: 'Failed to generate prompt improvement via Gemini API.',
          message: 'The server-side Gemini API call encountered an issue. Please verify API key and quota.',
        });
      }
    }

    // Controlled server foundation response when API key is not yet set
    const foundationResponse = {
      id: `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      originalPrompt: prompt.trim(),
      taskType,
      score: {
        overall: 82,
        clarity: 84,
        context: 78,
        specificity: 80,
        completeness: 86,
      },
      problems: [
        'Missing target audience or user persona',
        'Output format and constraints not explicitly defined',
        'Lacks step-by-step guidance for complex requests',
      ],
      improvedPrompt: `Act as a senior expert in ${taskType}. Please address the following request with depth, structure, and precision:\n\n"${prompt.trim()}"\n\nRequirements:\n1. Provide a step-by-step breakdown with actionable recommendations.\n2. State any assumptions and prerequisites.\n3. Format the response with clear headings, bullet points, and practical examples.\n4. Avoid generic advice; focus on concrete, high-impact strategies.`,
      whyBetter: [
        'Establishes an authoritative expert role persona',
        'Provides explicit structure and output requirements',
        'Constrains the AI from outputting superficial responses',
        'Ensures actionable, high-quality deliverables',
      ],
      suggestions: [
        'Always specify the target audience or reader background',
        'Include constraints on length, tone, or format',
        'Provide one concrete example of the desired output',
      ],
      createdAt: new Date().toISOString(),
      source: 'server-foundation',
      apiKeyConfigured: false,
    };

    return sendJson(res, 200, foundationResponse);
  } catch (err: any) {
    console.error('[API Improve Handler Error]:', err?.message || err);
    return sendJson(res, 500, { error: 'Internal Server Error' });
  }
}
