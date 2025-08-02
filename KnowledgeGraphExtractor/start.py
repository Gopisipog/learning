#!/usr/bin/env python3
"""
Startup script for Knowledge Graph Extractor
Starts both backend and frontend servers
"""

import subprocess
import sys
import os
import time
import threading
import webbrowser
from pathlib import Path

def run_backend():
    """Start the Flask backend server"""
    print("🔄 Starting backend server...")
    backend_dir = Path(__file__).parent / "backend"
    
    try:
        # Change to backend directory
        os.chdir(backend_dir)
        
        # Start Flask server
        subprocess.run([sys.executable, "app.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend server failed to start: {e}")
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")

def run_frontend():
    """Start the React frontend server"""
    print("🔄 Starting frontend server...")
    frontend_dir = Path(__file__).parent / "frontend"
    
    try:
        # Change to frontend directory
        os.chdir(frontend_dir)
        
        # Check if node_modules exists
        if not (frontend_dir / "node_modules").exists():
            print("📦 Installing frontend dependencies...")
            subprocess.run(["npm", "install"], check=True)
        
        # Start React server
        subprocess.run(["npm", "start"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend server failed to start: {e}")
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")

def check_dependencies():
    """Check if required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    # Check Python
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    
    # Check Node.js
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Node.js is not installed")
            return False
        print(f"✅ Node.js version: {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ Node.js is not installed")
        return False
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ npm is not installed")
            return False
        print(f"✅ npm version: {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ npm is not installed")
        return False
    
    return True

def setup_backend():
    """Setup backend dependencies"""
    backend_dir = Path(__file__).parent / "backend"
    requirements_file = backend_dir / "requirements.txt"
    
    if not requirements_file.exists():
        print("❌ Backend requirements.txt not found")
        return False
    
    print("📦 Setting up backend dependencies...")
    try:
        os.chdir(backend_dir)
        subprocess.run([sys.executable, "setup.py"], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend setup failed: {e}")
        return False

def open_browser():
    """Open browser after servers start"""
    time.sleep(5)  # Wait for servers to start
    print("🌐 Opening browser...")
    webbrowser.open("http://localhost:3000")

def main():
    """Main startup function"""
    print("🚀 Knowledge Graph Extractor Startup")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        print("\n💡 Please install the required dependencies:")
        print("- Python 3.8+: https://python.org")
        print("- Node.js 16+: https://nodejs.org")
        return
    
    # Setup backend
    if not setup_backend():
        print("\n❌ Backend setup failed. Please check the error messages above.")
        return
    
    print("\n🎉 Starting Knowledge Graph Extractor...")
    print("📍 Frontend: http://localhost:3000")
    print("📍 Backend API: http://localhost:5000")
    print("\n⚠️  Press Ctrl+C to stop both servers")
    
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=run_backend, daemon=True)
        backend_thread.start()
        
        # Wait a moment for backend to start
        time.sleep(2)
        
        # Open browser in a separate thread
        browser_thread = threading.Thread(target=open_browser, daemon=True)
        browser_thread.start()
        
        # Start frontend (this will block)
        run_frontend()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down servers...")
        print("👋 Thank you for using Knowledge Graph Extractor!")

if __name__ == "__main__":
    main()
