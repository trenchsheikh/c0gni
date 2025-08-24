'use client';

import React from 'react';
import { 
  Users, 
  Brain, 
  Crosshair, 
  ArrowLeftRight,
  BarChart3,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Network,
  AlertTriangle,
  CheckCircle,
  Code,
  ArrowRight
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
} from '@/components/docs/DocComponents';

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Agent System</h1>
        <p className="text-xl text-white/80">
          Autonomous AI entities that think, learn, and execute trades faster than human reaction time. 
          The future of trading is not about better tools - it's about autonomous intelligence.
        </p>
      </div>

      <Info>
        <strong>What makes c0gni agents different:</strong> Unlike traditional bots that follow scripts, 
        c0gni agents are autonomous entities with persistent memory, learning capabilities, and swarm intelligence.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Agent vs Bot</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">Traditional Trading Bots</h3>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white/70">React to predefined conditions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white/70">No learning or adaptation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white/70">Isolated execution</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white/70">Static strategies</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">c0gni Agents</h3>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/70">Autonomous decision making</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/70">Persistent on-chain memory</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/70">Swarm coordination</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/70">Evolving strategies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Agent Capabilities</h2>
        
        <Tabs>
          <Tab title="Autonomous Intelligence">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                c0gni agents operate with true autonomy, making complex decisions based on market analysis, 
                historical performance, and real-time conditions.
              </p>
              
              <CardGroup cols={2}>
                <Card title="Pattern Recognition" icon={Brain}>
                  <div className="space-y-2">
                    <p>Advanced ML models identify profitable patterns across market conditions</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Chart pattern analysis</div>
                      <div>• Volume spike detection</div>
                      <div>• Market sentiment indicators</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Risk Assessment" icon={Shield}>
                  <div className="space-y-2">
                    <p>Dynamic risk evaluation for every trade opportunity</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Volatility analysis</div>
                      <div>• Liquidity assessment</div>
                      <div>• Portfolio exposure limits</div>
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Decision Making Process</h4>
                  <CodeBlock language="typescript">
{`class TradingAgent {
  async analyzeOpportunity(token: TokenData) {
    const patterns = await this.identifyPatterns(token);
    const risk = await this.assessRisk(token);
    const sentiment = await this.analyzeSentiment(token);
    
    const decision = await this.neuralNetwork.process({
      patterns,
      risk,
      sentiment,
      memory: this.onChainMemory
    });
    
    if (decision.confidence > this.confidenceThreshold) {
      return this.executeTrade(decision);
    }
  }
}`}
                  </CodeBlock>
                </div>
              </Frame>
            </div>
          </Tab>
          
          <Tab title="Learning & Memory">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Every agent maintains persistent memory on-chain, learning from each trade to improve future performance.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Memory Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <strong className="text-white">Trade History</strong>
                        <p className="text-white/70 text-sm">Complete record of all executed trades</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <strong className="text-white">Strategy Performance</strong>
                        <p className="text-white/70 text-sm">Success rates by market conditions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <strong className="text-white">Market Patterns</strong>
                        <p className="text-white/70 text-sm">Learned correlations and signals</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-medium mb-4">Learning Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Pattern Recognition</span>
                      <span className="text-green-400">94.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Risk Prediction</span>
                      <span className="text-green-400">87.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Timing Accuracy</span>
                      <span className="text-green-400">91.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Profit Consistency</span>
                      <span className="text-green-400">76.8%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <AccordionGroup>
                <Accordion title="On-Chain Memory Structure">
                  <CodeBlock language="json">
{`{
  "agentId": "agent_001",
  "memoryVersion": "1.2.0",
  "tradeHistory": {
    "totalTrades": 1247,
    "successfulTrades": 956,
    "averageROI": 0.234,
    "recentPatterns": [...]
  },
  "learningState": {
    "modelVersion": "v2.1",
    "trainingEpochs": 15429,
    "confidenceScore": 0.847
  }
}`}
                  </CodeBlock>
                </Accordion>
                
                <Accordion title="Continuous Learning">
                  Agents update their models after every trade, incorporating new market data and refining strategies based on outcomes.
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Swarm Intelligence">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Multiple agents working together create emergent intelligence that exceeds individual capabilities.
              </p>
              
              <Steps>
                <Step title="Opportunity Discovery">
                  Scout agents continuously scan markets for potential trades
                </Step>
                <Step title="Consensus Building">
                  Multiple agents analyze and vote on opportunity validity
                </Step>
                <Step title="Risk Validation">
                  Specialized risk agents assess potential downsides
                </Step>
                <Step title="Coordinated Execution">
                  Trader agents execute with optimal timing and sizing
                </Step>
              </Steps>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="Swarm Coordination" icon={Network}>
                  <div className="space-y-2">
                    <p>Agents communicate through encrypted channels to share insights</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Real-time signal sharing</div>
                      <div>• Consensus mechanism</div>
                      <div>• Load balancing</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Emergent Behavior" icon={TrendingUp}>
                  <div className="space-y-2">
                    <p>Swarms develop strategies beyond individual agent capabilities</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Market manipulation detection</div>
                      <div>• Coordinated arbitrage</div>
                      <div>• Risk distribution</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Agent Specializations</h2>
        
        <CardGroup cols={2}>
          <Card title="Sniper Agent" icon={Crosshair}>
            <div className="space-y-2">
              <p className="text-green-400 text-sm font-medium">Best for new token launches</p>
              <p>Detects and trades new tokens within milliseconds of launch</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Sub-second execution</div>
                <div>• Launch detection algorithms</div>
                <div>• Liquidity analysis</div>
              </div>
            </div>
          </Card>
          
          <Card title="Arbitrage Engine" icon={ArrowLeftRight}>
            <div className="space-y-2">
              <p className="text-blue-400 text-sm font-medium">Steady, low-risk returns</p>
              <p>Finds and exploits price differences across DEXs</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Multi-DEX monitoring</div>
                <div>• Flash loan integration</div>
                <div>• Gas optimization</div>
              </div>
            </div>
          </Card>
          
          <Card title="LP Optimizer" icon={BarChart3}>
            <div className="space-y-2">
              <p className="text-purple-400 text-sm font-medium">Long-term yield generation</p>
              <p>Manages liquidity positions for optimal fee collection</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Impermanent loss protection</div>
                <div>• Fee tier optimization</div>
                <div>• Rebalancing automation</div>
              </div>
            </div>
          </Card>
          
          <Card title="Scout Agent" icon={Target}>
            <div className="space-y-2">
              <p className="text-orange-400 text-sm font-medium">Market intelligence</p>
              <p>Continuously monitors for trading opportunities</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Pattern recognition</div>
                <div>• Signal generation</div>
                <div>• Market sentiment analysis</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Performance Metrics</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-medium">Agent Type</th>
                <th className="text-left py-3 px-4 text-white font-medium">Success Rate</th>
                <th className="text-left py-3 px-4 text-white font-medium">Avg ROI</th>
                <th className="text-left py-3 px-4 text-white font-medium">Risk Level</th>
                <th className="text-left py-3 px-4 text-white font-medium">Execution Speed</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white">Sniper</td>
                <td className="py-3 px-4 text-green-400">73%</td>
                <td className="py-3 px-4 text-green-400">2.3x</td>
                <td className="py-3 px-4 text-yellow-400">Medium</td>
                <td className="py-3 px-4 text-green-400">387ms</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white">Arbitrage</td>
                <td className="py-3 px-4 text-green-400">94%</td>
                <td className="py-3 px-4 text-green-400">1.2x</td>
                <td className="py-3 px-4 text-green-400">Low</td>
                <td className="py-3 px-4 text-green-400">423ms</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white">LP Optimizer</td>
                <td className="py-3 px-4 text-green-400">89%</td>
                <td className="py-3 px-4 text-green-400">15% APY</td>
                <td className="py-3 px-4 text-green-400">Low</td>
                <td className="py-3 px-4 text-blue-400">2.1s</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white">Scout</td>
                <td className="py-3 px-4 text-green-400">87%</td>
                <td className="py-3 px-4 text-white/60">N/A</td>
                <td className="py-3 px-4 text-green-400">None</td>
                <td className="py-3 px-4 text-green-400">156ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Agent Lifecycle</h2>
        
        <AccordionGroup>
          <Accordion title="1. Initialization">
            <div className="space-y-3">
              <p>Agent creation process includes:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Strategy loading from template or custom code</li>
                <li>• Memory initialization from backup or blank state</li>
                <li>• Resource allocation (compute, memory, network)</li>
                <li>• Security sandbox setup</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="2. Learning Phase">
            <div className="space-y-3">
              <p>New agents begin with supervised learning:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Paper trading with simulated funds</li>
                <li>• Strategy validation against historical data</li>
                <li>• Risk parameter calibration</li>
                <li>• Performance baseline establishment</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="3. Active Trading">
            <div className="space-y-3">
              <p>Autonomous operation with continuous learning:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Real-time market monitoring</li>
                <li>• Trade execution and result tracking</li>
                <li>• Strategy refinement based on outcomes</li>
                <li>• Swarm coordination and communication</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="4. Evolution">
            <div className="space-y-3">
              <p>Long-term adaptation and improvement:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Strategy mutation and A/B testing</li>
                <li>• Cross-agent knowledge sharing</li>
                <li>• Market regime adaptation</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Safety & Risk Management</h2>
        
        <CardGroup cols={2}>
          <Card title="Built-in Guardrails" icon={Shield}>
            <div className="space-y-2">
              <p>Multiple layers of protection prevent catastrophic losses</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Maximum position sizing</div>
                <div>• Stop-loss enforcement</div>
                <div>• Slippage protection</div>
              </div>
            </div>
          </Card>
          
          <Card title="Circuit Breakers" icon={AlertTriangle}>
            <div className="space-y-2">
              <p>Automatic shutdown triggers for unusual conditions</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Rapid drawdown detection</div>
                <div>• Market volatility limits</div>
                <div>• Network congestion handling</div>
              </div>
            </div>
          </Card>
        </CardGroup>
        
        <Warning>
          All agents operate within strict risk parameters. While they're designed for autonomous operation, 
          you maintain full control and can pause or terminate agents at any time.
        </Warning>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Deploy Your First Agent</h3>
              <p className="text-white/70">Start with a pre-configured agent template</p>
            </div>
            <a 
              href="/docs/quickstart"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Quick Start
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Build Custom Agents</h3>
              <p className="text-white/70">Use our SDK for advanced strategies</p>
            </div>
            <a 
              href="/docs/sdk"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              Developer SDK
              <Code className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <Tip>
        <strong>Pro Tip:</strong> Start with simpler agents like Arbitrage or LP Optimizer to understand the platform 
        before deploying high-frequency Sniper agents.
      </Tip>
    </div>
  );
}