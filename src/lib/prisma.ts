// Mock Prisma Client for Vercel Build without DB
// This allows the app to build and run in a stateless/in-memory mode

class InMemoryStore {
  private users = new Map<string, any>();
  private sessions = new Map<string, any>();
  private messages = new Map<string, any[]>();
  private summaries = new Map<string, any[]>();
  private embeddings = new Map<string, any[]>();
  private contexts = new Map<string, any>();
  private memories = new Map<string, any>();

  // Helper to simulate $queryRaw
  $queryRaw = async (...args: any[]) => {
    console.log('⚠️ [MOCK PRISMA] $queryRaw called (returning empty array)', args);
    return [];
  };

  user = {
    findUnique: async ({ where }: any) => this.users.get(where.id) || null,
    create: async ({ data }: any) => {
      this.users.set(data.id, { ...data, createdAt: new Date(), updatedAt: new Date() });
      return this.users.get(data.id);
    },
    upsert: async ({ where, create, update }: any) => {
      const existing = this.users.get(where.id);
      if (existing) {
        const updated = { ...existing, ...update, updatedAt: new Date() };
        this.users.set(where.id, updated);
        return updated;
      }
      const created = { ...create, createdAt: new Date(), updatedAt: new Date() };
      this.users.set(where.id, created);
      return created;
    }
  };

  chatSession = {
    create: async ({ data }: any) => {
      const id = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      const session = { 
        id, 
        ...data, 
        createdAt: new Date(), 
        updatedAt: new Date(),
        lastActivity: new Date(),
        messageCount: 0,
        totalTokens: 0,
        messages: [],
        summaries: []
      };
      this.sessions.set(id, session);
      return session;
    },
    findUnique: async ({ where, include }: any) => {
      const session = this.sessions.get(where.id);
      if (!session) return null;
      
      // Handle simple include logic
      const result = { ...session };
      if (include?.messages) {
        result.messages = this.messages.get(where.id) || [];
      }
      if (include?.summaries) {
        result.summaries = this.summaries.get(where.id) || [];
      }
      return result;
    },
    findMany: async ({ where }: any) => {
      // Simple filter implementation
      return Array.from(this.sessions.values()).filter(s => {
        if (where.userId && s.userId !== where.userId) return false;
        if (where.isActive !== undefined && s.isActive !== where.isActive) return false;
        return true;
      });
    },
    update: async ({ where, data }: any) => {
      const session = this.sessions.get(where.id);
      if (!session) throw new Error('Session not found');
      
      // Handle increment/push operations
      const updated = { ...session };
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
          if ('increment' in (value as any)) {
            updated[key] = (updated[key] || 0) + (value as any).increment;
          } else if ('push' in (value as any)) {
            updated[key] = [...(updated[key] || []), ...(Array.isArray((value as any).push) ? (value as any).push : [(value as any).push])];
          } else {
            updated[key] = value;
          }
        } else {
          updated[key] = value;
        }
      }
      updated.updatedAt = new Date();
      this.sessions.set(where.id, updated);
      return updated;
    },
    delete: async ({ where }: any) => {
      this.sessions.delete(where.id);
      this.messages.delete(where.id);
      return { id: where.id };
    }
  };

  message = {
    create: async ({ data }: any) => {
      const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      const message = { 
        id, 
        ...data, 
        createdAt: new Date(), 
        updatedAt: new Date(),
        reactions: []
      };
      
      const sessionMessages = this.messages.get(data.sessionId) || [];
      sessionMessages.push(message);
      this.messages.set(data.sessionId, sessionMessages);
      
      return message;
    },
    findMany: async ({ where, orderBy, take }: any) => {
      let msgs = this.messages.get(where.sessionId) || [];
      // Sort
      if (orderBy?.createdAt === 'desc') {
        msgs = [...msgs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      } else {
        msgs = [...msgs].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      }
      // Take
      if (take) {
        msgs = msgs.slice(0, take);
      }
      return msgs;
    },
    findUnique: async ({ where }: any) => {
      for (const msgs of this.messages.values()) {
        const found = msgs.find(m => m.id === where.id);
        if (found) return found;
      }
      return null;
    }
  };

  conversationSummary = {
    create: async ({ data }: any) => {
      const id = 'summary-' + Date.now();
      const summary = { id, ...data, createdAt: new Date() };
      const sessionSummaries = this.summaries.get(data.sessionId) || [];
      sessionSummaries.push(summary);
      this.summaries.set(data.sessionId, sessionSummaries);
      return summary;
    }
  };

  userEmbedding = {
    create: async ({ data }: any) => {
      const id = 'emb-' + Date.now();
      const embedding = { id, ...data, createdAt: new Date() };
      const userEmbeddings = this.embeddings.get(data.userId) || [];
      userEmbeddings.push(embedding);
      this.embeddings.set(data.userId, userEmbeddings);
      return embedding;
    },
    findMany: async ({ where, take }: any) => {
      const userEmbeddings = this.embeddings.get(where.userId) || [];
      // Simple contains filter
      let filtered = userEmbeddings;
      if (where.content?.contains) {
        const query = where.content.contains.toLowerCase();
        filtered = filtered.filter((e: any) => e.content.toLowerCase().includes(query));
      }
      if (take) {
        filtered = filtered.slice(0, take);
      }
      return filtered;
    }
  };

  userContext = {
    findUnique: async ({ where }: any) => this.contexts.get(where.userId) || null,
    create: async ({ data }: any) => {
      const context = { id: 'ctx-' + data.userId, ...data, createdAt: new Date(), updatedAt: new Date() };
      this.contexts.set(data.userId, context);
      return context;
    },
    update: async ({ where, data }: any) => {
      // Find by ID (which we stored as ctx-userId, but where might be id)
      // For simplicity, let's assume we can find it.
      // In findUnique we used userId. Here we might need to iterate.
      let foundUserId = null;
      for (const [userId, ctx] of this.contexts.entries()) {
        if (ctx.id === where.id) {
          foundUserId = userId;
          break;
        }
      }
      if (foundUserId) {
        const existing = this.contexts.get(foundUserId);
        const updated = { ...existing, ...data, updatedAt: new Date() };
        this.contexts.set(foundUserId, updated);
        return updated;
      }
      return null;
    }
  };

  userMemory = {
    upsert: async ({ where, create, update }: any) => {
      // Key is userId_key composite
      const compositeKey = `${where.userId_key.userId}:${where.userId_key.key}`;
      const existing = this.memories.get(compositeKey);
      if (existing) {
        const updatedMemory = { ...existing, ...update, updatedAt: new Date() };
        this.memories.set(compositeKey, updatedMemory);
        return updatedMemory;
      }
      const created = { ...create, createdAt: new Date(), updatedAt: new Date() };
      this.memories.set(compositeKey, created);
      return created;
    }
  };
}

export const prisma = new InMemoryStore() as any;

// Ensure shared knowledge base user exists
export async function ensureSharedKnowledgeBaseUser() {
  console.log('ℹ️ [MOCK PRISMA] Skipping shared knowledge base user (in-memory mode)')
}
