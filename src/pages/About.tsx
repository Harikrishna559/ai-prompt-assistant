import React from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Cpu,
  Info,
  ShieldCheck,
  Rocket,
  Code2,
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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Platform Architecture & Vision</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Engineering Better Human-to-AI Communication
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          "Turn Simple Ideas into Powerful AI Prompts."
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-200/70 dark:border-amber-950/60 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            The Problem
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Most users interact with LLMs using vague, unconstrained one-liners. Without explicit role personas, context boundaries, output formatting instructions, and negative constraints, AI models produce generic, repetitive, or inaccurate answers.
          </p>
        </Card>

        <Card className="border-sky-200/70 dark:border-sky-950/60 bg-sky-50/20 dark:bg-sky-950/10">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            The Solution
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            AI Prompt Improvement Assistant automatically audits prompt quality across clarity, context, specificity, and completeness, then applies proven prompt engineering frameworks to generate production-ready instructions.
          </p>
        </Card>
      </div>

      {/* How It Works 5-Step Process */}
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Optimization Methodology
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Our systematic five-stage optimization lifecycle:
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Input Raw Idea',
              desc: 'Provide your initial thought, brief question, or raw task request.',
              icon: <Terminal className="w-4 h-4 text-sky-500" />,
            },
            {
              step: '2',
              title: 'Analyze Four Pillars',
              desc: 'Evaluated across four core dimensions: clarity, context, specificity, and completeness.',
              icon: <SlidersHorizontal className="w-4 h-4 text-sky-500" />,
            },
            {
              step: '3',
              title: 'Identify Shortcomings',
              desc: 'Detects missing target persona, unspecified formatting constraints, and ambiguous terms.',
              icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
            },
            {
              step: '4',
              title: 'Apply Frameworks',
              desc: 'Injects role framing, domain expertise, step-by-step guidance, and quality bounds.',
              icon: <Wand2 className="w-4 h-4 text-sky-500" />,
            },
            {
              step: '5',
              title: 'Deliverable Generation',
              desc: 'Receive a copy-paste ready prompt with actionable tips for future prompting.',
              icon: <Award className="w-4 h-4 text-emerald-500" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-sky-50 dark:border-slate-800 hover:border-sky-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-500">
                    Step {item.step}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Used */}
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-500" />
            Technologies Used
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Built using modern, high-performance web standards:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: 'React 19', badge: 'Frontend Library' },
            { name: 'TypeScript', badge: 'Strict Typing' },
            { name: 'Vite 8', badge: 'Build Tool' },
            { name: 'Tailwind CSS', badge: 'Sky-Blue Theme' },
            { name: 'NVIDIA NIM API', badge: 'Llama 3.3 70B' },
            { name: 'Browser Storage', badge: '100% Local History' },
            { name: 'Lucide Icons', badge: 'UI Icons' },
            { name: 'Vercel', badge: 'Serverless Platform' },
          ].map((tech) => (
            <div
              key={tech.name}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-sky-50 dark:border-slate-800 text-center"
            >
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                {tech.name}
              </span>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                {tech.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Features */}
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-sky-500" />
            Core Capabilities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Engineered for speed, privacy, and public usability:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              phase: 'AI Provider',
              title: 'NVIDIA NIM Integration',
              desc: 'High-speed OpenAI-compatible API endpoint executing Meta Llama 3.3 70B Instruct with rule-based fallback fallback protection.',
              icon: <Sparkles className="w-4 h-4 text-sky-500" />,
              badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
            },
            {
              phase: 'Public Access',
              title: 'Zero Login Requirement',
              desc: 'Immediate access for all visitors without forced account registration, passwords, or OAuth bottlenecks.',
              icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
              badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
            },
            {
              phase: 'Privacy First',
              title: 'Browser Local Storage',
              desc: 'Prompt history is saved exclusively in the user browser local storage with zero server database tracking.',
              icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
              badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
            },
            {
              phase: 'Abuse Control',
              title: 'Server-Side Rate Limiting',
              desc: 'IP sliding window rate limiting and input length bounds protect serverless infrastructure.',
              icon: <Award className="w-4 h-4 text-amber-500" />,
              badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
            },
            {
              phase: 'Library',
              title: 'Curated Templates',
              desc: 'Pre-engineered prompt patterns spanning Coding, Writing, Research, Career, and Business.',
              icon: <Code2 className="w-4 h-4 text-purple-500" />,
              badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
            },
            {
              phase: 'Infrastructure',
              title: 'Vercel Deployment',
              desc: 'Fast serverless execution, SPA route handling, and optimized asset delivery.',
              icon: <Rocket className="w-4 h-4 text-rose-500" />,
              badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
            },
          ].map((item) => (
            <div
              key={item.phase}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-sky-50 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shrink-0">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                    Active
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.phase}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Notice */}
      <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex items-start gap-3 text-sky-900 dark:text-sky-200">
        <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="font-semibold">
            Public SaaS Platform
          </p>
          <p>
            AI Prompt Improvement Assistant is deployed at <a href="https://ai-prompt-assistant-jet.vercel.app" target="_blank" rel="noopener noreferrer" className="underline font-medium">ai-prompt-assistant-jet.vercel.app</a>. It provides high-performance prompt engineering tools powered by NVIDIA NIM & Meta Llama 3.3.
          </p>
        </div>
      </div>
    </div>
  );
};
