import type { Mission, OpenContribution } from '@/types'

export const MISSIONS_DATA: Mission[] = [
  {
    id: 'tutorial',
    title: 'From Zero to GenLayer',
    subtitle: 'Featured Mission — Educational Content',
    type: 'timed',
    badge: 'FEATURED',
    prize: 'Extra points + GenLayer social feature + official docs inclusion',
    description:
      'Create a comprehensive multi-part educational resource that walks a complete beginner from zero to deploying their first Intelligent Contract. Must demonstrate Optimistic Democracy and the Equivalence Principle.',
    requirements: [
      'Explain Optimistic Democracy and the Equivalence Principle clearly',
      'Include a working Python Intelligent Contract in GenLayer Studio',
      'Build a genlayer-js frontend that connects to the contract',
      'Multi-part format: written guide, video, or both',
      'Verified with GenLayer Studio and Shipyard',
    ],
    chatSeed:
      "I'm here to help you win the From Zero to GenLayer mission. Tell me your background and I'll help you design a tutorial that stands out.",
    status: 'open',
    deadline: null,
  },
  {
    id: 'minigame',
    title: 'Mini-Games for Community',
    subtitle: 'Special Mission — Projects & Milestones',
    type: 'timed',
    badge: 'SPECIAL',
    prize: 'Community testing + social coverage + potential Foundation hosting',
    description:
      'Build a multiplayer mini-game where an Intelligent Contract is the core game engine — handling state, turns, and outcomes via Optimistic Democracy consensus. Must be replayable weekly with an XP leaderboard.',
    requirements: [
      'Intelligent Contract at the core of all game logic',
      'Optimistic Democracy integral to gameplay (not bolted on)',
      'Multiplayer — at least 2 players',
      '5–15 minute session length, replayable weekly',
      'Post-game XP leaderboard stored on-chain',
    ],
    chatSeed:
      "Let's build your GenLayer mini-game! What kind of game are you thinking? I'll help you design the contract architecture and frontend.",
    status: 'open',
    deadline: null,
  },
]

export const OPEN_CONTRIBUTIONS: OpenContribution[] = [
  {
    id: 'projects',
    title: 'Projects & Milestones',
    description: "Showcase your project from MVP to growth milestones. GenLayer's take on early ecosystem grants — earn rewards as you build and reach new stages. Significant achievements get amplification across GenLayer's channels.",
    actions: [
      'Start with a working MVP — any domain that uses an Intelligent Contract',
      'Submit to the Builder Portal and define your milestone roadmap',
      'Earn rewards incrementally as you hit each milestone',
      'Get amplified across GenLayer\'s channels for significant achievements',
    ],
    chatSeed: "Tell me what you're building — even at MVP stage. I'll help you design the Intelligent Contract, scope your MVP, and plan your milestone roadmap for GenLayer's ecosystem grant programme.",
  },
  {
    id: 'research',
    title: 'Research & Analysis',
    description: 'Publish original research on GenLayer — consensus analysis, AI alignment, use case exploration, or comparative studies.',
    actions: [
      'Pick an open question in the GenLayer ecosystem',
      'Research deeply and document findings',
      'Publish as a paper, blog post, or technical thread',
      'Engage the community for peer review',
    ],
    chatSeed: "What research topic interests you? I can help you frame the question and find relevant GenLayer concepts to explore.",
  },
  {
    id: 'tools',
    title: 'Tools & Infrastructure',
    description: 'Build developer tooling — CLIs, libraries, templates, testing frameworks — that makes GenLayer development easier.',
    actions: [
      'Identify a friction point for GenLayer developers',
      'Design and build the tool',
      'Write documentation and examples',
      'Open-source and share with the community',
    ],
    chatSeed: "What pain point do you want to solve for GenLayer devs? Let's design a tool together.",
  },
  {
    id: 'community',
    title: 'Community & Growth',
    description: 'Expand the GenLayer ecosystem through content, events, onboarding, and ambassador activities.',
    actions: [
      'Create educational content (videos, threads, articles)',
      'Help newcomers in community channels',
      'Organize or attend GenLayer meetups',
      'Translate docs or tutorials to other languages',
    ],
    chatSeed: "How do you want to grow the GenLayer community? Tell me your strengths and we'll find the best angle.",
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Improve or expand GenLayer\'s official documentation — guides, API references, tutorials, or translations.',
    actions: [
      'Identify gaps in the current documentation',
      'Draft new or improved content',
      'Submit via the GenLayer GitHub repository',
      'Iterate based on community feedback',
    ],
    chatSeed: "What part of GenLayer documentation needs improvement? I'll help you write clear, accurate technical content.",
  },
  {
    id: 'educational',
    title: 'Educational Content',
    description: 'Create standalone educational resources — courses, workshops, explainers — that teach GenLayer concepts.',
    actions: [
      'Choose a GenLayer concept or workflow to teach',
      'Design the learning path and format',
      'Create the content with working examples',
      'Publish and share with the community',
    ],
    chatSeed: "What GenLayer concept do you want to teach? I'll help you build a lesson that actually sticks.",
  },
]
