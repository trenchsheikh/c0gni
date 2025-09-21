#!/bin/bash

# 🚀 c0gni Trading Agent Demo - Quick Start
# Minimal script to get the demo running fast

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}🤖 c0gni Trading Agent Demo - Quick Start${NC}"
echo "============================================="
echo

# Function to cleanup on exit
cleanup() {
    echo -e "\n${BLUE}Stopping services...${NC}"
    pkill -f "python.*demo_system.py" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Quick dependency check
if ! command -v python3 >/dev/null 2>&1; then
    echo "❌ Python 3 not found. Please install Python 3."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm not found. Please install Node.js."
    exit 1
fi

echo -e "${BLUE}Starting services...${NC}"

# Install minimal dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install --silent
fi

# Start agents in background
echo "🤖 Starting trading agents..."
cd agents
if [ ! -d "venv" ]; then
    python3 -m venv venv >/dev/null 2>&1
fi
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
python demo_system.py &
cd ..

# Start web app in background  
echo "🌐 Starting web application..."
npm run dev >/dev/null 2>&1 &

# Wait for services
sleep 8

echo
echo -e "${GREEN}✅ Demo is running!${NC}"
echo
echo -e "🎯 Agent Observer: ${CYAN}http://localhost:3000/agents${NC}"
echo -e "📊 Dashboard:     ${CYAN}http://localhost:3000/dashboard${NC}"
echo

# Auto-open browser
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:3000/agents" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
    open "http://localhost:3000/agents" >/dev/null 2>&1 &
fi

echo "Press Ctrl+C to stop..."

# Keep running
while true; do
    sleep 30
    echo -e "${BLUE}Demo running... ($(date '+%H:%M:%S'))${NC}"
done