import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Award,
  Wand2,
  Lightbulb,
  Layers,
  History as HistoryIcon,
  Check,
  Copy,
  Terminal,
  ArrowDown,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { copyToClipboard } from '../utils/clipboard';

const DEMO_ITEMS = [
  {
    original: 'make a website',
    improved:
      'Create a responsive personal portfolio website using React and Tailwind CSS. Include a navigation bar, hero section, projects section, skills section, contact form and responsive mobile layout.',
    category: 'Coding',
    score: 84,
  },
  {
    original: 'write an email asking for a raise',
    improved:
      'Draft a formal, data-driven email to my direct manager requesting a salary review during my upcoming annual appraisal. Highlight 3 major impact metrics from the past year, propose a 12% adjustment aligned with market benchmark rates, and maintain a collaborative, appreciative tone.',
    category: 'Career',
    score: 92,
  },
  {
    original: 'explain quantum computing',
    improved:
      'Explain quantum computing to a high-school student with basic physics knowledge. Use a spinning coin analogy to differentiate classical bits from qubits, illustrate quantum superposition and entanglement in simple terms, and describe one current practical application without heavy mathematical jargon.',
    category: 'Education',
    score: 89,
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [demoIndex, setDemoIndex] = useState(0);
  const [copiedDemo, setCopiedDemo] = useState(false);

  const activeDemo = DEMO_ITEMS[demoIndex];

  const handleCopyDemo = async () => {
    const success = await copyToClipboard(activeDemo.improved);
    if (success) {
      setCopiedDemo(true);
      setTimeout(() => setCopiedDemo(false), 2000);
    }
  };

  const handleNextDemo = () => {
    setDemoIndex((prev) => (prev + 1) % DEMO_ITEMS.length);
  };

  return (
    <div className="space-y-24 py-8 md:py-16">
      {/* ==================================================== */}
      {/* HERO SECTION                                         */}
      {/* ==================================================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20 pointer-events-none overflow-hidden">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 blur-[140px] rounded-full" />
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Prompt Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
            Transform Your Prompts.{' '}
            <span className="ai-gradient-text">Get Better AI Responses.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Analyze, improve and optimize your prompts with an AI-powered prompt engineering assistant.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/improve')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Improve My Prompt
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/templates')}
            >
              Explore Templates
            </Button>
          </div>
        </div>

        {/* Hero Prompt Visual Mockup */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Header bar */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">assistant_optimizer.ts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Optimization Pipeline</span>
              </div>
            </div>

            {/* Visual Workflow comparison */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Original Prompt Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Original Prompt
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 font-medium">
                    Vague & Unconstrained
                  </span>
                </div>
                <p className="text-base font-medium text-slate-700 dark:text-slate-300 font-mono">
                  "make a website"
                </p>
              </div>

              {/* Arrow + AI Analysis Badge */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm animate-pulse">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>AI Analysis & Framework Application</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              </div>

              {/* Improved Prompt Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Improved Prompt
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold">
                    Score: 88/100 (+42%)
                  </span>
                </div>
                <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  "Create a responsive personal portfolio website using React and Tailwind CSS. Include a navigation bar, hero section with call-to-action, projects showcase, technical skills grid, contact form with validation, and responsive mobile layout."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* WORKFLOW SECTION                                     */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Four simple steps to turn low-quality prompt outputs into deterministic, high-yield results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: '1',
              title: 'Enter Your Prompt',
              desc: 'User enters an initial prompt or rough thought.',
              icon: <Terminal className="w-5 h-5" />,
            },
            {
              step: '2',
              title: 'Analyze',
              desc: 'The system analyzes clarity, context, specificity and completeness.',
              icon: <SlidersHorizontal className="w-5 h-5" />,
            },
            {
              step: '3',
              title: 'Improve',
              desc: 'The system generates an optimized version with established prompt patterns.',
              icon: <Wand2 className="w-5 h-5" />,
            },
            {
              step: '4',
              title: 'Get Better Results',
              desc: 'The user receives a clearer and more effective prompt ready for copy-paste.',
              icon: <Award className="w-5 h-5" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                Step {item.step}
              </span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* FEATURES SECTION                                     */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Comprehensive Prompt Intelligence
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Everything you need to write precision instructions for any large language model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI-Powered Analysis',
              desc: 'Instantly breaks down syntax, role definition, context boundaries, and missing variables in seconds.',
              icon: <Wand2 className="w-6 h-6 text-blue-500" />,
            },
            {
              title: 'Prompt Quality Score',
              desc: 'Get an objective 0-100 grade across clarity, context, specificity, and completeness metrics.',
              icon: <Award className="w-6 h-6 text-indigo-500" />,
            },
            {
              title: 'Smart Prompt Improvement',
              desc: 'Automatically injects role personas, positive & negative constraints, and explicit output structures.',
              icon: <Sparkles className="w-6 h-6 text-purple-500" />,
            },
            {
              title: 'Actionable Suggestions',
              desc: 'Learn prompt engineering on the fly with targeted, practical guidance for next time.',
              icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
            },
            {
              title: 'Prompt Templates',
              desc: 'Access pre-engineered frameworks spanning Coding, Education, Business, Email, and Research.',
              icon: <Layers className="w-6 h-6 text-emerald-500" />,
            },
            {
              title: 'Prompt History',
              desc: 'Keep track of all your iterations, scores, and revisions in one unified, searchable hub.',
              icon: <HistoryIcon className="w-6 h-6 text-rose-500" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* LIVE DEMO SECTION                                    */}
      {/* ==================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Interactive Showcase
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                See the Difference in Action
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextDemo}
              >
                Try Another Prompt
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Original Prompt
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                  Score: 32/100
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-sm font-mono text-slate-700 dark:text-slate-300 min-h-[140px] flex items-center">
                "{activeDemo.original}"
              </div>
            </div>

            {/* Improved */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Improved Prompt
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  Score: {activeDemo.score}/100
                </span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-slate-950 border border-indigo-100 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 min-h-[140px] leading-relaxed">
                "{activeDemo.improved}"
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Demo sample {demoIndex + 1} of {DEMO_ITEMS.length} ({activeDemo.category})
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyDemo}
                leftIcon={copiedDemo ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              >
                {copiedDemo ? 'Copied to Clipboard' : 'Copy Prompt'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/improve')}
              >
                Open in Improver
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* CTA SECTION                                          */}
      {/* ==================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to write better prompts?
            </h2>
            <p className="text-indigo-100 text-base sm:text-lg">
              Start improving your prompts and get more useful AI responses.
            </p>
            <div className="pt-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/improve')}
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-md font-semibold"
                rightIcon={<ArrowRight className="w-4 h-4 text-indigo-600" />}
              >
                Improve Your First Prompt
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
