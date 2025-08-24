'use client';

import React from 'react';
import { 
  Code, 
  Terminal,
  Book,
  Zap,
  Brain,
  Database,
  Network,
  Shield,
  Download,
  ExternalLink,
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
  Tip
} from '@/components/docs/DocComponents';

export default function SDKPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Developer SDK</h1>
        <p className="text-xl text-white/80">
          Build custom autonomous agents with our Python and TypeScript SDKs. From simple strategies to complex multi-agent systems.
        </p>
      </div>

      <Info>
        The c0gni SDK provides everything you need to create, test, and deploy custom trading agents. 
        Choose between Python for ML-heavy strategies or TypeScript for web-based integrations.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Choose Your Language</h2>
        
        <CardGroup cols={2}>
          <Card title="Python SDK" icon={Code} href="/docs/sdk/python">
            <div className="space-y-2">
              <p className="text-blue-400 text-sm font-medium">Recommended for ML strategies</p>
              <p>Full-featured SDK with ML libraries, backtesting, and data analysis tools</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• scikit-learn & pandas integration</div>
                <div>• Built-in backtesting framework</div>
                <div>• Real-time market data feeds</div>
              </div>
            </div>
          </Card>
          
          <Card title="TypeScript SDK" icon={Terminal} href="/docs/sdk/typescript">
            <div className="space-y-2">
              <p className="text-green-400 text-sm font-medium">Perfect for web integration</p>
              <p>Lightweight SDK for React/Node.js applications and web-based strategies</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• React hooks for UI integration</div>
                <div>• WebSocket real-time updates</div>
                <div>• Type-safe API interactions</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Quick Start</h2>
        
        <Tabs>
          <Tab title="Python">
            <div className="space-y-6">
              <Steps>
                <Step title="Install SDK">
                  Install the c0gni Python SDK via pip
                </Step>
                <Step title="Create Agent">
                  Define your trading strategy using our agent framework
                </Step>
                <Step title="Backtest">
                  Test your strategy against historical data
                </Step>
                <Step title="Deploy">
                  Deploy your agent to the c0gni network
                </Step>
              </Steps>
              
              <div className="space-y-4">
                <h4 className="text-white font-medium">Installation</h4>
                <CodeBlock language="bash">
{`# Install the c0gni SDK
pip install c0gni-sdk

# Install optional dependencies for ML strategies
pip install c0gni-sdk[ml]`}
                </CodeBlock>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white font-medium">Your First Agent</h4>
                <CodeBlock language="python">
{`from c0gni import Agent, Strategy, MarketData

class SniperStrategy(Strategy):
    def __init__(self):
        self.min_liquidity = 10  # SOL
        self.max_market_cap = 100000  # USD
        
    async def on_new_token(self, token_data):
        # Check if token meets our criteria
        if (token_data.liquidity >= self.min_liquidity and 
            token_data.market_cap <= self.max_market_cap):
            
            # Perform additional analysis
            risk_score = await self.analyze_risk(token_data)
            
            if risk_score < 0.3:  # Low risk
                return self.buy_signal(
                    token=token_data.address,
                    amount=self.budget * 0.1  # 10% of budget
                )
        
        return None

# Create and configure agent
agent = Agent(
    strategy=SniperStrategy(),
    budget=5.0,  # 5 SOL
    risk_level='medium'
)

# Deploy to testnet first
await agent.deploy(network='devnet')`}
                </CodeBlock>
              </div>
            </div>
          </Tab>
          
          <Tab title="TypeScript">
            <div className="space-y-6">
              <Steps>
                <Step title="Install Package">
                  Add the c0gni TypeScript SDK to your project
                </Step>
                <Step title="Configure Client">
                  Initialize the SDK with your API credentials
                </Step>
                <Step title="Build Strategy">
                  Create your trading logic using TypeScript
                </Step>
                <Step title="Deploy Agent">
                  Launch your agent on the c0gni network
                </Step>
              </Steps>
              
              <div className="space-y-4">
                <h4 className="text-white font-medium">Installation</h4>
                <CodeBlock language="bash">
{`# Install via npm
npm install @c0gni/sdk

# Install via yarn
yarn add @c0gni/sdk`}
                </CodeBlock>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white font-medium">Basic Setup</h4>
                <CodeBlock language="typescript">
{`import { C0gniClient, AgentBuilder, ArbitrageStrategy } from '@c0gni/sdk';

// Initialize client
const client = new C0gniClient({
  apiKey: process.env.C0GNI_API_KEY,
  network: 'mainnet-beta'
});

// Create arbitrage strategy
class CustomArbitrageStrategy extends ArbitrageStrategy {
  async findOpportunities() {
    const opportunities = await this.scanDEXs([
      'jupiter',
      'raydium', 
      'orca'
    ]);
    
    // Filter profitable opportunities
    return opportunities.filter(opp => 
      opp.profitPercent > 0.5 && 
      opp.liquidity > 1000
    );
  }
  
  async executeArbitrage(opportunity: Opportunity) {
    const result = await this.client.executeTrade({
      type: 'arbitrage',
      buyDex: opportunity.buyDex,
      sellDex: opportunity.sellDex,
      token: opportunity.token,
      amount: this.calculateOptimalSize(opportunity)
    });
    
    return result;
  }
}

// Deploy agent
const agent = new AgentBuilder()
  .setStrategy(new CustomArbitrageStrategy())
  .setBudget(10) // 10 SOL
  .setRiskLevel('conservative')
  .build();

await agent.deploy();`}
                </CodeBlock>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">SDK Features</h2>
        
        <CardGroup cols={2}>
          <Card title="Strategy Framework" icon={Brain}>
            <div className="space-y-2">
              <p>Pre-built base classes for common trading strategies</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• SniperStrategy</div>
                <div>• ArbitrageStrategy</div>
                <div>• LiquidityStrategy</div>
                <div>• CustomStrategy</div>
              </div>
            </div>
          </Card>
          
          <Card title="Market Data API" icon={Database}>
            <div className="space-y-2">
              <p>Real-time and historical market data from multiple sources</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Price feeds</div>
                <div>• Volume data</div>
                <div>• Liquidity metrics</div>
                <div>• Token metadata</div>
              </div>
            </div>
          </Card>
          
          <Card title="Backtesting Engine" icon={Zap}>
            <div className="space-y-2">
              <p>Test your strategies against historical data before deployment</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Historical simulation</div>
                <div>• Performance metrics</div>
                <div>• Risk analysis</div>
                <div>• Strategy optimization</div>
              </div>
            </div>
          </Card>
          
          <Card title="Agent Management" icon={Network}>
            <div className="space-y-2">
              <p>Deploy, monitor, and control your agents programmatically</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Remote deployment</div>
                <div>• Real-time monitoring</div>
                <div>• Performance tracking</div>
                <div>• Emergency controls</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Development Workflow</h2>
        
        <AccordionGroup>
          <Accordion title="1. Local Development" icon={Code}>
            <div className="space-y-3">
              <p>Develop and test your strategies locally:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Use our local simulator for rapid iteration</li>
                <li>• Built-in debugging and logging tools</li>
                <li>• Paper trading mode for risk-free testing</li>
                <li>• Integration with popular IDEs</li>
              </ul>
              
              <CodeBlock language="python">
{`# Local testing with simulator
from c0gni import LocalSimulator

simulator = LocalSimulator(
    start_date='2024-01-01',
    end_date='2024-01-31',
    initial_balance=10.0
)

results = await simulator.run(agent)
print(f"Total return: {results.total_return:.2%}")
print(f"Sharpe ratio: {results.sharpe_ratio:.2f}")`}
              </CodeBlock>
            </div>
          </Accordion>
          
          <Accordion title="2. Backtesting" icon={BarChart3}>
            <div className="space-y-3">
              <p>Comprehensive backtesting framework:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Historical data replay</li>
                <li>• Multiple timeframes and markets</li>
                <li>• Performance attribution analysis</li>
                <li>• Risk-adjusted metrics</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="3. Paper Trading" icon={Shield}>
            <div className="space-y-3">
              <p>Test with live market data but simulated trades:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Real-time market conditions</li>
                <li>• No financial risk</li>
                <li>• Full feature testing</li>
                <li>• Performance validation</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="4. Production Deployment" icon={Rocket}>
            <div className="space-y-3">
              <p>Deploy your tested agent to production:</p>
              <ul className="space-y-1 text-white/70">
                <li>• Seamless migration from paper trading</li>
                <li>• Automatic monitoring and alerts</li>
                <li>• Performance tracking</li>
                <li>• Emergency stop capabilities</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Advanced Features</h2>
        
        <Tabs>
          <Tab title="Machine Learning">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Integrate ML models into your trading strategies:
              </p>
              
              <CodeBlock language="python">
{`from c0gni.ml import PredictiveModel, FeatureExtractor

class MLSniperStrategy(Strategy):
    def __init__(self):
        # Load pre-trained model
        self.model = PredictiveModel.load('token_success_predictor')
        self.features = FeatureExtractor()
        
    async def analyze_token(self, token_data):
        # Extract features
        features = await self.features.extract(token_data)
        
        # Predict success probability
        success_prob = self.model.predict(features)
        
        # Make trading decision
        if success_prob > 0.8:
            return self.buy_signal(
                confidence=success_prob,
                amount=self.calculate_kelly_size(success_prob)
            )
        
        return None`}
              </CodeBlock>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card title="Pre-trained Models" icon={Brain}>
                  Access battle-tested ML models for common trading tasks
                </Card>
                
                <Card title="Custom Training" icon={Database}>
                  Train your own models using our data pipeline
                </Card>
              </div>
            </div>
          </Tab>
          
          <Tab title="Multi-Agent Systems">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Build sophisticated multi-agent systems:
              </p>
              
              <CodeBlock language="typescript">
{`import { AgentSwarm, ScoutAgent, TraderAgent } from '@c0gni/sdk';

// Create specialized agents
const scout = new ScoutAgent({
  markets: ['jupiter', 'raydium'],
  scanInterval: 100 // ms
});

const trader = new TraderAgent({
  budget: 5.0,
  riskLevel: 'medium'
});

// Create swarm
const swarm = new AgentSwarm({
  agents: [scout, trader],
  coordination: 'consensus',
  communicationProtocol: 'encrypted'
});

// Define swarm behavior
swarm.onOpportunity(async (signal) => {
  const consensus = await swarm.buildConsensus(signal);
  
  if (consensus.confidence > 0.7) {
    return trader.execute(consensus.trade);
  }
});

await swarm.deploy();`}
              </CodeBlock>
            </div>
          </Tab>
          
          <Tab title="Custom Integrations">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Integrate external data sources and services:
              </p>
              
              <CodeBlock language="python">
{`from c0gni.integrations import ExternalDataSource

class TwitterSentimentIntegration(ExternalDataSource):
    async def get_sentiment(self, token_symbol):
        # Connect to Twitter API
        tweets = await self.fetch_tweets(token_symbol, limit=100)
        
        # Analyze sentiment
        sentiment_scores = [
            self.analyze_tweet(tweet) for tweet in tweets
        ]
        
        return {
            'overall_sentiment': np.mean(sentiment_scores),
            'tweet_volume': len(tweets),
            'trending': self.is_trending(token_symbol)
        }

# Use in strategy
class SentimentAwareStrategy(Strategy):
    def __init__(self):
        self.sentiment_source = TwitterSentimentIntegration()
        
    async def analyze_token(self, token_data):
        sentiment = await self.sentiment_source.get_sentiment(
            token_data.symbol
        )
        
        if sentiment['overall_sentiment'] > 0.7:
            return self.buy_signal()
        elif sentiment['overall_sentiment'] < 0.3:
            return self.sell_signal()`}
              </CodeBlock>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Resources</h2>
        
        <CardGroup cols={3}>
          <Card title="Documentation" icon={Book} href="/docs/api">
            Complete API reference and guides
          </Card>
          
          <Card title="Examples" icon={Code} href="https://github.com/c0gni/examples">
            Sample strategies and implementation examples
          </Card>
          
          <Card title="Community" icon={Network} href="/docs/support/community">
            Discord community and developer forums
          </Card>
        </CardGroup>
      </div>

      <Warning>
        <strong>Development Best Practices:</strong>
        <ul className="mt-2 space-y-1">
          <li>• Always backtest strategies before live deployment</li>
          <li>• Start with paper trading to validate behavior</li>
          <li>• Implement proper error handling and logging</li>
          <li>• Use version control for strategy development</li>
        </ul>
      </Warning>

      <Tip>
        <strong>Getting Help:</strong> Join our Discord community for developer support, 
        strategy discussions, and access to our team of trading experts.
      </Tip>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Python SDK Documentation</h3>
              <p className="text-white/70">Complete guide for Python developers</p>
            </div>
            <a 
              href="/docs/sdk/python"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Python Docs
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">TypeScript SDK Documentation</h3>
              <p className="text-white/70">Complete guide for TypeScript/JavaScript developers</p>
            </div>
            <a 
              href="/docs/sdk/typescript"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              TypeScript Docs
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}