import React from 'react';
import { 
  Crosshair, 
  ArrowLeftRight,
  BarChart3,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';
import { 
  Card, 
  CardGroup, 
  Tabs, 
  Tab, 
  Info, 
  Warning,
  CodeBlock,
  AccordionGroup,
  Accordion
} from '@/components/docs';

export default function AgentTypesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Agent Types</h1>
        <p className="text-xl text-white/80">
          Choose the right agent for your trading strategy. Each type is specialized for different market conditions and risk profiles.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Sniper Agent</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-xl text-white font-medium">Ultra-Fast Token Launches</h3>
                <p className="text-green-400 text-sm">Perfect for new token opportunities</p>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              Designed to detect and trade new token launches within milliseconds. Uses advanced algorithms 
              to identify legitimate projects and execute entries before manual traders can react.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white/70">Sub-400ms execution time</span>
              </div>
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-white/70">AI-powered rug detection</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white/70">Built-in risk validation</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Success Rate</span>
                <span className="text-green-400">73%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Average ROI</span>
                <span className="text-green-400">2.3x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Max Drawdown</span>
                <span className="text-yellow-400">-18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Execution Speed</span>
                <span className="text-green-400">387ms avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Arbitrage Engine</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-xl text-white font-medium">Cross-DEX Price Differences</h3>
                <p className="text-blue-400 text-sm">Low-risk, consistent returns</p>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              Constantly monitors price differences across multiple DEXs and executes profitable arbitrage trades. 
              Uses flash loans to maximize capital efficiency and minimize risk exposure.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white/70">94% success rate</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white/70">24/7 monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-white/70">Flash loan integration</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Success Rate</span>
                <span className="text-green-400">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Average ROI</span>
                <span className="text-green-400">1.2x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Max Drawdown</span>
                <span className="text-green-400">-3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Execution Speed</span>
                <span className="text-green-400">423ms avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">LP Optimizer</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-xl text-white font-medium">Automated Liquidity Management</h3>
                <p className="text-purple-400 text-sm">Long-term yield optimization</p>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              Manages liquidity positions across multiple pools, automatically rebalancing to minimize 
              impermanent loss while maximizing fee collection. Perfect for passive income strategies.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white/70">Impermanent loss protection</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className="text-white/70">Multi-pool optimization</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white/70">15% average APY</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Success Rate</span>
                <span className="text-green-400">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Average APY</span>
                <span className="text-green-400">15.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">IL Protection</span>
                <span className="text-green-400">-2.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Rebalance Freq</span>
                <span className="text-blue-400">2.1 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Scout Agent</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-400" />
              <div>
                <h3 className="text-xl text-white font-medium">Market Intelligence Gathering</h3>
                <p className="text-orange-400 text-sm">Information and signal generation</p>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              Continuously scans markets for opportunities and generates signals for other agents. 
              Doesn&apos;t execute trades but provides valuable market intelligence for swarm coordination.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-white/70">Advanced pattern recognition</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white/70">Real-time signal generation</span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="text-white/70">87% signal accuracy</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Signal Accuracy</span>
                <span className="text-green-400">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Detection Speed</span>
                <span className="text-green-400">156ms avg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Markets Monitored</span>
                <span className="text-blue-400">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Daily Signals</span>
                <span className="text-blue-400">1,234</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Choosing the Right Agent</h2>
        
        <Tabs>
          <Tab title="Risk Profile">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Match your agent choice to your risk tolerance and investment goals:
              </p>
              
              <div className="space-y-4">
                <Card title="Conservative (Low Risk)" icon={<Shield />}>
                  <div className="space-y-2">
                    <p><strong>Recommended:</strong> LP Optimizer, Arbitrage Engine</p>
                    <p>Focus on steady, predictable returns with minimal risk exposure.</p>
                  </div>
                </Card>
                
                <Card title="Balanced (Medium Risk)" icon={<BarChart3 />}>
                  <div className="space-y-2">
                    <p><strong>Recommended:</strong> Arbitrage Engine, Scout + Trader combination</p>
                    <p>Balance growth potential with risk management through diversified strategies.</p>
                  </div>
                </Card>
                
                <Card title="Aggressive (High Risk)" icon={<TrendingUp />}>
                  <div className="space-y-2">
                    <p><strong>Recommended:</strong> Sniper Agent, Multi-agent swarms</p>
                    <p>Maximum growth potential with higher risk tolerance for experienced traders.</p>
                  </div>
                </Card>
              </div>
            </div>
          </Tab>
          
          <Tab title="Capital Requirements">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Different agents have varying capital efficiency and minimum requirements:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white font-medium">Agent Type</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Min Capital</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Recommended</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Capital Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">Sniper</td>
                      <td className="py-3 px-4 text-white/70">0.5 SOL</td>
                      <td className="py-3 px-4 text-green-400">2-5 SOL</td>
                      <td className="py-3 px-4 text-yellow-400">Medium</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">Arbitrage</td>
                      <td className="py-3 px-4 text-white/70">1 SOL</td>
                      <td className="py-3 px-4 text-green-400">5-10 SOL</td>
                      <td className="py-3 px-4 text-green-400">High</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">LP Optimizer</td>
                      <td className="py-3 px-4 text-white/70">5 SOL</td>
                      <td className="py-3 px-4 text-green-400">20+ SOL</td>
                      <td className="py-3 px-4 text-green-400">High</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white">Scout</td>
                      <td className="py-3 px-4 text-white/70">0.1 SOL</td>
                      <td className="py-3 px-4 text-green-400">0.5 SOL</td>
                      <td className="py-3 px-4 text-blue-400">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tab>
          
          <Tab title="Market Conditions">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Optimal agent performance varies with market conditions:
              </p>
              
              <AccordionGroup>
                <Accordion title="Bull Market">
                  <div className="space-y-2">
                    <p><strong>Best performers:</strong> Sniper Agents, LP Optimizers</p>
                    <p>High volatility and new token launches create optimal conditions for aggressive strategies.</p>
                  </div>
                </Accordion>
                
                <Accordion title="Bear Market">
                  <div className="space-y-2">
                    <p><strong>Best performers:</strong> Arbitrage Engines, Scout Agents</p>
                    <p>Lower volatility favors consistent arbitrage opportunities and market intelligence gathering.</p>
                  </div>
                </Accordion>
                
                <Accordion title="Sideways Market">
                  <div className="space-y-2">
                    <p><strong>Best performers:</strong> LP Optimizers, Arbitrage Engines</p>
                    <p>Range-bound markets are perfect for liquidity provision and cross-exchange arbitrage.</p>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
        </Tabs>
      </div>

      <Info>
        <strong>Pro Tip:</strong> Consider deploying multiple agent types for portfolio diversification. 
        Swarm coordination allows different agents to work together for enhanced performance.
      </Info>

      <Warning>
        Remember that past performance doesn&apos;t guarantee future results. Start with smaller amounts 
        to understand agent behavior before scaling up your deployments.
      </Warning>
    </div>
  );
}