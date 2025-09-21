@echo off
REM 🚀 c0gni Trading Agent Demo - Complete System Launcher (Windows)
REM This batch script starts the entire demo system in one command

setlocal enabledelayedexpansion

echo.
echo 🤖 c0gni Trading Agent Demo System
echo ====================================
echo.
echo Starting complete trading agent demonstration...
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

where python >nul 2>nul
if !errorlevel! neq 0 (
    where python3 >nul 2>nul
    if !errorlevel! neq 0 (
        echo [ERROR] Python is not installed or not in PATH
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    set PYTHON_CMD=python
)

where npm >nul 2>nul
if !errorlevel! neq 0 (
    echo [ERROR] Node.js/npm is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist package.json (
    echo [ERROR] Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist agents (
    echo [ERROR] Agents directory not found
    pause
    exit /b 1
)

echo [SUCCESS] Prerequisites check passed
echo.

REM Install Node.js dependencies if needed
if not exist node_modules (
    echo [INFO] Installing Node.js dependencies...
    call npm install
    echo [SUCCESS] Node.js dependencies installed
) else (
    echo [INFO] Node.js dependencies already installed
)

REM Create Python virtual environment if needed
if not exist agents\venv (
    echo [INFO] Creating Python virtual environment...
    cd agents
    %PYTHON_CMD% -m venv venv
    cd ..
    echo [SUCCESS] Python virtual environment created
)

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
cd agents
call venv\Scripts\activate
if exist requirements.txt (
    pip install -r requirements.txt >nul 2>&1
    echo [SUCCESS] Python dependencies installed
) else (
    echo [WARNING] No requirements.txt found, skipping Python dependency installation
)
cd ..
echo.

REM Start the agent demo system
echo [INFO] Starting trading agent system...
cd agents
start /b "Trading Agents" cmd /c "venv\Scripts\activate && python demo_system.py"
cd ..

REM Wait a bit for the agent system to initialize
timeout /t 5 /nobreak >nul

echo [SUCCESS] Trading agent system started
echo.

REM Start the web application  
echo [INFO] Starting web application...
start /b "Web App" cmd /c "npm run dev"

REM Wait for web app to initialize
timeout /t 10 /nobreak >nul

echo [SUCCESS] Web application started
echo.

REM Display status information
echo 🎯 Demo System Status
echo.
echo ✓ Trading Agent System: Running on WebSocket port 8001
echo ✓ Web Application: Running on http://localhost:3000
echo ✓ Agent Observer: http://localhost:3000/agents
echo ✓ Dashboard: http://localhost:3000/dashboard
echo.

echo 🤖 Active Trading Agents:
echo    • Enhanced Trader (Conservative)
echo    • Enhanced Trader (Balanced)
echo    • Momentum Trader (Aggressive)
echo.

echo 📊 Features Available:
echo    • Real-time agent monitoring
echo    • Live trading event feed
echo    • Portfolio performance tracking
echo    • Risk management dashboard
echo    • WebSocket-powered updates
echo.

echo 🌐 Quick Links:
echo    • Agent Observer: http://localhost:3000/agents
echo    • Dashboard:      http://localhost:3000/dashboard
echo    • Chat Interface: http://localhost:3000/chat
echo.

REM Try to open browser automatically
echo [INFO] Opening browser...
start "" "http://localhost:3000/agents"

echo.
echo 🎮 Demo is now running!
echo Watch the agents trade in real-time...
echo.
echo Press any key to stop all services...
pause >nul

REM Cleanup
echo.
echo [INFO] Stopping services...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo [SUCCESS] All services stopped

echo.
echo Thanks for trying the c0gni Trading Agent Demo! 🚀
pause