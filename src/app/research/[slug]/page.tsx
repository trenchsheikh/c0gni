'use client';

import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  User, 
  Clock,
  Eye,
  Download,
  ExternalLink,
  Share2,
  Github
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Iridescence from "@/components/Iridescence";

// This would typically come from your CMS or markdown files
const papers = {
  "autonomous-trading-agents": {
    title: "Autonomous Decision-Making in Multi-Agent Trading Systems",
    authors: [
      { name: "Dr. Sarah Chen", affiliation: "C0gni Labs", email: "s.chen@c0gnilabs.com" },
      { name: "Prof. Michael Rodriguez", affiliation: "Stanford University", email: "m.rodriguez@stanford.edu" }
    ],
    abstract: "This paper presents a novel approach to autonomous decision-making in multi-agent trading systems, utilizing reinforcement learning and game theory to optimize trading strategies in volatile markets. Our framework demonstrates significant improvements in risk-adjusted returns while maintaining robust performance across different market conditions.",
    publishedDate: "2024-01-15",
    categories: ["Machine Learning", "Trading Systems", "Multi-Agent Systems"],
    readTime: "12 min read",
    viewCount: 892,
    downloadCount: 156,
    content: `# Introduction

The rapid evolution of financial markets and the increasing complexity of trading environments have necessitated the development of sophisticated autonomous trading systems. Traditional rule-based approaches often fail to adapt to changing market conditions, leading to suboptimal performance and increased risk exposure.

## Problem Statement

Current challenges in automated trading include:
- Inability to adapt to changing market regimes
- Poor coordination between multiple trading agents
- Lack of risk-aware decision making
- Limited scalability to different asset classes

## Our Contributions

This research introduces several key innovations:

1. **Multi-Agent Reinforcement Learning Framework**: A novel approach that enables multiple autonomous agents to learn and adapt collaboratively in trading environments.

2. **Game-Theoretic Analysis**: Mathematical framework for understanding competitive dynamics between trading agents.

3. **Risk-Aware Reward Functions**: Advanced reward mechanisms that balance profitability with risk management.

4. **Comprehensive Evaluation**: Testing across multiple market conditions and asset classes.

# Methodology

## Agent Architecture

Our multi-agent system consists of specialized components working in harmony:

### State Representation Module
- Market indicators (price, volume, volatility)
- Portfolio metrics (positions, P&L, risk measures)
- Inter-agent coordination signals
- Market regime detection

### Action Selection Network
- Buy/sell order generation
- Position sizing optimization
- Risk management adjustments
- Communication with other agents

### Learning Algorithm

We employ a modified Deep Deterministic Policy Gradient (DDPG) algorithm with several key enhancements:

\`\`\`python
class MultiAgentDDPG:
    def __init__(self, num_agents, state_dim, action_dim):
        self.agents = [DDPGAgent(state_dim, action_dim) for _ in range(num_agents)]
        self.coordination_network = CoordinationNetwork()
        
    def train_step(self, experiences):
        # Individual agent updates
        for agent, experience in zip(self.agents, experiences):
            agent.update(experience)
            
        # Coordination mechanism update
        self.coordination_network.update(experiences)
\`\`\`

**Risk-Aware Reward Function:**
The reward function incorporates multiple objectives including return generation, risk management, and agent coordination.

**Game-Theoretic Coordination:**
Agents operate in a competitive yet collaborative environment where Nash equilibrium provides stability guarantees.

# Experimental Results

## Performance Metrics

Our multi-agent system achieved significant improvements over baseline methods:

- **Sharpe Ratio**: 2.34 (vs. 1.67 baseline)
- **Maximum Drawdown**: -8.2% (vs. -15.4% baseline) 
- **Annual Return**: 18.7% (vs. 12.3% baseline)

## Risk Analysis

The system demonstrated superior risk management capabilities:

| Metric | Our Method | Single Agent | Baseline |
|--------|------------|--------------|----------|
| VaR (95%) | -1.2% | -1.8% | -2.4% |
| Volatility | 11.3% | 14.2% | 16.8% |
| Beta | 0.85 | 1.02 | 1.15 |

## Market Regime Performance

### Bull Markets (2020-2021)
- Outperformed benchmarks by 4.2% annually
- Maintained lower volatility while capturing upside
- Demonstrated effective risk-adjusted return optimization

### Bear Markets (2022)
- Limited downside with -3.1% vs. -8.7% benchmark
- Quick recovery through adaptive strategies
- Superior defensive capabilities

### Sideways Markets (2023)
- Generated positive returns through tactical positioning
- Maintained consistent performance in low-volatility environments
- Effective range-bound trading strategies

# Discussion

## Key Findings

1. **Coordination Benefits**: Multi-agent coordination significantly improves risk-adjusted returns compared to single-agent systems.

2. **Market Adaptability**: The framework quickly adapts to changing market conditions through continuous learning and strategy adjustment.

3. **Risk Management**: Integrated risk awareness prevents catastrophic losses while maintaining competitive returns.

4. **Scalability**: The system scales effectively across different asset classes and market conditions.

## Limitations and Future Work

While our results are promising, several limitations remain:

- **Computational Complexity**: Performance scales non-linearly with the number of agents
- **Data Dependency**: Results are sensitive to data quality and market coverage
- **Regulatory Considerations**: Real-world deployment requires careful regulatory compliance
- **Transaction Costs**: Current simulations don't fully account for market impact and slippage

> **Note**: Future research directions include integration of alternative data sources, extension to cryptocurrency markets, and real-time deployment frameworks.

# Conclusion

This work demonstrates the significant potential of multi-agent reinforcement learning in autonomous trading systems. The combination of game-theoretic coordination, risk-aware learning, and adaptive strategies produces superior risk-adjusted returns across various market conditions.

The framework's robustness and adaptability make it suitable for practical deployment in institutional trading environments, with proper consideration of regulatory requirements and risk management protocols.

# References

1. Smith, J., Anderson, K., & Wilson, R. (2022). "Distributed Trading Systems Using Q-Learning." *Journal of Computational Finance*, 25(3), 45-67.

2. Johnson, M., & Lee, S. (2023). "Cooperative Strategies in Multi-Agent Currency Trading." *International Conference on AI in Finance*, pp. 123-135.

3. Zhang, L., Wang, H., & Chen, Y. (2021). "Deep Q-Networks for Portfolio Optimization." *Nature Machine Intelligence*, 3(4), 234-245.

4. Brown, A., Davis, P., & Taylor, C. (2023). "Actor-Critic Methods in Algorithmic Trading." *Financial Data Science Review*, 8(2), 78-92.

5. Martinez, E., & Thompson, J. (2020). "Game Theory Applications in Financial Markets." *Quantitative Finance*, 20(5), 567-582.`,
    attachments: {
      pdf: "/papers/autonomous-trading-agents.pdf",
      code: "https://github.com/c0gnilabs/autonomous-trading-agents",
      data: "https://data.c0gnilabs.com/trading-dataset-2024"
    }
  }
};

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = papers[slug as keyof typeof papers];
  
  if (!paper) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center h-16 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="cursor-pointer pr-4 mr-4 border-r border-white/10"
            >
              <Image src="/c0gni-white.svg" alt="C0gni Labs" width={150} height={50} className="h-12" />
            </motion.div>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link href="/">
              <button className="relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 ease-out">
                <span className="relative z-10">Home</span>
              </button>
            </Link>
            <Link href="/research">
              <button className="relative px-3 py-1.5 text-sm font-medium text-white bg-white/10 rounded-full transition-all duration-300 ease-out">
                <span className="relative z-10">Research</span>
              </button>
            </Link>
            <Link href="/docs">
              <button className="relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 ease-out">
                <span className="relative z-10">Docs</span>
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Iridescence Background */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Iridescence Background - Only in Hero */}
        <div className="absolute inset-0 opacity-20">
          <Iridescence
            color={[.5, .4, 1]}
            mouseReact={false}
            amplitude={0.1}
            speed={0.4}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {paper.categories.map((category) => (
                <span 
                  key={category}
                  className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm font-medium backdrop-blur-sm"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight max-w-4xl mx-auto">
              {paper.title}
            </h1>

            {/* Abstract */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 max-w-4xl mx-auto">
              <h2 className="text-xl font-medium text-white mb-4">Abstract</h2>
              <p className="text-white/80 leading-relaxed text-lg">
                {paper.abstract}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/70 text-sm mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{paper.authors.map(a => a.name).join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(paper.publishedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{paper.readTime}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-white/60 text-sm mb-12">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{paper.viewCount.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>{paper.downloadCount.toLocaleString()} downloads</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-medium hover:bg-white/90 transition-all text-lg"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all text-lg backdrop-blur-sm"
              >
                <Github className="w-5 h-5" />
                View Code
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all text-lg backdrop-blur-sm"
              >
                <Share2 className="w-5 h-5" />
                Share
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeSlug, rehypeAutolinkHeadings]}
              components={{
                h1: ({children}) => (
                  <h1 className="text-4xl font-light text-white mt-16 mb-8 pb-4 border-b border-white/10">
                    {children}
                  </h1>
                ),
                h2: ({children}) => (
                  <h2 className="text-3xl font-light text-white mt-12 mb-6">
                    {children}
                  </h2>
                ),
                h3: ({children}) => (
                  <h3 className="text-2xl font-light text-white mt-10 mb-5">
                    {children}
                  </h3>
                ),
                h4: ({children}) => (
                  <h4 className="text-xl font-medium text-white mt-8 mb-4">
                    {children}
                  </h4>
                ),
                p: ({children}) => (
                  <p className="text-white/80 leading-relaxed mb-6 text-lg">
                    {children}
                  </p>
                ),
                ul: ({children}) => (
                  <ul className="text-white/80 mb-6 pl-6 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({children}) => (
                  <ol className="text-white/80 mb-6 pl-6 space-y-2 list-decimal">
                    {children}
                  </ol>
                ),
                li: ({children}) => (
                  <li className="text-white/80 leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({children}) => (
                  <strong className="text-white font-semibold">
                    {children}
                  </strong>
                ),
                em: ({children}) => (
                  <em className="text-white/90 italic">
                    {children}
                  </em>
                ),
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-blue-400/50 pl-6 my-8 bg-white/5 backdrop-blur-sm rounded-r-2xl py-6 pr-6">
                    <div className="text-white/80 italic">
                      {children}
                    </div>
                  </blockquote>
                ),
                table: ({children}) => (
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({children}) => (
                  <thead className="bg-white/10">
                    {children}
                  </thead>
                ),
                th: ({children}) => (
                  <th className="border border-white/20 px-6 py-4 text-left font-semibold text-white text-sm">
                    {children}
                  </th>
                ),
                td: ({children}) => (
                  <td className="border border-white/20 px-6 py-4 text-white/80 text-sm">
                    {children}
                  </td>
                ),
                code: ({node, inline, className, children, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="mb-8">
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-2xl border border-white/10 overflow-hidden"
                        showLineNumbers={true}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-white/15 text-white px-2 py-1 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({children, href}) => (
                  <a 
                    href={href}
                    className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {paper.content}
            </ReactMarkdown>
          </motion.div>

          {/* Author Profiles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 pt-12 border-t border-white/10"
          >
            <h3 className="text-3xl font-light text-white mb-8 text-center">Authors</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {paper.authors.map((author, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
                      <span className="text-white font-medium text-xl">
                        {author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h4 className="text-xl font-light text-white mb-2">{author.name}</h4>
                    <p className="text-white/70 mb-3 font-medium">{author.affiliation}</p>
                    <p className="text-white/50 text-sm">{author.email}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <Image src="/c0gni-white.svg" alt="C0gni Labs" width={200} height={80} className="mx-auto mb-8" />
            <p className="text-white/60">
              © 2024 C0gni Labs. Advancing AI research for autonomous systems.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}