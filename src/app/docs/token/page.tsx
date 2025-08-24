import React from 'react';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Zap,
  Award,
  Shield,
  PieChart,
  DollarSign,
  ArrowRight,
  Lock,
  Unlock
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

export default function TokenPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">$CGNI Token</h1>
        <p className="text-xl text-white/80">
          The native token powering the c0gni agent ecosystem. More than a currency - it's your stake in the future of autonomous trading.
        </p>
      </div>

      <CardGroup cols={3}>
        <Card title="Utility Token" icon={<Zap />}>
          Powers agent deployment, trading fees, and platform governance
        </Card>
        <Card title="Staking Rewards" icon={<TrendingUp />}>
          Earn yields by staking tokens to secure the network
        </Card>
        <Card title="Governance Rights" icon={<Users />}>
          Vote on protocol upgrades and feature development
        </Card>
      </CardGroup>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Token Economics</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl text-white font-medium">Supply Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Total Supply</span>
                <span className="text-white font-mono">1,000,000,000 CGNI</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Circulating Supply</span>
                <span className="text-white font-mono">350,000,000 CGNI</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Market Cap</span>
                <span className="text-white font-mono">$42.5M</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">Current Price</span>
                <span className="text-white font-mono">$0.121</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Token Allocation</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Public Sale (35%)</span>
                  <span className="text-white">350M CGNI</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Team & Advisors (20%)</span>
                  <span className="text-white">200M CGNI</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Ecosystem Fund (25%)</span>
                  <span className="text-white">250M CGNI</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Staking Rewards (20%)</span>
                  <span className="text-white">200M CGNI</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Token Utility</h2>
        
        <Tabs>
          <Tab title="Agent Operations">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                $CGNI is required for all core agent operations on the platform:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="Agent Deployment" icon={<Zap />}>
                  <div className="space-y-2">
                    <p>Deploy new agents with CGNI tokens</p>
                    <div className="text-sm text-white/60">
                      • Sniper Agent: 10 CGNI
                    </div>
                    <div className="text-sm text-white/60">
                      • Arbitrage Engine: 25 CGNI
                    </div>
                    <div className="text-sm text-white/60">
                      • Custom Agent: 50 CGNI
                    </div>
                  </div>
                </Card>
                
                <Card title="Trading Fees" icon={<DollarSign />}>
                  <div className="space-y-2">
                    <p>Reduced fees when paying with CGNI</p>
                    <div className="text-sm text-white/60">
                      • Standard: 0.3% per trade
                    </div>
                    <div className="text-sm text-white/60">
                      • CGNI Payment: 0.15% per trade
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Tab>
          
          <Tab title="Staking">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Stake $CGNI to earn rewards and participate in network security:
              </p>
              
              <AccordionGroup>
                <Accordion title="Staking Tiers">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <strong>Bronze Tier</strong>
                        <span className="text-green-400">8% APY</span>
                      </div>
                      <p className="text-sm text-white/60">Minimum stake: 1,000 CGNI</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <strong>Silver Tier</strong>
                        <span className="text-green-400">12% APY</span>
                      </div>
                      <p className="text-sm text-white/60">Minimum stake: 10,000 CGNI</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <strong>Gold Tier</strong>
                        <span className="text-green-400">18% APY</span>
                      </div>
                      <p className="text-sm text-white/60">Minimum stake: 100,000 CGNI</p>
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Validator Rewards">
                  Stake CGNI to run validator nodes and earn additional rewards from network fees and MEV protection services.
                </Accordion>
                
                <Accordion title="Lock-up Periods">
                  <div className="space-y-2">
                    <div>• <strong>Flexible:</strong> No lock-up, 6% APY</div>
                    <div>• <strong>30 days:</strong> 8% APY bonus</div>
                    <div>• <strong>90 days:</strong> 12% APY bonus</div>
                    <div>• <strong>180 days:</strong> 18% APY bonus</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Governance">
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                $CGNI holders participate in protocol governance through on-chain voting:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-white">Protocol Upgrades</strong>
                    <p className="text-white/70 text-sm">Vote on new features and system improvements</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-white">Fee Structure</strong>
                    <p className="text-white/70 text-sm">Adjust trading fees and revenue distribution</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-white">Treasury Management</strong>
                    <p className="text-white/70 text-sm">Allocate ecosystem funds for development and partnerships</p>
                  </div>
                </div>
              </div>
              
              <Info>
                <strong>Voting Power:</strong> 1 CGNI = 1 vote. Minimum holding period of 7 days required to participate in governance.
              </Info>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Token Vesting</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-medium">Allocation</th>
                <th className="text-left py-3 px-4 text-white font-medium">Percentage</th>
                <th className="text-left py-3 px-4 text-white font-medium">Vesting Period</th>
                <th className="text-left py-3 px-4 text-white font-medium">Cliff</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white">Public Sale</td>
                <td className="py-3 px-4 text-white/70">35%</td>
                <td className="py-3 px-4 text-green-400">Immediate</td>
                <td className="py-3 px-4 text-white/70">None</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white">Team & Advisors</td>
                <td className="py-3 px-4 text-white/70">20%</td>
                <td className="py-3 px-4 text-yellow-400">36 months linear</td>
                <td className="py-3 px-4 text-white/70">12 months</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-white">Ecosystem Fund</td>
                <td className="py-3 px-4 text-white/70">25%</td>
                <td className="py-3 px-4 text-blue-400">48 months linear</td>
                <td className="py-3 px-4 text-white/70">6 months</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white">Staking Rewards</td>
                <td className="py-3 px-4 text-white/70">20%</td>
                <td className="py-3 px-4 text-purple-400">60 months linear</td>
                <td className="py-3 px-4 text-white/70">None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">How to Acquire CGNI</h2>
        
        <Steps>
          <Step title="CEX Trading">
            Available on major centralized exchanges including Binance, Coinbase, and Kraken
          </Step>
          <Step title="DEX Trading">
            Trade directly on Solana DEXs like Jupiter, Raydium, and Orca
          </Step>
          <Step title="Agent Earnings">
            Earn CGNI rewards from successful agent trading performance
          </Step>
          <Step title="Liquidity Provision">
            Provide liquidity to CGNI trading pairs and earn LP rewards
          </Step>
        </Steps>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Token Contract</h2>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Contract Address</span>
              <span className="text-white font-mono text-sm">7xKvzVZ8qZQKVB3rHjGGvH3MrE9P2QnF1RLvKwJ8TP3K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Decimals</span>
              <span className="text-white font-mono">9</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Network</span>
              <span className="text-white">Solana</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Token Standard</span>
              <span className="text-white">SPL Token</span>
            </div>
          </div>
        </div>
        
        <Warning>
          Always verify the contract address before trading. Be cautious of fake tokens with similar names.
        </Warning>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Roadmap</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <strong className="text-white">Q1 2024 - Token Launch</strong>
              <p className="text-white/70 text-sm">Public sale, DEX listings, staking launch</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <strong className="text-white">Q2 2024 - Governance</strong>
              <p className="text-white/70 text-sm">On-chain voting, protocol upgrades</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div>
              <strong className="text-white">Q3 2024 - Cross-Chain</strong>
              <p className="text-white/70 text-sm">Ethereum and BSC bridge integration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-white/40 rounded-full"></div>
            <div>
              <strong className="text-white">Q4 2024 - DeFi Integration</strong>
              <p className="text-white/70 text-sm">Lending/borrowing, yield farming</p>
            </div>
          </div>
        </div>
      </div>

      <Tip>
        Ready to start earning with CGNI? <a href="/docs/quickstart" className="text-blue-400 hover:text-blue-300 underline">Deploy your first agent</a> or learn about <a href="/docs/platform/terminal" className="text-blue-400 hover:text-blue-300 underline">staking rewards</a>.
      </Tip>
    </div>
  );
}