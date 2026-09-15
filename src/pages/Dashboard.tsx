import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Copy,
  Check,
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { MOCK_RECENT_PROMPTS } from '../data/mockPrompts';
import type { PromptHistoryItem } from '../types';
import { formatDate, getScoreColor } from '../utils/formatters';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { copyToClipboard } from '../utils/clipboard';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState<PromptHistoryItem | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadInImprover = (item: PromptHistoryItem) => {
    setSelectedPrompt(null);
    navigate('/improve', {
      state: {
        templatePrompt: item.originalPrompt,
        taskType: item.taskType,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your prompt improvement activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/improve')}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            New Prompt Optimization
          </Button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Prompts"
          value="27"
          subtitle="Processed this month"
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: '+14% vs last month', isPositive: true }}
        />
        <StatsCard
          title="Average Prompt Score"
          value="78"
          subtitle="Out of 100 benchmark"
          icon={<Award className="w-5 h-5" />}
          trend={{ value: '+8 pts higher', isPositive: true }}
        />
        <StatsCard
          title="Improved Prompts"
          value="23"
          subtitle="Production-ready outputs"
          icon={<Sparkles className="w-5 h-5" />}
          trend={{ value: '85% conversion', isPositive: true }}
        />
        <StatsCard
          title="Templates Used"
          value="12"
          subtitle="From 10 categories"
          icon={<Layers className="w-5 h-5" />}
          trend={{ value: 'Coding most popular', isPositive: true }}
        />
      </div>

      {/* Recent Prompts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Recent Prompts
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/history')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Full History
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-6">Prompt</th>
                <th className="py-3.5 px-6">Task Type</th>
                <th className="py-3.5 px-6">Score</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {MOCK_RECENT_PROMPTS.map((item) => {
                const scoreStyle = getScoreColor(item.score);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      "{item.originalPrompt}"
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.taskType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreStyle.badgeBg}`}
                      >
                        {item.score} / 100
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPrompt(item)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Grid View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {MOCK_RECENT_PROMPTS.map((item) => {
            const scoreStyle = getScoreColor(item.score);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.taskType}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreStyle.badgeBg}`}
                  >
                    Score: {item.score}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                  "{item.originalPrompt}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                  <span>{formatDate(item.createdAt)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPrompt(item)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Modal Viewer */}
      {selectedPrompt && (
        <Modal
          isOpen={!!selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          title="Prompt Details & Optimization"
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Meta tags */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Category: {selectedPrompt.taskType}
              </span>
              <span className="text-slate-400">
                Created: {formatDate(selectedPrompt.createdAt)}
              </span>
            </div>

            {/* Original */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Original Prompt
              </span>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 font-mono">
                "{selectedPrompt.originalPrompt}"
              </div>
            </div>

            {/* Improved Output */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Improved Version
                </span>
                <button
                  onClick={() => handleCopy(selectedPrompt.improvedPrompt)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/60 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedPrompt.improvedPrompt}
              </div>
            </div>

            {/* Subscores if available */}
            {selectedPrompt.detailedScore && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Clarity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPrompt.detailedScore.clarity}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Context</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPrompt.detailedScore.context}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Specificity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPrompt.detailedScore.specificity}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Completeness</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPrompt.detailedScore.completeness}%
                  </span>
                </div>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPrompt(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleLoadInImprover(selectedPrompt)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Open in Improver
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
