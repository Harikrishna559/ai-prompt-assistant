import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { TASK_TYPES } from '../data/mockPrompts';
import type { PromptHistoryItem } from '../types';
import { formatDate, getScoreColor } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { copyToClipboard } from '../utils/clipboard';
import {
  getHistory,
  deleteHistoryItem,
  clearHistory as clearAllLocalStorageHistory,
} from '../services/localStorage';

export const History: React.FC = () => {
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState<PromptHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  const [viewingItem, setViewingItem] = useState<PromptHistoryItem | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // Fetch items from browser localStorage
  const loadHistory = useCallback(() => {
    setIsLoading(true);
    try {
      const items = getHistory();
      setHistoryItems(items);
    } catch {
      setHistoryItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

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
          return (b.score || 0) - (a.score || 0);
        }
        if (sortOption === 'lowest') {
          return (a.score || 0) - (b.score || 0);
        }
        return 0;
      });
  }, [historyItems, searchQuery, selectedTaskType, sortOption]);

  const handleDeleteItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistoryItems(updated);
    setDeleteConfirmationId(null);
  };

  const handleClearAll = () => {
    clearAllLocalStorageHistory();
    setHistoryItems([]);
    setShowClearConfirm(false);
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            <span>Browser Local Storage (Private)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Prompt History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            History is stored strictly in your current browser session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {historyItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Clear History
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/improve')}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Enhance New Prompt
          </Button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 flex items-start gap-3 text-xs text-sky-800 dark:text-sky-300">
        <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Privacy Disclaimer:</p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Your saved prompt iterations are stored directly in your browser's local storage. Your history is never transmitted to shared database servers, preserving complete privacy across sessions.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by prompt text..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Task Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Categories</option>
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
              className="w-full py-2 px-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
            Showing {filteredAndSortedItems.length} of {historyItems.length} stored prompts
          </span>
          {(searchQuery || selectedTaskType !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTaskType('All');
              }}
              className="text-sky-600 dark:text-sky-400 hover:underline"
            >
              Clear search filters
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      {!isLoading && filteredAndSortedItems.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedItems.map((item) => {
            const scoreColor = getScoreColor(item.score);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-sky-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-slate-700">
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-sans">
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
          icon={<HistoryIcon className="w-8 h-8 text-sky-500" />}
          title={historyItems.length === 0 ? 'No prompts saved yet' : 'No prompts match filters'}
          description={
            historyItems.length === 0
              ? 'Prompts you enhance in the improver will automatically save here in your browser.'
              : 'Try clearing your search query or selecting a different category filter.'
          }
          actionText={historyItems.length === 0 ? 'Enhance a Prompt Now' : 'Reset Search Filters'}
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

      {/* Single Item Delete Modal */}
      {deleteConfirmationId && (
        <Modal
          isOpen={!!deleteConfirmationId}
          onClose={() => setDeleteConfirmationId(null)}
          title="Delete Prompt Record?"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this prompt from your local browser storage?
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
                onClick={() => handleDeleteItem(deleteConfirmationId)}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <Modal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          title="Clear Entire History?"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This will permanently delete all stored prompt records from your current browser session.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearAll}
              >
                Clear All History
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detailed Item Viewer Modal */}
      {viewingItem && (
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title="Saved Prompt Optimization"
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Meta header */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-sky-50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {viewingItem.taskType}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full ${
                    getScoreColor(viewingItem.score).badgeBg
                  }`}
                >
                  Score: {viewingItem.score}/100
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
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
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
              <div className="p-4 rounded-xl bg-sky-50/40 dark:bg-slate-950 border border-sky-100 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {viewingItem.improvedPrompt}
              </div>
            </div>

            {/* Why It Was Improved */}
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

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-50 dark:border-slate-800">
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
