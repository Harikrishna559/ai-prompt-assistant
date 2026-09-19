import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { TASK_TYPES } from '../data/mockPrompts';
import type { PromptHistoryItem } from '../types';
import { formatDate, getScoreColor } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { copyToClipboard } from '../utils/clipboard';
import { useAuth } from '../context/AuthContext';
import { getPromptHistory, deletePromptHistory } from '../services/database';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [historyItems, setHistoryItems] = useState<PromptHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [viewingItem, setViewingItem] = useState<PromptHistoryItem | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch real history on mount or when auth state changes
  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await getPromptHistory();
        if (!isMounted) return;

        if (fetchError) {
          setError(fetchError);
        } else {
          setHistoryItems(data || []);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load prompt history. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, authLoading]);

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

  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const { success, error: delError } = await deletePromptHistory(id);
      if (success) {
        setHistoryItems((prev) => prev.filter((item) => item.id !== id));
        setDeleteConfirmationId(null);
      } else {
        setError(delError || 'Failed to delete prompt history item.');
        setDeleteConfirmationId(null);
      }
    } catch {
      setError('An unexpected error occurred while deleting.');
      setDeleteConfirmationId(null);
    } finally {
      setIsDeleting(false);
    }
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
            Review past prompt analyses, scores, and revisions saved to your account.
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

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-sm text-rose-700 dark:text-rose-400 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading prompt history...</p>
        </div>
      ) : filteredAndSortedItems.length > 0 ? (
        /* History Items List */
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
        /* Empty State */
        <EmptyState
          icon={<HistoryIcon className="w-8 h-8" />}
          title={historyItems.length === 0 ? 'No prompts in history' : 'No prompts found'}
          description={
            historyItems.length === 0
              ? "You haven't saved any prompts yet. Head over to the improver to get started!"
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
          onClose={() => !isDeleting && setDeleteConfirmationId(null)}
          title="Delete this prompt?"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This action will permanently remove this prompt from your account history.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmationId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeleting}
                disabled={isDeleting}
                onClick={() => handleDelete(deleteConfirmationId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detailed Modal Viewer */}
      {viewingItem && (
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title="Prompt Details & Optimization"
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Meta header */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {viewingItem.taskType}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    getScoreColor(viewingItem.score).badgeBg
                  }`}
                >
                  Score: {viewingItem.score} ({getScoreColor(viewingItem.score).tier})
                </span>
              </div>
              <span className="text-slate-400">
                Date: {formatDate(viewingItem.createdAt)}
              </span>
            </div>

            {/* Original */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Original Prompt
              </span>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 font-mono">
                "{viewingItem.originalPrompt}"
              </div>
            </div>

            {/* Improved Output */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Improved Prompt
                </span>
                <button
                  onClick={() => handleCopy(viewingItem.improvedPrompt)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/60 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {viewingItem.improvedPrompt}
              </div>
            </div>

            {/* Why It Was Improved (if available in JSONB) */}
            {viewingItem.whyBetter && viewingItem.whyBetter.length > 0 && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Why It Was Improved
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingItem.whyBetter.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-medium text-emerald-900 dark:text-emerald-300"
                    >
                      <span>✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions (if available in JSONB) */}
            {viewingItem.suggestions && viewingItem.suggestions.length > 0 && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                  Suggestions
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {viewingItem.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal actions */}
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
