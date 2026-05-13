export const TOOLS = [
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'coding',
    logo: '⌥',
    color: '#7c3aed',
    plans: [
      { id: 'hobby', label: 'Hobby (Free)', price: 0 },
      { id: 'pro', label: 'Pro', price: 20 },
      { id: 'business', label: 'Business', price: 40 },
      { id: 'enterprise', label: 'Enterprise', price: 100 },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    logo: '◈',
    color: '#6366f1',
    plans: [
      { id: 'individual', label: 'Individual', price: 10 },
      { id: 'business', label: 'Business', price: 19 },
      { id: 'enterprise', label: 'Enterprise', price: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'mixed',
    logo: '◉',
    color: '#f59e0b',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'pro', label: 'Pro', price: 20 },
      { id: 'max', label: 'Max', price: 100 },
      { id: 'team', label: 'Team', price: 25 },
      { id: 'enterprise', label: 'Enterprise', price: 60 },
      { id: 'api', label: 'API Direct', price: null },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'mixed',
    logo: '◎',
    color: '#10b981',
    plans: [
      { id: 'plus', label: 'Plus', price: 20 },
      { id: 'team', label: 'Team', price: 30 },
      { id: 'enterprise', label: 'Enterprise', price: 60 },
      { id: 'api', label: 'API Direct', price: null },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    category: 'api',
    logo: 'Λ',
    color: '#fb7185',
    plans: [
      { id: 'api', label: 'API Direct', price: null },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    category: 'api',
    logo: '⊕',
    color: '#34d399',
    plans: [
      { id: 'api', label: 'API Direct', price: null },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'mixed',
    logo: '✦',
    color: '#60a5fa',
    plans: [
      { id: 'pro', label: 'Pro (Free)', price: 0 },
      { id: 'ultra', label: 'Advanced / Ultra', price: 20 },
      { id: 'api', label: 'API Direct', price: null },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'coding',
    logo: '⛵',
    color: '#a78bfa',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'pro', label: 'Pro', price: 15 },
      { id: 'teams', label: 'Teams', price: 35 },
      { id: 'enterprise', label: 'Enterprise', price: 60 },
    ],
  },
];

export const USE_CASES = [
  { id: 'coding', label: 'Software Development', icon: '⌨' },
  { id: 'writing', label: 'Writing & Content', icon: '✍' },
  { id: 'data', label: 'Data & Analytics', icon: '📊' },
  { id: 'research', label: 'Research', icon: '🔬' },
  { id: 'mixed', label: 'Mixed / General', icon: '⚡' },
];

export function getToolById(id) {
  return TOOLS.find(t => t.id === id);
}
