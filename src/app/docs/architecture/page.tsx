import React from 'react';
import { 
  Network, 
  Database, 
  Zap, 
  Shield,
  Brain,
  Code,
  Cloud,
  ArrowRight,
  GitBranch,
  Cpu,
  HardDrive,
  Wifi,
  Lock
} from 'lucide-react';
import { 
  Card, 
  CardGroup, 
  Tabs, 
  Tab, 
  Info, 
  Warning,
  CodeBlock,
  Steps,
  Step,
  AccordionGroup,
  Accordion,
  Frame
} from '@/components/docs';

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Platform Architecture</h1>
        <p className="text-xl text-white/80">
          Understanding the technical foundation that powers sub-400ms trading execution and swarm intelligence.
        </p>
      </div>

      <Info>
        c0gni's architecture is designed for <strong>speed, reliability, and autonomous operation</strong>. Every component is optimized for millisecond-level decision making and execution.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">System Overview</h2>
        
        <Frame>
          <div className="text-center py-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Agent Layer</h3>
                    <p className="text-white/60 text-sm">Autonomous decision-making and strategy execution</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Network className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Orchestration Layer</h3>
                    <p className="text-white/60 text-sm">Swarm coordination and resource allocation</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Database className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Infrastructure Layer</h3>
                    <p className="text-white/60 text-sm">Solana integration and execution engine</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-white/60 text-sm">
                ↑ User Interface & APIs ↑
              </div>
              
              <div className="mt-2 h-px bg-white/10"></div>
              
              <div className="mt-2 text-white/60 text-sm">
                ↓ Blockchain & Market Data ↓
              </div>
            </div>
          </div>
        </Frame>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Core Components</h2>
        
        <Tabs>
          <Tab title="Agent Runtime">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                The Agent Runtime is the execution environment where autonomous agents make decisions and execute trades.
              </p>
              
              <CardGroup cols={2}>
                <Card title="Decision Engine" icon={<Brain />}>
                  <div className="space-y-2">
                    <p>AI-powered strategy execution with machine learning models</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Pattern recognition algorithms</div>
                      <div>• Risk assessment models</div>
                      <div>• Market sentiment analysis</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Memory System" icon={<Database />}>
                  <div className="space-y-2">
                    <p>On-chain persistent memory for learning and adaptation</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Trade history storage</div>
                      <div>• Strategy performance metrics</div>
                      <div>• Market condition mappings</div>
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <AccordionGroup>
                <Accordion title="Agent Lifecycle Management">
                  <div className="space-y-3">
                    <p><strong>Initialization:</strong> Agent spawning with initial parameters and strategy loading</p>
                    <p><strong>Execution:</strong> Continuous market monitoring and trade execution</p>
                    <p><strong>Learning:</strong> Performance analysis and strategy refinement</p>
                    <p><strong>Termination:</strong> Graceful shutdown with state persistence</p>
                  </div>
                </Accordion>
                
                <Accordion title="Resource Allocation">
                  Dynamic allocation of computational resources based on market conditions and agent performance requirements.
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Swarm Orchestration">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                The orchestration layer coordinates multiple agents working together as intelligent swarms.
              </p>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Swarm Communication Protocol</h4>
                  <CodeBlock language="typescript">
{`interface SwarmMessage {
  agentId: string;
  messageType: 'OPPORTUNITY' | 'EXECUTION' | 'RISK_ALERT';
  payload: {
    token: string;
    confidence: number;
    timestamp: number;
    data: any;
  };
}

class SwarmOrchestrator {
  async coordinateAgents(message: SwarmMessage) {
    const relevantAgents = await this.findRelevantAgents(message);
    const consensus = await this.buildConsensus(relevantAgents, message);
    
    if (consensus.shouldExecute) {
      return this.executeCoordinatedTrade(consensus);
    }
  }
}`}
                  </CodeBlock>
                </div>
              </Frame>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Agent Specialization</h4>
                  <div className="space-y-2">
                    <div>• <strong>Scouts:</strong> Market opportunity detection</div>
                    <div>• <strong>Analyzers:</strong> Risk assessment and validation</div>
                    <div>• <strong>Traders:</strong> Execution specialists</div>
                    <div>• <strong>Hedgers:</strong> Position protection</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Consensus Mechanisms</h4>
                  <div className="space-y-2">
                    <div>• <strong>Confidence Voting:</strong> Weighted by historical performance</div>
                    <div>• <strong>Risk Validation:</strong> Multi-agent risk assessment</div>
                    <div>• <strong>Execution Timing:</strong> Optimal entry coordination</div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          
          <Tab title="Infrastructure">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                High-performance infrastructure optimized for ultra-low latency trading on Solana.
              </p>
              
              <CardGroup cols={2}>
                <Card title="Execution Engine" icon={<Zap />}>
                  <div className="space-y-2">
                    <p>Sub-400ms trade execution with Jito bundle optimization</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Direct RPC connections</div>
                      <div>• Transaction prioritization</div>
                      <div>• MEV protection</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Data Pipeline" icon={<Wifi />}>
                  <div className="space-y-2">
                    <p>Real-time market data ingestion and processing</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Multiple DEX aggregation</div>
                      <div>• WebSocket streams</div>
                      <div>• Data normalization</div>
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">&lt;400ms</div>
                    <div className="text-white/60 text-sm">Execution Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">99.9%</div>
                    <div className="text-white/60 text-sm">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">10k+</div>
                    <div className="text-white/60 text-sm">TPS Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">24/7</div>
                    <div className="text-white/60 text-sm">Monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Data Flow Architecture</h2>
        
        <Steps>
          <Step title="Market Data Ingestion">
            Real-time price feeds from multiple DEXs are aggregated and normalized through our data pipeline
          </Step>
          <Step title="Agent Processing">
            Individual agents analyze market data using their specialized algorithms and historical memory
          </Step>
          <Step title="Swarm Coordination">
            Agents communicate findings and build consensus on trading opportunities through the orchestration layer
          </Step>
          <Step title="Execution">
            Validated trades are executed through optimized Solana transactions with MEV protection
          </Step>
          <Step title="Learning">
            Results are recorded on-chain and fed back to agent memory systems for continuous improvement
          </Step>
        </Steps>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Security Architecture</h2>
        
        <AccordionGroup>
          <Accordion title="Agent Isolation" icon={<Shield />}>
            <div className="space-y-3">
              <p>Each agent runs in an isolated environment with limited permissions:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Sandboxed execution environment</li>
                <li>• Restricted resource access</li>
                <li>• Encrypted inter-agent communication</li>
                <li>• Audit trail for all actions</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Private Key Management" icon={<Lock />}>
            <div className="space-y-3">
              <p>Secure key management using hardware security modules:</p>
              <ul className="space-y-1 text-white/70">
                <li>• HSM-backed key storage</li>
                <li>• Multi-signature wallets for high-value operations</li>
                <li>• Key rotation policies</li>
                <li>• Zero-knowledge proof integration</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Network Security" icon={<Network />}>
            <div className="space-y-3">
              <p>Multiple layers of network protection:</p>
              <ul className="space-y-1 text-white/70">
                <li>• DDoS protection and rate limiting</li>
                <li>• VPN-encrypted communications</li>
                <li>• Geographic distribution of nodes</li>
                <li>• Real-time threat monitoring</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Scalability & Performance</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">Horizontal Scaling</h3>
            <p className="text-white/70 leading-relaxed">
              The platform automatically scales to handle increased load by spinning up additional agent instances 
              and distributing workload across multiple nodes.
            </p>
            
            <div className="space-y-2">
              <div>• <strong>Auto-scaling:</strong> Dynamic resource allocation</div>
              <div>• <strong>Load balancing:</strong> Intelligent request distribution</div>
              <div>• <strong>Geographic distribution:</strong> Global node network</div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Current Scale</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Active Agents</span>
                <span className="text-white font-mono">15,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Daily Transactions</span>
                <span className="text-white font-mono">2.3M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Network Nodes</span>
                <span className="text-white font-mono">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Global Regions</span>
                <span className="text-white font-mono">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Integration Points</h2>
        
        <CardGroup cols={2}>
          <Card title="Solana Blockchain" icon={<Database />}>
            <div className="space-y-2">
              <p>Native integration with Solana's high-performance blockchain</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• SPL Token support</div>
                <div>• Program interaction</div>
                <div>• Account state management</div>
              </div>
            </div>
          </Card>
          
          <Card title="DEX Aggregators" icon={<GitBranch />}>
            <div className="space-y-2">
              <p>Connected to all major Solana DEXs for optimal pricing</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Jupiter Protocol</div>
                <div>• Raydium</div>
                <div>• Orca</div>
              </div>
            </div>
          </Card>
        </CardGroup>
        
        <Warning>
          All integrations are thoroughly tested and monitored. We maintain fallback systems for critical operations to ensure uninterrupted service.
        </Warning>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Technical Deep Dive</h3>
            <p className="text-white/70">Explore detailed technical documentation for developers</p>
          </div>
          <a 
            href="/docs/technical/solana"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            View Technical Docs
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}