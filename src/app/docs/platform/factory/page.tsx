import React from 'react';
import { 
  Rocket, 
  Zap, 
  Settings,
  Play,
  Pause,
  Square,
  BarChart3,
  Users,
  Brain,
  Shield,
  Clock,
  DollarSign,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { 
  Card, 
  CardGroup, 
  Steps, 
  Step, 
  Info, 
  Warning,
  CodeBlock,
  Tabs,
  Tab,
  AccordionGroup,
  Accordion,
  Tip
} from '@/components/docs';

export default function AgentFactoryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Agent Factory</h1>
        <p className="text-xl text-white/80">
          Deploy autonomous trading agents in under 60 seconds. No coding required - choose from battle-tested blueprints or customize parameters for your strategy.
        </p>
      </div>

      <Info>
        <strong>Agent Factory</strong> is designed for traders who want powerful automation without complex setup. 
        Select a blueprint, configure parameters, and deploy your agent to start trading autonomously.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Available Blueprints</h2>
        
        <CardGroup cols={2}>
          <Card title="Sniper Agent" icon={<Zap />}>
            <div className="space-y-2">
              <p className="text-green-400 text-sm font-medium">Most Popular • 73% Success Rate</p>
              <p>Detects and trades new token launches with sub-400ms execution speed</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Perfect for new token opportunities</div>
                <div>• Built-in rug pull detection</div>
                <div>• Configurable risk parameters</div>
              </div>
            </div>
          </Card>
          
          <Card title="Arbitrage Engine" icon={<BarChart3 />}>
            <div className="space-y-2">
              <p className="text-blue-400 text-sm font-medium">Low Risk • 94% Success Rate</p>
              <p>Finds price differences across DEXs and executes profitable arbitrage</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Cross-exchange monitoring</div>
                <div>• Flash loan integration</div>
                <div>• Consistent daily returns</div>
              </div>
            </div>
          </Card>
          
          <Card title="LP Optimizer" icon={<Settings />}>
            <div className="space-y-2">
              <p className="text-purple-400 text-sm font-medium">Passive Income • 15% APY</p>
              <p>Automatically manages liquidity positions for optimal fee generation</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Multi-pool optimization</div>
                <div>• Impermanent loss protection</div>
                <div>• Auto-rebalancing</div>
              </div>
            </div>
          </Card>
          
          <Card title="Scout Network" icon={<Users />}>
            <div className="space-y-2">
              <p className="text-orange-400 text-sm font-medium">Intelligence • 87% Accuracy</p>
              <p>Network of scouts that gather market intelligence for other agents</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Real-time market scanning</div>
                <div>• Signal generation</div>
                <div>• Swarm coordination</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Deployment Process</h2>
        
        <Steps>
          <Step title="Select Blueprint">
            Choose from pre-configured agent templates based on your trading strategy
          </Step>
          <Step title="Configure Parameters">
            Set budget, risk level, and strategy-specific settings through the intuitive interface
          </Step>
          <Step title="Fund Agent Wallet">
            Transfer SOL to your agent's dedicated wallet for autonomous trading
          </Step>
          <Step title="Deploy & Activate">
            Deploy your agent to the network and begin autonomous trading immediately
          </Step>
        </Steps>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Configuration Options</h2>
        
        <Tabs>
          <Tab title="Basic Settings">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Essential configuration options available for all agent types:
              </p>
              
              <AccordionGroup>
                <Accordion title="Budget Allocation" icon={<DollarSign />}>
                  <div className="space-y-3">
                    <p>Set the total amount of SOL your agent can use for trading:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• <strong>Minimum:</strong> 0.5 SOL (recommended for testing)</li>
                      <li>• <strong>Optimal:</strong> 2-10 SOL (balanced risk/reward)</li>
                      <li>• <strong>Advanced:</strong> 10+ SOL (experienced traders)</li>
                    </ul>
                    <CodeBlock language="json">
{`{
  "budget": {
    "totalAmount": "5.0 SOL",
    "maxPositionSize": "20%",
    "reserveBuffer": "0.5 SOL"
  }
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="Risk Management" icon={<Shield />}>
                  <div className="space-y-3">
                    <p>Built-in safety controls to protect your capital:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• <strong>Conservative:</strong> 10% max position, -15% stop loss</li>
                      <li>• <strong>Balanced:</strong> 20% max position, -25% stop loss</li>
                      <li>• <strong>Aggressive:</strong> 40% max position, -40% stop loss</li>
                    </ul>
                  </div>
                </Accordion>
                
                <Accordion title="Execution Speed" icon={<Zap />}>
                  <div className="space-y-3">
                    <p>Priority fee settings for transaction speed:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• <strong>Standard:</strong> 0.0001 SOL priority fee</li>
                      <li>• <strong>Fast:</strong> 0.001 SOL priority fee</li>
                      <li>• <strong>Ultra:</strong> Dynamic priority fees</li>
                    </ul>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Advanced Settings">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Advanced configuration for experienced users:
              </p>
              
              <CardGroup cols={2}>
                <Card title="MEV Protection" icon={<Shield />}>
                  <div className="space-y-2">
                    <p>Protect against front-running and sandwich attacks</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Jito bundle integration</div>
                      <div>• Private mempool routing</div>
                      <div>• Anti-MEV strategies</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Slippage Tolerance" icon={<Settings />}>
                  <div className="space-y-2">
                    <p>Maximum acceptable price movement during execution</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Conservative: 1-2%</div>
                      <div>• Standard: 3-5%</div>
                      <div>• Aggressive: 5-10%</div>
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <AccordionGroup>
                <Accordion title="Custom Strategies">
                  <div className="space-y-3">
                    <p>Advanced users can modify strategy parameters:</p>
                    <CodeBlock language="javascript">
{`// Custom Sniper Configuration
const sniperConfig = {
  detectionSpeed: "ultra",
  minLiquidity: 10, // SOL
  maxMarketCap: 100000, // USD
  rugDetection: {
    enabled: true,
    sensitivity: "high"
  },
  exitStrategy: {
    takeProfitTargets: [50, 100, 200], // %
    stopLoss: -30 // %
  }
};`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="Swarm Coordination">
                  Enable your agent to coordinate with other agents for enhanced performance.
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Monitoring">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Real-time monitoring and control options:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card title="Live Dashboard" icon={<BarChart3 />}>
                  Real-time performance metrics and trade history
                </Card>
                
                <Card title="Alert System" icon={<AlertTriangle />}>
                  Custom notifications for trades, profits, and losses
                </Card>
                
                <Card title="Remote Control" icon={<Settings />}>
                  Pause, resume, or terminate agents remotely
                </Card>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-medium mb-4">Control Panel</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                      <Play className="w-4 h-4" />
                      Start Agent
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                      <Square className="w-4 h-4" />
                      Stop
                    </button>
                  </div>
                  <p className="text-white/60 text-sm">
                    Full control over your agent's operation from anywhere
                  </p>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Getting Started</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">First-Time Users</h3>
            <p className="text-white/70 leading-relaxed">
              New to autonomous trading? Start with these recommended settings:
            </p>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <h4 className="text-white font-medium mb-3">Beginner Setup</h4>
              <div className="space-y-2 text-sm">
                <div>• <strong>Agent:</strong> Arbitrage Engine</div>
                <div>• <strong>Budget:</strong> 1-2 SOL</div>
                <div>• <strong>Risk:</strong> Conservative</div>
                <div>• <strong>Duration:</strong> 24 hours trial</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">Experienced Traders</h3>
            <p className="text-white/70 leading-relaxed">
              Ready for advanced strategies? Consider these options:
            </p>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h4 className="text-white font-medium mb-3">Advanced Setup</h4>
              <div className="space-y-2 text-sm">
                <div>• <strong>Agent:</strong> Multi-agent swarm</div>
                <div>• <strong>Budget:</strong> 10+ SOL</div>
                <div>• <strong>Risk:</strong> Balanced to Aggressive</div>
                <div>• <strong>Features:</strong> Custom strategies enabled</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Pricing</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Starter" icon={<Rocket />}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10 CGNI</div>
                <div className="text-white/60">per deployment</div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Single agent deployment</div>
                <div>• Basic monitoring dashboard</div>
                <div>• Standard support</div>
              </div>
            </div>
          </Card>
          
          <Card title="Professional" icon={<Users />}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">25 CGNI</div>
                <div className="text-white/60">per deployment</div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Advanced agent types</div>
                <div>• Real-time analytics</div>
                <div>• Priority support</div>
                <div>• Custom parameters</div>
              </div>
            </div>
          </Card>
          
          <Card title="Enterprise" icon={<Brain />}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50 CGNI</div>
                <div className="text-white/60">per deployment</div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Multi-agent swarms</div>
                <div>• Custom strategies</div>
                <div>• Dedicated support</div>
                <div>• White-label options</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Warning>
        <strong>Important:</strong> All agents operate with real funds on live markets. Start with small amounts 
        to understand behavior before scaling up. Past performance doesn't guarantee future results.
      </Warning>

      <Tip>
        <strong>Pro Tip:</strong> Use the paper trading mode first to test your configuration without risking real funds. 
        Once you're satisfied with the performance, switch to live trading.
      </Tip>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Ready to Deploy Your First Agent?</h3>
            <p className="text-white/70">Access the Agent Factory and start autonomous trading</p>
          </div>
          <a 
            href="https://app.cognilabs.com"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Launch Factory
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}