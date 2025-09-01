// Quick test script to verify AI agent functionality
import { config } from 'dotenv'
config({ path: '.env.local' })

// Test the chat API endpoint
async function testChatAPI() {
  try {
    console.log('🧪 Testing AI Chat API...')
    
    const response = await fetch('http://localhost:3002/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        message: 'Hello! What can you tell me about Ethereum trading?',
        deepResearchMode: false
      })
    })

    console.log('📊 Response status:', response.status)
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      console.log('✅ Chat API is working!')
      
      // Read the streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      console.log('📡 Streaming response:')
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        console.log(chunk)
      }
    } else {
      console.log('❌ Chat API failed')
      const text = await response.text()
      console.log('Response:', text)
    }
  } catch (error) {
    console.error('🚨 Test failed:', error)
  }
}

// Test GeckoTerminal API
async function testGeckoTerminal() {
  try {
    console.log('\n🦎 Testing GeckoTerminal API...')
    
    const response = await fetch('https://api.geckoterminal.com/api/v2/networks')
    console.log('📊 GeckoTerminal response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ GeckoTerminal API is working!')
      console.log('📈 Available networks:', data.data?.length || 0)
    } else {
      console.log('❌ GeckoTerminal API failed')
    }
  } catch (error) {
    console.error('🚨 GeckoTerminal test failed:', error)
  }
}

// Test OpenAI embeddings
async function testEmbeddings() {
  try {
    console.log('\n🤖 Testing OpenAI Embeddings...')
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: 'Test blockchain embedding generation'
      })
    })

    console.log('📊 OpenAI response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ OpenAI Embeddings API is working!')
      console.log('📊 Embedding dimensions:', data.data?.[0]?.embedding?.length || 0)
    } else {
      console.log('❌ OpenAI Embeddings API failed')
      const error = await response.json()
      console.log('Error:', error)
    }
  } catch (error) {
    console.error('🚨 Embeddings test failed:', error)
  }
}

// Test OpenRouter
async function testOpenRouter() {
  try {
    console.log('\n🌐 Testing OpenRouter API...')
    
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    })

    console.log('📊 OpenRouter response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ OpenRouter API is working!')
      console.log('🤖 Available models:', data.data?.length || 0)
    } else {
      console.log('❌ OpenRouter API failed')
      const error = await response.text()
      console.log('Error:', error)
    }
  } catch (error) {
    console.error('🚨 OpenRouter test failed:', error)
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive AI chat system tests...\n')
  
  await testGeckoTerminal()
  await testEmbeddings()
  await testOpenRouter()
  await testChatAPI()
  
  console.log('\n🏁 All tests completed!')
}

runAllTests().catch(console.error)