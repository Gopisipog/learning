#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('🎬 Starting Murugan Shorts Preview...');
  console.log('📍 Location:', __dirname);
  
  // Try to run remotion preview
  const remotionPath = path.join(__dirname, 'node_modules', '.bin', 'remotion');
  console.log('🔍 Looking for remotion at:', remotionPath);
  
  // Run the command
  execSync(`node "${remotionPath}" preview src/index.tsx`, {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

