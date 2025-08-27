import React from 'react';
import { 
  Network, 
  Users, 
  Brain,
  Zap,
  Target,
  Shield,
  TrendingUp,
  GitBranch,
  MessageCircle,
  Share2,
  ArrowRight,
  CheckCircle
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
  Tip,
  Frame
} from '@/components/docs';

export default function SwarmIntelligencePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Swarm Intelligence</h1>
        <p className="text-xl text-white/80">
          Multiple agents working together create emergent intelligence that exceeds individual capabilities. 
          Experience the power of coordinated autonomous trading.
        </p>
      </div>

      <Info>
        <strong>Swarm Intelligence</strong> enables multiple specialized agents to collaborate, share insights, 
        and execute coordinated strategies that would be impossible for individual agents.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">How Swarms Work</h2>
        
        <Frame>
          <div className="text-center py-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Scout</h3>
                    <p className="text-white/60 text-sm">Discovers opportunities</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Analyzer</h3>
                    <p className="text-white/60 text-sm">Validates risks</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Trader</h3>
                    <p className="text-white/60 text-sm">Executes trades</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Hedger</h3>
                    <p className="text-white/60 text-sm">Protects positions</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                <MessageCircle className="w-6 h-6 text-white/40" />
                <div className="h-px bg-gradient-to-l from-transparent via-white/20 to-transparent flex-1"></div>
              </div>
              
              <p className="mt-4 text-white/60 text-sm">
                Agents communicate through encrypted channels to coordinate decisions
              </p>
            </div>
          </div>
        </Frame>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Swarm Communication Protocol</h2>
        
        <Tabs>
          <Tab title="Message Types">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Agents use different message types to coordinate and share information:
              </p>
              
              <CodeBlock language="typescript">
{`interface SwarmMessage {
  agentId: string;
  swarmId: string;
  timestamp: number;
  messageType: MessageType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  payload: any;
  signature: string;
}

enum MessageType {
  OPPORTUNITY_DISCOVERY = 'opportunity_discovery',
  RISK_ASSESSMENT = 'risk_assessment',
  EXECUTION_REQUEST = 'execution_request',
  POSITION_UPDATE = 'position_update',
  CONSENSUS_VOTE = 'consensus_vote',
  EMERGENCY_HALT = 'emergency_halt'
}

// Example opportunity message
const opportunityMessage: SwarmMessage = {
  agentId: 'scout_001',
  swarmId: 'swarm_alpha',
  timestamp: Date.now(),
  messageType: MessageType.OPPORTUNITY_DISCOVERY,
  priority: 'high',
  payload: {
    token: '0xA0b86a33E6E6C0cf7e72A8D9A0C5D6E6D6B2F2F4',  // USDC on Ethereum
    opportunity_type: 'price_arbitrage',
    confidence: 0.87,
    expected_profit: 0.23,
    time_sensitive: true,
    expires_at: Date.now() + 30000 // 30 seconds
  },
  signature: '...'
};`}
              </CodeBlock>
              
              <AccordionGroup>
                <Accordion title="Message Routing">
                  Messages are routed based on agent specialization and current workload. Critical messages bypass normal queues.
                </Accordion>
                
                <Accordion title="Encryption">
                  All swarm communications use end-to-end encryption with rotating keys to prevent eavesdropping.
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Consensus Building">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Swarms use sophisticated consensus mechanisms to make collective decisions:
              </p>
              
              <Steps>
                <Step title="Signal Generation">
                  Scout agents identify potential opportunities and broadcast signals to the swarm
                </Step>
                <Step title="Multi-Agent Analysis">
                  Analyzer agents independently evaluate the opportunity using different models
                </Step>
                <Step title="Weighted Voting">
                  Each agent votes with weight based on historical accuracy and specialization
                </Step>
                <Step title="Execution Decision">
                  If consensus threshold is met, execution agents coordinate the trade
                </Step>
              </Steps>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Consensus Algorithm</h4>
                  <CodeBlock language="python">
{`class SwarmConsensus:
    def __init__(self, threshold=0.7):
        self.threshold = threshold
        self.votes = {}
        
    async def collect_votes(self, opportunity):
        votes = []
        for agent in self.active_agents:
            if agent.can_evaluate(opportunity):
                vote = await agent.evaluate(opportunity)
                weight = self.get_agent_weight(agent)
                votes.append(vote * weight)
        
        weighted_average = sum(votes) / len(votes)
        return weighted_average > self.threshold
    
    def get_agent_weight(self, agent):
        # Weight based on historical performance
        base_weight = 1.0
        performance_multiplier = agent.success_rate / 0.7  # baseline 70%
        recency_factor = self.calculate_recency_factor(agent)
        
        return base_weight * performance_multiplier * recency_factor`}
                  </CodeBlock>
                </div>
              </Frame>
            </div>
          </Tab>
          
          <Tab title="Coordination Patterns">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Different coordination patterns for different market scenarios:
              </p>
              
              <CardGroup cols={2}>
                <Card title="Competitive Swarming" icon={<TrendingUp />}>
                  <div className="space-y-2">
                    <p>Agents compete for the best opportunities while sharing market intelligence</p>
                    <div className="text-sm text-white/60 mt-3">
                      Best for: High-frequency trading scenarios
                    </div>
                  </div>
                </Card>
                
                <Card title="Cooperative Execution" icon={<Users />}>
                  <div className="space-y-2">
                    <p>Agents work together to execute large trades without market impact</p>
                    <div className="text-sm text-white/60 mt-3">
                      Best for: Large position management
                    </div>
                  </div>
                </Card>
                
                <Card title="Hierarchical Command" icon={<GitBranch />}>
                  <div className="space-y-2">
                    <p>Lead agents coordinate subordinate agents for complex strategies</p>
                    <div className="text-sm text-white/60 mt-3">
                      Best for: Multi-step arbitrage
                    </div>
                  </div>
                </Card>
                
                <Card title="Defensive Formation" icon={<Shield />}>
                  <div className="space-y-2">
                    <p>Agents coordinate to protect against market manipulation</p>
                    <div className="text-sm text-white/60 mt-3">
                      Best for: High-risk environments
                    </div>
                  </div>
                </Card>
              </CardGroup>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Emergent Behaviors</h2>
        
        <p className="text-white/80 leading-relaxed">
          When agents work together, they develop behaviors that exceed the sum of their individual capabilities:
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">Market Adaptation</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Dynamic Strategy Switching</strong>
                  <p className="text-white/70 text-sm">Swarms automatically adapt strategies based on market conditions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Collective Learning</strong>
                  <p className="text-white/70 text-sm">Individual agent experiences improve the entire swarm</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Risk Distribution</strong>
                  <p className="text-white/70 text-sm">Intelligent position sizing across multiple agents</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Performance Improvements</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Success Rate</span>
                <span className="text-green-400">Single: 73% → Swarm: 89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Risk Management</span>
                <span className="text-green-400">47% better drawdown control</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Opportunity Detection</span>
                <span className="text-green-400">3.2x faster signal identification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Execution Efficiency</span>
                <span className="text-green-400">23% lower slippage costs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Swarm Configuration</h2>
        
        <AccordionGroup>
          <Accordion title="Basic Swarm Setup" icon={<Users />}>
            <div className="space-y-4">
              <p>Creating a basic swarm with complementary agents:</p>
              <CodeBlock language="json">
{`{
  "swarm_config": {
    "name": "Alpha Trading Swarm",
    "agents": [
      {
        "type": "scout",
        "specialization": "new_token_detection",
        "allocation": "0.1 ETH"
      },
      {
        "type": "analyzer", 
        "specialization": "risk_assessment",
        "allocation": "0.2 ETH"
      },
      {
        "type": "trader",
        "specialization": "execution",
        "allocation": "1.5 ETH"
      },
      {
        "type": "hedger",
        "specialization": "position_protection",
        "allocation": "0.1 ETH"
      }
    ],
    "communication": {
      "protocol": "encrypted_broadcast",
      "consensus_threshold": 0.75,
      "timeout_ms": 5000
    }
  }
}`}
              </CodeBlock>
            </div>
          </Accordion>
          
          <Accordion title="Advanced Coordination" icon={<Network />}>
            <div className="space-y-3">
              <p>Configure complex swarm behaviors:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Hierarchical agent structures</li>
                <li>• Multi-market coordination</li>
                <li>• Dynamic agent spawning</li>
                <li>• Cross-swarm communication</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Monitoring & Control" icon={<Shield />}>
            <div className="space-y-3">
              <p>Real-time swarm oversight:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Agent performance dashboards</li>
                <li>• Communication flow visualization</li>
                <li>• Emergency stop controls</li>
                <li>• Swarm health metrics</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Use Cases</h2>
        
        <CardGroup cols={2}>
          <Card title="MEV Protection Swarms" icon={<Shield />}>
            <div className="space-y-2">
              <p>Coordinated defense against front-running and sandwich attacks</p>
              <div className="text-sm text-white/60 mt-3">
                Agents work together to detect and counter MEV attempts in real-time
              </div>
            </div>
          </Card>
          
          <Card title="Cross-DEX Arbitrage" icon={<Share2 />}>
            <div className="space-y-2">
              <p>Multi-agent coordination for complex arbitrage opportunities</p>
              <div className="text-sm text-white/60 mt-3">
                Simultaneous execution across multiple exchanges with perfect timing
              </div>
            </div>
          </Card>
          
          <Card title="Large Position Management" icon={<TrendingUp />}>
            <div className="space-y-2">
              <p>Break large trades into optimal smaller positions</p>
              <div className="text-sm text-white/60 mt-3">
                Minimize market impact while maintaining execution speed
              </div>
            </div>
          </Card>
          
          <Card title="Market Making Swarms" icon={<Network />}>
            <div className="space-y-2">
              <p>Distributed liquidity provision across multiple pairs</p>
              <div className="text-sm text-white/60 mt-3">
                Coordinated market making for optimal capital efficiency
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <Warning>
        <strong>Important:</strong> Swarm coordination introduces additional complexity. Start with simple 
        2-3 agent swarms before deploying larger coordinated systems.
      </Warning>

      <Tip>
        <strong>Pro Tip:</strong> Monitor agent communication patterns to optimize swarm performance. 
        Excessive messaging can slow down decision-making in time-sensitive scenarios.
      </Tip>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Deploy Your First Swarm</h3>
            <p className="text-white/70">Start with a pre-configured swarm template</p>
          </div>
          <a 
            href="/docs/platform/factory"
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Launch Factory
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}