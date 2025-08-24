'use client';

import React from 'react';
import { 
  Zap, 
  Network,
  Database,
  Shield,
  Clock,
  DollarSign,
  Code,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  GitBranch
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
} from '@/components/docs/DocComponents';

export default function SolanaIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">Solana Integration</h1>
        <p className="text-xl text-white/80">
          Deep technical integration with Solana blockchain enabling sub-400ms trade execution 
          and advanced on-chain capabilities.
        </p>
      </div>

      <Info>
        c0gni leverages Solana's high-performance architecture to deliver institutional-grade 
        trading speeds with decentralized security and transparency.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Why Solana?</h2>
        
        <CardGroup cols={2}>
          <Card title="Ultra-Low Latency" icon={Zap}>
            <div className="space-y-2">
              <p>~400ms block times enable near-instant trade execution</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Single-slot finality</div>
                <div>• No mempool delays</div>
                <div>• Predictable confirmation times</div>
              </div>
            </div>
          </Card>
          
          <Card title="Minimal Costs" icon={DollarSign}>
            <div className="space-y-2">
              <p>Transaction fees typically under $0.01 per trade</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• No gas price volatility</div>
                <div>• Predictable fee structure</div>
                <div>• Profitable micro-strategies</div>
              </div>
            </div>
          </Card>
          
          <Card title="Massive Throughput" icon={Network}>
            <div className="space-y-2">
              <p>65,000+ theoretical TPS supports high-frequency trading</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Parallel transaction processing</div>
                <div>• Scalable architecture</div>
                <div>• No network congestion</div>
              </div>
            </div>
          </Card>
          
          <Card title="Rich DeFi Ecosystem" icon={Database}>
            <div className="space-y-2">
              <p>Extensive DEXs and protocols for diverse strategies</p>
              <div className="text-sm text-white/60 mt-3 space-y-1">
                <div>• Jupiter aggregation</div>
                <div>• Multiple AMMs</div>
                <div>• Advanced DeFi primitives</div>
              </div>
            </div>
          </Card>
        </CardGroup>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Technical Architecture</h2>
        
        <Tabs>
          <Tab title="Network Layer">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                c0gni maintains optimized connections to Solana's network infrastructure:
              </p>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">RPC Infrastructure</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-white font-medium text-sm">Primary Connections</div>
                      <div className="text-sm text-white/70 space-y-1">
                        <div>• Dedicated validator nodes</div>
                        <div>• Geographic distribution (US, EU, APAC)</div>
                        <div>• Sub-10ms latency to major exchanges</div>
                        <div>• 99.99% uptime SLA</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-white font-medium text-sm">Fallback Systems</div>
                      <div className="text-sm text-white/70 space-y-1">
                        <div>• Multiple RPC endpoint providers</div>
                        <div>• Automatic failover (&lt;100ms)</div>
                        <div>• Load balancing and health checks</div>
                        <div>• Emergency degraded mode</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Frame>
              
              <CodeBlock language="typescript">
{`// RPC Connection Manager
class SolanaConnectionManager {
  private primaryRPC: Connection;
  private fallbackRPCs: Connection[];
  private currentLatency: number;
  
  constructor() {
    this.primaryRPC = new Connection(
      process.env.SOLANA_PRIMARY_RPC,
      {
        commitment: 'processed',
        confirmTransactionInitialTimeout: 30000,
        wsEndpoint: process.env.SOLANA_WS_ENDPOINT
      }
    );
    
    this.fallbackRPCs = [
      new Connection(process.env.SOLANA_FALLBACK_1),
      new Connection(process.env.SOLANA_FALLBACK_2),
    ];
    
    this.monitorConnections();
  }
  
  async sendTransaction(transaction: Transaction): Promise<string> {
    const startTime = Date.now();
    
    try {
      const signature = await this.primaryRPC.sendTransaction(transaction, {
        skipPreflight: true,
        maxRetries: 3
      });
      
      this.updateLatencyMetrics(Date.now() - startTime);
      return signature;
    } catch (error) {
      return await this.fallbackSend(transaction);
    }
  }
  
  private async monitorConnections() {
    setInterval(async () => {
      const health = await this.primaryRPC.getHealth();
      if (health !== 'ok') {
        await this.switchToFallback();
      }
    }, 5000);
  }
}`}
              </CodeBlock>
            </div>
          </Tab>
          
          <Tab title="Transaction Optimization">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Advanced transaction optimization techniques for maximum speed:
              </p>
              
              <AccordionGroup>
                <Accordion title="Priority Fee Management">
                  <div className="space-y-3">
                    <p>Dynamic priority fee calculation for optimal transaction ordering:</p>
                    <CodeBlock language="typescript">
{`class PriorityFeeManager {
  async calculateOptimalFee(urgency: 'low' | 'medium' | 'high'): Promise<number> {
    // Get recent fee statistics
    const recentFees = await this.getRecentPriorityFees();
    const networkCongestion = await this.getNetworkCongestion();
    
    const baseFee = {
      low: 0.0001,
      medium: 0.001, 
      high: 0.01
    }[urgency];
    
    // Adjust based on network conditions
    const congestionMultiplier = Math.max(1, networkCongestion / 50);
    return baseFee * congestionMultiplier;
  }
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="Transaction Batching">
                  <div className="space-y-3">
                    <p>Efficient batching of multiple operations:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• Combine multiple DEX interactions</li>
                      <li>• Atomic swap sequences</li>
                      <li>• Reduced total transaction count</li>
                      <li>• Lower cumulative fees</li>
                    </ul>
                  </div>
                </Accordion>
                
                <Accordion title="Compute Unit Optimization">
                  <div className="space-y-3">
                    <p>Precise compute budget allocation:</p>
                    <ul className="space-y-1 text-white/70">
                      <li>• Pre-calculate exact compute requirements</li>
                      <li>• Avoid over-provisioning penalties</li>
                      <li>• Program-specific optimizations</li>
                      <li>• Simulation-based estimation</li>
                    </ul>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Program Interactions">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Direct integration with major Solana DeFi programs:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="DEX Integrations" icon={Network}>
                  <div className="space-y-2">
                    <div className="text-sm text-white/60 space-y-1">
                      <div>• <strong>Jupiter:</strong> Aggregated routing</div>
                      <div>• <strong>Raydium:</strong> AMM pools</div>
                      <div>• <strong>Orca:</strong> Concentrated liquidity</div>
                      <div>• <strong>Phoenix:</strong> Central limit order book</div>
                      <div>• <strong>OpenBook:</strong> Serum v4</div>
                    </div>
                  </div>
                </Card>
                
                <Card title="Protocol Support" icon={Code}>
                  <div className="space-y-2">
                    <div className="text-sm text-white/60 space-y-1">
                      <div>• <strong>Token Program:</strong> SPL token transfers</div>
                      <div>• <strong>Associated Token:</strong> Account management</div>
                      <div>• <strong>Metaplex:</strong> NFT interactions</div>
                      <div>• <strong>Wormhole:</strong> Cross-chain bridging</div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <CodeBlock language="typescript">
{`// Jupiter Integration Example
class JupiterSwapHandler {
  async executeSwap(params: SwapParams): Promise<string> {
    // Get best route from Jupiter
    const routes = await this.jupiterApi.computeRoutes({
      inputMint: params.inputToken,
      outputMint: params.outputToken,
      amount: params.amount,
      slippageBps: params.slippage * 100
    });
    
    const bestRoute = routes.routesInfos[0];
    
    // Build transaction
    const transaction = await this.jupiterApi.exchange({
      route: bestRoute,
      userPublicKey: this.wallet.publicKey
    });
    
    // Add priority fee and execute
    const priorityFee = await this.feeManager.calculateOptimalFee('high');
    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee * 1_000_000
      })
    );
    
    return await this.connection.sendTransaction(transaction, [this.wallet]);
  }
}`}
              </CodeBlock>
            </div>
          </Tab>
          
          <Tab title="Data Streaming">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Real-time data streaming for immediate market response:
              </p>
              
              <Frame>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">WebSocket Subscriptions</h4>
                  <div className="text-sm text-white/70 space-y-2">
                    <div>• <strong>Account Changes:</strong> Token balance updates</div>
                    <div>• <strong>Program Logs:</strong> DEX transaction monitoring</div>
                    <div>• <strong>Signature Status:</strong> Transaction confirmations</div>
                    <div>• <strong>Slot Updates:</strong> Block progression tracking</div>
                  </div>
                </div>
              </Frame>
              
              <CodeBlock language="typescript">
{`class MarketDataStreamer {
  private wsConnection: WebSocket;
  private subscriptions: Map<string, number> = new Map();
  
  constructor(endpoint: string) {
    this.wsConnection = new WebSocket(endpoint);
    this.setupEventHandlers();
  }
  
  subscribeToAccount(publicKey: string, callback: (data: any) => void) {
    const subscription = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'accountSubscribe',
      params: [
        publicKey,
        { commitment: 'processed', encoding: 'base64' }
      ]
    };
    
    this.wsConnection.send(JSON.stringify(subscription));
    this.subscriptions.set(publicKey, subscription.id);
    
    // Register callback for this subscription
    this.callbacks.set(subscription.id, callback);
  }
  
  private setupEventHandlers() {
    this.wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.method === 'accountNotification') {
        const callback = this.callbacks.get(data.params.subscription);
        if (callback) {
          callback(data.params.result);
        }
      }
    };
  }
}`}
              </CodeBlock>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Performance Metrics</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card title="Network Latency" icon={Clock}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">8.7ms</div>
              <p className="text-sm text-white/60">Average RPC response time</p>
            </div>
          </Card>
          
          <Card title="Transaction Success" icon={CheckCircle}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">99.4%</div>
              <p className="text-sm text-white/60">First-attempt success rate</p>
            </div>
          </Card>
          
          <Card title="Confirmation Time" icon={Zap}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">387ms</div>
              <p className="text-sm text-white/60">Average confirmation</p>
            </div>
          </Card>
          
          <Card title="Fee Efficiency" icon={DollarSign}>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-400">$0.008</div>
              <p className="text-sm text-white/60">Average transaction cost</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Network Resilience</h2>
        
        <AccordionGroup>
          <Accordion title="Outage Handling" icon={Shield}>
            <div className="space-y-3">
              <p>Comprehensive strategies for network disruptions:</p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Automatic Detection:</strong> Real-time network health monitoring</li>
                <li><strong>Graceful Degradation:</strong> Reduced functionality vs complete shutdown</li>
                <li><strong>Position Protection:</strong> Emergency stop-loss execution</li>
                <li><strong>Fast Recovery:</strong> Automatic resume when network stabilizes</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Fork Handling" icon={GitBranch}>
            <div className="space-y-3">
              <p>Protection against chain reorganizations:</p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Confirmation Depth:</strong> Wait for sufficient confirmations</li>
                <li><strong>Fork Detection:</strong> Monitor for competing blocks</li>
                <li><strong>Transaction Replay:</strong> Automatic retry on valid forks</li>
                <li><strong>State Reconciliation:</strong> Verify final transaction state</li>
              </ul>
            </div>
          </Accordion>
          
          <Accordion title="Emergency Procedures" icon={AlertTriangle}>
            <div className="space-y-3">
              <p>Critical situation response protocols:</p>
              <ul className="space-y-2 text-white/70">
                <li><strong>Circuit Breakers:</strong> Automatic trading halts</li>
                <li><strong>Manual Overrides:</strong> Emergency human intervention</li>
                <li><strong>Asset Recovery:</strong> Fund extraction procedures</li>
                <li><strong>Incident Response:</strong> Coordinated recovery efforts</li>
              </ul>
            </div>
          </Accordion>
        </AccordionGroup>
      </div>

      <Warning>
        <strong>Network Dependencies:</strong> While Solana provides exceptional performance, 
        all blockchain networks can experience outages. c0gni implements comprehensive 
        contingency measures to protect user funds during network issues.
      </Warning>

      <Tip>
        <strong>Optimization Tip:</strong> Agents automatically adjust their behavior based on 
        network conditions. During high congestion, they may use higher priority fees or 
        temporarily reduce trading frequency to maintain profitability.
      </Tip>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-2">Learn More About c0gni Architecture</h3>
            <p className="text-white/70">Dive deeper into our technical implementation</p>
          </div>
          <a 
            href="/docs/architecture"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            System Architecture
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}