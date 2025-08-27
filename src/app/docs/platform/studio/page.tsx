import React from 'react';
import { 
  Code, 
  Terminal,
  FileCode,
  Play,
  Bug,
  GitBranch,
  Cpu,
  Database,
  Zap,
  Brain,
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
  Tip
} from '@/components/docs';

export default function AgentStudioPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Agent Studio</h1>
        <p className="text-xl text-white/80">
          Professional development environment for creating custom autonomous trading agents. 
          Build, test, and deploy sophisticated strategies with advanced tooling.
        </p>
      </div>

      <Info>
        <strong>Agent Studio</strong> is designed for developers who need full control over agent behavior. 
        Create custom strategies using Python or TypeScript with integrated testing and deployment tools.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Studio Features</h2>
        
        <CardGroup cols={2}>
          <Card title="Code Editor" icon={<Code />}>
            <div className="space-y-2">
              <p>Full-featured IDE with syntax highlighting and auto-completion</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Python & TypeScript support</div>
                <div>• IntelliSense and debugging</div>
                <div>• Git integration</div>
                <div>• Real-time collaboration</div>
              </div>
            </div>
          </Card>
          
          <Card title="Strategy Simulator" icon={<Play />}>
            <div className="space-y-2">
              <p>Test strategies against historical data with realistic market conditions</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Historical backtesting</div>
                <div>• Real-time paper trading</div>
                <div>• Performance analytics</div>
                <div>• Risk analysis tools</div>
              </div>
            </div>
          </Card>
          
          <Card title="Debug Console" icon={<Bug />}>
            <div className="space-y-2">
              <p>Advanced debugging tools for strategy development</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Breakpoints and stepping</div>
                <div>• Variable inspection</div>
                <div>• Trade execution logs</div>
                <div>• Performance profiling</div>
              </div>
            </div>
          </Card>
          
          <Card title="Version Control" icon={<GitBranch />}>
            <div className="space-y-2">
              <p>Built-in Git support for strategy version management</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Branch management</div>
                <div>• Commit history</div>
                <div>• Collaborative development</div>
                <div>• Automated backups</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Getting Started</h2>
        
        <Steps>
          <Step title="Create New Project">
            Start a new agent project from templates or from scratch
          </Step>
          <Step title="Develop Strategy">
            Write custom trading logic using our comprehensive SDK
          </Step>
          <Step title="Test & Debug">
            Use the simulator to validate strategy performance
          </Step>
          <Step title="Deploy Agent">
            Deploy your tested strategy as an autonomous agent
          </Step>
        </Steps>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Development Environment</h2>
        
        <Tabs>
          <Tab title="Code Editor">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Professional code editor with all the features you need for agent development:
              </p>
              
              <CodeBlock language="python" filename="sniper_agent.py">
{`from c0gni import Agent, Strategy, MarketData
from c0gni.indicators import RSI, MACD
import numpy as np

class AdvancedSniperStrategy(Strategy):
    def __init__(self):
        super().__init__()
        self.rsi = RSI(period=14)
        self.macd = MACD(fast=12, slow=26, signal=9)
        self.min_liquidity = 10  # ETH
        self.confidence_threshold = 0.8
        
    async def on_new_token(self, token_data):
        # Multi-factor analysis for new token launches
        liquidity_score = self.analyze_liquidity(token_data)
        technical_score = await self.technical_analysis(token_data)
        sentiment_score = await self.sentiment_analysis(token_data)
        
        # Weighted confidence calculation
        confidence = (
            liquidity_score * 0.4 +
            technical_score * 0.3 +
            sentiment_score * 0.3
        )
        
        if confidence > self.confidence_threshold:
            position_size = self.kelly_criterion(confidence)
            return self.buy_signal(
                token=token_data.address,
                amount=position_size,
                confidence=confidence
            )
        
        return None
    
    def analyze_liquidity(self, token_data):
        if token_data.liquidity < self.min_liquidity:
            return 0.0
        
        # Liquidity depth analysis
        bid_ask_spread = token_data.ask_price - token_data.bid_price
        spread_ratio = bid_ask_spread / token_data.mid_price
        
        return max(0, 1 - (spread_ratio * 10))
    
    async def technical_analysis(self, token_data):
        # Get price history for technical indicators
        history = await self.get_price_history(token_data.address, periods=100)
        
        if len(history) < 50:
            return 0.5  # Neutral for insufficient data
        
        # RSI analysis
        rsi_value = self.rsi.calculate(history.close)
        rsi_score = 1 - abs(rsi_value - 50) / 50  # Closer to 50 is better
        
        # MACD analysis  
        macd_line, signal_line, histogram = self.macd.calculate(history.close)
        macd_score = 1 if macd_line[-1] > signal_line[-1] else 0
        
        return (rsi_score + macd_score) / 2`}
              </CodeBlock>
              
              <AccordionGroup>
                <Accordion title="Editor Features">
                  <div className="space-y-2">
                    <div>• <strong>Syntax Highlighting:</strong> Full Python/TypeScript support</div>
                    <div>• <strong>Auto-completion:</strong> Intelligent code suggestions</div>
                    <div>• <strong>Error Detection:</strong> Real-time syntax checking</div>
                    <div>• <strong>Code Formatting:</strong> Automatic style enforcement</div>
                  </div>
                </Accordion>
                
                <Accordion title="Integrated Tools">
                  <div className="space-y-2">
                    <div>• <strong>Terminal:</strong> Built-in command line interface</div>
                    <div>• <strong>File Explorer:</strong> Project navigation and management</div>
                    <div>• <strong>Search & Replace:</strong> Advanced text search capabilities</div>
                    <div>• <strong>Extensions:</strong> Custom plugin support</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Testing Framework">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Comprehensive testing tools for validating strategy performance:
              </p>
              
              <CardGroup cols={2}>
                <Card title="Backtesting Engine" icon={<Database />}>
                  <div className="space-y-2">
                    <p>Test strategies against historical market data</p>
                    <div className="text-sm text-white/60 mt-3">
                      Replay historical conditions with realistic execution
                    </div>
                  </div>
                </Card>
                
                <Card title="Paper Trading" icon={<Zap />}>
                  <div className="space-y-2">
                    <p>Live testing with real market data, simulated trades</p>
                    <div className="text-sm text-white/60 mt-3">
                      Risk-free validation of strategy behavior
                    </div>
                  </div>
                </Card>
              </CardGroup>
              
              <CodeBlock language="python" filename="test_strategy.py">
{`import pytest
from c0gni.testing import BacktestEngine, PaperTrader
from datetime import datetime, timedelta

def test_sniper_strategy_backtest():
    # Setup backtest environment
    engine = BacktestEngine(
        start_date=datetime(2024, 1, 1),
        end_date=datetime(2024, 1, 31),
        initial_balance=2.0  # ETH
    )
    
    strategy = AdvancedSniperStrategy()
    results = engine.run_backtest(strategy)
    
    # Performance assertions
    assert results.total_return > 0.1  # At least 10% return
    assert results.win_rate > 0.6      # At least 60% win rate
    assert results.max_drawdown < 0.2  # Less than 20% drawdown
    assert results.sharpe_ratio > 1.0  # Risk-adjusted returns

def test_real_time_paper_trading():
    # Setup paper trading
    paper_trader = PaperTrader(
        initial_balance=5.0,
        strategy=AdvancedSniperStrategy()
    )
    
    # Run for 24 hours
    results = await paper_trader.run_for_duration(
        duration=timedelta(hours=24)
    )
    
    # Validate performance
    assert results.trades_executed > 5
    assert results.average_execution_time < 500  # ms
    assert results.error_rate < 0.01  # Less than 1% errors`}
              </CodeBlock>
            </div>
          </Tab>
          
          <Tab title="Performance Analysis">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Advanced analytics for understanding strategy performance:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Total Return</span>
                      <span className="text-green-400">+34.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Win Rate</span>
                      <span className="text-green-400">67.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Sharpe Ratio</span>
                      <span className="text-green-400">2.14</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Max Drawdown</span>
                      <span className="text-yellow-400">-11.2%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Execution Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Avg Execution Time</span>
                      <span className="text-green-400">287ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Success Rate</span>
                      <span className="text-green-400">99.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Slippage</span>
                      <span className="text-yellow-400">1.8% avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Gas Efficiency</span>
                      <span className="text-green-400">94.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          
          <Tab title="Deployment">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Deploy your tested strategies as production agents:
              </p>
              
              <Steps>
                <Step title="Pre-deployment Checks">
                  Automated validation of strategy code and configuration
                </Step>
                <Step title="Environment Setup">
                  Configure production environment and resource allocation
                </Step>
                <Step title="Gradual Rollout">
                  Deploy with limited capital to validate live performance
                </Step>
                <Step title="Full Production">
                  Scale up to full capital allocation after validation
                </Step>
              </Steps>
              
              <CodeBlock language="yaml" filename="deployment.yml">
{`apiVersion: v1
kind: AgentDeployment
metadata:
  name: advanced-sniper-v2
  namespace: production
spec:
  strategy:
    image: "c0gni/advanced-sniper:v2.1"
    resources:
      requests:
        memory: "512Mi"
        cpu: "0.5"
      limits:
        memory: "1Gi"
        cpu: "1.0"
  
  configuration:
    budget: "2.0 ETH"
    risk_level: "medium" 
    max_position_size: 0.2
    
  monitoring:
    enabled: true
    alerts:
      - type: "performance"
        threshold: "win_rate < 0.6"
      - type: "risk" 
        threshold: "drawdown > 0.15"
        
  scaling:
    initial_capital: "0.2 ETH"  # Start small
    scale_up_trigger: "win_rate > 0.7 AND trades > 50"
    max_capital: "2.0 ETH"`}
              </CodeBlock>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Advanced Features</h2>
        
        <AccordionGroup>
          <Accordion title="Machine Learning Integration" icon={<Brain />}>
            <div className="space-y-3">
              <p>Integrate ML models into your trading strategies:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Pre-trained models for market prediction</li>
                <li>• Custom model training pipeline</li>
                <li>• Feature engineering tools</li>
                <li>• Model performance monitoring</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Multi-Asset Support" icon={<Database />}>
            <div className="space-y-3">
              <p>Trade across different asset classes:</p>
              <ul className="space-y-1 text-white/70">
                <li>• ERC-20 tokens on Ethereum</li>
                <li>• NFT collections</li>
                <li>• Liquidity pool tokens</li>
                <li>• Cross-chain assets (coming soon)</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Real-time Collaboration" icon={<GitBranch />}>
            <div className="space-y-3">
              <p>Work with your team on agent development:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Live code editing sessions</li>
                <li>• Shared development environments</li>
                <li>• Code review and approval workflows</li>
                <li>• Team performance dashboards</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Pricing</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Starter" icon={<Code />}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Free</div>
                <div className="text-white/60">for testing</div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Basic code editor</div>
                <div>• Limited backtesting (30 days)</div>
                <div>• Paper trading</div>
                <div>• Community support</div>
              </div>
            </div>
          </Card>
          
          <Card title="Professional" icon={<Terminal />}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$49</div>
                <div className="text-white/60">per month</div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Advanced IDE features</div>
                <div>• Full historical backtesting</div>
                <div>• Real-time deployment</div>
                <div>• Priority support</div>
              </div>
            </div>
          </Card>
          
          <Card title="Enterprise" icon={<Cpu />}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Custom</div>
                <div className="text-white/60">contact us</div>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Team collaboration tools</div>
                <div>• Custom ML models</div>
                <div>• Dedicated support</div>
                <div>• SLA guarantees</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Warning>
        <strong>Development Best Practices:</strong> Always thoroughly test strategies in paper trading 
        mode before deploying with real capital. Start with small allocations to validate performance.
      </Warning>

      <Tip>
        <strong>Pro Tip:</strong> Use version control from day one of development. It's much easier to 
        track changes and rollback issues when you have a complete development history.
      </Tip>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Start Building Custom Agents</h3>
            <p className="text-white/70">Access the professional development environment</p>
          </div>
          <a 
            href="https://studio.cognilabs.com"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Launch Studio
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}