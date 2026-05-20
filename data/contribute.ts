import type { ContribPath } from '@/types'

export const CONTRIBS: ContribPath[] = [
  {
    id: 'build-contract',
    title: 'Build an Intelligent Contract',
    description: 'Write a Python contract using gl.exec_prompt or gl.get_webpage and deploy it on Shipyard.',
    steps: [
      'Pick a real-world use case that benefits from AI reasoning',
      'Write the contract in Python using GenLayer primitives',
      'Test in GenLayer Studio',
      'Deploy on GenShipyard and share your contract address',
    ],
  },
  {
    id: 'create-frontend',
    title: 'Create a Frontend DApp',
    description: 'Build a single-file HTML frontend that connects to a deployed Intelligent Contract using genlayer-js.',
    steps: [
      'Choose or deploy a contract on Shipyard',
      'Build a self-contained HTML page (CSS + JS inline)',
      'Integrate genlayer-js readContract / writeContract',
      'Deploy on Netlify Drop or Vercel',
    ],
  },
  {
    id: 'write-tutorial',
    title: 'Write a Tutorial',
    description: 'Document your GenLayer experience — from setup to deployment — to help the next builder.',
    steps: [
      'Pick a specific workflow or concept you understand well',
      'Write step-by-step with working code snippets',
      'Include screenshots or video where helpful',
      'Submit to the GenLayer community channels',
    ],
  },
  {
    id: 'research',
    title: 'Publish Research',
    description: 'Explore GenLayer\'s consensus model, AI alignment properties, or novel use cases in depth.',
    steps: [
      'Identify an open question in the GenLayer ecosystem',
      'Research and document your findings',
      'Publish as a blog post, paper, or thread',
      'Share with the community for feedback',
    ],
  },
  {
    id: 'build-tool',
    title: 'Build a Developer Tool',
    description: 'Create a CLI, library, template, or plugin that makes GenLayer development easier.',
    steps: [
      'Identify a friction point in the developer workflow',
      'Design and build the tool',
      'Write a README with installation and usage',
      'Open-source it and share with the community',
    ],
  },
  {
    id: 'community',
    title: 'Grow the Community',
    description: 'Help more builders discover GenLayer through content, events, or onboarding support.',
    steps: [
      'Create educational content — videos, threads, or posts',
      'Help newcomers in Discord or Telegram',
      'Organize or join a local Web3 meetup',
      'Translate documentation into your language',
    ],
  },
]

export const CONTRIBUTE_SUGGESTIONS = [
  'Which path suits a Python developer?',
  'I want to contribute but have no blockchain experience',
  'What\'s the fastest way to make an impact?',
  'How do I get my work recognized by the GenLayer team?',
]
