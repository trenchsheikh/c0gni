# 🚀 c0gni Trading Agent Demo - Launch Guide

## 🎯 **Get Started in 30 Seconds**

Choose your preferred launch method:

### 🎮 **One-Click Launch** (Recommended)

```bash
# For Linux/Mac users:
./start_demo.sh

# For Windows users:
start_demo.bat
```

**What this does:**
- ✅ Checks all prerequisites automatically
- ✅ Installs Python and Node.js dependencies  
- ✅ Starts 3 different trading agents
- ✅ Launches WebSocket server for real-time updates
- ✅ Starts the web interface
- ✅ Opens browser to agent observer dashboard
- ✅ Provides live status updates
- ✅ Handles cleanup when you press Ctrl+C

### ⚡ **Lightning Quick** (Minimal)

```bash
./quick_start.sh
```

**What this does:**
- 🚀 Fastest way to get running
- 🚀 Minimal output, maximum speed
- 🚀 Perfect for quick testing

### 🛠️ **Manual Control** (Advanced)

If you prefer to run components individually:

1. **Just the agents**: `cd agents && python demo_system.py`
2. **Just the web app**: `npm run dev`  
3. **Just WebSocket server**: `cd agents && python start_websocket.py`

## 🎯 **What You'll See**

After launching, visit these URLs:

- **🤖 Agent Observer**: http://localhost:3000/agents
- **📊 Dashboard**: http://localhost:3000/dashboard  
- **💬 Chat Interface**: http://localhost:3000/chat

## 🤖 **Demo Features**

### Real-time Agent Monitoring
- Live portfolio values and P&L tracking
- Win rates and performance metrics
- Risk level monitoring
- Active position counts

### Live Event Feed
- Trade executions as they happen
- Trading signal generations
- Risk alerts and warnings
- Position open/close events

### Interactive Dashboard  
- Click on agents to see detailed info
- Performance progress bars
- Connection status indicators
- Auto-refresh controls

### Beautiful UI/UX
- Glassmorphism design matching your existing site
- Smooth animations with Framer Motion
- Responsive design for all screen sizes
- Dark theme with purple gradients

## 🔧 **System Architecture**

```
Browser (localhost:3000) ←→ Next.js App ←→ WebSocket Server (localhost:8001)
                                                      ↕
                                               Redis Pub/Sub
                                                      ↕
                                      ┌─────────────────────────────┐
                                      │   Trading Agents Pool       │
                                      │  • Enhanced Trader (Low)    │
                                      │  • Enhanced Trader (Med)    │  
                                      │  • Momentum Trader (High)   │
                                      └─────────────────────────────┘
```

## 🎮 **Demo Scenarios**

The system creates realistic trading scenarios:

- **Conservative Agent**: High-confidence, low-risk trades
- **Balanced Agent**: Medium risk, steady performance  
- **Aggressive Agent**: High-frequency, higher-risk trades

Each agent:
- 📊 Analyzes simulated market data
- 🎯 Generates trading signals with confidence scores
- ⚖️ Applies risk management rules
- 💼 Manages portfolio positions
- 📡 Broadcasts events in real-time
- 🤝 Communicates with other agents

## 🛑 **Stopping the Demo**

- **With launch scripts**: Press `Ctrl+C` (automatic cleanup)
- **Manual processes**: Kill Python and Node.js processes individually

## 🐛 **Troubleshooting**

### Common Issues:

1. **Port conflicts**: 
   - Stop existing services on ports 3000 and 8001
   - Or the scripts will help you identify conflicts

2. **Python/Node not found**:
   - Install Python 3.8+ and Node.js 16+
   - Ensure they're in your system PATH

3. **Dependencies missing**:
   - The launch scripts handle this automatically
   - For manual setup, see `agents/README_DEMO.md`

4. **WebSocket connection fails**:
   - Check that the agent system started successfully
   - Verify port 8001 is accessible
   - Look for error messages in the terminal

### Getting Help:

- Check the detailed documentation: `agents/README_DEMO.md`
- Look for error messages in the console output
- Ensure Redis connection is working (configured in agents/.env)

## 🎉 **Enjoy the Demo!**

You now have a complete autonomous trading system with:
- Multiple AI agents making trading decisions
- Real-time web monitoring interface  
- Professional-grade UI/UX
- Risk management and performance tracking
- WebSocket-powered live updates

**Happy Trading!** 🤖📈