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
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { copyToClipboard } from '../utils/clipboard';

const DEMO_ITEMS = [
  {
    original: 'make a website',
    improved:
      'Create a responsive personal portfolio website using React and Tailwind CSS. Include a sticky navigation bar, hero section with call-to-action, projects grid with interactive modals, skills showcase, contact form with validation, and smooth mobile layout.',
    category: 'Coding',
    score: 94,
  },
  {
    original: 'write an email asking for a raise',
    improved:
      'Draft a formal, data-driven email to my direct manager requesting a compensation review during my upcoming appraisal. Highlight 3 major impact metrics from the past year, propose a 12% adjustment aligned with market benchmark rates, and maintain a collaborative tone.',
    category: 'Career',
    score: 96,
  },
  {
    original: 'explain quantum computing',
    improved:
      'Explain quantum computing to a high-school student with basic physics knowledge. Use a spinning coin analogy to differentiate classical bits from qubits, illustrate quantum superposition and entanglement in simple terms, and describe one current practical application.',
    category: 'Education',
    score: 92,
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
    <div className="space-y-20 py-8 md:py-14">
      {/* HERO SECTION */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-ink-900 border border-forest-200/80 dark:border-ink-700 text-xs font-semibold text-forest-800 dark:text-forest-300">
            <span className="w-2 h-2 rounded-full bg-forest-700 dark:bg-forest-400" />
            <span>Powered by Groq Cloud • GPT-OSS 120B</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink-900 dark:text-ink-50 tracking-tight leading-[1.12]">
            Turn Simple Ideas into{' '}
            <span className="text-forest-700 dark:text-forest-300 underline decoration-terracotta-400/60 decoration-wavy decoration-2 underline-offset-8">
              Powerful AI Prompts.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-ink-500 dark:text-ink-400 max-w-2xl mx-auto leading-relaxed">
            Elevate your AI interactions with precision role framing, output constraints, and instant quality scoring — 100% free, private, and registration-free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/improve')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enhance Your Prompt
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/templates')}
            >
              Browse Library Templates
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-medium text-ink-500 dark:text-ink-400 pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-700 dark:text-forest-400" /> No Account Required
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-forest-700 dark:text-forest-400" /> 100% Private Local Storage
            </span>
          </div>
        </div>

        {/* Hero Prompt Visual Architecture Showcase */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-ink-800 rounded-2xl border border-parchment-200 dark:border-ink-700/80 shadow-sm overflow-hidden">
            {/* Header bar */}
            <div className="px-5 py-3.5 bg-parchment-100 dark:bg-ink-900 border-b border-parchment-200 dark:border-ink-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-parchment-300 dark:bg-ink-700" />
                <span className="w-3 h-3 rounded-full bg-parchment-300 dark:bg-ink-700" />
                <span className="w-3 h-3 rounded-full bg-parchment-300 dark:bg-ink-700" />
                <span className="ml-2 text-xs font-mono text-ink-500">groq_prompt_pipeline.ts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-forest-700 dark:text-forest-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Structural Optimization Pipeline</span>
              </div>
            </div>

            {/* Visual Workflow comparison */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Original Prompt Card */}
              <div className="p-4 rounded-xl bg-parchment-50 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                    Raw User Prompt
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/40 dark:text-terracotta-300 font-semibold border border-terracotta-200 dark:border-terracotta-900/40">
                    Vague & Unconstrained (Score: 35)
                  </span>
                </div>
                <p className="text-sm font-medium text-ink-800 dark:text-ink-200 font-mono">
                  "make a website"
                </p>
              </div>

              {/* Arrow + AI Analysis Badge */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px bg-parchment-200 dark:bg-ink-700 flex-1" />
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 dark:bg-ink-900 border border-forest-200 dark:border-ink-700 text-xs font-semibold text-forest-800 dark:text-forest-300">
                  <ArrowDown className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
                  <span>Groq AI Prompt Engineering Framework</span>
                </div>
                <div className="h-px bg-parchment-200 dark:bg-ink-700 flex-1" />
              </div>

              {/* Improved Prompt Card */}
              <div className="p-5 rounded-xl bg-forest-50/40 dark:bg-ink-900/40 border border-forest-600/40 dark:border-forest-500/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
                    Structured Prompt Deliverable
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    Quality Score: 94/100 (+59 pts)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-900 dark:text-ink-100 leading-relaxed font-sans">
                  "Act as a Senior Frontend Architect. Create a responsive personal portfolio website using React and Tailwind CSS. Include a navigation bar, hero section with call-to-action, projects showcase, technical skills grid, contact form with validation, and responsive mobile layout."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
            How The Optimization Engine Works
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
            Four deterministic steps to turn raw prompts into high-yield, production-ready deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Raw Idea Input',
              desc: 'Enter your rough concept, brief command, or preliminary instruction.',
              icon: <Terminal className="w-5 h-5" />,
            },
            {
              step: '02',
              title: 'Four-Pillar Audit',
              desc: 'Groq engine benchmarks clarity, context, specificity, and completeness constraints.',
              icon: <SlidersHorizontal className="w-5 h-5" />,
            },
            {
              step: '03',
              title: 'Role & Format Framing',
              desc: 'Injects domain expertise, negative guardrails, and deterministic output schema.',
              icon: <Wand2 className="w-5 h-5" />,
            },
            {
              step: '04',
              title: 'Copy & Execute',
              desc: 'Copy the ready-to-paste instruction directly into your LLM of choice.',
              icon: <Award className="w-5 h-5" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col p-6 bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 rounded-2xl shadow-xs hover:border-parchment-400 dark:hover:border-ink-600 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-ink-900 text-forest-700 dark:text-forest-300 flex items-center justify-center font-bold text-sm mb-4 border border-forest-100 dark:border-ink-700">
                {item.icon}
              </div>
              <span className="text-[11px] font-mono font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider mb-1">
                Step {item.step}
              </span>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
            Crafted for Professional AI Prompting
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
            Eliminate prompt ambiguity and get deterministic, high-quality results from any language model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Groq Cloud LPUs',
              desc: 'High-speed OpenAI-compatible processing running the openai/gpt-oss-120b model with zero-failure fallback.',
              icon: <Wand2 className="w-5 h-5 text-forest-700 dark:text-forest-400" />,
            },
            {
              title: 'Objective Quality Scoring',
              desc: 'Instant 0-100 rubric across clarity, context, specificity, and completeness metrics.',
              icon: <Award className="w-5 h-5 text-forest-700 dark:text-forest-400" />,
            },
            {
              title: 'Role Persona Architecture',
              desc: 'Automatically establishes authoritative expertise, context boundaries, and operational guardrails.',
              icon: <Sparkles className="w-5 h-5 text-forest-700 dark:text-forest-400" />,
            },
            {
              title: 'Actionable Optimization Tips',
              desc: 'Understand exactly why the improved prompt works better so you learn the principles of prompt engineering.',
              icon: <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
            },
            {
              title: 'Pre-Engineered Blueprints',
              desc: 'Battle-tested prompt patterns spanning Coding, Data Analysis, Writing, Business, and Career.',
              icon: <Layers className="w-5 h-5 text-forest-700 dark:text-forest-400" />,
            },
            {
              title: 'Local Privacy Guarantee',
              desc: 'Prompt history is saved exclusively in your browser localStorage. Zero remote tracking or data storage.',
              icon: <HistoryIcon className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700/80 shadow-xs hover:border-parchment-400 dark:hover:border-ink-600 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-ink-900 flex items-center justify-center mb-3.5 border border-forest-100 dark:border-ink-700">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE DEMO SHOWCASE SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-parchment-100/70 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700/80 p-6 md:p-8 rounded-3xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-400">
                Live Studio Comparison
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 dark:text-ink-50 mt-1">
                Before & After Optimization
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextDemo}
              >
                Next Sample Pattern
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Original */}
            <div className="p-5 rounded-2xl bg-white dark:bg-ink-800 border border-parchment-200 dark:border-ink-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Original Raw Prompt
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/40 dark:text-terracotta-300">
                  Score: 35/100
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-700 text-xs sm:text-sm font-mono text-ink-800 dark:text-ink-200 min-h-[120px] flex items-center">
                "{activeDemo.original}"
              </div>
            </div>

            {/* Improved */}
            <div className="p-5 rounded-2xl bg-white dark:bg-ink-800 border border-forest-600/40 dark:border-forest-500/40 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-forest-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-forest-400" />
                  Optimized Prompt
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Score: {activeDemo.score}/100
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-forest-50/30 dark:bg-ink-900 border border-forest-100 dark:border-ink-700 text-xs sm:text-sm text-ink-900 dark:text-ink-100 min-h-[120px] leading-relaxed">
                "{activeDemo.improved}"
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-parchment-200 dark:border-ink-700">
            <span className="text-xs text-ink-500 dark:text-ink-400">
              Pattern {demoIndex + 1} of {DEMO_ITEMS.length} ({activeDemo.category})
            </span>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyDemo}
                leftIcon={copiedDemo ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              >
                {copiedDemo ? 'Copied' : 'Copy Blueprint'}
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

      {/* CTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-forest-800 dark:bg-forest-900 p-8 sm:p-12 text-center text-parchment-50 shadow-md border border-forest-700">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3.5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your AI Prompts?
            </h2>
            <p className="text-parchment-200 text-sm sm:text-base leading-relaxed">
              Generate structured, copy-paste ready prompt blueprints in seconds. 100% private in your browser with zero registration required.
            </p>
            <div className="pt-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/improve')}
                className="bg-parchment-50 text-ink-900 hover:bg-parchment-100 font-bold border-none"
                rightIcon={<ArrowRight className="w-4 h-4 text-forest-800" />}
              >
                Improve Prompt Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
