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
      return sendJson(res, 400, {
        error: 'INVALID_REQUEST',
        message: 'Please enter a valid prompt and try again.',
      });
    }

    if (prompt.length > 5000) {
      return sendJson(res, 400, {
        error: 'INVALID_REQUEST',
        message: 'Your prompt exceeds the 5000 character limit.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isApiKeyConfigured = Boolean(
      apiKey && apiKey.length > 0 && apiKey !== 'your_gemini_api_key_here'
    );

    // If API key is configured, execute real server-side Gemini call
    if (isApiKeyConfigured && apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const getTaskTypeGuidance = (type: string): string => {
          switch (type) {
            case 'Coding':
              return `TASK-SPECIFIC GUIDANCE (Coding):
- Define explicit functional requirements and expected system behavior.
- Specify technical constraints: runtime/framework versions, libraries, typing (e.g., TypeScript), and component architecture.
- Clarify input/output formats, data structures, and function signatures.
- Highlight edge cases, error handling, performance considerations, and testability.
- Request modular, clean, and production-ready code with setup instructions.`;

            case 'Writing':
              return `TASK-SPECIFIC GUIDANCE (Writing):
- Define the target audience, their background knowledge, and reading level.
- Specify the desired tone (e.g., authoritative, conversational, persuasive, empathetic).
- State the core purpose, key arguments, and takeaway messages.
- Specify structural guidelines: headings, paragraphs, transitions, and narrative arc.
- Establish length constraints (word count or section targets) and stylistic rules.`;

            case 'Research':
              return `TASK-SPECIFIC GUIDANCE (Research):
- Formulate a focused research question and clear investigation objective.
- Define the scope, boundaries, and inclusion/exclusion criteria.
- Specify source requirements: peer-reviewed literature, empirical data, or credible industry reports.
- Request a structured synthesis: executive summary, methodology, findings, and citations.
- Include analytical constraints: counterarguments, limitations, and future implications.`;

            case 'Education':
              return `TASK-SPECIFIC GUIDANCE (Education):
- Identify the target learner's grade level, prior knowledge, and learning goals.
- Incorporate pedagogical techniques: analogies, conceptual intuition, and step-by-step scaffolding.
- Request interactive checks for understanding: practice exercises, quizzes, or reflection prompts.
- Address common misconceptions and provide clear, concrete examples.
- Specify an organized educational format (e.g., study guide, lesson plan, tutorial).`;

            case 'Data Analysis':
              return `TASK-SPECIFIC GUIDANCE (Data Analysis):
- Describe the data schema, variables, data types, and potential data quality nuances.
- Specify analytical objectives: exploratory data analysis, hypothesis testing, regression, or clustering.
- Define expected metrics, KPIs, and statistical significance thresholds.
- Detail visualization preferences: chart types, axes, labeling, and tool choices (e.g., Pandas, Seaborn, Tableau).
- Request actionable business interpretations and strategic recommendations based on insights.`;

            case 'Career':
              return `TASK-SPECIFIC GUIDANCE (Career):
- Specify the target role, seniority level, industry, and hiring manager perspective.
- Emphasize quantifiable achievements, action verbs, and STAR methodology (Situation, Task, Action, Result).
- Ensure a professional, confident, and authentic tone.
- Tailor keywords to relevant industry job descriptions and ATS (Applicant Tracking Systems).
- Produce concrete deliverables (e.g., polished resume bullet points, tailored cover letter, or interview answers).`;

            case 'Business':
              return `TASK-SPECIFIC GUIDANCE (Business):
- Frame the core business problem, strategic objectives, and stakeholder priorities.
- Define the target market, customer persona, and unique value proposition.
- Incorporate operational constraints: budget, timeline, resources, and risk factors.
- Specify measurable outcomes: ROI, conversion rates, customer lifetime value, or cost savings.
- Format for executive readability: executive summary, strategic pillars, and next steps.`;

            case 'Social Media':
              return `TASK-SPECIFIC GUIDANCE (Social Media):
- Tailor the prompt to the specific platform (e.g., LinkedIn, Twitter/X, Instagram, YouTube).
- Craft an attention-grabbing hook and compelling storytelling format.
- Define the audience persona and community engagement angle.
- Include clear calls-to-action (CTA) to encourage comments, shares, or clicks.
- Specify formatting: line breaks, character limits, emoji balance, and relevant hashtags.`;

            case 'Email':
              return `TASK-SPECIFIC GUIDANCE (Email):
- Establish the recipient relationship, context, and seniority hierarchy.
- State the single primary purpose clearly in the first two sentences.
- Maintain appropriate formality, politeness, and professional brevity.
- Include a high-converting, friction-free Call to Action (CTA) with clear next steps.
- Provide a compelling subject line and professional sign-off.`;

            case 'Image Generation':
              return `TASK-SPECIFIC GUIDANCE (Image Generation):
- Define the primary subject, focal point, and action in rich visual detail.
- Specify artistic style, medium, and aesthetic (e.g., photorealistic, digital oil painting, 3D render, minimalist vector).
- Detail the environment, lighting (e.g., golden hour, volumetric studio lighting), and color palette.
- Detail camera parameters: perspective, focal length, depth of field, and framing.
- Specify aspect ratio, resolution targets, and negative prompts (what to avoid).`;

            case 'General':
            default:
              return `TASK-SPECIFIC GUIDANCE (General):
- Clarify the overarching goal and intended outcome.
- Provide rich background context, persona framing, and operational constraints.
- Specify the exact desired output format, structure, and tone.
- Eliminate ambiguities and establish quality benchmarks.`;
          }
        };

        const taskGuidance = getTaskTypeGuidance(taskType);

        const systemInstruction = `You are an elite AI prompt engineer and instruction optimization expert.
Your mission is to analyze the user's input prompt for the task category "${taskType}" and transform it into a high-performance, production-ready AI prompt.

CORE OPTIMIZATION PRINCIPLES:
1. PRESERVE ORIGINAL INTENT: Faithfully maintain what the user wants to accomplish. Never change their underlying goal or replace their topic with something unrelated.
2. IDENTIFY REAL WEAKNESSES: Identify genuine, concrete shortcomings in the user's prompt (e.g., missing context, unspecified constraints, ambiguous wording, omitted output format). Do NOT fabricate trivial or non-existent problems.
3. ELEVATE THE FOUR KEY PILLARS:
   - Clarity: Remove vagueness, contradictory instructions, and jargon.
   - Context: Provide role framing, persona, background, and target audience.
   - Specificity: Provide concrete requirements, parameters, examples, and boundaries.
   - Completeness: Define exact output structure, edge cases, format constraints, and quality criteria.
4. PRODUCE A PRACTICAL IMPROVED PROMPT: The rewritten prompt must be immediately copy-pasteable into Gemini, Claude, or ChatGPT and yield vastly superior, deterministic results.
5. EXPLAIN WHY IT IS BETTER: Provide concise, persuasive explanations of how the enhancements improve output quality.
6. ACTIONABLE SUGGESTIONS: Give practical tips the user can apply to future prompts in this domain.

${taskGuidance}

${variation > 0 ? `VARIATION DIRECTIVE (Variation #${variation}): Provide a distinct, alternative architectural approach or creative angle while strictly maintaining the user's core intent and domain standards.` : ''}

SCORING CRITERIA (0-100 scale for user's ORIGINAL prompt):
- overall: Holistic prompt effectiveness score.
- clarity: How clear and unambiguous the original instruction is.
- context: How well role, background, and audience are framed.
- specificity: Presence of concrete details, constraints, and parameters.
- completeness: Presence of output format, boundaries, and acceptance criteria.

OUTPUT FORMAT REQUIREMENTS:
You MUST return ONLY a valid, parseable JSON object matching this exact schema:
{
  "score": {
    "overall": number (0-100),
    "clarity": number (0-100),
    "context": number (0-100),
    "specificity": number (0-100),
    "completeness": number (0-100)
  },
  "problems": string[] (2 to 4 concrete weaknesses),
  "improvedPrompt": string (complete, production-ready, improved prompt string),
  "whyBetter": string[] (3 to 5 clear reasons why this version produces superior results),
  "suggestions": string[] (2 to 4 actionable suggestions for future prompts)
}`;

        let response: any = null;
        let lastError: any = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: `Analyze and improve this prompt:\n"""${prompt.trim()}"""`,
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
                temperature: variation > 0 ? 0.85 : 0.7,
              },
            });
            break;
          } catch (err: any) {
            lastError = err;
            const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err) || '');
            const isTransient =
              err?.status === 503 ||
              err?.status === 'UNAVAILABLE' ||
              err?.code === 503 ||
              err?.error?.code === 503 ||
              err?.status === 429 ||
              msg.includes('503') ||
              msg.includes('high demand') ||
              msg.includes('UNAVAILABLE');

            if (isTransient && attempt < 3) {
              await new Promise((resolve) => setTimeout(resolve, 2500 * attempt));
              continue;
            }
            throw err;
          }
        }

        if (!response) {
          throw lastError || new Error('Gemini API call returned empty response');
        }

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
        const errorMsg =
          typeof geminiError === 'string'
            ? geminiError
            : geminiError?.message || JSON.stringify(geminiError) || '';
        const statusCode =
          geminiError?.status ||
          geminiError?.code ||
          geminiError?.error?.code;

        // Quota / Rate Limit Exceeded (HTTP 429 / RESOURCE_EXHAUSTED)
        const isQuotaExceeded =
          statusCode === 429 ||
          statusCode === 'RESOURCE_EXHAUSTED' ||
          geminiError?.status === 'RESOURCE_EXHAUSTED' ||
          errorMsg.includes('429') ||
          errorMsg.includes('RESOURCE_EXHAUSTED') ||
          errorMsg.includes('quota') ||
          errorMsg.includes('Quota exceeded');

        if (isQuotaExceeded) {
          console.warn('[Gemini API]: Quota limit reached (429 RESOURCE_EXHAUSTED)');
          return sendJson(res, 429, {
            error: 'QUOTA_EXCEEDED',
            message: 'AI usage limit reached. Please try again later.',
          });
        }

        // Temporary Service Unavailable (HTTP 503 / UNAVAILABLE)
        const isUnavailable =
          statusCode === 503 ||
          statusCode === 'UNAVAILABLE' ||
          geminiError?.status === 'UNAVAILABLE' ||
          errorMsg.includes('503') ||
          errorMsg.includes('high demand') ||
          errorMsg.includes('UNAVAILABLE');

        if (isUnavailable) {
          console.warn('[Gemini API]: Service temporarily unavailable (503 UNAVAILABLE)');
          return sendJson(res, 503, {
            error: 'SERVICE_UNAVAILABLE',
            message: 'The AI service is temporarily unavailable. Please try again.',
          });
        }

        // Other upstream or unexpected errors from Gemini (safe user-facing message, no leaked keys)
        console.error('[Gemini Server Error]:', errorMsg);
        return sendJson(res, 500, {
          error: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while improving your prompt. Please try again.',
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
    return sendJson(res, 500, {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong while improving your prompt. Please try again.',
    });
  }
}
