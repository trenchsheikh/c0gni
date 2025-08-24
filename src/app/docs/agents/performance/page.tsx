import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Zap,
  Target,
  Shield,
  Clock,
  DollarSign,
  Activity,
  Gauge,
  ArrowUp,
  ArrowDown,
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
  AccordionGroup,
  Accordion,
  Tip,
  Frame
} from '@/components/docs';

export default function AgentPerformancePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Agent Performance</h1>
        <p className="text-xl text-white/80">
          Understanding how to measure, analyze, and optimize your agents&apos; trading performance. 
          Data-driven insights for maximizing profitability.
        </p>
      </div>

      <Info>
        <strong>Performance tracking</strong> is essential for optimizing agent strategies and ensuring 
        consistent profitability. c0gni provides comprehensive analytics and real-time monitoring.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Key Performance Metrics</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Success Rate" icon={<Target />}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">78.4%</div>
              <p className="text-sm text-white/60">Profitable trades / Total trades</p>
            </div>
          </Card>
          
          <Card title="Average ROI" icon={<TrendingUp />}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">2.3x</div>
              <p className="text-sm text-white/60">Return on investment per trade</p>
            </div>
          </Card>
          
          <Card title="Execution Speed" icon={<Zap />}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">387ms</div>
              <p className="text-sm text-white/60">Average time to execution</p>
            </div>
          </Card>
          
          <Card title="Max Drawdown" icon={<ArrowDown />}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-400">-12.4%</div>
              <p className="text-sm text-white/60">Largest loss from peak</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Performance Categories</h2>
        
        <Tabs>
          <Tab title="Trading Metrics">
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white font-medium">Metric</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Description</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Good Performance</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Benchmark</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white font-mono">Win Rate</td>
                      <td className="py-3 px-4 text-white/70">Percentage of profitable trades</td>
                      <td className="py-3 px-4 text-green-400">&gt;70%</td>
                      <td className="py-3 px-4 text-white/60">65%</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white font-mono">Profit Factor</td>
                      <td className="py-3 px-4 text-white/70">Gross profit / Gross loss</td>
                      <td className="py-3 px-4 text-green-400">&gt;2.0</td>
                      <td className="py-3 px-4 text-white/60">1.8</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white font-mono">Sharpe Ratio</td>
                      <td className="py-3 px-4 text-white/70">Risk-adjusted returns</td>
                      <td className="py-3 px-4 text-green-400">&gt;1.5</td>
                      <td className="py-3 px-4 text-white/60">1.2</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white font-mono">Max Drawdown</td>
                      <td className="py-3 px-4 text-white/70">Largest peak-to-trough loss</td>
                      <td className="py-3 px-4 text-green-400">&lt;15%</td>
                      <td className="py-3 px-4 text-white/60">20%</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white font-mono">Recovery Time</td>
                      <td className="py-3 px-4 text-white/70">Time to recover from drawdown</td>
                      <td className="py-3 px-4 text-green-400">&lt;7 days</td>
                      <td className="py-3 px-4 text-white/60">14 days</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white font-mono">Consistency</td>
                      <td className="py-3 px-4 text-white/70">Profitable days / Total days</td>
                      <td className="py-3 px-4 text-green-400">&gt;60%</td>
                      <td className="py-3 px-4 text-white/60">55%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tab>
          
          <Tab title="Technical Performance">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Technical execution metrics that impact profitability:
              </p>
              
              <CardGroup cols={2}>
                <Card title="Execution Latency" icon={<Clock />}>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Signal to Order</span>
                        <span className="text-green-400">156ms avg</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Order to Fill</span>
                        <span className="text-green-400">231ms avg</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Slippage Control" icon={<Target />}>
                  <div className="space-y-3">
                    <div className="text-sm text-white/60">
                      <div>• <strong>Target Slippage:</strong> &lt;2%</div>
                      <div>• <strong>Average Slippage:</strong> 1.34%</div>
                      <div>• <strong>Worst Case:</strong> 4.2%</div>
                      <div>• <strong>Slippage Control:</strong> 89% within target</div>
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <AccordionGroup>
                <Accordion title="Network Performance">
                  <div className="space-y-3">
                    <p><strong>RPC Response Times:</strong></p>
                    <ul className="space-y-1 text-white/70">
                      <li>• Primary RPC: 45ms average</li>
                      <li>• Fallback RPC: 67ms average</li>
                      <li>• WebSocket latency: 12ms average</li>
                      <li>• Connection uptime: 99.97%</li>
                    </ul>
                  </div>
                </Accordion>
                
                <Accordion title="Resource Usage">
                  <div className="space-y-3">
                    <p><strong>Computational Efficiency:</strong></p>
                    <ul className="space-y-1 text-white/70">
                      <li>• CPU utilization: 23% average</li>
                      <li>• Memory usage: 180MB per agent</li>
                      <li>• Network bandwidth: 2.3 MB/min</li>
                      <li>• Storage I/O: minimal impact</li>
                    </ul>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Risk Metrics">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Risk assessment and management performance:
              </p>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Risk-Adjusted Returns</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">2.34</div>
                      <div className="text-white/60 text-sm">Sharpe Ratio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">1.87</div>
                      <div className="text-white/60 text-sm">Sortino Ratio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">1.45</div>
                      <div className="text-white/60 text-sm">Calmar Ratio</div>
                    </div>
                  </div>
                </div>
              </Frame>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Drawdown Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Current Drawdown</span>
                      <span className="text-green-400">-2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Max Drawdown (30d)</span>
                      <span className="text-yellow-400">-8.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Average Recovery</span>
                      <span className="text-green-400">3.2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Drawdown Frequency</span>
                      <span className="text-white/60">12% of time</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Position Sizing</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Average Position Size</span>
                      <span className="text-white/60">18% of capital</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Max Position Size</span>
                      <span className="text-yellow-400">35% of capital</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Risk per Trade</span>
                      <span className="text-green-400">2.1% average</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Kelly Criterion</span>
                      <span className="text-white/60">85% adherence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Performance Analysis Tools</h2>
        
        <CardGroup cols={2}>
          <Card title="Real-Time Dashboard" icon={<Activity />}>
            <div className="space-y-2">
              <p>Live monitoring of all key performance indicators</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Trade execution tracking</div>
                <div>• P&L updates in real-time</div>
                <div>• Risk exposure monitoring</div>
                <div>• Performance alerts</div>
              </div>
            </div>
          </Card>
          
          <Card title="Historical Analysis" icon={<BarChart3 />}>
            <div className="space-y-2">
              <p>Deep dive into past performance with advanced analytics</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Backtesting capabilities</div>
                <div>• Performance attribution</div>
                <div>• Market condition analysis</div>
                <div>• Strategy comparison</div>
              </div>
            </div>
          </Card>
          
          <Card title="Benchmark Comparison" icon={<TrendingUp />}>
            <div className="space-y-2">
              <p>Compare agent performance against market benchmarks</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• SOL price performance</div>
                <div>• DeFi index comparison</div>
                <div>• Peer agent analysis</div>
                <div>• Risk-adjusted comparisons</div>
              </div>
            </div>
          </Card>
          
          <Card title="Optimization Suggestions" icon={<Target />}>
            <div className="space-y-2">
              <p>AI-powered recommendations for improving performance</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Parameter optimization</div>
                <div>• Risk management tuning</div>
                <div>• Strategy improvements</div>
                <div>• Market timing insights</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Performance Optimization</h2>
        
        <AccordionGroup>
          <Accordion title="Strategy Tuning" icon={<Gauge />}>
            <div className="space-y-4">
              <p>Optimize agent parameters based on performance data:</p>
              <CodeBlock language="json">
{`{
  "optimization_config": {
    "objective": "maximize_sharpe_ratio",
    "constraints": {
      "max_drawdown": 0.15,
      "min_win_rate": 0.65,
      "max_position_size": 0.3
    },
    "parameters_to_optimize": [
      {
        "name": "entry_threshold",
        "current": 0.7,
        "range": [0.5, 0.9],
        "impact": "high"
      },
      {
        "name": "stop_loss",
        "current": 0.25,
        "range": [0.1, 0.4],
        "impact": "medium"
      },
      {
        "name": "position_size_multiplier",
        "current": 1.0,
        "range": [0.5, 2.0],
        "impact": "high"
      }
    ]
  }
}`}
              </CodeBlock>
            </div>
          </Accordion>
          
          <Accordion title="A/B Testing" icon={<CheckCircle />}>
            <div className="space-y-3">
              <p>Test strategy variations systematically:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Deploy multiple agent variants</li>
                <li>• Compare performance over time</li>
                <li>• Statistical significance testing</li>
                <li>• Gradual rollout of improvements</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Market Regime Detection" icon={<Activity />}>
            <div className="space-y-3">
              <p>Adapt strategies based on market conditions:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Bull/bear market detection</li>
                <li>• Volatility regime classification</li>
                <li>• Liquidity condition assessment</li>
                <li>• Automatic parameter adjustment</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Performance Alerts</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">Alert Types</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-red-400 rounded-full mt-1"></div>
                <div>
                  <strong className="text-white">Critical Alerts</strong>
                  <p className="text-white/70 text-sm">Immediate attention required (drawdown &gt;10%)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1"></div>
                <div>
                  <strong className="text-white">Warning Alerts</strong>
                  <p className="text-white/70 text-sm">Performance degradation detected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full mt-1"></div>
                <div>
                  <strong className="text-white">Info Alerts</strong>
                  <p className="text-white/70 text-sm">Performance milestones and updates</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Recent Performance</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <div className="flex-1">
                  <div className="text-sm text-white">New profit record: +47.2% this month</div>
                  <div className="text-xs text-white/60">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white">Win rate improved to 78.4%</div>
                  <div className="text-xs text-white/60">6 hours ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white">Execution speed: 387ms average</div>
                  <div className="text-xs text-white/60">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Warning>
        <strong>Performance Context:</strong> Always consider market conditions when evaluating agent performance. 
        A 60% win rate during high volatility may be better than 80% during stable conditions.
      </Warning>

      <Tip>
        <strong>Pro Tip:</strong> Focus on risk-adjusted metrics like Sharpe ratio rather than raw returns. 
        Consistent, moderate gains often outperform volatile high returns over time.
      </Tip>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">View Performance Dashboard</h3>
            <p className="text-white/70">Access real-time analytics and historical data</p>
          </div>
          <a 
            href="/docs/platform/terminal"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Open Dashboard
            <BarChart3 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}