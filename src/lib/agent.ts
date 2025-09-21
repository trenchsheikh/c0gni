import { ChatOpenAI } from '@langchain/openai'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { AIMessage, HumanMessage, BaseMessage, SystemMessage } from '@langchain/core/messages'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'

// Import our blockchain tools
import {
  listSupportedNetworksTool,
  searchPoolsTool,
  getPoolDetailsTool,
  getSimpleTokenPriceTool,
  getDexesOnNetworkTool,
  getTrendingPoolsTool,
  getMultiplePoolDetailsTool,
  getTopPoolsOnNetworkTool,
  getTopPoolsOnDexTool,
  getNewPoolsTool,
  getTopPoolsForTokenTool,
  getTokenDetailsTool,
  getMultipleTokenDetailsTool,
  getTokenInfoTool,
  getPoolTokenInfoTool,
  getRecentlyUpdatedTokenInfoTool,
  getPoolTradesTool
} from './langchain-tools/gecko-terminal'

// Import our market data tools
import {
  getPolymarketDataTool,
  getHyperliquidDataTool,
  analyzeMarketOpportunityTool,
  getPortfolioInsightsTool
} from './langchain-tools/market-data'

// Import memory services
import { searchSimilarMemories, storeUserMemory, storeEmbedding } from './embeddings'
import { getUserWithMemories } from './auth'
import { ensureSharedKnowledgeBaseUser } from './prisma'

// Initialize the main LLM (OpenRouter)
const llm = new ChatOpenAI({
  model: process.env.DEFAULT_MODEL || 'qwen/qwen3-235b-a22b-2507',
  temperature: parseFloat(process.env.DEFAULT_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.MAX_TOKENS || '4000'),
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://c0gnilabs.xyz',
      'X-Title': 'c0gni AI Chat',
    },
  },
  streaming: true,
})

// Initialize the memory extraction LLM (OpenRouter)
const memoryExtractionLlm = new ChatOpenAI({
  model: process.env.MEMORY_EXTRACTION_MODEL || 'openai/gpt-oss-20b',
  temperature: 0.3, // Lower temperature for more consistent extraction
  maxTokens: 1000,
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://c0gnilabs.xyz',
      'X-Title': 'c0gni AI Chat - Memory Extraction',
    },
  },
  streaming: false,
})

// Create a crypto knowledge search tool
const cryptoKnowledgeSearchTool = new DynamicStructuredTool({
  name: 'searchCryptoKnowledge',
  description: 'Search shared crypto and blockchain knowledge base. Use this to find factual information about tokens, DeFi protocols, trading strategies, and blockchain technology.',
  schema: z.object({
    query: z.string().describe('Search query to find relevant crypto/blockchain knowledge')
  }),
  func: async ({ query }) => {
    try {
      console.log(`🔍 [AGENT] Searching shared crypto knowledge: "${query}"`)
      const knowledgeId = 'crypto_knowledge_base'
      const knowledge = await searchSimilarMemories(knowledgeId, query, 0.7, 8)
      
      const formattedKnowledge = knowledge.map(item => ({
        content: item.content,
        type: item.type,
        similarity: item.similarity,
        metadata: item.metadata
      }))
      
      console.log(`💎 [AGENT] Found ${formattedKnowledge.length} relevant crypto knowledge items`)
      return JSON.stringify({
        knowledge: formattedKnowledge,
        totalFound: knowledge.length,
        source: 'shared_crypto_knowledge_base'
      })
    } catch (error) {
      console.error('[AGENT] Crypto knowledge search error:', error)
      return JSON.stringify({ knowledge: [], error: 'Crypto knowledge search failed' })
    }
  }
})

// Web search tool (placeholder - you can integrate your SonarPro tool here)
const webSearchTool = new DynamicStructuredTool({
  name: 'searchWeb',
  description: 'Search the web for current blockchain news, market analysis, and DeFi information. Use for real-time market sentiment and recent developments.',
  schema: z.object({
    query: z.string().describe('Search query for web search')
  }),
  func: async ({ query }) => {
    try {
      console.log(`🌐 [AGENT] Web search: "${query}"`)
      // This is a placeholder - integrate your SonarPro search here
      return JSON.stringify({
        results: [
          {
            title: `Web search results for: ${query}`,
            content: 'Web search functionality will be implemented with SonarPro integration.',
            url: 'https://example.com',
            timestamp: new Date().toISOString()
          }
        ],
        note: 'SonarPro integration pending - returning placeholder'
      })
    } catch (error) {
      console.error('[AGENT] Web search error:', error)
      return JSON.stringify({ results: [], error: 'Web search failed' })
    }
  }
})

