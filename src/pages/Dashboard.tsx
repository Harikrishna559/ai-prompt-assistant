import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  Award,
  Layers,
  History,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { getHistory, getHistoryStats } from '../services/localStorage';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Button } from '../components/ui/Button';
import { formatDate, getScoreTier, getScoreColor } from '../utils/formatters';
import type { PromptHistoryItem } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => getHistoryStats());
  const [historyItems, setHistoryItems] = useState<PromptHistoryItem[]>(() => getHistory());

  useEffect(() => {
    // Refresh stats when window regains focus
    const handleFocus = () => {
      setStats(getHistoryStats());
      setHistoryItems(getHistory());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const scoreTier = getScoreTier(stats.averageScore);
  const excellentCount = historyItems.filter((i) => (i.score || 0) >= 80).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-ink-900 border border-forest-200/80 dark:border-ink-700 text-forest-800 dark:text-forest-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
            <span>Telemetry & Quality Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
            Usage Dashboard
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Real performance telemetry derived from your private browser sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/history')}
            leftIcon={<History className="w-4 h-4" />}
          >
            Browse Full History
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/improve')}
            rightIcon={<Wand2 className="w-4 h-4" />}
          >
            Enhance New Prompt
          </Button>
        </div>
      </div>

      {/* Real Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Prompts"
          value={stats.totalPrompts}
          subtitle="Saved in browser local storage"
          icon={<Wand2 className="w-5 h-5" />}
        />
        <StatsCard
          title="Average Score"
          value={stats.totalPrompts > 0 ? `${stats.averageScore}/100` : '—'}
          subtitle={stats.totalPrompts > 0 ? `${scoreTier.label} tier average` : 'No prompts evaluated yet'}
          icon={<Award className="w-5 h-5" />}
          trend={
            stats.totalPrompts > 0
              ? {
                  value: scoreTier.label,
                  isPositive: stats.averageScore >= 70,
                }
              : undefined
          }
        />
        <StatsCard
          title="Top Category"
          value={stats.totalPrompts > 0 ? stats.topCategory : '—'}
          subtitle={stats.totalPrompts > 0 ? 'Most frequent domain' : 'Awaiting data'}
          icon={<Layers className="w-5 h-5" />}
        />
        <StatsCard
          title="High Yield (80%+)"
          value={stats.totalPrompts > 0 ? excellentCount : '—'}
          subtitle={
            stats.totalPrompts > 0
              ? `${Math.round((excellentCount / stats.totalPrompts) * 100)}% production ready`
              : 'Zero prompts saved'
          }
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {stats.totalPrompts > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Distribution Chart / Breakdown */}
          <div className="lg:col-span-1 bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">
                Category Distribution
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                Breakdown of task types optimized
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                const percentage = Math.round((count / stats.totalPrompts) * 100);
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink-800 dark:text-ink-200">
                        {cat}
                      </span>
                      <span className="text-ink-500 font-mono">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-parchment-200 dark:bg-ink-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest-700 dark:bg-forest-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-parchment-100/70 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700/60 text-xs text-ink-600 dark:text-ink-400 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-forest-700 dark:text-forest-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                Zero Analytics Leakage
              </span>
              <p className="text-[11px] leading-relaxed">
                All aggregates are computed client-side. No telemetry is transmitted to third-party trackers.
              </p>
            </div>
          </div>

          {/* Recent Prompt Iterations */}
          <div className="lg:col-span-2 bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-parchment-100 dark:border-ink-700/60">
              <div>
                <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">
                  Recent Optimizations
                </h3>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                  Latest prompt evaluations in this environment
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/history')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View All
              </Button>
            </div>

            <div className="divide-y divide-parchment-100 dark:divide-ink-700/60">
              {historyItems.slice(0, 5).map((item) => {
                const scoreColor = getScoreColor(item.score);
                return (
                  <div
                    key={item.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-parchment-50/50 dark:hover:bg-ink-900/30 px-2 -mx-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-1 min-w-0 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border border-parchment-200 dark:border-ink-700">
                          {item.taskType}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${scoreColor.badgeBg}`}
                        >
                          {item.score}/100
                        </span>
                        <span className="text-[11px] text-ink-400">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-ink-800 dark:text-ink-200 truncate font-mono">
                        "{item.originalPrompt}"
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate('/improve', {
                          state: {
                            templatePrompt: item.originalPrompt,
                            taskType: item.taskType,
                          },
                        })
                      }
                      rightIcon={<Wand2 className="w-3.5 h-3.5" />}
                    >
                      Re-Optimize
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-ink-800 border border-dashed border-parchment-300 dark:border-ink-700 rounded-2xl p-10 sm:p-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 dark:bg-ink-900 text-forest-700 dark:text-forest-400 flex items-center justify-center mx-auto border border-forest-100 dark:border-ink-700">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-ink-900 dark:text-ink-50">
              No telemetry collected yet
            </h3>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
              When you improve prompts using the studio tool, your quality scores, categories, and audit telemetry will automatically appear on this dashboard.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/improve')}
              rightIcon={<Wand2 className="w-4 h-4" />}
            >
              Start First Prompt Improvement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
