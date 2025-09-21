#!/bin/bash

# 🌐 Simple Web Demo - Just start the Next.js app with simulated data

set -e

echo "🚀 c0gni Agent Observer - Web Demo"
echo "=================================="
echo
echo "Starting web interface with simulated trading agents..."
echo

# Check if npm is available
if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm not found. Please install Node.js."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

echo "🌐 Starting web server..."
echo

# Start the development server
npm run dev &
WEB_PID=$!

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Stopping web server..."
    kill $WEB_PID 2>/dev/null || true
    echo "✅ Stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait a bit for the server to start
sleep 5

echo "🎯 Demo Ready!"
echo
echo "📊 Agent Observer: http://localhost:3000/agents"
echo "🏠 Dashboard: http://localhost:3000/dashboard"
echo "💬 Chat: http://localhost:3000/chat"
echo
echo "🤖 Note: This shows simulated agent data"
echo "   The agents will appear to be trading with animated updates"
echo
echo "🌐 Opening browser..."

# Try to open browser
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:3000/agents" 2>/dev/null &
elif command -v open >/dev/null 2>&1; then
    open "http://localhost:3000/agents" 2>/dev/null &
elif command -v start >/dev/null 2>&1; then
    start "http://localhost:3000/agents" 2>/dev/null &
fi

echo
echo "Press Ctrl+C to stop..."

# Keep script running
wait $WEB_PID