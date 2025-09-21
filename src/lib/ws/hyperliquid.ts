"use client";

// Lightweight client-side WebSocket helper for Hyperliquid data.
// Works on Vercel because it runs entirely in the browser.

export type HLMessageHandler = (msg: any) => void;

export interface HLWsOptions {
  url?: string; // ws url; defaults to public env or HL default
  onMessage?: HLMessageHandler;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  reconnect?: boolean;
  reconnectDelayMs?: number;
}

export class HyperliquidWS {
  private ws: WebSocket | null = null;
  private opts: Required<HLWsOptions>;
  private shouldReconnect = false;

  constructor(options: HLWsOptions = {}) {
    this.opts = {
      url: options.url || (process.env.NEXT_PUBLIC_HYPERLIQUID_WS_URL || 'wss://api.hyperliquid.xyz/ws'),
      onMessage: options.onMessage || (() => {}),
      onOpen: options.onOpen || (() => {}),
      onClose: options.onClose || (() => {}),
      onError: options.onError || (() => {}),
      reconnect: options.reconnect ?? true,
      reconnectDelayMs: options.reconnectDelayMs ?? 1500,
    };
  }

  connect() {
    this.shouldReconnect = this.opts.reconnect;
    try {
      this.ws = new WebSocket(this.opts.url);
    } catch (e) {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.opts.onOpen();
    };

    this.ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data as any);
        this.opts.onMessage(data);
      } catch {
        // ignore non-JSON
      }
    };

    this.ws.onclose = (ev) => {
      this.opts.onClose(ev);
      if (this.shouldReconnect) this.scheduleReconnect();
    };

    this.ws.onerror = (ev) => {
      this.opts.onError(ev);
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    this.ws = null;
  }

  send(obj: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify(obj));
    return true;
  }

  // Subscribe to an order book channel for a symbol.
  // Note: Hyperliquid WS subscription schema can change; allow overriding via env.
  subscribeOrderBook(symbol: string) {
    const channel = process.env.NEXT_PUBLIC_HL_BOOK_CHANNEL || 'book';
    const method = process.env.NEXT_PUBLIC_HL_SUBSCRIBE_METHOD || 'subscribe';
    const payload: any = {
      method,
      params: {
        channels: [`${channel}:${symbol}`],
      },
    };
    this.send(payload);
  }

  unsubscribeOrderBook(symbol: string) {
    const channel = process.env.NEXT_PUBLIC_HL_BOOK_CHANNEL || 'book';
    const method = process.env.NEXT_PUBLIC_HL_UNSUBSCRIBE_METHOD || 'unsubscribe';
    const payload: any = {
      method,
      params: {
        channels: [`${channel}:${symbol}`],
      },
    };
    this.send(payload);
  }

  private scheduleReconnect() {
    if (!this.opts.reconnect) return;
    setTimeout(() => this.connect(), this.opts.reconnectDelayMs);
  }
}

export function parseHLOrderBook(msg: any) {
  // Attempt to parse a generic book update shape into { bids, asks } with {price,size,total}
  // Returns null if not parseable.
  try {
    const book = msg?.data?.book || msg?.book || msg?.data;
    if (!book) return null;
    const bidsRaw = book.bids || book.bid || [];
    const asksRaw = book.asks || book.ask || [];
    const mapSide = (arr: any[]) => arr.map((x: any) => ({
      price: Number(x[0] ?? x.price ?? 0),
      size: Number(x[1] ?? x.size ?? 0),
      total: Number(x[2] ?? x.size ?? 0),
    }));
    return {
      bids: mapSide(Array.isArray(bidsRaw) ? bidsRaw : []),
      asks: mapSide(Array.isArray(asksRaw) ? asksRaw : []),
      spread: 0,
      lastUpdate: new Date(),
    };
  } catch {
    return null;
  }
}

