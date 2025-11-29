// Test Tavily API
const { tavily } = require('@tavily/core');
require('dotenv').config();

// Use API key from environment or fallback to default
const apiKey = process.env.TAVILY_API_KEY || "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";
const tvly = tavily({ apiKey });

console.log('Using API Key:', apiKey.substring(0, 10) + '...\n');

// Test search
async function testTavilySearch() {
  try {
    console.log('Testing Tavily search...\n');
    
    const results = await tvly.search("Who is Leo Messi?");
    
    console.log('Search Results:');
    console.log(JSON.stringify(results, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('\nMake sure to:');
    console.error('1. Replace "tvly-YOUR_API_KEY" with your actual Tavily API key');
    console.error('2. Get your API key from: https://tavily.com/');
  }
}

// Run the test
testTavilySearch();

