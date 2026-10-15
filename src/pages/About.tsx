import React from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Cpu,
  Info,
  Terminal,
  SlidersHorizontal,
  AlertCircle,
  Wand2,
  Award,
} from 'lucide-react';
import { Card } from '../components/ui/Card';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-ink-900 border border-forest-200/80 dark:border-ink-700 text-forest-800 dark:text-forest-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
          <span>Platform Architecture & System Philosophy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
          Engineering Deterministic Human-to-AI Interaction
        </h1>
        <p className="text-sm sm:text-base text-ink-500 dark:text-ink-400 max-w-xl mx-auto">
          "Turn Simple Ideas into Powerful AI Prompts." Mature, editorial-grade prompt architecture powered by Groq Cloud.
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-terracotta-200/80 dark:border-terracotta-900/60 bg-terracotta-50/20 dark:bg-ink-900/40">
          <div className="w-10 h-10 rounded-xl bg-terracotta-100 dark:bg-terracotta-950/60 text-terracotta-700 dark:text-terracotta-400 flex items-center justify-center mb-3.5 border border-terracotta-200 dark:border-terracotta-900/40">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50 mb-1.5">
            The Fundamental Problem
          </h2>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            Most developers and operators interact with LLMs using terse, unconstrained one-liners. Without explicit role personas, boundary constraints, and structural output formats, models generate ambiguous, repetitive, or hallucinated responses.
          </p>
        </Card>

        <Card className="border-forest-200/80 dark:border-ink-700 bg-forest-50/20 dark:bg-ink-900/40">
          <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-ink-900 text-forest-700 dark:text-forest-400 flex items-center justify-center mb-3.5 border border-forest-200 dark:border-ink-700">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50 mb-1.5">
            The Structural Solution
          </h2>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            AI Prompt Studio audits input prompt quality across clarity, context, specificity, and completeness, then applies proven prompt engineering frameworks to synthesize production-ready instructions.
          </p>
        </Card>
      </div>

      {/* How It Works 5-Step Process */}
      <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">
            Optimization Methodology
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Our systematic five-stage prompt engineering lifecycle:
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Input Raw Idea',
              desc: 'Provide your initial thought, brief command, or rough question.',
              icon: <Terminal className="w-4 h-4 text-forest-700 dark:text-forest-400" />,
            },
            {
              step: '2',
              title: 'Analyze Four Pillars',
              desc: 'Evaluated across four core dimensions: clarity, context, specificity, and completeness.',
              icon: <SlidersHorizontal className="w-4 h-4 text-forest-700 dark:text-forest-400" />,
            },
            {
              step: '3',
              title: 'Identify Shortcomings',
              desc: 'Detects missing target persona, unspecified formatting constraints, and ambiguous terms.',
              icon: <AlertCircle className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />,
            },
            {
              step: '4',
              title: 'Apply Frameworks',
              desc: 'Injects role framing, domain expertise, step-by-step guidance, and quality bounds.',
              icon: <Wand2 className="w-4 h-4 text-forest-700 dark:text-forest-400" />,
            },
            {
              step: '5',
              title: 'Deliverable Generation',
              desc: 'Receive a copy-paste ready prompt with actionable tips for future prompting.',
              icon: <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 p-3.5 rounded-xl bg-parchment-50/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-700 hover:border-parchment-400 dark:hover:border-ink-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-forest-100 dark:bg-ink-900 text-forest-800 dark:text-forest-300 flex items-center justify-center shrink-0 border border-forest-200/60 dark:border-ink-700">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400 font-mono">
                    Step {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Used */}
      <div className="bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-forest-700 dark:text-forest-400" />
            Core Stack & Standards
          </h2>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Engineered using modern, high-performance web standards:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'React 19', badge: 'Frontend UI' },
            { name: 'TypeScript', badge: 'Strict Typing' },
            { name: 'Vite 8', badge: 'Bundler' },
            { name: 'Tailwind CSS', badge: 'Editorial Palette' },
            { name: 'Groq Cloud API', badge: 'GPT-OSS 120B' },
            { name: 'Browser Storage', badge: 'Local Persistence' },
            { name: 'Lucide Icons', badge: 'System Icons' },
            { name: 'Vercel', badge: 'Serverless Edge' },
          ].map((tech) => (
            <div
              key={tech.name}
              className="p-3.5 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 text-center"
            >
              <span className="text-sm font-bold text-ink-900 dark:text-ink-100 block">
                {tech.name}
              </span>
              <span className="text-[10px] text-forest-700 dark:text-forest-400 font-semibold uppercase tracking-wider">
                {tech.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Production Notice */}
      <div className="p-4 rounded-2xl bg-forest-50 dark:bg-ink-900/60 border border-forest-200 dark:border-ink-700 flex items-start gap-3 text-ink-800 dark:text-ink-200">
        <Info className="w-5 h-5 text-forest-700 dark:text-forest-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="font-bold text-ink-900 dark:text-ink-50">
            Public Production Environment
          </p>
          <p className="text-ink-600 dark:text-ink-400">
            AI Prompt Studio is deployed at <a href="https://ai-prompt-assistant-jet.vercel.app" target="_blank" rel="noopener noreferrer" className="text-forest-700 dark:text-forest-400 underline font-semibold">ai-prompt-assistant-jet.vercel.app</a>. It provides high-speed prompt engineering powered by Groq Cloud API with zero-failure fallback.
          </p>
        </div>
      </div>
    </div>
  );
};
