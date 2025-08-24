'use client';

import React from 'react';
import { 
  Code, 
  Key,
  Database,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Book
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
  Tip
} from '@/components/docs/DocComponents';

export default function APIReferencePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white">API Reference</h1>
        <p className="text-xl text-white/80">
          Complete REST and WebSocket API documentation for programmatic access to c0gni platform features.
        </p>
      </div>

      <Info>
        The c0gni API enables developers to build custom applications, integrate with existing systems, 
        and access real-time agent data programmatically.
      </Info>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Authentication</h2>
        
        <Tabs>
          <Tab title="API Keys">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                API access requires authentication using API keys obtained from your account dashboard.
              </p>
              
              <CodeBlock language="bash">
{`# Authentication via header
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.cognilabs.com/v1/agents`}
              </CodeBlock>
              
              <AccordionGroup>
                <Accordion title="Obtaining API Keys">
                  <div className="space-y-3">
                    <p>Get your API keys from the developer dashboard:</p>
                    <ol className="list-decimal list-inside space-y-1 text-white/70">
                      <li>Navigate to Settings → API Keys</li>
                      <li>Click "Generate New Key"</li>
                      <li>Select appropriate permissions</li>
                      <li>Copy and secure your key immediately</li>
                    </ol>
                  </div>
                </Accordion>
                
                <Accordion title="Key Permissions">
                  <div className="space-y-2">
                    <div>• <strong>read:</strong> Access agent data and performance metrics</div>
                    <div>• <strong>write:</strong> Create and modify agents</div>
                    <div>• <strong>trade:</strong> Execute trades and manage positions</div>
                    <div>• <strong>admin:</strong> Full account access</div>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Rate Limits">
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                API rate limits vary by endpoint and subscription tier:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white font-medium">Endpoint Category</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Rate Limit</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Burst Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">Agent Management</td>
                      <td className="py-3 px-4 text-white/70">100/hour</td>
                      <td className="py-3 px-4 text-green-400">20/minute</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">Market Data</td>
                      <td className="py-3 px-4 text-white/70">1000/hour</td>
                      <td className="py-3 px-4 text-green-400">100/minute</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">Trading Operations</td>
                      <td className="py-3 px-4 text-white/70">500/hour</td>
                      <td className="py-3 px-4 text-yellow-400">50/minute</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white">Analytics</td>
                      <td className="py-3 px-4 text-white/70">200/hour</td>
                      <td className="py-3 px-4 text-white/60">30/minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Core Endpoints</h2>
        
        <Tabs>
          <Tab title="Agents">
            <div className="space-y-6">
              <h3 className="text-xl text-white font-medium">Agent Management</h3>
              
              <AccordionGroup>
                <Accordion title="GET /v1/agents">
                  <div className="space-y-4">
                    <p>Retrieve all agents for the authenticated user.</p>
                    
                    <CodeBlock language="bash">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.cognilabs.com/v1/agents`}
                    </CodeBlock>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Response</h4>
                      <CodeBlock language="json">
{`{
  "success": true,
  "data": [
    {
      "id": "agent_001",
      "name": "My Sniper Agent",
      "type": "sniper",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "balance": {
        "current": 4.23,
        "initial": 5.0,
        "currency": "SOL"
      },
      "performance": {
        "total_return": 0.157,
        "win_rate": 0.743,
        "total_trades": 47
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1
  }
}`}
                      </CodeBlock>
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="POST /v1/agents">
                  <div className="space-y-4">
                    <p>Create a new agent with specified configuration.</p>
                    
                    <CodeBlock language="bash">
{`curl -X POST \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{
       "name": "My Arbitrage Agent",
       "type": "arbitrage",
       "config": {
         "budget": 10.0,
         "risk_level": "medium",
         "min_profit_threshold": 0.005
       }
     }' \\
     https://api.cognilabs.com/v1/agents`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="PUT /v1/agents/{id}">
                  <div className="space-y-4">
                    <p>Update agent configuration or status.</p>
                    
                    <CodeBlock language="bash">
{`curl -X PUT \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{
       "status": "paused",
       "config": {
         "risk_level": "low"
       }
     }' \\
     https://api.cognilabs.com/v1/agents/agent_001`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="DELETE /v1/agents/{id}">
                  <div className="space-y-4">
                    <p>Stop and remove an agent (closes positions first).</p>
                    
                    <CodeBlock language="bash">
{`curl -X DELETE \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.cognilabs.com/v1/agents/agent_001`}
                    </CodeBlock>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Trading">
            <div className="space-y-6">
              <h3 className="text-xl text-white font-medium">Trading Operations</h3>
              
              <AccordionGroup>
                <Accordion title="GET /v1/agents/{id}/trades">
                  <div className="space-y-4">
                    <p>Retrieve trade history for a specific agent.</p>
                    
                    <CodeBlock language="json">
{`{
  "success": true,
  "data": [
    {
      "id": "trade_12345",
      "agent_id": "agent_001", 
      "timestamp": "2024-01-15T14:23:10Z",
      "side": "buy",
      "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": 1000.0,
      "price": 0.998,
      "fees": 0.15,
      "signature": "5KHvzp...",
      "status": "completed",
      "pnl": 23.45
    }
  ]
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="GET /v1/agents/{id}/positions">
                  <div className="space-y-4">
                    <p>Get current open positions for an agent.</p>
                    
                    <CodeBlock language="json">
{`{
  "success": true,
  "data": [
    {
      "token": "So11111111111111111111111111111111111111112",
      "symbol": "SOL",
      "amount": 2.5,
      "entry_price": 98.50,
      "current_price": 102.30,
      "unrealized_pnl": 9.5,
      "opened_at": "2024-01-15T12:00:00Z"
    }
  ]
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="POST /v1/agents/{id}/orders">
                  <div className="space-y-4">
                    <p>Manually place order through agent (overrides autonomy temporarily).</p>
                    
                    <CodeBlock language="bash">
{`curl -X POST \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{
       "side": "buy",
       "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
       "amount": 500.0,
       "type": "market"
     }' \\
     https://api.cognilabs.com/v1/agents/agent_001/orders`}
                    </CodeBlock>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Market Data">
            <div className="space-y-6">
              <h3 className="text-xl text-white font-medium">Real-time Market Data</h3>
              
              <AccordionGroup>
                <Accordion title="GET /v1/market/tokens">
                  <div className="space-y-4">
                    <p>Get current token prices and metadata.</p>
                    
                    <CodeBlock language="bash">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "https://api.cognilabs.com/v1/market/tokens?symbols=SOL,USDC,RAY"`}
                    </CodeBlock>
                    
                    <CodeBlock language="json">
{`{
  "success": true,
  "data": [
    {
      "symbol": "SOL",
      "address": "So11111111111111111111111111111111111111112",
      "price": 102.34,
      "volume_24h": 1234567.89,
      "change_24h": 0.023,
      "market_cap": 45678901234,
      "last_updated": "2024-01-15T14:30:00Z"
    }
  ]
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="GET /v1/market/ohlcv">
                  <div className="space-y-4">
                    <p>Historical OHLCV data for charting and analysis.</p>
                    
                    <CodeBlock language="bash">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "https://api.cognilabs.com/v1/market/ohlcv?symbol=SOL&interval=1h&limit=100"`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="GET /v1/market/orderbook">
                  <div className="space-y-4">
                    <p>Current orderbook depth for supported pairs.</p>
                    
                    <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "symbol": "SOL/USDC",
    "bids": [
      [102.30, 15.5],
      [102.25, 8.2]
    ],
    "asks": [
      [102.35, 12.1], 
      [102.40, 6.8]
    ],
    "timestamp": "2024-01-15T14:30:00Z"
  }
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
          
          <Tab title="Analytics">
            <div className="space-y-6">
              <h3 className="text-xl text-white font-medium">Performance Analytics</h3>
              
              <AccordionGroup>
                <Accordion title="GET /v1/agents/{id}/performance">
                  <div className="space-y-4">
                    <p>Detailed performance metrics for an agent.</p>
                    
                    <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "agent_id": "agent_001",
    "period": "30d",
    "metrics": {
      "total_return": 0.157,
      "total_return_percentage": 15.7,
      "win_rate": 0.743,
      "profit_factor": 2.34,
      "sharpe_ratio": 1.87,
      "max_drawdown": -0.084,
      "total_trades": 47,
      "average_trade_duration": "00:45:30",
      "best_trade": 0.235,
      "worst_trade": -0.067
    },
    "daily_returns": [
      {"date": "2024-01-14", "return": 0.023},
      {"date": "2024-01-13", "return": -0.015}
    ]
  }
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="GET /v1/portfolio/summary">
                  <div className="space-y-4">
                    <p>Portfolio-wide performance summary.</p>
                    
                    <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "total_value": 47.83,
    "total_pnl": 12.83,
    "total_pnl_percentage": 36.6,
    "active_agents": 3,
    "total_trades_today": 15,
    "best_performing_agent": "agent_003",
    "allocation": [
      {"agent_id": "agent_001", "value": 23.45, "percentage": 49.0},
      {"agent_id": "agent_002", "value": 15.20, "percentage": 31.8},
      {"agent_id": "agent_003", "value": 9.18, "percentage": 19.2}
    ]
  }
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">WebSocket API</h2>
        
        <p className="text-white/80 leading-relaxed">
          Real-time data streaming for live updates on agent performance, trades, and market data.
        </p>
        
        <Tabs>
          <Tab title="Connection">
            <div className="space-y-6">
              <CodeBlock language="javascript">
{`const ws = new WebSocket('wss://api.cognilabs.com/v1/ws');

ws.onopen = function() {
  // Authenticate with API key
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_API_KEY'
  }));
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// Subscribe to agent updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'agent_updates',
  agent_id: 'agent_001'
}));`}
              </CodeBlock>
            </div>
          </Tab>
          
          <Tab title="Channels">
            <div className="space-y-6">
              <AccordionGroup>
                <Accordion title="agent_updates">
                  <div className="space-y-3">
                    <p>Real-time agent status and performance updates.</p>
                    <CodeBlock language="json">
{`{
  "type": "agent_update",
  "agent_id": "agent_001",
  "data": {
    "status": "active",
    "balance": 4.67,
    "unrealized_pnl": 0.12,
    "last_trade": "2024-01-15T14:30:00Z"
  }
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="trades">
                  <div className="space-y-3">
                    <p>Live trade execution notifications.</p>
                    <CodeBlock language="json">
{`{
  "type": "trade_executed",
  "agent_id": "agent_001", 
  "trade": {
    "id": "trade_12346",
    "side": "sell",
    "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": 500.0,
    "price": 1.002,
    "pnl": 15.23,
    "timestamp": "2024-01-15T14:31:45Z"
  }
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
                
                <Accordion title="market_data">
                  <div className="space-y-3">
                    <p>Real-time price updates for subscribed tokens.</p>
                    <CodeBlock language="json">
{`{
  "type": "price_update",
  "symbol": "SOL",
  "price": 102.45,
  "change": 0.11,
  "volume": 15234.67,
  "timestamp": "2024-01-15T14:32:00Z"
}`}
                    </CodeBlock>
                  </div>
                </Accordion>
              </AccordionGroup>
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-light text-white">Error Handling</h2>
        
        <p className="text-white/80 leading-relaxed">
          The API uses standard HTTP status codes and provides detailed error messages.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-medium">Status Code</th>
                <th className="text-left py-3 px-4 text-white font-medium">Meaning</th>
                <th className="text-left py-3 px-4 text-white font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-green-400 font-mono">200</td>
                <td className="py-3 px-4 text-white">OK</td>
                <td className="py-3 px-4 text-white/70">Request successful</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-yellow-400 font-mono">400</td>
                <td className="py-3 px-4 text-white">Bad Request</td>
                <td className="py-3 px-4 text-white/70">Invalid request format</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-red-400 font-mono">401</td>
                <td className="py-3 px-4 text-white">Unauthorized</td>
                <td className="py-3 px-4 text-white/70">Invalid or missing API key</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-red-400 font-mono">403</td>
                <td className="py-3 px-4 text-white">Forbidden</td>
                <td className="py-3 px-4 text-white/70">Insufficient permissions</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 text-yellow-400 font-mono">429</td>
                <td className="py-3 px-4 text-white">Too Many Requests</td>
                <td className="py-3 px-4 text-white/70">Rate limit exceeded</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-red-400 font-mono">500</td>
                <td className="py-3 px-4 text-white">Internal Server Error</td>
                <td className="py-3 px-4 text-white/70">Server-side error</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <CodeBlock language="json" filename="Error Response Format">
{`{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Agent balance too low to execute trade",
    "details": {
      "required": 1.5,
      "available": 0.8,
      "currency": "SOL"
    }
  },
  "request_id": "req_1234567890"
}`}
        </CodeBlock>
      </div>

      <Warning>
        <strong>API Stability:</strong> This API is in active development. While we maintain backward 
        compatibility, new features may be added regularly. Subscribe to our developer newsletter for updates.
      </Warning>

      <Tip>
        <strong>Best Practices:</strong> Implement proper error handling and retry logic. Use WebSocket 
        connections for real-time data rather than polling REST endpoints frequently.
      </Tip>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">Interactive API Explorer</h3>
              <p className="text-white/70">Test endpoints directly in your browser</p>
            </div>
            <a 
              href="https://api.cognilabs.com/docs"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try API
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium mb-2">OpenAPI Specification</h3>
              <p className="text-white/70">Download complete API specification</p>
            </div>
            <a 
              href="https://api.cognilabs.com/openapi.json"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
              <Book className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}