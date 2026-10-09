import React, { useState } from 'react';
import {
  Code,
  GraduationCap,
  BarChart3,
  PenTool,
  Share2,
  Briefcase,
  Mail,
  Search,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import type { PromptTemplate } from '../../types';
import { Button } from '../ui/Button';
import { copyToClipboard } from '../../utils/clipboard';

interface TemplateCardProps {
  template: PromptTemplate;
  onUseTemplate: (template: PromptTemplate) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Share2: <Share2 className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onUseTemplate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyExample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(template.examplePrompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700/60 transition-all duration-200 group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 group-hover:scale-105 transition-transform">
            {ICON_MAP[template.iconName] || <Sparkles className="w-5 h-5" />}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 dark:bg-slate-800 dark:text-sky-300 border border-sky-100 dark:border-slate-700">
            {template.category}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {template.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Example Prompt Box */}
        <div className="relative mb-5 p-3.5 rounded-xl bg-sky-50/40 dark:bg-slate-950/70 border border-sky-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sample Prompt
            </span>
            <button
              onClick={handleCopyExample}
              title="Copy sample prompt"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 italic">
            "{template.examplePrompt}"
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="pt-3 border-t border-sky-50 dark:border-slate-800/80">
        <Button
          onClick={() => onUseTemplate(template)}
          variant="secondary"
          size="sm"
          className="w-full group-hover:bg-sky-500 group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-white transition-colors font-medium"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Use Template
        </Button>
      </div>
    </div>
  );
};
