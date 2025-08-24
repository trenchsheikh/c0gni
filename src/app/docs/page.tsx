'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Zap, 
  Brain, 
  Network, 
  Shield, 
  Rocket, 
  Code, 
  Cloud, 
  Store,
  ChartLine,
  Users,
  Database,
  ArrowRight
} from 'lucide-react';
import { 
  Card, 
  CardGroup, 
  Tabs, 
  Tab, 
  AccordionGroup, 
  Accordion, 
  Steps, 
  Step, 
  Tip, 
  Info 
} from '@/components/docs/DocComponents';

export default function DocsIntroduction() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3">
            <Image 
              src="/c0gni-c.svg" 
              alt="c0gni logo" 
              width={40} 
              height={40} 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-light text-white mb-2">c0gni Documentation</h1>
            <p className="text-xl text-white/70">Your last trade was too slow.</p>
          </div>
        </div>

        <p className="text-lg text-white/80 leading-relaxed">
          Stop building bots that react. Start deploying agents that decide. The best alpha is captured in &lt;1 second. Humans can&apos;t move that fast.
        </p>
      </div>

      <CardGroup cols={2}>
        <Card title="<400ms Execution" icon={Zap} href="/docs/technical/solana">
          From detection to execution faster than human reaction time
        </Card>
        <Card title="On-Chain Memory" icon={Brain} href="/docs/technical/memory">
          Persistent agent state and learning stored on Solana
        </Card>
        <Card title="Swarm Intelligence" icon={Network} href="/docs/agents/swarms">
          Multi-agent coordination that compounds performance
        </Card>
        <Card title="MEV Protected" icon={Shield} href="/docs/technical/mev">
          Built-in protection against frontrunning and sandwich attacks
        </Card>
      </CardGroup>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Why Agents, Not Bots?</h2>
        <p className="text-white/80 leading-relaxed">
          Traditional bots are reactive scripts. c0gni agents are autonomous entities that:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Learn from every trade</strong>
                <p className="text-white/70 text-sm">Persistent on-chain memory stores outcomes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Coordinate as swarms</strong>
                <p className="text-white/70 text-sm">Multiple agents work together for compound intelligence</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Execute at machine speed</strong>
                <p className="text-white/70 text-sm">Sub-second decision making and execution</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <strong className="text-white">Evolve strategies</strong>
                <p className="text-white/70 text-sm">Adapt based on market conditions and performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Platform Capabilities</h2>
        
        <AccordionGroup>
          <Accordion title="Agent Factory" icon={Rocket}>
            Deploy autonomous agents in under 60 seconds with pre-composed blueprints. No coding required.
          </Accordion>

          <Accordion title="Agent Studio" icon={Code}>
            Code-first SDK for elite builders. Python/TypeScript with local simulation and LLM integration.
          </Accordion>

          <Accordion title="Agent Cloud" icon={Cloud}>
            Orchestration layer with swarm intelligence. Multi-agent teams that collaborate and compete.
          </Accordion>

          <Accordion title="Agent Marketplace" icon={Store}>
            Network effect engine. Buy/sell agent strategies with verified on-chain PnL.
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">The End of Human Latency</h2>
        <p className="text-white/80 leading-relaxed">
          You&apos;re not slow. You&apos;re human. And in DeFi, that&apos;s the problem.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">Humans vs Agents</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Decision Speed</span>
                <span className="text-white">Seconds vs Milliseconds</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Availability</span>
                <span className="text-white">8 hours vs 24/7</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Emotion</span>
                <span className="text-white">FOMO/Fear vs Logic</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">Memory</span>
                <span className="text-white">Forget vs Learn</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Performance Comparison</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Human Trader</span>
                  <span className="text-white">45% Success Rate</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">c0gni Agent</span>
                  <span className="text-white">78% Success Rate</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">What Makes c0gni Different</h2>

        <Tabs>
          <Tab title="Speed">
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-center">
                  <ChartLine className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">Sub-400ms Execution</h4>
                  <p className="text-white/70 text-sm">From opportunity detection to on-chain execution</p>
                </div>
              </div>
              
              <p className="text-white/80 leading-relaxed">
                <strong>Sub-400ms execution time</strong> from opportunity detection to on-chain execution. 
                Powered by Jito bundles and optimized RPC connections.
              </p>
            </div>
          </Tab>
          
          <Tab title="Intelligence">
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-center">
                  <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">Swarm Coordination</h4>
                  <p className="text-white/70 text-sm">Multiple specialist agents working together</p>
                </div>
              </div>
            
            <p className="text-white/80 leading-relaxed">
              <strong>Swarm coordination</strong> where specialist agents work together: Scouts find opportunities, 
              Analyzers assess risk, Traders execute, Hedgers protect.
            </p>
            </div>
          </Tab>
          
          <Tab title="Memory">
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-center">
                  <Database className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">On-Chain Learning</h4>
                  <p className="text-white/70 text-sm">Persistent memory stored on Solana blockchain</p>
                </div>
              </div>
            
            <p className="text-white/80 leading-relaxed">
              <strong>Persistent learning</strong> with agent state stored on-chain. Each trade informs 
              future decisions with verifiable memory.
            </p>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Getting Started</h2>

        <Steps>
          <Step title="Connect Your Wallet">
            Link your Solana wallet to start deploying agents
          </Step>
          <Step title="Choose Agent Type">
            Select from Scout, Trader, Arbitrage, or LP Optimizer blueprints
          </Step>
          <Step title="Deploy & Fund">
            Deploy with 0.5-10 SOL and activate built-in risk guardrails
          </Step>
          <Step title="Monitor Performance">
            Watch your agents execute at machine speed through the dashboard
          </Step>
        </Steps>
      </div>

      <Tip>
        Ready to deploy your first agent? Start with our <a href="/docs/quickstart" className="text-blue-400 hover:text-blue-300 underline">quickstart guide</a> or explore the <a href="/docs/platform/factory" className="text-blue-400 hover:text-blue-300 underline">Agent Factory</a>.
      </Tip>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Launch Your First Agent</h3>
            <p className="text-white/70">Deploy an autonomous trading agent in under 60 seconds</p>
          </div>
          <a 
            href="/docs/quickstart"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}