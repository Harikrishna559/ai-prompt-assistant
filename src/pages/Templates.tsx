import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, X } from 'lucide-react';
import { MOCK_TEMPLATES, PROMPT_CATEGORIES } from '../data/templates';
import type { PromptTemplate } from '../types';
import { TemplateCard } from '../components/templates/TemplateCard';
import { EmptyState } from '../components/ui/EmptyState';

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        template.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.examplePrompt.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleUseTemplate = (template: PromptTemplate) => {
    navigate('/improve', {
      state: {
        templatePrompt: template.examplePrompt,
        taskType: template.taskType,
        templateTitle: template.title,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Pre-Engineered Pattern Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Prompt Templates
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Start with proven, battle-tested prompt blueprints for any domain.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by keyword, category, or task..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar px-2">
          {PROMPT_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-sky-100/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Grid or Empty State */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No templates found"
          description="Try modifying your search keywords or switching category filters."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      )}
    </div>
  );
};
