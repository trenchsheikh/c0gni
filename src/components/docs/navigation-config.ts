import { 
  BookOpen, 
  Zap, 
  Users, 
  Factory, 
  Code, 
  Cpu, 
  Coins, 
  HelpCircle,
  Rocket,
  Brain,
  TrendingUp,
  LifeBuoy,
  Network
} from 'lucide-react';

export interface NavItem {
  title: string;
  href?: string;
  icon?: any;
  items?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      {
        title: 'Introduction',
        href: '/docs',
      },
      {
        title: 'Quickstart',
        href: '/docs/quickstart',
      },
    ],
  },
  {
    title: 'Agents',
    icon: Users,
    items: [
      {
        title: 'Overview',
        href: '/docs/agents',
      },
      {
        title: 'Agent Types',
        href: '/docs/agents/types',
      },
      {
        title: 'Lifecycle',
        href: '/docs/agents/lifecycle',
      },
      {
        title: 'Performance',
        href: '/docs/agents/performance',
      },
      {
        title: 'Swarms',
        href: '/docs/agents/swarms',
      },
    ],
  },
  {
    title: 'Platform',
    icon: Factory,
    items: [
      {
        title: 'Agent Factory',
        href: '/docs/platform/factory',
      },
      {
        title: 'Agent Studio',
        href: '/docs/platform/studio',
      },
    ],
  },
  {
    title: 'Technical',
    icon: Cpu,
    items: [
      {
        title: 'Architecture',
        href: '/docs/architecture',
      },
      {
        title: 'Solana Integration',
        href: '/docs/technical/solana',
      },
    ],
  },
  {
    title: 'SDK & API',
    icon: Code,
    items: [
      {
        title: 'SDK Overview',
        href: '/docs/sdk',
      },
      {
        title: 'Python SDK',
        href: '/docs/sdk/python',
      },
      {
        title: 'API Reference',
        href: '/docs/api',
      },
    ],
  },
  {
    title: 'Token',
    icon: Coins,
    items: [
      {
        title: '$CGNI Token',
        href: '/docs/token',
      },
    ],
  },
  {
    title: 'Support',
    icon: HelpCircle,
    items: [
      {
        title: 'FAQ',
        href: '/docs/support/faq',
      },
    ],
  },
];