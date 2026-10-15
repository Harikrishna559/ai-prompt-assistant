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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-ink-900 border border-forest-200/80 dark:border-ink-700 text-forest-800 dark:text-forest-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
            <span>Browser Local Storage (100% Private)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
            Prompt History
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Historical records are preserved directly in your current browser session.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {historyItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Clear Session
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
      <div className="p-4 rounded-2xl bg-parchment-100/70 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700/80 flex items-start gap-3 text-xs text-ink-700 dark:text-ink-300">
        <ShieldCheck className="w-5 h-5 text-forest-700 dark:text-forest-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-ink-900 dark:text-ink-100">Zero Cloud Data Retention:</p>
          <p className="text-ink-500 dark:text-ink-400 leading-relaxed">
            Your saved prompt iterations remain in your local browser sandbox. No server database retains your queries, preserving confidentiality across development workflows.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by keyword or phrase..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
          </div>

          {/* Task Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              className="w-full py-2 px-3 text-sm rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-700"
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
              className="w-full py-2 px-3 text-sm rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 text-ink-900 dark:text-ink-50 focus:outline-none focus:ring-2 focus:ring-forest-700"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Score</option>
              <option value="lowest">Sort: Lowest Score</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-400 dark:text-ink-500 pt-1">
          <span>
            Showing {filteredAndSortedItems.length} of {historyItems.length} stored prompt records
          </span>
          {(searchQuery || selectedTaskType !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTaskType('All');
              }}
              className="text-forest-700 dark:text-forest-400 hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* History Items List */}
      {!isLoading && filteredAndSortedItems.length > 0 ? (
        <div className="space-y-3.5">
          {filteredAndSortedItems.map((item) => {
            const scoreColor = getScoreColor(item.score);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-5 shadow-xs hover:border-parchment-400 dark:hover:border-ink-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border border-parchment-200 dark:border-ink-700">
                      {item.taskType}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${scoreColor.badgeBg}`}
                    >
                      Score: {item.score}/100
                    </span>
                    <span className="text-xs text-ink-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50 font-mono truncate">
                      "{item.originalPrompt}"
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 line-clamp-1 mt-0.5 font-sans">
                      Deliverable: {item.improvedPrompt}
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
          icon={<HistoryIcon className="w-7 h-7 text-forest-700 dark:text-forest-400" />}
          title={historyItems.length === 0 ? 'No prompts saved yet' : 'No records match search'}
          description={
            historyItems.length === 0
              ? 'Prompts you enhance in the improver will automatically save here in your browser.'
              : 'Try clearing your search query or switching to another domain filter.'
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
            <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400">
              Are you sure you want to remove this prompt from your local browser storage?
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
            <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400">
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
                Clear Session
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
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-parchment-200 dark:border-ink-700">
              <div className="flex items-center gap-2">
                <span className="font-bold text-forest-700 dark:text-forest-400">
                  {viewingItem.taskType}
                </span>
                <span className="text-ink-300 dark:text-ink-700">•</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full ${
                    getScoreColor(viewingItem.score).badgeBg
                  }`}
                >
                  Score: {viewingItem.score}/100
                </span>
              </div>
              <span className="text-ink-400">
                Date: {formatDate(viewingItem.createdAt)}
              </span>
            </div>

            {/* Original */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">
                Original Input
              </span>
              <div className="p-3.5 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 text-xs sm:text-sm text-ink-900 dark:text-ink-100 font-mono">
                "{viewingItem.originalPrompt}"
              </div>
            </div>

            {/* Improved Output */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
                  Optimized Deliverable
                </span>
                <button
                  onClick={() => handleCopy(viewingItem.improvedPrompt)}
                  className="text-xs text-ink-500 hover:text-ink-800 dark:hover:text-ink-200 flex items-center gap-1 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 text-xs sm:text-sm text-ink-900 dark:text-ink-100 leading-relaxed font-sans">
                {viewingItem.improvedPrompt}
              </div>
            </div>

            {/* Why It Was Improved */}
            {viewingItem.whyBetter && viewingItem.whyBetter.length > 0 && (
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
                  Why This Structure Is Better
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingItem.whyBetter.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-forest-50/50 dark:bg-ink-900/40 border border-forest-200/70 dark:border-forest-900/40 text-xs font-medium text-forest-950 dark:text-forest-200"
                    >
                      <span className="text-forest-700 font-bold">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-parchment-200 dark:border-ink-700">
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
