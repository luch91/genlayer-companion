import type { Background, Interest, TimeCommitment } from '@/types'

export const BACKGROUNDS: Background[] = [
  { value: 'developer', label: 'Software Developer' },
  { value: 'designer', label: 'Designer / Creative' },
  { value: 'student', label: 'Student' },
  { value: 'researcher', label: 'Researcher / Academic' },
  { value: 'entrepreneur', label: 'Entrepreneur / Founder' },
  { value: 'web3', label: 'Web3 / Crypto Native' },
  { value: 'marketer', label: 'Marketer / Content Creator' },
  { value: 'other', label: 'Other / Curious Learner' },
]

export const INTERESTS: Interest[] = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'defi', label: 'DeFi / Finance' },
  { value: 'social', label: 'Social / Community' },
  { value: 'ai', label: 'AI / Machine Learning' },
  { value: 'nft', label: 'NFTs / Digital Art' },
  { value: 'governance', label: 'Governance / DAOs' },
  { value: 'education', label: 'Education' },
  { value: 'tools', label: 'Developer Tools' },
  { value: 'health', label: 'Health / Wellness' },
  { value: 'environment', label: 'Environment / Sustainability' },
]

export const TIME_COMMITMENTS: TimeCommitment[] = [
  { value: 'weekend', label: 'A weekend (1–2 days)' },
  { value: 'week', label: 'A week (5–7 days)' },
  { value: 'sprint', label: 'Two weeks (a sprint)' },
  { value: 'month', label: 'A month' },
]
