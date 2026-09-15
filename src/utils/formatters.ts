/**
 * Format ISO date or date string into human-friendly format (e.g., Sep 15, 2026)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Get color classes according to quality score (0-100)
 */
export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  badgeBg: string;
  barColor: string;
} {
  if (score >= 80) {
    return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      barColor: 'bg-emerald-500',
    };
  }
  if (score >= 60) {
    return {
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      barColor: 'bg-blue-500',
    };
  }
  return {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    barColor: 'bg-amber-500',
  };
}
