#!/bin/bash

# 🚀 c0gni Trading Agent Demo - Complete System Launcher
# This script starts the entire demo system in one command

set -e  # Exit on any error

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Function to cleanup background processes on exit
cleanup() {
    print_status "Cleaning up background processes..."
    
    # Kill all background jobs
    jobs -p | xargs -r kill 2>/dev/null || true
    
    # Kill specific processes
    pkill -f "python.*demo_system.py" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    
    print_success "Cleanup completed"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if eval $check_command >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within $max_attempts seconds"
    return 1
}

# Main function
main() {
    # Print header
    clear
    echo
    print_header "🤖 c0gni Trading Agent Demo System"
    print_header "===================================="
    echo
    print_status "Starting complete trading agent demonstration..."
    echo
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists python3; then
        print_error "Python 3 is not installed or not in PATH"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "Node.js/npm is not installed or not in PATH"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "Please run this script from the project root directory (where package.json is located)"
        exit 1
    fi
    
    if [ ! -d "agents" ]; then
        print_error "Agents directory not found. Please ensure you're in the correct project directory."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    echo
    
    # Check for port conflicts
    print_status "Checking for port conflicts..."
    
    if port_in_use 3000; then
        print_warning "Port 3000 is already in use. The web app might conflict."
        echo "You may need to stop the existing service or the demo will use a different port."
    fi
    
    if port_in_use 8001; then
        print_warning "Port 8001 is already in use. The WebSocket server might conflict."
        echo "You may need to stop the existing service."
    fi
    
    print_success "Port check completed"
    echo
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
        print_status "Installing Node.js dependencies..."
        npm install
        print_success "Node.js dependencies installed"
    else
        print_status "Node.js dependencies already installed"
    fi
    
    # Check Python virtual environment
    if [ ! -d "agents/venv" ]; then
        print_status "Creating Python virtual environment..."
        cd agents
        python3 -m venv venv
        cd ..
        print_success "Python virtual environment created"
    fi
    
    # Install Python dependencies
    print_status "Installing Python dependencies..."
    cd agents
    source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null || {
        print_error "Failed to activate Python virtual environment"
        exit 1
    }
    
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt >/dev/null 2>&1
        print_success "Python dependencies installed"
    else
        print_warning "No requirements.txt found, skipping Python dependency installation"
    fi
    
    cd ..
    echo
    
    # Start the agent demo system
    print_status "Starting trading agent system..."
    cd agents
    
    # Ensure the virtual environment is activated and run in background
    (source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null; python demo_system.py) &
    AGENT_PID=$!
    
    cd ..
    
    # Wait for agent system to initialize
    sleep 5
    
    # Check if agent system is still running
    if ! kill -0 $AGENT_PID 2>/dev/null; then
        print_error "Trading agent system failed to start"
        exit 1
    fi
    
    print_success "Trading agent system started (PID: $AGENT_PID)"
    echo
    
    # Wait for WebSocket server to be ready
    wait_for_service "WebSocket server" "nc -z localhost 8001"
    echo
    
    # Start the web application
    print_status "Starting web application..."
    npm run dev &
    WEB_PID=$!
    
    # Wait for web app to be ready
    wait_for_service "Web application" "curl -f http://localhost:3000 -o /dev/null -s"
    echo
    
    print_success "Web application started (PID: $WEB_PID)"
    echo
    
    # Display status information
    print_header "🎯 Demo System Status"
    echo
    print_success "✓ Trading Agent System: Running on WebSocket port 8001"
    print_success "✓ Web Application: Running on http://localhost:3000"
    print_success "✓ Agent Observer: http://localhost:3000/agents"
    print_success "✓ Dashboard: http://localhost:3000/dashboard"
    echo
    
    print_header "🤖 Active Trading Agents:"
    echo "   • Enhanced Trader (Conservative)"
    echo "   • Enhanced Trader (Balanced)" 
    echo "   • Momentum Trader (Aggressive)"
    echo
    
    print_header "📊 Features Available:"
    echo "   • Real-time agent monitoring"
    echo "   • Live trading event feed"
    echo "   • Portfolio performance tracking"
    echo "   • Risk management dashboard"
    echo "   • WebSocket-powered updates"
    echo
    
    print_header "🌐 Quick Links:"
    echo -e "   • Agent Observer: ${CYAN}http://localhost:3000/agents${NC}"
    echo -e "   • Dashboard:      ${CYAN}http://localhost:3000/dashboard${NC}"
    echo -e "   • Chat Interface: ${CYAN}http://localhost:3000/chat${NC}"
    echo
    
    print_warning "Press Ctrl+C to stop all services"
    echo
    
    # Try to open browser automatically
    if command_exists xdg-open; then
        print_status "Opening browser..."
        xdg-open "http://localhost:3000/agents" >/dev/null 2>&1 &
    elif command_exists open; then
        print_status "Opening browser..."
        open "http://localhost:3000/agents" >/dev/null 2>&1 &
    elif command_exists start; then
        print_status "Opening browser..."
        start "http://localhost:3000/agents" >/dev/null 2>&1 &
    else
        print_status "Please open your browser and navigate to: http://localhost:3000/agents"
    fi
    
    echo
    print_header "🎮 Demo is now running!"
    print_status "Watch the agents trade in real-time..."
    echo
    
    # Keep script running and show live status
    while true; do
        # Check if processes are still running
        if ! kill -0 $AGENT_PID 2>/dev/null; then
            print_error "Trading agent system has stopped unexpectedly"
            break
        fi
        
        if ! kill -0 $WEB_PID 2>/dev/null; then
            print_error "Web application has stopped unexpectedly"
            break
        fi
        
        # Show live status every 30 seconds
        sleep 30
        current_time=$(date '+%H:%M:%S')
        print_status "[$current_time] Demo system running smoothly..."
    done
}

# Run the main function
main "$@"