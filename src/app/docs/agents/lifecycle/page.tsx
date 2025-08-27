import React from 'react';
import { 
  Play, 
  Pause, 
  Square,
  RotateCcw,
  Settings,
  Brain,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
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
} from '@/components/docs';

export default function AgentLifecyclePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Agent Lifecycle</h1>
        <p className="text-xl text-white/80">
          Understanding the complete lifecycle of autonomous trading agents from creation to termination. 
          Master every stage for optimal agent management.
        </p>
      </div>

      <Info>
        <strong>Agent Lifecycle Management</strong> is crucial for maintaining optimal performance and ensuring 
        your agents adapt to changing market conditions throughout their operational lifetime.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Lifecycle Stages</h2>
        
        <Frame>
          <div className="space-y-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto">
                  <Settings className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Creation</h3>
                  <p className="text-white/60 text-xs">Configuration & Setup</p>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Learning</h3>
                  <p className="text-white/60 text-xs">Initial Training</p>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto">
                  <Play className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Active</h3>
                  <p className="text-white/60 text-xs">Live Trading</p>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto">
                  <RotateCcw className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Evolution</h3>
                  <p className="text-white/60 text-xs">Adaptation & Updates</p>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto">
                  <Square className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Retirement</h3>
                  <p className="text-white/60 text-xs">Decommissioning</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="h-px bg-gradient-to-r from-blue-400 via-purple-400 via-green-400 via-yellow-400 to-red-400 w-full max-w-2xl"></div>
            </div>
          </div>
        </Frame>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Detailed Lifecycle Stages</h2>
        
        <Tabs>
          <Tab title="1. Creation & Setup">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                The creation phase involves configuring agent parameters, selecting strategies, and preparing 
                the initial operational environment.
              </p>
              
              <Steps>
                <Step title="Strategy Selection">
                  Choose from pre-built templates or create custom trading strategies
                </Step>
                <Step title="Parameter Configuration">
                  Set risk parameters, budget allocation, and performance targets  
                </Step>
                <Step title="Resource Allocation">
                  Assign computational resources and memory requirements
                </Step>
                <Step title="Security Setup">
                  Generate keypairs, configure access controls, and enable monitoring
                </Step>
              </Steps>
              
              <AccordionGroup>
                <Accordion title="Initial Configuration">
                  <CodeBlock language="json">
{`{
  "agent_config": {
    "id": "agent_001",
    "type": "sniper",
    "version": "1.0.0",
    "created_at": "2024-01-15T10:30:00Z",
    "parameters": {
      "budget": "1.0 ETH",
      "max_position_size": 0.2,
      "stop_loss": -0.3,
      "take_profit": 2.0,
      "risk_level": "medium"
    },
    "strategy": {
      "name": "token_sniper_v2",
      "confidence_threshold": 0.75,
      "execution_speed": "ultra_fast"
    }
  }
}`}
                  </CodeBlock>
                </Accordion>
                
                <Accordion title="Resource Requirements">
                  <div className="space-y-2">
                    <div>• <strong>CPU:</strong> 2-4 cores per agent</div>
                    <div>• <strong>Memory:</strong> 512MB-2GB depending on complexity</div>
                    <div>• <strong>Storage:</strong> 50-200MB for logs and data</div>
                    <div>• <strong>Network:</strong> Low latency connection required</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="2. Learning Phase">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                New agents undergo a supervised learning phase to calibrate their decision-making before 
                live trading begins.
              </p>
              
              <CardGroup cols={2}>
                <Card title="Paper Trading" icon={<Shield />}>
                  <div className="space-y-2">
                    <p>Risk-free simulation using live market data</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Duration: 24-72 hours</div>
                      <div>• Min trades: 100 simulated</div>
                      <div>• Performance threshold: 65% win rate</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Strategy Validation" icon={<CheckCircle />}>
                  <div className="space-y-2">
                    <p>Backtesting against historical market data</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Historical period: 30-90 days</div>
                      <div>• Market conditions: Various regimes</div>
                      <div>• Benchmark comparison required</div>
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Learning Progress Tracking</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Strategy Comprehension</span>
                        <span className="text-green-400">94%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '94%'}}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Risk Assessment</span>
                        <span className="text-green-400">87%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Market Pattern Recognition</span>
                        <span className="text-yellow-400">72%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Frame>
            </div>
          </Tab>
          
          <Tab title="3. Active Trading">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Once validated, agents enter active trading mode with full autonomy and real capital.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Operational States</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <Play className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-white font-medium">Active</div>
                        <div className="text-white/60 text-sm">Fully operational and trading</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <Pause className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-white font-medium">Paused</div>
                        <div className="text-white/60 text-sm">Temporarily halted for maintenance</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">Monitoring</div>
                        <div className="text-white/60 text-sm">Scanning markets, no positions</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Health Monitoring</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">System Health</span>
                      <span className="text-green-400">Excellent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Network Latency</span>
                      <span className="text-green-400">34ms avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Memory Usage</span>
                      <span className="text-yellow-400">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Error Rate</span>
                      <span className="text-green-400">0.02%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Uptime</span>
                      <span className="text-green-400">99.97%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <AccordionGroup>
                <Accordion title="Performance Monitoring">
                  <div className="space-y-3">
                    <p>Continuous tracking of key performance indicators:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• Real-time P&L calculation</li>
                      <li>• Trade execution metrics</li>
                      <li>• Risk exposure analysis</li>
                      <li>• Market condition assessment</li>
                    </ul>
                  </div>
                </Accordion>
                
                <Accordion title="Automatic Safety Checks">
                  <div className="space-y-3">
                    <p>Built-in safeguards to prevent catastrophic losses:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• Maximum drawdown limits</li>
                      <li>• Position size enforcement</li>
                      <li>• Rapid loss detection</li>
                      <li>• Network connectivity monitoring</li>
                    </ul>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="4. Evolution & Updates">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Agents continuously evolve their strategies based on performance data and changing market conditions.
              </p>
              
              <Steps>
                <Step title="Performance Analysis">
                  Regular evaluation of trading results and strategy effectiveness
                </Step>
                <Step title="Parameter Optimization">
                  Fine-tuning of risk parameters and strategy variables
                </Step>
                <Step title="Strategy Updates">
                  Deployment of improved algorithms and decision models
                </Step>
                <Step title="Capability Expansion">
                  Addition of new features and trading capabilities
                </Step>
              </Steps>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Evolution Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-white text-sm">Strategy optimization completed</div>
                        <div className="text-white/60 text-xs">Win rate improved from 73% to 78% - 2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-white text-sm">Risk parameters updated</div>
                        <div className="text-white/60 text-xs">Reduced position sizing during high volatility - 1 day ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-white text-sm">New feature deployed</div>
                        <div className="text-white/60 text-xs">Added cross-DEX arbitrage capability - 3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Frame>
            </div>
          </Tab>
          
          <Tab title="5. Retirement">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                When agents are no longer needed or underperforming, they undergo controlled decommissioning.
              </p>
              
              <CardGroup cols={2}>
                <Card title="Graceful Shutdown" icon={<CheckCircle />}>
                  <div className="space-y-2">
                    <p>Controlled termination with position closure</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Close all open positions</div>
                      <div>• Withdraw remaining funds</div>
                      <div>• Export performance data</div>
                      <div>• Archive agent memory</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Emergency Stop" icon={<AlertTriangle />}>
                  <div className="space-y-2">
                    <p>Immediate termination for critical situations</p>
                    <div className="text-sm text-white/60 mt-3 space-y-1">
                      <div>• Instant position liquidation</div>
                      <div>• Fund recovery procedures</div>
                      <div>• Incident documentation</div>
                      <div>• Root cause analysis</div>
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <AccordionGroup>
                <Accordion title="Retirement Triggers">
                  <div className="space-y-3">
                    <p>Common reasons for agent retirement:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• Consistently poor performance (&lt;50% win rate for 30 days)</li>
                      <li>• Maximum drawdown exceeded multiple times</li>
                      <li>• Strategy becomes obsolete due to market changes</li>
                      <li>• User-initiated termination</li>
                      <li>• Technical issues preventing reliable operation</li>
                    </ul>
                  </div>
                </Accordion>
                
                <Accordion title="Data Preservation">
                  <div className="space-y-3">
                    <p>Important data preserved after retirement:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• Complete trading history and performance metrics</li>
                      <li>• Strategy parameters and evolution timeline</li>
                      <li>• Decision logs and market analysis data</li>
                      <li>• Learned patterns and model weights</li>
                    </ul>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Lifecycle Management Tools</h2>
        
        <CardGroup cols={2}>
          <Card title="Agent Dashboard" icon={<Settings />}>
            <div className="space-y-2">
              <p>Comprehensive control panel for lifecycle management</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Start/stop/pause controls</div>
                <div>• Performance monitoring</div>
                <div>• Configuration updates</div>
                <div>• Health status overview</div>
              </div>
            </div>
          </Card>
          
          <Card title="Automated Policies" icon={<Zap />}>
            <div className="space-y-2">
              <p>Set rules for automatic lifecycle transitions</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Performance-based pausing</div>
                <div>• Scheduled maintenance windows</div>
                <div>• Emergency stop conditions</div>
                <div>• Resource optimization</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <Warning>
        <strong>Important:</strong> Always ensure proper position closure before retiring agents. 
        Unexpected shutdowns can result in unwanted market exposure.
      </Warning>

      <Tip>
        <strong>Best Practice:</strong> Regularly review agent performance and consider evolution updates 
        every 2-4 weeks to maintain optimal trading effectiveness.
      </Tip>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Manage Agent Lifecycle</h3>
            <p className="text-white/70">Access comprehensive lifecycle management tools</p>
          </div>
          <a 
            href="/docs/platform/terminal"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Open Terminal
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}