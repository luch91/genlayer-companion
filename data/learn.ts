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
    title: 'Shipyard',
    description: 'Deploy and manage your Intelligent Contracts on the network.',
    level: 'beginner',
  },
  {
    id: 'advanced-contracts',
    title: 'Advanced Contract Patterns',
    description: 'State machines, multi-step consensus, and complex data flows.',
    level: 'advanced',
  },
]

export const TOOL_IDS = ['studio', 'shipyard']

export const TOPIC_SEEDS: Record<string, string> = {
  'what-is-genlayer':
    "You selected **What is GenLayer?** — let's start from zero. Ask me what makes GenLayer different from Ethereum, why contracts are written in Python, how AI validators work, or anything else about the basics.",

  'intelligent-contracts':
    "You selected **Intelligent Contracts** — Python-based contracts that can read the web and reason with AI. Ask me to show a working example, explain the class structure, walk through decorators, or compare with a traditional Solidity contract.",

  'optimistic-democracy':
    "You selected **Optimistic Democracy** — GenLayer's consensus mechanism. Ask me to walk through the 5-step process, explain what happens when validators disagree, how appeals work, or why non-deterministic AI outputs can still reach consensus.",

  'equivalence-principle':
    "You selected **Equivalence Principle** — how validators agree on subjective AI outputs. Ask me to explain gl.eq_principle_prompt_comparative with a code example, walk through a borderline case, or show how to write a good equivalence principle string.",

  'gl-exec-prompt':
    "You selected **gl.exec_prompt** — running AI reasoning directly inside a contract. Ask me for examples: sentiment analysis, content classification, decision-making logic, or how to structure prompts for reliable validator consensus.",

  'gl-get-webpage':
    "You selected **gl.get_webpage** — fetching live web data inside an Intelligent Contract. Ask me for examples: live price feeds, news headlines, sports scores, or how to combine gl.get_webpage with gl.exec_prompt to process the fetched data.",

  'genlayer-js':
    "You selected **genlayer-js Frontend SDK** — connecting a frontend to a deployed Intelligent Contract. Ask me to show readContract vs writeContract, how to handle transaction states, set up the client, or wire up a complete HTML/JS frontend example.",

  'studio':
    "You selected **GenLayer Studio** — the browser-based IDE for writing and testing Intelligent Contracts. Ask me how to get started, how to write and run your first contract, how to use the simulator, or how to debug contract behaviour before deploying.",

  'shipyard':
    "You selected **Shipyard** — the platform for deploying and managing Intelligent Contracts on the GenLayer network. Ask me how to deploy a contract, read the contract address after deployment, interact with a live contract, or manage contract versions.",

  'advanced-contracts':
    "You selected **Advanced Contract Patterns** — state machines, multi-step consensus, and complex data flows. Ask me for a specific pattern you want to implement, or to walk through examples of complex Intelligent Contract architectures.",
}

export const LEARN_SUGGESTIONS = [
  'Explain Optimistic Democracy like I\'m 5',
  'Show me a minimal Intelligent Contract example',
  'How does gl.exec_prompt work?',
  'What\'s the difference between read and write methods?',
  'How do I connect a frontend to my contract?',
]
