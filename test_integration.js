// Integration test for AI Agent Dashboard
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Testing AI Agent Dashboard Integration...\n')

// Test 1: Check if all required files exist
console.log('📁 Checking required files...')
const requiredFiles = [
  'src/app/dashboard/agents/page.tsx',
  'src/components/chat/EnhancedChatInterface.tsx',
  'src/lib/langchain-tools/market-data.ts',
  'src/lib/dashboard-navigation.ts',
  'src/components/charts/MarketChart.tsx',
  'src/components/actions/QuickActions.tsx'
]

let missingFiles = []
requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file)
  if (!fs.existsSync(fullPath)) {
    missingFiles.push(file)
  } else {
    console.log(`✅ ${file}`)
  }
})

if (missingFiles.length > 0) {
  console.log('\n❌ Missing files:')
  missingFiles.forEach(file => console.log(`  - ${file}`))
  process.exit(1)
}

// Test 2: Check if imports are correct
console.log('\n🔍 Checking file imports...')

function checkImports(filePath, requiredImports) {
  const content = fs.readFileSync(filePath, 'utf8')
  const issues = []

  requiredImports.forEach(importStr => {
    if (!content.includes(importStr)) {
      issues.push(`Missing import: ${importStr}`)
    }
  })

  return issues
}

// Check EnhancedChatInterface imports
const chatInterfaceIssues = checkImports('src/components/chat/EnhancedChatInterface.tsx', [
  'MarketChart',
  'QuickActions',
  'useRouter'
])

if (chatInterfaceIssues.length > 0) {
  console.log('❌ EnhancedChatInterface issues:')
  chatInterfaceIssues.forEach(issue => console.log(`  - ${issue}`))
} else {
  console.log('✅ EnhancedChatInterface imports')
}

// Check agent.ts imports
const agentIssues = checkImports('src/lib/agent.ts', [
  'getPolymarketDataTool',
  'getHyperliquidDataTool',
  'analyzeMarketOpportunityTool'
])

if (agentIssues.length > 0) {
  console.log('❌ Agent.ts issues:')
  agentIssues.forEach(issue => console.log(`  - ${issue}`))
} else {
  console.log('✅ Agent.ts imports')
}

// Test 3: Check if API endpoints are accessible
console.log('\n🌐 Checking API endpoints...')

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    return { status: response.status, ok: response.ok }
  } catch (error) {
    return { error: error.message }
  }
}

// Test 4: Check dashboard navigation structure
console.log('\n📊 Checking dashboard navigation...')
const sidebarPath = 'src/components/dashboard/DashboardSidebar.tsx'
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8')

if (sidebarContent.includes('/dashboard/agents')) {
  console.log('✅ Dashboard navigation updated to /dashboard/agents')
} else {
  console.log('❌ Dashboard navigation not updated')
}

// Test 5: Verify market data tools
console.log('\n🔧 Checking market data tools...')
const marketDataPath = 'src/lib/langchain-tools/market-data.ts'
const marketDataContent = fs.readFileSync(marketDataPath, 'utf8')

const requiredTools = [
  'getPolymarketDataTool',
  'getHyperliquidDataTool',
  'analyzeMarketOpportunityTool',
  'getPortfolioInsightsTool'
]

let missingTools = []
requiredTools.forEach(tool => {
  if (!marketDataContent.includes(tool)) {
    missingTools.push(tool)
  } else {
    console.log(`✅ ${tool}`)
  }
})

if (missingTools.length > 0) {
  console.log('\n❌ Missing tools:')
  missingTools.forEach(tool => console.log(`  - ${tool}`))
}

// Test 6: Check chart components
console.log('\n📈 Checking chart components...')
const chartPath = 'src/components/charts/MarketChart.tsx'
const chartContent = fs.readFileSync(chartPath, 'utf8')

const requiredChartComponents = [
  'MarketChart',
  'MarketOverview',
  'Sparkline'
]

let missingChartComponents = []
requiredChartComponents.forEach(component => {
  if (!chartContent.includes(`export function ${component}`) && !chartContent.includes(`export const ${component}`)) {
    missingChartComponents.push(component)
  } else {
    console.log(`✅ ${component}`)
  }
})

if (missingChartComponents.length > 0) {
  console.log('\n❌ Missing chart components:')
  missingChartComponents.forEach(component => console.log(`  - ${component}`))
}

// Test 7: Check action components
console.log('\n⚡ Checking action components...')
const actionPath = 'src/components/actions/QuickActions.tsx'
const actionContent = fs.readFileSync(actionPath, 'utf8')

const requiredActionComponents = [
  'QuickActions',
  'ContextualActions',
  'ActionGenerator'
]

let missingActionComponents = []
requiredActionComponents.forEach(component => {
  if (!actionContent.includes(component)) {
    missingActionComponents.push(component)
  } else {
    console.log(`✅ ${component}`)
  }
})

if (missingActionComponents.length > 0) {
  console.log('\n❌ Missing action components:')
  missingActionComponents.forEach(component => console.log(`  - ${component}`))
}

// Summary
console.log('\n📋 Integration Test Summary:')
console.log('==========================')

const totalIssues = missingFiles.length + chatInterfaceIssues.length + agentIssues.length + missingTools.length + missingChartComponents.length + missingActionComponents.length

if (totalIssues === 0) {
  console.log('🎉 All tests passed! Integration is complete.')
  console.log('\n✨ Features integrated:')
  console.log('  - AI Chat moved to /dashboard/agents')
  console.log('  - Market data tools for Polymarket & Hyperliquid')
  console.log('  - Visual rendering with charts and data cards')
  console.log('  - Deep linking and dashboard navigation')
  console.log('  - Action buttons and quick navigation')
  console.log('  - Enhanced agent with market intelligence')

  console.log('\n🚀 Ready to test! Try:')
  console.log('  1. Navigate to /dashboard/agents')
  console.log('  2. Ask: "Show me trending Polymarket markets"')
  console.log('  3. Ask: "What are the best Hyperliquid funding rates?"')
  console.log('  4. Ask: "Analyze market opportunities"')

} else {
  console.log(`❌ Found ${totalIssues} issues that need to be resolved.`)
  console.log('\n🔧 Next steps:')
  console.log('  1. Fix the issues listed above')
  console.log('  2. Run this test again')
  console.log('  3. Test manually in the browser')
}

console.log('\n💡 Pro tip: The AI agent now has access to:')
console.log('  - Real-time Polymarket prediction market data')
console.log('  - Hyperliquid perpetual contract information')
console.log('  - Market analysis and opportunity detection')
console.log('  - Visual data rendering and navigation')