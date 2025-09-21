/**
 * WebSocket client for real-time agent monitoring
 * Integrates with Redis pub/sub system from Python agents
 */

export interface AgentState {
  agent_id: string;
  agent_type: string;
  status: 'idle' | 'working' | 'error' | 'stopped';
  portfolio_value: number;
  daily_pnl: number;
  win_rate: number;
  trade_count: number;
  last_activity: string;
  performance_score: number;
  risk_level: string;
  active_positions: number;
  performance_metrics?: Record<string, any>;
}

export interface MarketEvent {
  id: string;
  agent_id: string;
  event_type: 'trade_executed' | 'signal_generated' | 'risk_alert' | 'position_opened' | 'position_closed' | 'agent_status';
  data: any;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error';
}

export interface TradingSignal {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  price_target?: number;
  stop_loss?: number;
  take_profit?: number;
  reason: string;
  timestamp: string;
  expires_at: string;
}

export type WebSocketEventType = 'agents' | 'events' | 'signals' | 'connection';

export interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: string;
}

export class AgentWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private subscribers: Map<WebSocketEventType, Set<(data: any) => void>> = new Map();

  constructor(private wsUrl?: string) {
    // Initialize subscriber sets
    ['agents', 'events', 'signals', 'connection'].forEach(type => {
      this.subscribers.set(type as WebSocketEventType, new Set());
    });
  }

  /**
   * Connect to the WebSocket server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use environment variable or fallback to localhost
        const url = this.wsUrl || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001/ws/agents';
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket connected to agent observer');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connection', { status: 'connected' });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.reason);
          this.isConnected = false;
          this.emit('connection', { status: 'disconnected' });
          
          // Attempt to reconnect if not manually closed
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('connection', { status: 'error', error });
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * Subscribe to WebSocket events
   */
  subscribe(eventType: WebSocketEventType, callback: (data: any) => void): () => void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.add(callback);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  /**
   * Send message to WebSocket server
   */
  send(type: string, data: any): void {
    if (this.ws && this.isConnected) {
      const message: WebSocketMessage = {
        type: type as WebSocketEventType,
        data,
        timestamp: new Date().toISOString()
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Request latest agent data
   */
  requestAgentData(): void {
    this.send('request_agents', {});
  }

  /**
   * Request agent details
   */
  requestAgentDetails(agentId: string): void {
    this.send('request_agent_details', { agent_id: agentId });
  }

  /**
   * Request historical events
   */
  requestEvents(limit = 20): void {
    this.send('request_events', { limit });
  }

  private handleMessage(message: WebSocketMessage): void {
    const { type, data } = message;

    switch (type) {
      case 'agents':
        this.emit('agents', data.agents || []);
        break;
      
      case 'events':
        this.emit('events', data.events || []);
        break;
      
      case 'signals':
        this.emit('signals', data.signals || []);
        break;
      
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  private emit(eventType: WebSocketEventType, data: any): void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  private attemptReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch(error => {
          console.error('Reconnection attempt failed:', error);
        });
      }
    }, delay);
  }
}

// Singleton instance for global use
let globalWebSocketClient: AgentWebSocketClient | null = null;

export function getWebSocketClient(): AgentWebSocketClient {
  if (!globalWebSocketClient) {
    globalWebSocketClient = new AgentWebSocketClient();
  }
  return globalWebSocketClient;
}

/**
 * React hook for WebSocket connection
 */
export function useAgentWebSocket() {
  const client = getWebSocketClient();
  
  return {
    client,
    connect: () => client.connect(),
    disconnect: () => client.disconnect(),
    isConnected: () => client.getConnectionStatus(),
    subscribe: (eventType: WebSocketEventType, callback: (data: any) => void) => 
      client.subscribe(eventType, callback),
    requestAgentData: () => client.requestAgentData(),
    requestEvents: (limit?: number) => client.requestEvents(limit)
  };
}