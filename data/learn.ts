import type { Topic } from '@/types'

export const TOPICS: Topic[] = [
  {
    id: 'what-is-genlayer',
    title: 'What is GenLayer?',
    description: 'The Optimistic AI blockchain and why it changes everything.',
    level: 'beginner',
  },
  {
    id: 'intelligent-contracts',
    title: 'Intelligent Contracts',
    description: 'Python-based smart contracts that can read the web and reason with AI.',
    level: 'beginner',
  },
  {
    id: 'optimistic-democracy',
    title: 'Optimistic Democracy',
    description: 'How GenLayer reaches consensus using LLM validators.',
    level: 'intermediate',
  },
  {
    id: 'equivalence-principle',
    title: 'Equivalence Principle',
    description: 'How validators agree on subjective outputs using eq_principle.',
    level: 'intermediate',
  },
  {
    id: 'gl-exec-prompt',
    title: 'gl.exec_prompt',
    description: 'Run AI reasoning inside your contract — with examples.',
    level: 'intermediate',
  },
  {
    id: 'gl-get-webpage',
    title: 'gl.get_webpage',
    description: 'Fetch live web data directly inside an Intelligent Contract.',
    level: 'intermediate',
  },
  {
    id: 'genlayer-js',
    title: 'genlayer-js Frontend SDK',
    description: 'Connect your HTML/JS frontend to a deployed Intelligent Contract.',
    level: 'intermediate',
  },
  {
    id: 'studio',
    title: 'GenLayer Studio',
    description: 'Write, test, and deploy contracts in the browser IDE.',
    level: 'beginner',
  },
  {
    id: 'shipyard',
    title: 'GenShipyard',
    description: 'Deploy and manage your Intelligent Contracts on mainnet.',
    level: 'beginner',
  },
  {
    id: 'advanced-contracts',
    title: 'Advanced Contract Patterns',
    description: 'State machines, multi-step consensus, and complex data flows.',
    level: 'advanced',
  },
]

export const LEARN_SUGGESTIONS = [
  'Explain Optimistic Democracy like I\'m 5',
  'Show me a minimal Intelligent Contract example',
  'How does gl.exec_prompt work?',
  'What\'s the difference between read and write methods?',
  'How do I connect a frontend to my contract?',
]
