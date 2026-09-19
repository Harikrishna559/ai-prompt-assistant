import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { Button } from '../ui/Button';

interface ImprovedPromptCardProps {
  improvedPrompt: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
  onSave?: () => Promise<boolean> | boolean | void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export const ImprovedPromptCard: React.FC<ImprovedPromptCardProps> = ({
  improvedPrompt,
  onRegenerate,
  isRegenerating = false,
  onSave,
  isSaving = false,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(improvedPrompt);
    if (success) {
      setCopied(true);
      showToast('Prompt copied!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast('Failed to copy. Please select and copy manually.');
    }
  };

  const handleSaveClick = async () => {
    if (isSaving) return;
    if (onSave) {
      const result = await onSave();
      if (result === true) {
        showToast('Prompt saved!');
      }
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 rounded-2xl p-6 shadow-md shadow-indigo-500/5">
      {/* Toast message notification */}
      {feedbackToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-medium shadow-lg flex items-center gap-1.5 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          {feedbackToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Improved Prompt
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Production Ready
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            className={copied ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : ''}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            isLoading={isRegenerating}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Regenerate
          </Button>

          <Button
            type="button"
            variant={isSaved ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleSaveClick}
            isLoading={isSaving}
            disabled={isSaving}
            leftIcon={
              isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-indigo-500" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )
            }
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Output Content Container */}
      <div className="relative group">
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-normal whitespace-pre-wrap select-all">
          {improvedPrompt}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>Ready to paste directly into Gemini, Claude, or ChatGPT.</span>
        <span>{improvedPrompt.length} characters</span>
      </div>
    </div>
  );
};
