import type { PromptAnalysis, PromptHistoryItem, TaskType } from '../types';

export const TASK_TYPES: TaskType[] = [
  'General',
  'Coding',
  'Education',
  'Writing',
  'Data Analysis',
  'Career',
  'Business',
  'Research',
  'Social Media',
  'Email',
  'Image Generation',
];

export const MOCK_RECENT_PROMPTS: PromptHistoryItem[] = [
  {
    id: 'hist-1',
    originalPrompt: 'Create a React website',
    improvedPrompt: 'Create a responsive personal portfolio website using React 19 and Tailwind CSS. Include a navigation bar, hero section with dynamic headline, projects grid, skills matrix, accessible contact form with validation, and smooth dark/light mode toggle. Ensure WCAG 2.1 AA accessibility compliance and clean modular component structure.',
    taskType: 'Coding',
    score: 84,
    createdAt: '2026-09-15T09:30:00Z',
    detailedScore: {
      overall: 84,
      clarity: 88,
      context: 78,
      specificity: 92,
      completeness: 80,
    },
    problems: [
      'Missing target technology stack details',
      'No mention of required UI sections or layout',
      'Accessibility and responsiveness standards not specified'
    ],
    whyBetter: [
      'Specified modern tech stack (React 19, Tailwind CSS)',
      'Defined essential structural sections',
      'Added accessibility compliance requirements',
      'Included dark mode and validation constraints'
    ],
    suggestions: [
      'State specific testing libraries if needed',
      'Specify performance or bundle size constraints'
    ]
  },
  {
    id: 'hist-2',
    originalPrompt: 'Explain machine learning',
    improvedPrompt: 'Act as an experienced AI educator. Explain the fundamental principles of Machine Learning to a non-technical undergraduate student. Use a cooking recipe analogy to distinguish between Supervised, Unsupervised, and Reinforcement Learning. Provide one tangible real-world example for each and conclude with a 3-question self-check quiz.',
    taskType: 'Education',
    score: 76,
    createdAt: '2026-09-14T14:15:00Z',
    detailedScore: {
      overall: 76,
      clarity: 82,
      context: 70,
      specificity: 78,
      completeness: 75,
    },
    problems: [
      'Audience knowledge level was not specified',
      'Scope was overwhelmingly broad without subcategories',
      'Format lacked engaging pedagogical structure'
    ],
    whyBetter: [
      'Targeted non-technical undergraduate audience',
      'Added intuitive cooking recipe analogy',
      'Scoped to the three core learning paradigms',
      'Added interactive comprehension quiz'
    ],
    suggestions: [
      'Mention mathematical depth level',
      'Indicate desired length (e.g. 500 words)'
    ]
  },
  {
    id: 'hist-3',
    originalPrompt: 'Write a professional email',
    improvedPrompt: 'Draft an executive-level email to the Vice President of Operations explaining a 1-week timeline delay on Project Titan due to third-party API deprecation. Maintain a calm, solutions-first, and accountable tone. Outline: 1) Executive summary, 2) Root cause in 2 sentences, 3) Mitigating actions and updated launch date (Oct 12), and 4) Clear decision required on scope trimming by end-of-day Friday.',
    taskType: 'Email',
    score: 91,
    createdAt: '2026-09-13T16:45:00Z',
    detailedScore: {
      overall: 91,
      clarity: 94,
      context: 89,
      specificity: 93,
      completeness: 88,
    },
    problems: [
      'Missing recipient identity and context',
      'Goal of email was undefined',
      'No tone or urgency guidelines provided'
    ],
    whyBetter: [
      'Defined executive recipient and context',
      'Set clear solution-oriented tone',
      'Provided structured 4-part outline',
      'Added explicit deadline and call to action'
    ],
    suggestions: [
      'Specify if attachments or links should be referenced'
    ]
  },
  {
    id: 'hist-4',
    originalPrompt: 'Create a responsive portfolio',
    improvedPrompt: 'Build an elegant personal developer portfolio website using React 19, TypeScript, and Tailwind CSS. Implement a sticky navbar with smooth dark mode toggle, hero section with dynamic typing effect, filterable projects grid with live preview modals, skills badge matrix, client testimonial cards, and an accessible contact form with frontend validation. Optimize for mobile devices (320px to 425px) and ensure WCAG 2.1 AA accessibility.',
    taskType: 'Coding',
    score: 88,
    createdAt: '2026-09-12T11:20:00Z',
    detailedScore: {
      overall: 88,
      clarity: 90,
      context: 85,
      specificity: 92,
      completeness: 85,
    },
    problems: [
      'Missing device responsiveness targets',
      'Did not specify key portfolio components',
      'Lacked accessibility requirements'
    ],
    whyBetter: [
      'Defined full component list and structure',
      'Specified precise responsive breakpoints',
      'Added accessibility and typing effects'
    ],
    suggestions: [
      'Include instructions for deployment on Vercel'
    ]
  },
  {
    id: 'hist-5',
    originalPrompt: 'Write a blog post about remote work',
    improvedPrompt: 'Write an authoritative 1,200-word blog post targeted at tech team leaders on "Combating Async Isolation: Building High-Trust Remote Engineering Cultures". Adopt an empathetic, pragmatic tone. Include 4 actionable management rituals, 2 real-world case study vignettes, and end with a downloadable 5-step checklist summary.',
    taskType: 'Writing',
    score: 83,
    createdAt: '2026-09-11T18:00:00Z',
    detailedScore: {
      overall: 83,
      clarity: 88,
      context: 80,
      specificity: 85,
      completeness: 80,
    },
    problems: [
      'Target reader was generic',
      'Word count was unspecified',
      'Tone and concrete examples were absent'
    ],
    whyBetter: [
      'Targeted tech team leaders specifically',
      'Set precise 1,200-word scope and compelling title',
      'Added management rituals and checklist'
    ],
    suggestions: [
      'Specify SEO target keywords if optimizing for search'
    ]
  },
];

