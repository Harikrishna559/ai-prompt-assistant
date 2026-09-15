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

export type ScoreTierLabel = 'Needs Improvement' | 'Fair' | 'Good' | 'Excellent';

/**
 * Get standardized quality tier based on score
 * 0-39: Needs Improvement
 * 40-59: Fair
 * 60-79: Good
 * 80-100: Excellent
 */
export function getScoreTier(score: number): {
  label: ScoreTierLabel;
  description: string;
} {
  if (score >= 80) {
    return {
      label: 'Excellent',
      description: 'Production-grade prompt with precise context, role, and output parameters.',
    };
  }
  if (score >= 60) {
    return {
      label: 'Good',
      description: 'Solid foundation with minor ambiguities or missing boundary constraints.',
    };
  }
  if (score >= 40) {
    return {
      label: 'Fair',
      description: 'Basic instruction provided, but lacks audience framing and format specification.',
    };
  }
  return {
    label: 'Needs Improvement',
    description: 'Highly ambiguous or minimal prompt; requires objective, context, and guardrails.',
  };
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
  tier: ScoreTierLabel;
} {
  const tier = getScoreTier(score).label;

  if (score >= 80) {
    return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      barColor: 'bg-emerald-500',
      tier,
    };
  }
  if (score >= 60) {
    return {
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      barColor: 'bg-blue-500',
      tier,
    };
  }
  if (score >= 40) {
    return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      barColor: 'bg-amber-500',
      tier,
    };
  }
  return {
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    barColor: 'bg-rose-500',
    tier,
  };
}