// Compile all available tools
const tools = [
  // Crypto knowledge search
  cryptoKnowledgeSearchTool,

  // Web search
  webSearchTool,

  // Market data tools (Polymarket & Hyperliquid)
  getPolymarketDataTool,
  getHyperliquidDataTool,
  analyzeMarketOpportunityTool,
  getPortfolioInsightsTool,

  // Blockchain data tools
  listSupportedNetworksTool,
  searchPoolsTool,
  getPoolDetailsTool,
  getSimpleTokenPriceTool,
  getDexesOnNetworkTool,
  getTrendingPoolsTool,
  getMultiplePoolDetailsTool,
  getTopPoolsOnNetworkTool,
  getTopPoolsOnDexTool,
  getNewPoolsTool,
  getTopPoolsForTokenTool,
  getTokenDetailsTool,
  getMultipleTokenDetailsTool,
  getTokenInfoTool,
  getPoolTokenInfoTool,
  getRecentlyUpdatedTokenInfoTool,
  getPoolTradesTool
]

// Create the prompt template
const prompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder('system_prompt'),
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
])

// System prompt
function getSystemPrompt(knowledgeId: string): string {
  return `You are c0gni, an advanced AI assistant specialized in blockchain analysis, cryptocurrency trading, DeFi protocols, and market intelligence. You operate within a trading dashboard and have access to real-time market data from Polymarket and Hyperliquid, plus a shared crypto knowledge base.

## Core Capabilities:
- **Market Analysis**: Real-time data from Polymarket prediction markets and Hyperliquid perpetuals
- **Trading Intelligence**: Pool analysis, price discovery, trend identification, funding rate analysis
- **Portfolio Insights**: Position analysis, P&L tracking, risk assessment
- **Shared Knowledge Base**: Access collective crypto/blockchain knowledge from all conversations
- **Dashboard Integration**: Generate deep links and navigation to relevant trading interfaces

## Market Data Access:
- **Polymarket**: Prediction markets, betting odds, volumes, trending topics
- **Hyperliquid**: Perpetual contracts, funding rates, orderbook data, positions
- **Opportunity Analysis**: Cross-platform arbitrage, high-volume markets, volatility plays
- **Portfolio Analysis**: Performance tracking, risk metrics, position optimization

## Dashboard Integration:
- Generate direct links to specific markets: /dashboard/polymarket?market=ID
- Navigate to trading interfaces: /dashboard/hyperliquid?symbol=BTC-USD
- Portfolio navigation: /dashboard/portfolio for position analysis
- Bridge recommendations: /dashboard/bridge for cross-chain needs

## Response Format:
- Use JSON code blocks to display market data visually
- Include actionable trading buttons and navigation links
- Provide specific market prices, volumes, and trends
- Generate dashboard deep links for easy navigation
- Include confidence levels and time-sensitive data

## Available Tools:
- **getPolymarketData**: Fetch prediction market data, trends, categories
- **getHyperliquidData**: Get perpetual market data, funding rates, volatility
- **analyzeMarketOpportunity**: Identify trading opportunities across platforms
- **getPortfolioInsights**: Analyze user positions and performance
- **searchCryptoKnowledge**: Access shared blockchain knowledge base
- **GeckoTerminal API**: Comprehensive DEX and token data

## Visual Data Presentation:
When presenting market data, always format as JSON for visual rendering:
\`\`\`json
{
  "markets": [
    {
      "question": "Market question or symbol",
      "yesPrice": 0.65,
      "volume24h": 50000,
      "dashboardUrl": "/dashboard/polymarket?market=xyz"
    }
  ]
}
\`\`\`

## Response Style:
- Be direct and actionable for trading insights
- Always include relevant dashboard navigation links
- Use data visualization through JSON blocks
- Provide specific market recommendations
- Include risk warnings for trading advice
- Generate quick action buttons for trades

## Important Notes:
- Generate dashboard deep links for all relevant markets
- Use visual data rendering for market information
- Focus on actionable trading intelligence
- Always include navigation to relevant dashboard pages
- Knowledge Base ID: ${knowledgeId}

Remember: You're an intelligent trading assistant with real-time market access, helping users navigate opportunities across Polymarket and Hyperliquid within their trading dashboard.`
}

export interface ChatEvent {
  type: 'thinking_stream' | 'memory_access' | 'tool_call' | 'tool_result' | 'content' | 'complete' | 'error'
  content?: string
  metadata?: any
}

export class AIAgent {
  private agent: AgentExecutor
  
  constructor() {
    const toolCallingAgent = createToolCallingAgent({ 
      llm, 
      tools, 
      prompt 
    })
    
    this.agent = new AgentExecutor({ 
      agent: toolCallingAgent, 
      tools,
      verbose: true,
      maxIterations: 10,
      returnIntermediateSteps: true
    })
  }

