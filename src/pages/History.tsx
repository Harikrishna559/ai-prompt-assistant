import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Trash2,
  Eye,
  Calendar,
  History as HistoryIcon,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { MOCK_RECENT_PROMPTS, TASK_TYPES } from '../data/mockPrompts';
import type { PromptHistoryItem } from '../types';
import { formatDate, getScoreColor } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { copyToClipboard } from '../utils/clipboard';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<PromptHistoryItem[]>(MOCK_RECENT_PROMPTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [viewingItem, setViewingItem] = useState<PromptHistoryItem | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter & Sort
  const filteredAndSortedItems = useMemo(() => {
    return historyItems
      .filter((item) => {
        const matchesType =
          selectedTaskType === 'All' || item.taskType.toLowerCase() === selectedTaskType.toLowerCase();

        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.originalPrompt.toLowerCase().includes(query) ||
          item.improvedPrompt.toLowerCase().includes(query);

        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOption === 'highest') {
          return b.score - a.score;
        }
        if (sortOption === 'lowest') {
          return a.score - b.score;
        }
        return 0;
      });
  }, [historyItems, searchQuery, selectedTaskType, sortOption]);

  const handleDelete = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    setDeleteConfirmationId(null);
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInImprover = (item: PromptHistoryItem) => {
    setViewingItem(null);
    navigate('/improve', {
      state: {
        templatePrompt: item.originalPrompt,
        taskType: item.taskType,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Prompt History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review past prompt analyses, scores, and revisions saved in local state.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/improve')}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Optimize New Prompt
          </Button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by prompt text..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Task Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Task Types</option>
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full py-2 px-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Score</option>
              <option value="lowest">Sort: Lowest Score</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1">
          <span>
            Showing {filteredAndSortedItems.length} of {historyItems.length} prompts
          </span>
          {(searchQuery || selectedTaskType !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTaskType('All');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      {filteredAndSortedItems.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedItems.map((item) => {
            const scoreColor = getScoreColor(item.score);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.taskType}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${scoreColor.badgeBg}`}
                    >
                      Score: {item.score}/100
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      "{item.originalPrompt}"
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-mono">
                      Improved: {item.improvedPrompt}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingItem(item)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirmationId(item.id)}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<HistoryIcon className="w-8 h-8" />}
          title="No prompts found"
          description={
            historyItems.length === 0
              ? 'You have not analyzed any prompts yet. Head over to the improver to get started!'
              : 'No prompts match your current search and filter criteria.'
          }
          actionText={historyItems.length === 0 ? 'Improve a Prompt' : 'Reset Filters'}
          onAction={() => {
            if (historyItems.length === 0) {
              navigate('/improve');
            } else {
              setSearchQuery('');
              setSelectedTaskType('All');
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <Modal
          isOpen={!!deleteConfirmationId}
          onClose={() => setDeleteConfirmationId(null)}
          title="Confirm Deletion"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to remove this prompt from your local history? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmationId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(deleteConfirmationId)}
              >
                Delete Record
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail View Modal */}
      {viewingItem && (
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title="Prompt Details"
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {viewingItem.taskType} • Quality Score: {viewingItem.score}/100
              </span>
              <span className="text-slate-400">{formatDate(viewingItem.createdAt)}</span>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Original Input
              </span>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm font-mono text-slate-800 dark:text-slate-200">
                "{viewingItem.originalPrompt}"
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Optimized Result
                </span>
                <button
                  onClick={() => handleCopy(viewingItem.improvedPrompt)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/60 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {viewingItem.improvedPrompt}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingItem(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenInImprover(viewingItem)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Load into Improver
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
