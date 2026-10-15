import type { UserCredits } from '../types';

const CLIENT_ID_STORAGE_KEY = 'ai_prompt_studio_anon_id';
const CREDITS_STORAGE_KEY = 'ai_prompt_studio_daily_credits';
export const DAILY_CREDIT_ALLOWANCE = 1000;

/**
 * Returns the local date in YYYY-MM-DD format for the user's timezone.
 */
export function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retrieves or generates an anonymous client identifier stored in localStorage.
 */
export function getAnonymousClientId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'anon_guest_' + Math.random().toString(36).substring(2, 9);
  }

  try {
    let id = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return 'anon_fallback_' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * Retrieves the current credit status, automatically performing midnight reset
 * if the date has changed in the user's local timezone.
 */
export function getClientCredits(): UserCredits {
  const today = getLocalDateString();
  const defaultCredits: UserCredits = {
    allowance: DAILY_CREDIT_ALLOWANCE,
    used: 0,
    remaining: DAILY_CREDIT_ALLOWANCE,
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultCredits;
  }

  try {
    const raw = localStorage.getItem(CREDITS_STORAGE_KEY);
    if (!raw) return defaultCredits;

    const parsed = JSON.parse(raw);
    // Midnight reset: If stored date is from a previous day, reset to 0 used
    if (parsed.date !== today) {
      const resetState: UserCredits = {
        allowance: DAILY_CREDIT_ALLOWANCE,
        used: 0,
        remaining: DAILY_CREDIT_ALLOWANCE,
      };
      saveClientCredits(resetState);
      return resetState;
    }

    const used = typeof parsed.used === 'number' ? parsed.used : 0;
    const remaining = Math.max(0, DAILY_CREDIT_ALLOWANCE - used);

    return {
      allowance: DAILY_CREDIT_ALLOWANCE,
      used,
      remaining,
    };
  } catch (err) {
    console.warn('Failed to parse credits from localStorage:', err);
    return defaultCredits;
  }
}

/**
 * Saves updated credit information to localStorage with today's date.
 */
export function saveClientCredits(credits: UserCredits): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const today = getLocalDateString();
    localStorage.setItem(
      CREDITS_STORAGE_KEY,
      JSON.stringify({
        date: today,
        used: credits.used,
        allowance: credits.allowance || DAILY_CREDIT_ALLOWANCE,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (err) {
    console.warn('Failed to save credits to localStorage:', err);
  }
}

/**
 * Constructs credit tracking headers to be passed with requests to /api/improve.
 */
export function getCreditHeaders(): Record<string, string> {
  const clientId = getAnonymousClientId();
  const today = getLocalDateString();
  const credits = getClientCredits();

  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    // ignore
  }

  return {
    'X-Client-Id': clientId,
    'X-Client-Date': today,
    'X-Client-Used': String(credits.used),
    'X-Client-Timezone': timezone,
  };
}
