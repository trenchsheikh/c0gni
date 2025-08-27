import React from 'react';
import { 
  HelpCircle, 
  DollarSign,
  Shield,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  ArrowRight
} from 'lucide-react';
import { 
  Card, 
  CardGroup,
  Info, 
  Warning,
  AccordionGroup,
  Accordion,
  Tip
} from '@/components/docs';

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Frequently Asked Questions</h1>
        <p className="text-xl text-white/80">
          Common questions about c0gni agents, platform features, and trading strategies. 
          Find quick answers to get started faster.
        </p>
      </div>

      <Info>
        Can't find what you're looking for? Join our <a href="/docs/support/community" className="text-blue-400 hover:text-blue-300 underline">Discord community</a> or 
        check the <a href="/docs/support/troubleshooting" className="text-blue-400 hover:text-blue-300 underline">troubleshooting guide</a>.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Getting Started</h2>
        
        <AccordionGroup>
          <Accordion title="What is c0gni and how is it different from trading bots?">
            <div className="space-y-3">
              <p>c0gni creates autonomous trading agents, not traditional bots. Key differences:</p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Autonomous Decision-Making:</strong> Agents think and adapt, bots follow scripts</li>
                <li><strong>Persistent Memory:</strong> Agents learn from every trade and store knowledge on-chain</li>
                <li><strong>Swarm Intelligence:</strong> Multiple agents coordinate for better performance</li>
                <li><strong>Sub-400ms Execution:</strong> Faster than human reaction time</li>
                <li><strong>Continuous Evolution:</strong> Strategies improve over time automatically</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="How much money do I need to start?">
            <div className="space-y-3">
              <p>Minimum requirements vary by agent type:</p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Scout Agent:</strong> 0.02 ETH (monitoring only, no trading)</li>
                <li><strong>Cross-Chain Arbitrage:</strong> 0.1 ETH minimum, 0.5-1 ETH recommended</li>
                <li><strong>Multi-Chain Sniper:</strong> 0.2 ETH minimum, 1-2 ETH recommended</li>
                <li><strong>DeFi Yield Farmer:</strong> 1 ETH minimum, 5+ ETH for optimal performance</li>
              </ul>
              <p className="mt-3"><strong>Pro Tip:</strong> Start small to understand agent behavior before scaling up.</p>
            </div>
          </Accordion>
          
          <Accordion title="Is my money safe? What are the risks?">
            <div className="space-y-3">
              <p><strong>Security Measures:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• Non-custodial: You maintain full control of your funds</li>
                <li>• Agent wallets are separate from your main wallet</li>
                <li>• Built-in stop-loss and risk management</li>
                <li>• Emergency stop functionality</li>
                <li>• Regular security audits</li>
              </ul>
              <p className="mt-3"><strong>Risks to Consider:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• All trading involves risk of loss</li>
                <li>• Market volatility can cause significant losses</li>
                <li>• Agent malfunction or network issues</li>
                <li>• Impermanent loss for LP strategies</li>
              </ul>
              <p className="mt-3 text-yellow-400"><strong>Never invest more than you can afford to lose.</strong></p>
            </div>
          </Accordion>
          
          <Accordion title="Do I need coding experience to use c0gni?">
            <div className="space-y-3">
              <p><strong>No coding required</strong> for basic usage:</p>
              <ul className="space-y-1 text-white/70">
                <li>• <strong>Agent Factory:</strong> Deploy agents using pre-built templates</li>
                <li>• <strong>Simple Configuration:</strong> Set parameters through web interface</li>
                <li>• <strong>One-Click Deployment:</strong> Launch agents in under 60 seconds</li>
              </ul>
              <p className="mt-3"><strong>Coding enables advanced features:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• <strong>Agent Studio:</strong> Build custom strategies</li>
                <li>• <strong>Python/TypeScript SDKs:</strong> Full programmatic control</li>
                <li>• <strong>Machine Learning:</strong> Integrate ML models</li>
                <li>• <strong>Complex Logic:</strong> Multi-factor decision making</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Agent Performance</h2>
        
        <AccordionGroup>
          <Accordion title="What kind of returns can I expect?">
            <div className="space-y-3">
              <p><strong>Performance varies by strategy and market conditions:</strong></p>
              <div className="grid md:grid-cols-2 gap-4 my-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Conservative Strategies</h4>
                  <div className="text-sm text-white/70">
                    <div>• Arbitrage: 5-15% monthly</div>
                    <div>• LP Optimization: 10-20% APY</div>
                    <div>• Lower risk, steady returns</div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Aggressive Strategies</h4>
                  <div className="text-sm text-white/70">
                    <div>• Sniper: 20-100% monthly*</div>
                    <div>• Custom swarms: Variable</div>
                    <div>• Higher risk, higher potential</div>
                  </div>
                </div>
              </div>
              <p className="text-yellow-400 text-sm">*Past performance doesn't guarantee future results. Crypto markets are highly volatile.</p>
            </div>
          </Accordion>
          
          <Accordion title="How fast do agents execute trades?">
            <div className="space-y-3">
              <p><strong>c0gni agents are optimized for speed:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Signal Detection:</strong> 50-200ms average</li>
                <li><strong>Decision Making:</strong> 100-300ms</li>
                <li><strong>Order Execution:</strong> 200-500ms</li>
                <li><strong>Total Time:</strong> &lt;400ms on average</li>
              </ul>
              <p className="mt-3">This is faster than human reaction time (~1-2 seconds) and competitive with professional trading systems.</p>
            </div>
          </Accordion>
          
          <Accordion title="Why is my agent not trading?">
            <div className="space-y-3">
              <p><strong>Common reasons for no trading activity:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Market Conditions:</strong> No opportunities meet strategy criteria</li>
                <li><strong>Risk Parameters:</strong> Settings too conservative for current volatility</li>
                <li><strong>Insufficient Capital:</strong> Balance too low for minimum position sizes</li>
                <li><strong>Agent Paused:</strong> Check if agent is in active state</li>
                <li><strong>Network Issues:</strong> Connectivity problems preventing execution</li>
              </ul>
              <p className="mt-3"><strong>Solutions:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• Review and adjust risk parameters</li>
                <li>• Add more capital to agent wallet</li>
                <li>• Try different agent type for current market</li>
                <li>• Check agent logs for error messages</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Can I pause or stop my agent anytime?">
            <div className="space-y-3">
              <p><strong>Yes, you have full control:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Pause:</strong> Temporarily halt trading (keeps positions open)</li>
                <li><strong>Stop:</strong> Close all positions and halt trading</li>
                <li><strong>Emergency Stop:</strong> Immediate liquidation of all positions</li>
                <li><strong>Withdraw:</strong> Remove funds from agent wallet</li>
              </ul>
              <p className="mt-3">Controls are available 24/7 through the dashboard or mobile app.</p>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Technical Questions</h2>
        
        <AccordionGroup>
          <Accordion title="What blockchain does c0gni use?">
            <div className="space-y-3">
              <p><strong>c0gni operates across multiple EVM chains</strong> for maximum opportunities:</p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Ethereum:</strong> Main base for wealth building and high-value trades</li>
                <li><strong>Layer 2s:</strong> Polygon, Arbitrum, Base for low-cost execution</li>
                <li><strong>Cross-Chain:</strong> BSC for additional market opportunities</li>
                <li><strong>Bridge Optimization:</strong> Automatic profit routing between chains</li>
                <li><strong>Collective Memory:</strong> Shared intelligence across all EVM chains</li>
              </ul>
              <p className="mt-3"><strong>Multi-chain execution</strong> enables agents to find opportunities anywhere while building wealth on Ethereum.</p>
            </div>
          </Accordion>
          
          <Accordion title="How does MEV protection work?">
            <div className="space-y-3">
              <p><strong>c0gni protects against MEV (Maximum Extractable Value) attacks:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Flashbots Bundles:</strong> Private mempool routing prevents front-running</li>
                <li><strong>Anti-Sandwich:</strong> Detection and avoidance of sandwich attacks</li>
                <li><strong>Priority Fees:</strong> Dynamic fee adjustment for transaction ordering</li>
                <li><strong>Swarm Coordination:</strong> Multiple agents working together can detect manipulation</li>
              </ul>
              <p className="mt-3">MEV protection is enabled by default for all agent types.</p>
            </div>
          </Accordion>
          
          <Accordion title="What happens if a blockchain network goes down?">
            <div className="space-y-3">
              <p><strong>Multi-chain redundancy and failover measures:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Chain Switching:</strong> Agents automatically switch to available chains</li>
                <li><strong>Position Monitoring:</strong> Existing positions tracked across all chains</li>
                <li><strong>Cross-Chain Recovery:</strong> Resume trading on functioning networks</li>
                <li><strong>Multiple RPCs:</strong> Redundant endpoints for each supported chain</li>
                <li><strong>Emergency Controls:</strong> Multi-chain override capabilities</li>
              </ul>
              <p className="mt-3">Multi-chain architecture provides inherent redundancy - if one chain has issues, agents continue on others.</p>
            </div>
          </Accordion>
          
          <Accordion title="How do I upgrade my agents?">
            <div className="space-y-3">
              <p><strong>Agent updates happen automatically:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Strategy Updates:</strong> Performance improvements deployed seamlessly</li>
                <li><strong>Security Patches:</strong> Critical updates applied immediately</li>
                <li><strong>Feature Rollouts:</strong> New capabilities enabled gradually</li>
                <li><strong>Backward Compatibility:</strong> Existing configurations preserved</li>
              </ul>
              <p className="mt-3"><strong>Manual updates for custom agents:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• Deploy new version through Agent Studio</li>
                <li>• Test in paper trading mode first</li>
                <li>• Migrate live agent when ready</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Billing & Tokens</h2>
        
        <AccordionGroup>
          <Accordion title="How much does c0gni cost?">
            <div className="space-y-3">
              <p><strong>c0gni uses a token-based pricing model:</strong></p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 my-4">
                <h4 className="text-white font-medium mb-2">Agent Deployment Costs</h4>
                <div className="text-sm text-white/70">
                  <div>• Basic Agent Factory: 10 CGNI tokens</div>
                  <div>• Advanced Agents: 25 CGNI tokens</div>
                  <div>• Custom Swarms: 50 CGNI tokens</div>
                  <div>• Enterprise Features: Contact us</div>
                </div>
              </div>
              <p><strong>Additional costs:</strong></p>
              <ul className="space-y-1 text-white/70">
                <li>• Trading fees: 0.15% per trade (vs 0.3% paying with ETH)</li>
                <li>• Network fees: Variable by chain (L2s much cheaper)</li>
                <li>• No monthly subscriptions or hidden fees</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="How do I get CGNI tokens?">
            <div className="space-y-3">
              <p><strong>Multiple ways to acquire CGNI tokens:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>DEX Trading:</strong> Buy on Uniswap, SushiSwap, or Balancer</li>
                <li><strong>CEX Trading:</strong> Available on major centralized exchanges</li>
                <li><strong>Agent Earnings:</strong> Earn rewards from successful trading</li>
                <li><strong>Staking Rewards:</strong> Stake tokens for yield</li>
                <li><strong>Liquidity Provision:</strong> Provide liquidity and earn fees</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Can I get refunds if my agent loses money?">
            <div className="space-y-3">
              <p><strong>Refund Policy:</strong></p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Deployment Fees:</strong> Non-refundable after agent is deployed</li>
                <li><strong>Trading Losses:</strong> Cannot be refunded (inherent market risk)</li>
                <li><strong>Technical Issues:</strong> Refunds considered case-by-case</li>
                <li><strong>Platform Bugs:</strong> Full refunds for verified platform errors</li>
              </ul>
              <p className="mt-3 text-yellow-400"><strong>Important:</strong> Only invest capital you can afford to lose. Trading is inherently risky.</p>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Still Have Questions?</h2>
        
        <CardGroup cols={2}>
          <Card title="Join Discord Community" icon={<Users />}>
            <div className="space-y-2">
              <p>Connect with other traders and get real-time help</p>
              <div className="text-sm text-white/60 mt-3">
                Active community of 15,000+ members ready to help
              </div>
            </div>
          </Card>
          
          <Card title="Read Troubleshooting Guide" icon={<Settings />}>
            <div className="space-y-2">
              <p>Step-by-step solutions for common issues</p>
              <div className="text-sm text-white/60 mt-3">
                Detailed guides for setup, configuration, and debugging
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <Warning>
        <strong>Risk Disclaimer:</strong> Trading cryptocurrencies involves substantial risk of loss and 
        is not suitable for all investors. Past performance does not guarantee future results.
      </Warning>

      <Tip>
        <strong>Getting Started:</strong> New to autonomous trading? Start with our 
        <a href="/docs/quickstart" className="text-blue-400 hover:text-blue-300 underline"> quickstart guide</a> and 
        try paper trading first to understand how agents work.
      </Tip>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Join Discord Community</h3>
              <p className="text-white/70">Get help from experienced traders</p>
            </div>
            <a 
              href="https://discord.gg/cognilabs"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Contact Support</h3>
              <p className="text-white/70">Direct help for complex issues</p>
            </div>
            <a 
              href="mailto:support@cognilabs.com"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Email Support
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}