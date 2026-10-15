import type {
  PromptAnalysis,
  TaskType,
} from '../types';
import { getCreditHeaders, saveClientCredits } from './credits';

/**
 * Analyze an input prompt and generate improvement suggestions
 *
 * Calls POST /api/improve and returns the optimized prompt analysis.
 */
export async function analyzePrompt(
  prompt: string,
  taskType: TaskType = 'General',
  variation: number = 0
): Promise<PromptAnalysis> {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Please enter a valid prompt and try again.');
  }

  let response: Response;
  const creditHeaders = getCreditHeaders();

  try {
    response = await fetch('/api/improve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...creditHeaders,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        taskType,
        variation,
      }),
    });
  } catch {
    // Network failure (offline, connection refused, DNS error, etc.)
    throw new Error('Unable to connect to the AI service. Please check your connection.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Credits Exhausted (HTTP 429)
    if (errorData.error === 'CREDITS_EXHAUSTED') {
      throw new Error(
        errorData.message ||
          'Daily free credit allowance reached (1,000/1,000 credits). Allowance resets at midnight in your local timezone.'
      );
    }

    // Rate Limit / Quota Exceeded (HTTP 429)
    if (response.status === 429 || errorData.error === 'RATE_LIMIT_EXCEEDED' || errorData.error === 'QUOTA_EXCEEDED') {
      throw new Error(
        errorData.message || 'AI request burst limit reached. Please wait a moment before trying again.'
      );
    }

    // Temporary Service Unavailable (HTTP 503)
    if (response.status === 503 || errorData.error === 'SERVICE_UNAVAILABLE') {
      throw new Error(
        errorData.message || 'The AI service is temporarily unavailable. Please try again.'
      );
    }

    // Invalid Request (HTTP 400)
    if (response.status === 400 || errorData.error === 'INVALID_REQUEST') {
      throw new Error(
        errorData.message || 'Please enter a valid prompt and try again.'
      );
    }

    // Unexpected Server / Upstream Error (HTTP 500 or others)
    throw new Error(
      errorData.message ||
        'Something went wrong while improving your prompt. Please try again.'
    );
  }

  const data = (await response.json()) as PromptAnalysis;

  // If server returned updated credit status, persist it locally
  if (data.credits) {
    saveClientCredits(data.credits);
  }

  return data;
}

/**
 * Improve an input prompt
 */
export async function improvePrompt(
  prompt: string,
  taskType: TaskType = 'General',
  variation: number = 0
): Promise<PromptAnalysis> {
  return analyzePrompt(prompt, taskType, variation);
}
