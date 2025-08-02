#!/usr/bin/env python3
"""
Setup script for Knowledge Graph Extractor Backend
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🚀 Setting up Knowledge Graph Extractor Backend")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python version: {sys.version}")
    
    # Install requirements
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("\n💡 Try using: pip install --user -r requirements.txt")
        return False
    
    # Download spaCy model
    if not run_command("python -m spacy download en_core_web_sm", "Downloading spaCy English model"):
        print("\n💡 spaCy model download failed. You may need to install it manually.")
        print("Run: python -m spacy download en_core_web_sm")
        return False
    
    # Create directories
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("processed", exist_ok=True)
    print("✅ Created upload and processed directories")
    
    print("\n🎉 Backend setup completed successfully!")
    print("\nTo start the backend server:")
    print("python app.py")
    
    return True

if __name__ == "__main__":
    main()
