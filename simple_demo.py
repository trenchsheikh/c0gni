#!/usr/bin/env python3
"""
Simple demo script that starts just the web interface for immediate testing.
This bypasses complex Python dependencies and focuses on the UI.
"""

import subprocess
import sys
import time
import webbrowser
from threading import Thread

def check_dependencies():
    """Check if basic dependencies are available."""
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ npm not found. Please install Node.js.")
            return False
        print(f"✅ npm found: {result.stdout.strip()}")
        
        result = subprocess.run(['node', '--version'], capture_output=True, text=True) 
        if result.returncode != 0:
            print("❌ node not found. Please install Node.js.")
            return False
        print(f"✅ node found: {result.stdout.strip()}")
        
        return True
    except FileNotFoundError:
        print("❌ npm/node not found. Please install Node.js.")
        return False

def install_npm_deps():
    """Install npm dependencies if needed."""
    print("📦 Checking npm dependencies...")
    try:
        result = subprocess.run(['npm', 'install'], check=True, capture_output=True, text=True)
        print("✅ npm dependencies ready")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install npm dependencies: {e}")
        return False

def start_web_server():
    """Start the Next.js development server."""
    print("🌐 Starting web server...")
    try:
        # Start npm run dev in background
        process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return process
    except Exception as e:
        print(f"❌ Failed to start web server: {e}")
        return None

def wait_for_server(max_wait=30):
    """Wait for the web server to be ready."""
    print("⏳ Waiting for web server to be ready...")
    
    import urllib.request
    import urllib.error
    
    for i in range(max_wait):
        try:
            urllib.request.urlopen('http://localhost:3000', timeout=2)
            print("✅ Web server is ready!")
            return True
        except urllib.error.URLError:
            time.sleep(1)
            if i % 5 == 0 and i > 0:
                print(f"   Still waiting... ({i}s)")
    
    print("⚠️  Web server might not be ready, but continuing...")
    return False

def open_browser():
    """Open the browser to the agent observer."""
    urls = [
        'http://localhost:3000/agents',
        'http://localhost:3000/dashboard',
        'http://localhost:3000'
    ]
    
    print("🌐 Opening browser...")
    for url in urls:
        try:
            webbrowser.open(url)
            print(f"   Opened: {url}")
            break
        except Exception as e:
            print(f"   Failed to open {url}: {e}")

def main():
    print("🚀 c0gni Simple Demo - Web Interface Only")
    print("==========================================")
    print()
    print("This demo starts just the web interface with simulated data.")
    print("Perfect for testing the UI without complex Python setup.")
    print()
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Dependencies not met. Please install Node.js and try again.")
        return 1
    
    # Install npm dependencies
    if not install_npm_deps():
        print("\n❌ Failed to install dependencies.")
        return 1
    
    # Start web server
    web_process = start_web_server()
    if not web_process:
        print("\n❌ Failed to start web server.")
        return 1
    
    try:
        # Wait for server to be ready
        wait_for_server()
        
        # Open browser
        open_browser()
        
        print()
        print("🎯 Demo Status:")
        print("   ✅ Web Interface: http://localhost:3000")
        print("   ✅ Agent Observer: http://localhost:3000/agents")
        print("   ✅ Dashboard: http://localhost:3000/dashboard")
        print()
        print("🤖 Note: This demo uses simulated agent data.")
        print("   The UI will show fake trading agents with animated updates.")
        print("   For real agent functionality, use the full demo system.")
        print()
        print("Press Ctrl+C to stop...")
        
        # Keep running
        web_process.wait()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping demo...")
        web_process.terminate()
        try:
            web_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            web_process.kill()
        print("✅ Demo stopped")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        web_process.terminate()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())