/**
 * Generate dynamic mock analysis based on input text and task type
 */
export function generateMockAnalysis(prompt: string, taskType: TaskType, variation: number = 0): PromptAnalysis {
  const trimmed = prompt.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  
  const standardProblems = [
    'Missing target audience',
    'Output format not specified',
    'Some instructions are ambiguous'
  ];

  const standardWhyBetter = [
    'Clear objective',
    'Better context',
    'Defined output',
    'Added constraints',
    'Reduced ambiguity'
  ];

  const standardSuggestions = [
    'Specify your target audience',
    'Mention desired response length',
    'Define expected output format',
    'Add important constraints'
  ];

  // Custom tailored responses for common inputs
  if (trimmed.toLowerCase().includes('website') || trimmed.toLowerCase().includes('react')) {
    const isAlternate = variation % 2 === 1;
    return {
      id: 'analysis-' + Date.now(),
      originalPrompt: prompt,
      taskType: taskType === 'General' ? 'Coding' : taskType,
      score: {
        overall: 82,
        clarity: 85,
        context: 75,
        specificity: 90,
        completeness: 80,
      },
      problems: standardProblems,
      improvedPrompt: isAlternate
        ? `Act as a Principal Software Architect. Build a modular, production-ready portfolio web application using React 19, TypeScript, and Tailwind CSS. Implement the following architecture:\n1. Core Sections: Sticky Navbar with theme toggle, Hero banner with strong value proposition, Filterable Projects gallery, Interactive Skills matrix, and Accessible Contact form with client-side validation.\n2. Non-Functional Requirements: Mobile-first responsive layout (320px to 1440px+), WCAG 2.1 AA accessibility standards, zero external CSS runtime overhead, and clean component isolation.`
        : `Create a responsive personal portfolio website using React and Tailwind CSS. Include a navigation bar, hero section with call-to-action buttons, interactive projects showcase section, technical skills grid, client testimonial cards, accessible contact form with frontend validation, and smooth dark/light mode switching. Ensure semantic HTML, WCAG 2.1 AA accessibility, and mobile-first responsive design across mobile (375px), tablet (768px), and desktop (1280px).`,
      whyBetter: standardWhyBetter,
      suggestions: standardSuggestions,
      createdAt: new Date().toISOString(),
    };
  }

  // Calculate dynamic realistic scores based on prompt length
  const baseClarity = Math.min(95, Math.max(50, 60 + wordCount * 2));
  const baseContext = Math.min(90, Math.max(45, 50 + wordCount * 2));
  const baseSpecificity = Math.min(95, Math.max(55, 65 + wordCount * 2));
  const baseCompleteness = Math.min(90, Math.max(40, 55 + wordCount * 2));
  const overallScore = Math.round((baseClarity + baseContext + baseSpecificity + baseCompleteness) / 4);

  const isAlternate = variation % 2 === 1;

  return {
    id: 'analysis-' + Date.now(),
    originalPrompt: prompt,
    taskType,
    score: {
      overall: Math.min(overallScore, 85),
      clarity: baseClarity,
      context: baseContext,
      specificity: baseSpecificity,
      completeness: baseCompleteness,
    },
    problems: standardProblems,
    improvedPrompt: isAlternate
      ? `Role & Context: You are a distinguished subject matter expert in ${taskType}.\nObjective: In response to "${trimmed}", generate an authoritative, structured deliverable for high-level decision makers.\nKey Instructions:\n- Provide a concise Executive Summary outlining core findings.\n- Deliver detailed, numbered technical specifications and rationale.\n- Address edge cases, dependencies, and risk mitigation strategies.\n- Conclude with an implementation roadmap and verification milestones.\nFormat: Structured Markdown with descriptive subheadings and callout boxes.`
      : `Act as an expert in ${taskType}. Regarding "${trimmed}": Provide a structured, step-by-step response tailored for a professional audience. Begin with a concise executive overview, followed by the core implementation guidelines with concrete examples, address potential edge cases and constraints, and conclude with a practical 3-step action checklist. Format your response in clean Markdown with clear headings and bullet points.`,
    whyBetter: standardWhyBetter,
    suggestions: standardSuggestions,
    createdAt: new Date().toISOString(),
  };
}
