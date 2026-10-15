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
 * Get color classes according to quality score (0-100) aligned with the editorial palette
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
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      barColor: 'bg-emerald-600',
      tier,
    };
  }
  if (score >= 60) {
    return {
      text: 'text-forest-700 dark:text-forest-300',
      bg: 'bg-forest-50 dark:bg-ink-900',
      border: 'border-forest-200 dark:border-ink-700',
      badgeBg: 'bg-forest-100 text-forest-800 dark:bg-ink-800 dark:text-forest-300',
      barColor: 'bg-forest-700 dark:bg-forest-500',
      tier,
    };
  }
  if (score >= 40) {
    return {
      text: 'text-amber-800 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/80',
      badgeBg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
      barColor: 'bg-amber-600',
      tier,
    };
  }
  return {
    text: 'text-terracotta-700 dark:text-terracotta-300',
    bg: 'bg-terracotta-50 dark:bg-terracotta-950/30',
    border: 'border-terracotta-200 dark:border-terracotta-800/80',
    badgeBg: 'bg-terracotta-100 text-terracotta-800 dark:bg-terracotta-950/60 dark:text-terracotta-300',
    barColor: 'bg-terracotta-600',
    tier,
  };
}
