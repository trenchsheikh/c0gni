import React from 'react';
import { 
  Wallet, 
  Settings, 
  Rocket, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  DollarSign,
  ArrowRight,
  Crosshair,
  ArrowLeftRight,
  Shield,
  TrendingUp,
  Code
} from 'lucide-react';
import { 
  Card, 
  CardGroup, 
  Steps, 
  Step, 
  Info, 
  Warning, 
  Tip,
  CodeBlock,
  Tabs,
  Tab,
  AccordionGroup,
  Accordion
} from '@/components/docs';

export default function QuickstartPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Deploy Your First Agent</h1>
        <p className="text-xl text-white/80">
          Get started with c0gni in under 60 seconds. This guide will walk you through deploying 
          a Cross-Chain Arbitrage agent that finds opportunities across EVM chains and builds wealth on Ethereum.
        </p>
      </div>

      <Info>
        <strong>Prerequisites:</strong>
        <ul className="mt-2 space-y-1">
          <li>• MetaMask or compatible EVM wallet</li>
          <li>• 1,000-10,000 COGNI tokens for staking</li>
          <li>• Basic understanding of DeFi concepts</li>
        </ul>
      </Info>

      <div className="space-y-8">
        <h2 className="text-3xl font-light text-white">Step 1: Connect Your Wallet</h2>

        <Steps>
          <Step title="Visit the Platform">
            Go to <a href="https://app.cognilabs.com" className="text-blue-400 hover:text-blue-300 underline">app.cognilabs.com</a> and click "Connect Wallet"
          </Step>
          <Step title="Select Network">
            Choose your starting chain (Ethereum, Polygon, Arbitrum, Base)
          </Step>
          <Step title="Approve Connection">
            Confirm the connection in your wallet extension
          </Step>
        </Steps>

        <Warning>
          Never share your private keys or seed phrase. c0gni only requires standard wallet connection permissions.
        </Warning>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-light text-white">Step 2: Choose Agent Blueprint</h2>
        <p className="text-white/80">
          Navigate to the <strong>Agent Factory</strong> and select from pre-configured blueprints:
        </p>

        <CardGroup cols={2}>
          <Card title="Cross-Chain Arbitrage" icon={<ArrowLeftRight />}>
            <div className="space-y-2">
              <p className="text-green-400 text-sm font-medium">Best for steady returns</p>
              <p>Finds price differences across EVM chains and executes profitable trades.</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Risk Level: Low-Medium</div>
                <div>• Success Rate: 89%</div>
                <div>• Avg ROI: 0.5-2% daily</div>
              </div>
            </div>
          </Card>
          
          <Card title="DeFi Yield Farmer" icon={<TrendingUp />}>
            <div className="space-y-2">
              <p className="text-blue-400 text-sm font-medium">Best for passive income</p>
              <p>Automatically farms yield across Aave, Compound, Curve on multiple chains.</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Risk Level: Low</div>
                <div>• APY: 8-15%</div>
                <div>• Auto-compounds: Yes</div>
              </div>
            </div>
          </Card>
        </CardGroup>

        <CardGroup cols={2}>
          <Card title="Multi-Chain Sniper" icon={<Crosshair />}>
            <div className="space-y-2">
              <p className="text-purple-400 text-sm font-medium">Best for high returns</p>
              <p>Detects new token launches across all chains and executes early entry trades.</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Risk Level: High</div>
                <div>• Success Rate: 65%</div>
                <div>• Avg ROI: 5-50x</div>
              </div>
            </div>
          </Card>
          
          <Card title="Custom Agent" icon={<Code />}>
            <div className="space-y-2">
              <p className="text-orange-400 text-sm font-medium">For developers</p>
              <p>Build your own strategy using our SDK and deploy as an autonomous agent.</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Risk Level: Variable</div>
                <div>• Success Rate: Variable</div>
                <div>• ROI: Your strategy</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-light text-white">Step 3: Configure Agent Settings</h2>

        <h3 className="text-xl font-medium text-white">Basic Configuration</h3>
        
        <CodeBlock language="json">
{`{
  "agentType": "cross-chain-arbitrage",
  "stakeAmount": "5000 COGNI",
  "chains": ["polygon", "arbitrum", "base"],
  "riskLevel": "medium",
  "bridgeToEthereum": true
}`}
        </CodeBlock>

        <Tabs>
          <Tab title="Budget & Risk">
            <AccordionGroup>
              <Accordion title="COGNI Stake">
                Amount of COGNI tokens to stake for agent activation (1,000-10,000 recommended for first deployment)
              </Accordion>
              
              <Accordion title="Risk Level">
                <div className="space-y-2">
                  <div>• <strong>Conservative</strong>: Lower risk, slower returns</div>
                  <div>• <strong>Balanced</strong>: Medium risk for moderate gains</div>
                  <div>• <strong>Aggressive</strong>: Higher risk for maximum alpha</div>
                </div>
              </Accordion>
              
              <Accordion title="Position Sizing">
                Maximum percentage of budget per trade (default: 20%)
              </Accordion>
            </AccordionGroup>
          </Tab>
          
          <Tab title="Auto-Exit Rules">
            <AccordionGroup>
              <Accordion title="Take Profit">
                Automatically sell when profit reaches target (default: 100%)
              </Accordion>
              
              <Accordion title="Stop Loss">
                Exit position when loss reaches threshold (default: -30%)
              </Accordion>
              
              <Accordion title="Time Limits">
                Maximum time to hold a position (default: 30 minutes)
              </Accordion>
            </AccordionGroup>
          </Tab>
          
          <Tab title="Advanced Settings">
            <AccordionGroup>
              <Accordion title="MEV Protection">
                Enable Flashbots protection on Ethereum, fast execution on L2s (recommended: ON)
              </Accordion>
              
              <Accordion title="Slippage Tolerance">
                Maximum acceptable slippage for trades (default: 5%)
              </Accordion>
              
              <Accordion title="Priority Fees">
                Extra fees for faster transaction confirmation (default: AUTO)
              </Accordion>
            </AccordionGroup>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-light text-white">Step 4: Deploy Agent</h2>

        <Steps>
          <Step title="Review Configuration">
            Double-check your settings and budget allocation
          </Step>
          <Step title="Stake COGNI">
            Lock COGNI tokens to activate your agent across selected chains
          </Step>
          <Step title="Deploy">
            Click "Deploy Agent" and confirm the transaction
          </Step>
          <Step title="Activate">
            Your agent will begin monitoring for opportunities immediately
          </Step>
        </Steps>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-medium mb-4">Transaction Flow</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
              <div>
                <p className="text-white">User → Agent Factory</p>
                <p className="text-white/60 text-sm">Configure agent parameters</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
              <div>
                <p className="text-white">Generate Agent Wallets</p>
                <p className="text-white/60 text-sm">Create EVM addresses for each chain</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
              <div>
                <p className="text-white">Deploy Agent Program</p>
                <p className="text-white/60 text-sm">Create on-chain agent account</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">4</div>
              <div>
                <p className="text-white">Agent Active</p>
                <p className="text-white/60 text-sm">Begin autonomous trading</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-light text-white">Step 5: Monitor Performance</h2>
        <p className="text-white/80">
          Your agent is now active! Monitor its performance through the dashboard:
        </p>

        <Info>
          <strong>Live Dashboard Features:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Trade execution history</li>
            <li>• Current positions and PnL</li>
            <li>• Risk metrics and exposure</li>
            <li>• Agent decision logs</li>
            <li>• Performance analytics</li>
          </ul>
        </Info>

        <h3 className="text-xl font-medium text-white">Key Metrics to Watch</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-medium">Metric</th>
                <th className="text-left py-3 px-4 text-white font-medium">Description</th>
                <th className="text-left py-3 px-4 text-white font-medium">Good Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white font-mono">Success Rate</td>
                <td className="py-3 px-4 text-white/70">Percentage of profitable trades</td>
                <td className="py-3 px-4 text-green-400">&gt;70%</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white font-mono">Avg ROI</td>
                <td className="py-3 px-4 text-white/70">Average return on investment</td>
                <td className="py-3 px-4 text-green-400">&gt;50%</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white font-mono">Max Drawdown</td>
                <td className="py-3 px-4 text-white/70">Largest loss from peak</td>
                <td className="py-3 px-4 text-green-400">&lt;20%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-mono">Execution Speed</td>
                <td className="py-3 px-4 text-white/70">Time from signal to execution</td>
                <td className="py-3 px-4 text-green-400">&lt;400ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">What Happens Next?</h2>
        <p className="text-white/80">Your agent will now:</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <strong className="text-white">Monitor markets</strong>
                <p className="text-white/70 text-sm">24/7 scanning for opportunities matching its strategy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <strong className="text-white">Execute trades</strong>
                <p className="text-white/70 text-sm">Automatically when conditions are met</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <strong className="text-white">Learn from results</strong>
                <p className="text-white/70 text-sm">Improve future performance through experience</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <strong className="text-white">Report activity</strong>
                <p className="text-white/70 text-sm">Dashboard and notifications keep you informed</p>
              </div>
            </div>
          </div>
        </div>

        <Tip>
          <strong>Pro Tip:</strong> Start with a smaller stake (1,000-2,000 COGNI) to get familiar with how your agent behaves before scaling up.
        </Tip>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Next Steps</h2>

        <CardGroup cols={2}>
          <Card title="Dashboard Walkthrough" icon={<BarChart3 />} href="/docs/guides/dashboard">
            Learn to navigate and interpret your agent's performance
          </Card>
          
          <Card title="Risk Management" icon={<Shield />} href="/docs/guides/risk">
            Set up advanced safety controls and alerts
          </Card>
          
          <Card title="Agent Types" icon={<TrendingUp />} href="/docs/agents/types">
            Explore different agent specializations and strategies
          </Card>
          
          <Card title="SDK Development" icon={<Code />} href="/docs/sdk">
            Build custom agents with our Python/TypeScript SDK
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Troubleshooting</h2>

        <AccordionGroup>
          <Accordion title="Agent not deploying">
            <div className="space-y-3">
              <p><strong>Common causes:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• Insufficient COGNI for staking (minimum 1,000)</li>
                <li>• Wallet connection issues</li>
                <li>• Network congestion</li>
              </ul>
              <p><strong>Solution:</strong> Check wallet balance and try reconnecting</p>
            </div>
          </Accordion>
          
          <Accordion title="No trading activity">
            <div className="space-y-3">
              <p><strong>Possible reasons:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• Market conditions don't match strategy criteria</li>
                <li>• Risk parameters too conservative</li>
                <li>• Insufficient liquidity in target tokens</li>
              </ul>
              <p><strong>Solution:</strong> Review strategy settings or try different agent type</p>
            </div>
          </Accordion>
          
          <Accordion title="High losses">
            <div className="space-y-3">
              <p><strong>Safety measures:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• Activate stop-loss protection</li>
                <li>• Reduce position sizing</li>
                <li>• Switch to conservative risk mode</li>
              </ul>
              <p><strong>Remember:</strong> All trading involves risk. Never invest more than you can afford to lose.</p>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Need Help?</h3>
            <p className="text-white/70">Check our full troubleshooting guide or join the Discord community</p>
          </div>
          <a 
            href="/docs/support/troubleshooting"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Get Support
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}