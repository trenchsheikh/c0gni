import React from 'react';
import { 
  Code, 
  Download,
  Book,
  Play,
  CheckCircle,
  AlertCircle,
  Terminal,
  Database,
  ArrowRight,
  ExternalLink
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

export default function PythonSDKPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Python SDK</h1>
        <p className="text-xl text-white/80">
          Build sophisticated trading agents with Python. Perfect for data scientists and ML engineers 
          who need advanced analytics and machine learning integration.
        </p>
      </div>

      <Info>
        The <strong>c0gni Python SDK</strong> provides the most comprehensive toolset for agent development, 
        with built-in support for pandas, scikit-learn, and popular ML libraries.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Installation</h2>
        
        <Steps>
          <Step title="Install via pip">
            Install the core SDK package from PyPI
          </Step>
          <Step title="Install Dependencies">
            Add optional ML and analytics packages as needed
          </Step>
          <Step title="Authentication">
            Configure API credentials for live trading
          </Step>
          <Step title="Verify Installation">
            Run a simple test to confirm everything works
          </Step>
        </Steps>
        
        <Tabs>
          <Tab title="Basic Installation">
            <div className="space-y-4">
              <CodeBlock language="bash">
{`# Install the c0gni Python SDK
pip install c0gni-sdk

# Verify installation
python -c "import c0gni; print(c0gni.__version__)"`}
              </CodeBlock>
              
              <p className="text-white/80">
                The basic installation includes everything needed for simple trading strategies.
              </p>
            </div>
          </Tab>
          
          <Tab title="Full Installation">
            <div className="space-y-4">
              <CodeBlock language="bash">
{`# Install with all optional dependencies
pip install c0gni-sdk[full]

# Or install specific feature sets:
pip install c0gni-sdk[ml]        # Machine learning
pip install c0gni-sdk[analytics] # Advanced analytics  
pip install c0gni-sdk[viz]       # Visualization tools
pip install c0gni-sdk[dev]       # Development tools

# For development with all features:
pip install c0gni-sdk[full,dev]`}
              </CodeBlock>
              
              <AccordionGroup>
                <Accordion title="Optional Dependencies">
                  <div className="space-y-2">
                    <div>• <strong>ml:</strong> scikit-learn, tensorflow, torch</div>
                    <div>• <strong>analytics:</strong> pandas, numpy, scipy, ta-lib</div>
                    <div>• <strong>viz:</strong> matplotlib, plotly, seaborn</div>
                    <div>• <strong>dev:</strong> pytest, black, mypy, jupyter</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Development Setup">
            <div className="space-y-4">
              <CodeBlock language="bash">
{`# Create virtual environment
python -m venv c0gni-env
source c0gni-env/bin/activate  # On Windows: c0gni-env\\Scripts\\activate

# Install development dependencies
pip install c0gni-sdk[full,dev]

# Setup Jupyter notebook integration
jupyter nbextension install --py --symlink --sys-prefix c0gni
jupyter nbextension enable --py --sys-prefix c0gni

# Create project structure
mkdir my-trading-agent
cd my-trading-agent
c0gni init --template sniper`}
              </CodeBlock>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Quick Start</h2>
        
        <CodeBlock language="python" filename="quickstart.py">
{`from c0gni import Agent, Strategy, MarketData
import asyncio

class SimpleArbitrageStrategy(Strategy):
    def __init__(self):
        super().__init__()
        self.min_profit_threshold = 0.005  # 0.5% minimum profit
        
    async def on_market_data(self, data: MarketData):
        # Check for arbitrage opportunities across DEXs
        opportunities = await self.scan_arbitrage_opportunities(data)
        
        for opportunity in opportunities:
            if opportunity.profit_percentage > self.min_profit_threshold:
                return self.arbitrage_signal(
                    buy_exchange=opportunity.buy_dex,
                    sell_exchange=opportunity.sell_dex,
                    token=opportunity.token,
                    profit_estimate=opportunity.profit_percentage
                )
        
        return None

# Create and configure agent
async def main():
    strategy = SimpleArbitrageStrategy()
    
    agent = Agent(
        name="My First Agent",
        strategy=strategy,
        initial_balance=1.0,  # 1 ETH
        network="sepolia"  # Start with testnet
    )
    
    # Start paper trading
    await agent.start_paper_trading(duration_hours=24)
    
    # Get results
    results = await agent.get_performance_summary()
    print(f"Total trades: {results.total_trades}")
    print(f"Win rate: {results.win_rate:.1%}")
    print(f"Total return: {results.total_return:.1%}")

if __name__ == "__main__":
    asyncio.run(main())`}
        </CodeBlock>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Core Components</h2>
        
        <Tabs>
          <Tab title="Agent Class">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                The Agent class is the main interface for creating and managing trading agents:
              </p>
              
              <CodeBlock language="python">
{`from c0gni import Agent

# Create an agent with full configuration
agent = Agent(
    name="Advanced Trader",
    strategy=my_strategy,
    initial_balance=2.0,
    network="mainnet",
    risk_management={
        'max_position_size': 0.3,
        'stop_loss': -0.25,
        'max_daily_loss': -0.10
    },
    execution_settings={
        'slippage_tolerance': 0.02,
        'priority_fee': 0.001,
        'use_jito_bundles': True
    }
)

# Agent lifecycle methods
await agent.deploy()              # Deploy to network
await agent.start()               # Begin trading
await agent.pause()               # Temporarily halt
await agent.resume()              # Resume trading
await agent.stop()                # Stop and cleanup

# Monitoring and control
status = await agent.get_status()
performance = await agent.get_performance()
positions = await agent.get_open_positions()`}
              </CodeBlock>
              
              <AccordionGroup>
                <Accordion title="Agent Configuration">
                  <div className="space-y-2">
                    <div>• <strong>name:</strong> Human-readable agent identifier</div>
                    <div>• <strong>strategy:</strong> Trading strategy implementation</div>
                    <div>• <strong>initial_balance:</strong> Starting capital in ETH</div>
                    <div>• <strong>network:</strong> Ethereum network (sepolia/mainnet)</div>
                    <div>• <strong>risk_management:</strong> Risk control parameters</div>
                  </div>
                </Accordion>
                
                <Accordion title="Execution Settings">
                  <div className="space-y-2">
                    <div>• <strong>slippage_tolerance:</strong> Max acceptable slippage</div>
                    <div>• <strong>priority_fee:</strong> Extra fee for faster execution</div>
                    <div>• <strong>use_flashbots:</strong> Enable MEV protection</div>
                    <div>• <strong>max_retries:</strong> Transaction retry attempts</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Strategy Framework">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Create custom strategies by extending the Strategy base class:
              </p>
              
              <CodeBlock language="python">
{`from c0gni import Strategy, Signal, MarketData
from c0gni.indicators import SMA, RSI, MACD
import pandas as pd

class TechnicalAnalysisStrategy(Strategy):
    def __init__(self):
        super().__init__()
        # Initialize indicators
        self.sma_short = SMA(period=10)
        self.sma_long = SMA(period=30)
        self.rsi = RSI(period=14)
        self.macd = MACD(fast=12, slow=26, signal=9)
        
    async def on_market_data(self, data: MarketData) -> Signal:
        \"\"\"Called when new market data arrives\"\"\"
        # Update indicators with latest price
        price = data.close_price
        self.sma_short.update(price)
        self.sma_long.update(price)
        self.rsi.update(price)
        self.macd.update(price)
        
        # Generate signals based on technical analysis
        return await self.analyze_entry_conditions(data)
    
    async def analyze_entry_conditions(self, data: MarketData) -> Signal:
        # Trend following: SMA crossover
        if (self.sma_short.value > self.sma_long.value and 
            self.sma_short.previous < self.sma_long.previous):
            
            # Confirm with RSI (not overbought)
            if self.rsi.value < 70:
                return self.buy_signal(
                    confidence=0.8,
                    reason="SMA bullish crossover with RSI confirmation"
                )
        
        # Mean reversion: Oversold RSI with MACD divergence
        elif self.rsi.value < 30 and self.macd.histogram > 0:
            return self.buy_signal(
                confidence=0.6,
                reason="Oversold RSI with MACD bullish divergence"
            )
        
        return None  # No signal
    
    async def on_position_update(self, position):
        \"\"\"Called when position changes\"\"\"
        # Implement trailing stops
        if position.unrealized_pnl > 0.1:  # 10% profit
            await self.set_trailing_stop(position, trail_percent=0.05)
    
    async def on_trade_filled(self, trade):
        \"\"\"Called when trade is executed\"\"\"
        self.log(f"Trade filled: {trade.side} {trade.size} at {trade.price}")
        
        # Update strategy state based on trade results
        if trade.side == "buy":
            await self.update_position_tracking(trade)`}
              </CodeBlock>
              
              <AccordionGroup>
                <Accordion title="Strategy Methods">
                  <div className="space-y-2">
                    <div>• <strong>on_market_data():</strong> Process incoming price data</div>
                    <div>• <strong>on_position_update():</strong> React to position changes</div>
                    <div>• <strong>on_trade_filled():</strong> Handle trade execution</div>
                    <div>• <strong>on_error():</strong> Handle exceptions and errors</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Data & Analytics">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Access comprehensive market data and analytics tools:
              </p>
              
              <CodeBlock language="python">
{`from c0gni.data import MarketDataProvider, HistoricalData
from c0gni.analytics import PerformanceAnalyzer, RiskMetrics
import pandas as pd

# Market data access
data_provider = MarketDataProvider()

# Get real-time data
current_price = await data_provider.get_current_price("ETH/USDC")
orderbook = await data_provider.get_orderbook("ETH/USDC", depth=10)

# Historical data for backtesting
historical = await data_provider.get_historical_data(
    symbol="ETH/USDC",
    interval="1m",
    start_date="2024-01-01",
    end_date="2024-01-31"
)

# Convert to pandas DataFrame for analysis
df = historical.to_dataframe()
print(df.head())

# Performance analysis
analyzer = PerformanceAnalyzer()
trades_df = await agent.get_trade_history()

# Calculate key metrics
metrics = analyzer.calculate_metrics(trades_df)
print(f"Sharpe Ratio: {metrics.sharpe_ratio:.2f}")
print(f"Max Drawdown: {metrics.max_drawdown:.1%}")
print(f"Win Rate: {metrics.win_rate:.1%}")

# Risk analysis
risk_analyzer = RiskMetrics()
portfolio_risk = risk_analyzer.calculate_portfolio_risk(
    positions=agent.positions,
    lookback_days=30
)

# Visualize performance (requires viz extra)
import matplotlib.pyplot as plt
analyzer.plot_equity_curve(trades_df)
analyzer.plot_monthly_returns(trades_df)
plt.show()`}
              </CodeBlock>
              
              <AccordionGroup>
                <Accordion title="Available Data">
                  <div className="space-y-2">
                    <div>• <strong>Price Data:</strong> OHLCV bars at multiple timeframes</div>
                    <div>• <strong>Orderbook:</strong> Bid/ask depth and market microstructure</div>
                    <div>• <strong>Trade Data:</strong> Recent trades and volume analysis</div>
                    <div>• <strong>Token Metadata:</strong> Supply, holders, and project info</div>
                  </div>
                </Accordion>
                
                <Accordion title="Analytics Tools">
                  <div className="space-y-2">
                    <div>• <strong>Performance Metrics:</strong> Returns, Sharpe, Sortino ratios</div>
                    <div>• <strong>Risk Analysis:</strong> VaR, expected shortfall, correlations</div>
                    <div>• <strong>Attribution:</strong> Performance source analysis</div>
                    <div>• <strong>Backtesting:</strong> Historical strategy validation</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Machine Learning Integration</h2>
        
        <p className="text-white/80 leading-relaxed">
          The Python SDK provides seamless integration with popular ML libraries:
        </p>
        
        <CodeBlock language="python">
{`from c0gni.ml import PredictiveModel, FeatureExtractor
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import numpy as np

class MLEnhancedStrategy(Strategy):
    def __init__(self):
        super().__init__()
        self.feature_extractor = FeatureExtractor([
            'price_momentum_5m',
            'volume_ratio_1h', 
            'rsi_14',
            'macd_histogram',
            'bollinger_position'
        ])
        
        # Load pre-trained model or create new one
        self.model = PredictiveModel.load('price_direction_model')
        if self.model is None:
            self.model = self.train_model()
            
    def train_model(self):
        \"\"\"Train a model to predict price direction\"\"\"
        # Get historical data for training
        historical_data = self.get_training_data(days=90)
        
        # Extract features
        X = []
        y = []
        
        for i in range(len(historical_data) - 10):
            # Features: current market state
            features = self.feature_extractor.extract(
                historical_data[i:i+1]
            )
            X.append(features)
            
            # Target: price direction in next 5 minutes
            current_price = historical_data[i]['close']
            future_price = historical_data[i+10]['close']  # 5min later
            y.append(1 if future_price > current_price else 0)
        
        # Train classifier
        model = RandomForestClassifier(n_estimators=100)
        model.fit(X, y)
        
        # Validate model
        accuracy = accuracy_score(y_test, model.predict(X_test))
        print(f"Model accuracy: {accuracy:.1%}")
        
        return model
    
    async def on_market_data(self, data):
        # Extract current features
        features = self.feature_extractor.extract([data])
        
        # Predict price direction
        prediction = self.model.predict_proba([features])[0]
        bullish_probability = prediction[1]
        
        # Generate signal if confidence is high
        if bullish_probability > 0.7:
            return self.buy_signal(
                confidence=bullish_probability,
                reason=f"ML prediction: {bullish_probability:.1%} bullish"
            )
        elif bullish_probability < 0.3:
            return self.sell_signal(
                confidence=1 - bullish_probability,
                reason=f"ML prediction: {1-bullish_probability:.1%} bearish"
            )
        
        return None`}
        </CodeBlock>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Testing & Debugging</h2>
        
        <CardGroup cols={2}>
          <Card title="Unit Testing" icon={<CheckCircle />}>
            <div className="space-y-2">
              <p>Comprehensive testing framework for strategy validation</p>
              <div className="text-sm text-white/60 mt-3">
                Built-in pytest integration with strategy-specific test utilities
              </div>
            </div>
          </Card>
          
          <Card title="Debug Tools" icon={<AlertCircle />}>
            <div className="space-y-2">
              <p>Advanced debugging capabilities for complex strategies</p>
              <div className="text-sm text-white/60 mt-3">
                Step-through debugging, variable inspection, and trade replay
              </div>
            </div>
          </Card>
        </CardGroup>
        
        <CodeBlock language="python" filename="test_strategy.py">
{`import pytest
from c0gni.testing import StrategyTester, MockMarketData
from my_strategy import TechnicalAnalysisStrategy

class TestTechnicalAnalysisStrategy:
    def setup_method(self):
        self.strategy = TechnicalAnalysisStrategy()
        self.tester = StrategyTester(self.strategy)
    
    def test_buy_signal_generation(self):
        # Create mock data with SMA crossover pattern
        mock_data = MockMarketData.create_sma_crossover(
            periods=50,
            crossover_at=30,
            price_start=100.0
        )
        
        # Feed data to strategy
        signals = []
        for data_point in mock_data:
            signal = await self.strategy.on_market_data(data_point)
            if signal:
                signals.append(signal)
        
        # Verify buy signal generated at crossover
        assert len(signals) == 1
        assert signals[0].action == "buy"
        assert signals[0].confidence > 0.7
    
    @pytest.mark.asyncio
    async def test_backtest_performance(self):
        # Run backtest on historical data
        results = await self.tester.backtest(
            start_date="2024-01-01",
            end_date="2024-01-31",
            initial_balance=2.0
        )
        
        # Performance assertions
        assert results.total_return > 0
        assert results.win_rate > 0.5
        assert results.max_drawdown < 0.3
    
    def test_risk_management(self):
        # Test position sizing logic
        balance = 10.0
        signal_confidence = 0.8
        
        position_size = self.strategy.calculate_position_size(
            balance, signal_confidence
        )
        
        # Should not risk more than 5% per trade
        assert position_size <= balance * 0.05`}
        </CodeBlock>
      </div>

      <Warning>
        <strong>Production Deployment:</strong> Always test strategies thoroughly in paper trading mode 
        before deploying with real capital. Use small amounts initially to validate live performance.
      </Warning>

      <Tip>
        <strong>Performance Tip:</strong> Use vectorized operations with pandas and numpy for faster 
        backtesting. Avoid loops when processing large datasets.
      </Tip>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">API Documentation</h3>
              <p className="text-white/70">Complete Python SDK reference</p>
            </div>
            <a 
              href="/docs/api"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              View Docs
              <Book className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">GitHub Examples</h3>
              <p className="text-white/70">Sample strategies and tutorials</p>
            </div>
            <a 
              href="https://github.com/c0gni/python-examples"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Examples
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}