  async *streamMessage(
    message: string,
    chatHistory: Array<{ role: string; content: string }> = [],
    knowledgeId?: string,
    deepResearchMode: boolean = false
  ): AsyncGenerator<ChatEvent> {
    try {
      console.log(`🤖 [AGENT] Starting stream for shared knowledge base: ${knowledgeId}`)
      
      // Convert chat history to LangChain format (will be empty for stateless conversations)
      const history: BaseMessage[] = chatHistory.map(msg => 
        msg.role === 'user' 
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      )

      // Access shared crypto knowledge base
      if (knowledgeId) {
        yield {
          type: 'memory_access',
          content: 'Accessing shared crypto knowledge base...',
          metadata: { phase: 'knowledge_retrieval', knowledgeId }
        }
      }

      yield {
        type: 'thinking_stream',
        content: 'Analyzing request and determining best approach...',
        metadata: { phase: 'analysis_start' }
      }

      // Create system message with knowledge base ID
      const systemMessage = new SystemMessage(getSystemPrompt(knowledgeId || 'crypto_knowledge_base'))

      // Stream the agent execution
      const eventStream = await this.agent.streamEvents({
        input: message,
        chat_history: history,
        system_prompt: [systemMessage]
      }, {
        version: 'v1',
        metadata: { knowledgeId, deepResearchMode }
      })

      let fullResponse = ''

      for await (const event of eventStream) {
        const { event: eventType, data, name } = event
        console.log(`[STREAM DEBUG] Event: ${eventType}, Name: ${name}`)

        // Handle different event types
        if (eventType === 'on_llm_stream' && data?.chunk?.content) {
          const content = data.chunk.content
          console.log(`[STREAM DEBUG] Streaming content: "${content}"`)
          fullResponse += content
          yield {
            type: 'content',
            content
          }
        }
        else if (eventType === 'on_tool_start') {
          if (name && name !== 'RunnableMap' && name !== 'RunnableSequence') {
            yield {
              type: 'tool_call',
              content: name,
              metadata: { 
                tool: name,
                status: 'running',
                inputs: data?.input
              }
            }
          }
        }
        else if (eventType === 'on_tool_end') {
          if (name && name !== 'RunnableMap' && name !== 'RunnableSequence') {
            yield {
              type: 'tool_result',
              content: `Completed: ${name}`,
              metadata: { 
                tool: name,
                status: 'completed',
                output: data?.output ? JSON.stringify(data.output).substring(0, 200) + '...' : 'No output'
              }
            }
          }
        }
        else if (eventType === 'on_chain_error' || eventType === 'on_tool_error') {
          const errorMessage = data?.error?.message || 'Unknown error'
          yield {
            type: 'error',
            content: errorMessage,
            metadata: { error: true, eventType }
          }
        }
        else if (eventType === 'on_agent_finish' || (eventType === 'on_chain_end' && name === 'AgentExecutor')) {
          // If we didn't get streaming content, send the final output as content
          if (!fullResponse && data?.output) {
            // Extract the actual text from the output object
            const actualOutput = typeof data.output === 'string' ? data.output : data.output?.output || JSON.stringify(data.output)
            console.log(`[STREAM DEBUG] No streaming received, sending final output: "${actualOutput}"`)
            fullResponse = actualOutput
            yield {
              type: 'content',
              content: actualOutput
            }
          }
          
          // Extract crypto knowledge for shared knowledge base
          if (knowledgeId && fullResponse) {
            this.extractAndStoreMemories(knowledgeId, message, fullResponse).catch(error => {
              console.warn('[AGENT] Crypto knowledge extraction failed:', error)
            })
          }

          yield {
            type: 'complete',
            content: fullResponse,
            metadata: { 
              completed: true,
              knowledgeId,
              tokensUsed: fullResponse.length // Rough estimate
            }
          }
          break
        }
      }

      console.log(`✅ [AGENT] Stream completed for knowledge base: ${knowledgeId}`)
    } catch (error) {
      console.error('[AGENT] Stream error:', error)
      yield {
        type: 'error',
        content: `Stream error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { error: true }
      }
    }
  }

  private async extractAndStoreMemories(
    knowledgeId: string,
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    try {
      console.log(`🧠 [AGENT] Extracting memories from conversation using LLM`)
      
      // Ensure shared knowledge base user exists
      await ensureSharedKnowledgeBaseUser()
      
      const extractionPrompt = `EXTRACT ALL CRYPTO DATA from the following conversation for a shared knowledge base. Be EXTREMELY AGGRESSIVE in capturing every token, price, and crypto detail mentioned.

User Message: "${userMessage}"
Assistant Response: "${assistantResponse}"

EXTRACT EVERY INSTANCE OF:
1. TOKEN DATA: Names, symbols, prices (any $X.XX format), percentage changes, volumes, market caps
2. DEFI_PROTOCOLS: Uniswap, Curve, Aave, Compound, etc. with TVL, APY, fees
3. BLOCKCHAIN_NETWORKS: Ethereum, Solana, Polygon, BSC with gas fees, transaction costs
4. TRADING_SIGNALS: Buy/sell recommendations, risk levels, price targets
5. TOKEN_ADDRESSES: Any 0x addresses, contract details
6. LIQUIDITY_DATA: Pool sizes, liquidity values, trading pairs
7. MARKET_MOVEMENTS: 24h changes, 1h changes, volume spikes
8. DEX_INFO: Which exchange (Uniswap V2/V3, etc.), pool details

For each piece of data, create a separate JSON entry. RETURN STRICT JSON ONLY (no code fences, no markdown, no commentary):
{
  "knowledge": [
    {
      "category": "token_price|defi_protocol|blockchain_tech|trading_signal|token_info|liquidity_pool|market_movement|dex_info",
      "key": "TOKEN_NAME_TIMESTAMP_OR_SPECIFIC_IDENTIFIER",
      "value": "DETAILED_FACTUAL_INFORMATION_INCLUDING_NUMBERS",
      "confidence": 0.9,
      "metadata": {
        "token_symbol": "SYMBOL",
        "price_usd": NUMBER_OR_NULL,
        "change_24h": PERCENTAGE_OR_NULL,
        "volume_24h": NUMBER_OR_NULL,
        "market_cap": NUMBER_OR_NULL,
        "dex": "EXCHANGE_NAME_OR_NULL",
        "risk_level": "RISK_LEVEL_OR_NULL",
        "timestamp": "${new Date().toISOString()}"
      }
    }
  ]
}

EXTRACTION RULES:
- Extract EVERY token mentioned by name or symbol
- Capture ALL prices (even small decimals like $0.000000251)
- Store EVERY percentage change (+67.48%, -16.55%, etc.)
- Record ALL volume and liquidity figures
- Note ALL DEX/protocol names
- Include risk assessments and trading signals
- Create separate entries for each token/fact
- If unsure, extract it anyway - better to over-capture than miss data
- Focus on numbers, specific values, and verifiable facts`

      const response = await memoryExtractionLlm.invoke([
        { role: 'user', content: extractionPrompt }
      ])

      try {
        // Robust JSON parsing: strip code fences/markdown and extract JSON object
        const raw = String(response.content || '')
        const cleaned = raw
          .replace(/^```(json)?/i, '')
          .replace(/```\s*$/i, '')
          .trim()

        const jsonCandidate = (() => {
          // If already starts with { and ends with }, try parse
          if (cleaned.startsWith('{') && cleaned.endsWith('}')) return cleaned
          // Try to find largest JSON object block
          const first = cleaned.indexOf('{')
          const last = cleaned.lastIndexOf('}')
          if (first !== -1 && last !== -1 && last > first) {
            return cleaned.slice(first, last + 1)
          }
          return cleaned
        })()

        const extractedData = JSON.parse(jsonCandidate)
        
        if (extractedData.knowledge && Array.isArray(extractedData.knowledge)) {
          for (const knowledge of extractedData.knowledge) {
            if (knowledge.category && knowledge.key && knowledge.value) {
              const knowledgeKey = `${knowledge.category}_${knowledge.key}_${Date.now()}`
              
              // Store in shared crypto knowledge base with enhanced metadata
              await storeUserMemory(
                knowledgeId, // This is 'crypto_knowledge_base'
                'blockchain_knowledge',
                knowledge.category,
                knowledgeKey,
                knowledge.value,
                knowledge.confidence || 0.9,
                'conversation',
                undefined, // messageId
                knowledge.metadata?.chain_id, // chainId
                knowledge.metadata?.token_address, // tokenAddress
                knowledge.metadata?.dex // protocol
              )
              
              // Also store as embedding with detailed metadata for better search
              await storeEmbedding(
                knowledgeId,
                knowledge.value,
                'crypto_knowledge',
                {
                  ...knowledge.metadata,
                  category: knowledge.category,
                  extraction_method: 'llm',
                  raw_key: knowledge.key
                }
              )
              
              console.log(`💎 [AGENT] Stored crypto knowledge: ${knowledge.category} - ${knowledge.value.substring(0, 80)}...`)
            }
          }
          console.log(`✅ [AGENT] Stored ${extractedData.knowledge.length} crypto facts to shared knowledge base`)
        }
      } catch (parseError) {
        console.warn('[AGENT] Failed to parse LLM knowledge extraction, using regex extraction')
        await this.regexTokenExtraction(knowledgeId, userMessage, assistantResponse)
      }
    } catch (error) {
      console.error('[AGENT] Memory extraction error:', error)
      await this.regexTokenExtraction(knowledgeId, userMessage, assistantResponse)
    }
  }

  private async regexTokenExtraction(
    knowledgeId: string,
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    try {
      console.log(`🔍 [AGENT] Using aggressive regex extraction for crypto data`)
      const fullText = `${userMessage} ${assistantResponse}`
      
      // Regex patterns for crypto data extraction
      const patterns = {
        prices: /\$[\d,]+\.?\d*/g,
        percentages: /[+-]?\d+\.?\d*%/g,
        tokenSymbols: /\b[A-Z]{2,10}\b(?=\s*(?:\(|\)|$|[^\w]|Price|trading|token))/g,
        addresses: /0x[a-fA-F0-9]{40}/g,
        volumes: /Volume.*?[\$~]?[\d,]+\.?\d*[KMBkmb]?/gi,
        liquidity: /Liquidity.*?[\$~]?[\d,]+\.?\d*[KMBkmb]?/gi,
        marketCap: /(?:Market Cap|MCAP|FDV).*?[\$~]?[\d,]+\.?\d*[KMBkmb]?/gi,
        exchanges: /\b(?:Uniswap(?:\s+V[23])?|PancakeSwap|SushiSwap|Curve|Balancer|1inch)\b/gi,
        risks: /\b(?:Very High|High|Moderate|Low|Conservative|Aggressive)\b.*?(?:risk|Risk)/gi
      }

      // Extract token symbols with more precise context matching
      const tokenMatches = Array.from(fullText.matchAll(/(?:#{3,4}\s+\d+\.\s+)?\*\*([A-Z]{2,20})\s*(?:\([^)]*?\))?\*\*|(?:^\|\s*\*\*([A-Z]{2,20})\*\*\s*\|)|(?:token|coin|symbol)[\s:]+([A-Z]{2,20})(?=\s|$)/gmi))
      
      // Also extract from bullet points and structured lists
      const bulletTokens = Array.from(fullText.matchAll(/(?:^|\n)\s*(?:\d+\.|\-|\*)\s*\*\*([A-Z]{2,20})\*\*|(?:^|\n)#{3,4}.*?\*\*([A-Z]{2,20})\s*(?:\([^)]*?\))?\*\*/gm))
      
      // Combine and deduplicate token matches
      const allTokenMatches = [...tokenMatches, ...bulletTokens]
      const uniqueTokens = new Map()
      
      for (const match of allTokenMatches) {
        const tokenSymbol = match[1] || match[2] || match[3]
        if (tokenSymbol && tokenSymbol.length >= 2 && tokenSymbol.length <= 10) {
          // Find the full context for this token
          const tokenRegex = new RegExp(`[\\s\\S]{0,200}\\*\\*${tokenSymbol}[\\s\\S]{0,200}`, 'i')
          const contextMatch = fullText.match(tokenRegex)
          
          if (contextMatch) {
            uniqueTokens.set(tokenSymbol, contextMatch[0])
          }
        }
      }
      
      // Process each unique token found
      for (const [tokenSymbol, context] of uniqueTokens) {
        // Extract price from context
        const priceMatch = context.match(/\$[\d,]+\.?\d*/g)
        const price = priceMatch ? priceMatch[0] : null
        
        // Extract percentage change
        const percentMatch = context.match(/[+-]?\d+\.?\d*%/g)
        const change = percentMatch ? percentMatch[0] : null
        
        // Extract volume if mentioned
        const volumeMatch = context.match(/(?:Volume|volume).*?[\$~]?[\d,]+\.?\d*[KMBkmb]?/gi)
        const volume = volumeMatch ? volumeMatch[0] : null
        
        // Extract liquidity
        const liquidityMatch = context.match(/(?:Liquidity).*?[\$~]?[\d,]+\.?\d*[KMBkmb]?/gi)
        const liquidity = liquidityMatch ? liquidityMatch[0] : null
        
        // Extract market cap
        const mcapMatch = context.match(/(?:Market Cap|MCAP|FDV).*?[\$~]?[\d,]+\.?\d*[KMBkmb]?/gi)
        const mcap = mcapMatch ? mcapMatch[0] : null
        
        // Extract DEX info
        const dexMatch = context.match(/(?:DEX|Uniswap|PancakeSwap|SushiSwap)/gi)
        const dex = dexMatch ? dexMatch[0] : null
        
        // Create comprehensive knowledge entry for each token
        const knowledgeKey = `token_${tokenSymbol}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        let knowledgeValue = `${tokenSymbol} token data`
        
        if (price) knowledgeValue += ` - Price: ${price}`
        if (change) knowledgeValue += ` - Change: ${change}`
        if (volume) knowledgeValue += ` - ${volume}`
        if (liquidity) knowledgeValue += ` - ${liquidity}`
        if (mcap) knowledgeValue += ` - ${mcap}`
        if (dex) knowledgeValue += ` - DEX: ${dex}`
        
        // Parse numerical values for metadata
        const priceNum = price ? parseFloat(price.replace(/[\$,]/g, '')) : null
        const changeNum = change ? parseFloat(change.replace('%', '')) : null
        
        await storeUserMemory(
          knowledgeId,
          'blockchain_knowledge',
          'token_price',
          knowledgeKey,
          knowledgeValue,
          0.85, // Higher confidence for extracted token data
          'conversation',
          undefined, undefined, undefined, dex?.toLowerCase()
        )

        // Store as embedding with rich metadata
        await storeEmbedding(
          knowledgeId,
          knowledgeValue,
          'crypto_knowledge',
          {
            token_symbol: tokenSymbol,
            price_usd: priceNum,
            change_24h: changeNum,
            volume_raw: volume,
            liquidity_raw: liquidity,
            mcap_raw: mcap,
            dex: dex?.toLowerCase(),
            raw_context: context.substring(0, 300), // Limit context size
            extraction_method: 'enhanced_regex',
            timestamp: new Date().toISOString()
          }
        )
        
        console.log(`🪙 [AGENT] Extracted token: ${tokenSymbol} - ${price || 'no price'} ${change || 'no change'} ${dex ? `on ${dex}` : ''}`)
      }

      // Extract DeFi protocol mentions
      const protocolMatches = fullText.match(patterns.exchanges) || []
      for (const protocol of protocolMatches) {
        const knowledgeKey = `protocol_${protocol.toLowerCase()}_${Date.now()}`
        await storeUserMemory(
          knowledgeId,
          'blockchain_knowledge',
          'defi_protocol',
          knowledgeKey,
          `${protocol} mentioned in trading context`,
          0.7,
          'conversation',
          undefined, undefined, undefined, protocol.toLowerCase()
        )
        console.log(`🏛️ [AGENT] Extracted protocol: ${protocol}`)
      }

      // Extract risk assessments
      const riskMatches = fullText.match(patterns.risks) || []
      for (const risk of riskMatches) {
        const knowledgeKey = `risk_assessment_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        await storeUserMemory(
          knowledgeId,
          'blockchain_knowledge',
          'trading_signal',
          knowledgeKey,
          risk,
          0.6,
          'conversation'
        )
        console.log(`⚠️ [AGENT] Extracted risk data: ${risk.substring(0, 50)}...`)
      }

      // Additional structured parsing for markdown tables and sections
      await this.parseStructuredSections(knowledgeId, assistantResponse)

      console.log(`🔍 [AGENT] Regex extraction completed - tokens: ${tokenMatches.length}, protocols: ${protocolMatches.length}, risks: ${riskMatches.length}`)
    } catch (error) {
      console.error('[AGENT] Regex extraction error:', error)
      await this.fallbackCryptoExtraction(knowledgeId, userMessage, assistantResponse)
    }
  }

  private async parseStructuredSections(
    knowledgeId: string,
    assistantResponse: string
  ): Promise<void> {
    try {
      // Parse markdown sections starting with ### or ####
      const sectionMatches = assistantResponse.match(/#{3,4}\s+\d+\.\s+\*\*([^*]+)\*\*[\s\S]*?(?=#{3,4}|\n\n---|\n\n\*\*|$)/g)
      
      if (sectionMatches) {
        for (const section of sectionMatches) {
          // Extract token name from section header
          const tokenMatch = section.match(/\*\*([A-Z]{2,20})\s*(?:\([^)]*\))?\*\*/)
          if (!tokenMatch) continue
          
          const tokenSymbol = tokenMatch[1]
          
          // Extract all data from the section
          const priceMatch = section.match(/Price.*?\$[\d,]+\.?\d*/i)
          const changeMatch = section.match(/24h Change.*?[+-]?\d+\.?\d*%/i)
          const volumeMatch = section.match(/Volume.*?\$[\d,]+\.?\d*[KMB]?/i)
          const liquidityMatch = section.match(/Liquidity.*?\$[\d,]+\.?\d*[KMB]?/i)
          const riskMatch = section.match(/Risk Level.*?(?:Very High|High|Moderate|Low)/i)
          const dexMatch = section.match(/DEX.*?(Uniswap\s*V?[23]?|PancakeSwap|SushiSwap)/i)
          const createdMatch = section.match(/Created.*?(\w+\s+\d+,\s+\d{4})/i)
          
          // Build comprehensive knowledge entry
          let knowledgeValue = `${tokenSymbol} comprehensive data`
          const metadata: any = {
            token_symbol: tokenSymbol,
            extraction_method: 'structured_parsing',
            timestamp: new Date().toISOString(),
            section_text: section.substring(0, 500) // Store partial section for context
          }
          
          if (priceMatch) {
            const price = priceMatch[0].match(/\$[\d,]+\.?\d*/)?.[0]
            if (price) {
              knowledgeValue += ` - ${priceMatch[0]}`
              metadata.price_usd = parseFloat(price.replace(/[\$,]/g, ''))
            }
          }
          
          if (changeMatch) {
            const change = changeMatch[0].match(/[+-]?\d+\.?\d*%/)?.[0]
            if (change) {
              knowledgeValue += ` - ${changeMatch[0]}`
              metadata.change_24h = parseFloat(change.replace('%', ''))
            }
          }
          
          if (volumeMatch) {
            knowledgeValue += ` - ${volumeMatch[0]}`
            const volumeValue = volumeMatch[0].match(/\$[\d,]+\.?\d*[KMB]?/)?.[0]
            if (volumeValue) {
              metadata.volume_24h = volumeValue
            }
          }
          
          if (liquidityMatch) {
            knowledgeValue += ` - ${liquidityMatch[0]}`
            metadata.liquidity = liquidityMatch[0].match(/\$[\d,]+\.?\d*[KMB]?/)?.[0]
          }
          
          if (riskMatch) {
            knowledgeValue += ` - ${riskMatch[0]}`
            metadata.risk_level = riskMatch[0].match(/(?:Very High|High|Moderate|Low)/i)?.[0]?.toLowerCase()
          }
          
          if (dexMatch) {
            knowledgeValue += ` - ${dexMatch[0]}`
            metadata.dex = dexMatch[1]
          }
          
          if (createdMatch) {
            knowledgeValue += ` - Created: ${createdMatch[1]}`
            metadata.created_date = createdMatch[1]
          }
          
          // Store the comprehensive token data
          const knowledgeKey = `structured_${tokenSymbol}_${Date.now()}`
          await storeUserMemory(
            knowledgeId,
            'blockchain_knowledge',
            'token_analysis',
            knowledgeKey,
            knowledgeValue,
            0.95, // High confidence for structured data
            'conversation',
            undefined,
            undefined,
            undefined,
            metadata.dex
          )
          
          // Store as embedding with rich metadata
          await storeEmbedding(
            knowledgeId,
            knowledgeValue,
            'crypto_knowledge',
            metadata
          )
          
          console.log(`📊 [AGENT] Extracted structured token analysis: ${tokenSymbol}`)
        }
      }

      // Parse trading strategy tables
      const tableMatches = assistantResponse.match(/\|\s*Risk Profile\s*\|\s*Recommended Tokens\s*\|[\s\S]*?(?=\n\n|$)/g)
      if (tableMatches) {
        for (const table of tableMatches) {
          const rows = table.split('\n').slice(2) // Skip header and separator
          for (const row of rows) {
            const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell)
            if (cells.length >= 2) {
              const riskProfile = cells[0]
              const recommendedTokens = cells[1]
              
              const knowledgeKey = `trading_strategy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
              const knowledgeValue = `Trading strategy: ${riskProfile} risk profile recommends ${recommendedTokens}`
              
              await storeUserMemory(
                knowledgeId,
                'blockchain_knowledge',
                'trading_strategy',
                knowledgeKey,
                knowledgeValue,
                0.8,
                'conversation'
              )
              
              console.log(`📈 [AGENT] Extracted trading strategy: ${riskProfile} -> ${recommendedTokens}`)
            }
          }
        }
      }

    } catch (error) {
      console.error('[AGENT] Structured parsing error:', error)
    }
  }

  private async fallbackCryptoExtraction(
    knowledgeId: string,
    userMessage: string,
    assistantResponse: string
  ): Promise<void> {
    try {
      console.log(`🔧 [AGENT] Using enhanced fallback keyword extraction`)
      
      // Comprehensive crypto keyword library
      const cryptoFactKeywords = {
        token_symbols: [
          // Major tokens
          'btc', 'bitcoin', 'eth', 'ethereum', 'usdc', 'usdt', 'bnb', 'sol', 'solana',
          'ada', 'cardano', 'dot', 'polkadot', 'matic', 'polygon', 'avax', 'avalanche',
          'link', 'chainlink', 'uni', 'uniswap', 'aave', 'comp', 'compound', 'mkr', 'maker',
          // Trending tokens often mentioned
          'pepe', 'shib', 'doge', 'floki', 'safemoon', 'apt', 'aptos', 'arb', 'arbitrum',
          'op', 'optimism', 'ftm', 'fantom', 'near', 'icp', 'atom', 'cosmos'
        ],
        market_data: [
          'price', 'volume', 'market cap', 'mcap', 'fdv', 'fully diluted valuation',
          'tvl', 'total value locked', 'apy', 'apr', 'yield', 'liquidity', 'trading volume',
          '24h change', '24h volume', '1h change', 'volatility', 'pump', 'dump', 'moon'
        ],
        defi_protocols: [
          'uniswap', 'pancakeswap', 'sushiswap', 'curve', 'balancer', '1inch', 'paraswap',
          'aave', 'compound', 'makerdao', 'yearn', 'synthetix', 'convex', 'frax',
          'lido', 'rocket pool', 'euler', 'morpho', 'instadapp', 'zapper', 'defisaver'
        ],
        blockchain_tech: [
          'ethereum', 'solana', 'polygon', 'bsc', 'binance smart chain', 'arbitrum', 'optimism',
          'avalanche', 'fantom', 'harmony', 'moonbeam', 'cronos', 'celo', 'near',
          'gas fees', 'gwei', 'transaction fees', 'block confirmation', 'finality',
          'proof of stake', 'proof of work', 'consensus', 'validator', 'staking'
        ],
        token_info: [
          'contract address', '0x', 'tokenomics', 'supply', 'total supply', 'max supply',
          'circulating supply', 'burn', 'mint', 'emission', 'inflation', 'deflation',
          'vesting', 'unlock', 'cliff', 'whitelist', 'presale', 'ico', 'ido', 'fair launch'
        ],
        trading_signals: [
          'buy signal', 'sell signal', 'bullish', 'bearish', 'breakout', 'breakdown',
          'support', 'resistance', 'rsi', 'macd', 'moving average', 'fibonacci',
          'accumulation', 'distribution', 'volume spike', 'whale movement'
        ],
        trading_strategies: [
          'arbitrage', 'yield farming', 'liquidity mining', 'staking', 'liquid staking',
          'impermanent loss', 'dca', 'dollar cost averaging', 'scalping', 'swing trading',
          'hodl', 'defi strategies', 'farming', 'lending', 'borrowing'
        ],
        risk_levels: [
          'very high risk', 'high risk', 'moderate risk', 'low risk', 'conservative',
          'aggressive', 'speculative', 'blue chip', 'memecoin', 'altcoin', 'shitcoin'
        ]
      }

      const combinedText = `${userMessage} ${assistantResponse}`.toLowerCase()
      
      // Extract with context-aware matching
      for (const [category, keywords] of Object.entries(cryptoFactKeywords)) {
        const foundKeywords: string[] = []
        const contextMatches: string[] = []
        
        for (const keyword of keywords) {
          const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
          const matches = combinedText.match(regex)
          
          if (matches) {
            foundKeywords.push(keyword)
            
            // Try to extract surrounding context for better knowledge
            const contextRegex = new RegExp(`\\b.{0,50}${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.{0,50}\\b`, 'gi')
            const contextMatch = combinedText.match(contextRegex)
            if (contextMatch) {
              contextMatches.push(...contextMatch)
            }
          }
        }
        
        if (foundKeywords.length > 0) {
          const knowledgeKey = `${category}_enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
          let knowledgeValue = `${category.replace('_', ' ')} data: ${foundKeywords.join(', ')}`
          
          // Add context if available
          if (contextMatches.length > 0) {
            const uniqueContexts = [...new Set(contextMatches)].slice(0, 3) // Limit to 3 best contexts
            knowledgeValue += ` | Context: ${uniqueContexts.join(' | ')}`
          }
          
          await storeUserMemory(
            knowledgeId,
            'blockchain_knowledge',
            category,
            knowledgeKey,
            knowledgeValue,
            0.5 + (foundKeywords.length * 0.1), // Dynamic confidence based on keyword count
            'conversation'
          )
          
          // Store as embedding with metadata
          await storeEmbedding(
            knowledgeId,
            knowledgeValue,
            'crypto_knowledge',
            {
              extraction_method: 'enhanced_fallback',
              category,
              found_keywords: foundKeywords,
              keyword_count: foundKeywords.length,
              timestamp: new Date().toISOString()
            }
          )
          
          console.log(`🔍 [AGENT] Enhanced fallback extraction: ${category} - found ${foundKeywords.length} keywords: ${foundKeywords.slice(0, 3).join(', ')}${foundKeywords.length > 3 ? '...' : ''}`)
        }
      }

      // Extract any remaining price patterns that might have been missed
      const priceMatches = combinedText.match(/\$[\d,]+\.?\d*/g)
      if (priceMatches && priceMatches.length > 0) {
        const knowledgeKey = `price_patterns_${Date.now()}`
        const knowledgeValue = `Price mentions: ${priceMatches.join(', ')}`
        
        await storeUserMemory(
          knowledgeId,
          'blockchain_knowledge',
          'market_data',
          knowledgeKey,
          knowledgeValue,
          0.7,
          'conversation'
        )
        
        console.log(`💰 [AGENT] Fallback price extraction: ${priceMatches.length} prices found`)
      }

    } catch (error) {
      console.error('[AGENT] Enhanced fallback extraction error:', error)
    }
  }
}

// Export singleton instance
export const aiAgent = new AIAgent()
