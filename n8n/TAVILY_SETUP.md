# Tavily Setup Guide

Tavily is a search API optimized for AI applications. Use it to enhance your blog posts with real-time information.

## ✅ Installation Complete

Tavily has been installed in your project:
```bash
npm install @tavily/core  ✅ DONE
```

---

## 🔑 Get Your Tavily API Key

### Step 1: Sign Up

1. Go to: https://tavily.com/
2. Click **"Get Started"** or **"Sign Up"**
3. Create an account (free tier available)

### Step 2: Get API Key

1. Login to your Tavily dashboard
2. Navigate to **API Keys** section
3. Copy your API key (starts with `tvly-`)
4. Save it securely

**Free Tier**: 1,000 searches per month

---

## 🧪 Test Tavily

### Quick Test

1. **Update the test file** with your API key:

Open `test-tavily.js` and replace:
```javascript
const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
```

With your actual key:
```javascript
const tvly = tavily({ apiKey: "tvly-abc123xyz..." });
```

2. **Run the test**:
```bash
node test-tavily.js
```

3. **Expected output**:
```json
{
  "results": [
    {
      "title": "Lionel Messi - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Lionel_Messi",
      "content": "Lionel Andrés Messi is an Argentine professional footballer...",
      "score": 0.98
    }
  ],
  "query": "Who is Leo Messi?"
}
```

---

## 🔌 Use Tavily in Your Workflow

### Option 1: Add Research Step to n8n Workflow

You can enhance your blog workflow to research topics before generating content.

**Example workflow**:
```
1. Receive text input
   ↓
2. Search Tavily for related information  ← NEW!
   ↓
3. Combine original text + research
   ↓
4. Generate blog with OpenAI
   ↓
5. Publish to WordPress
```

### Option 2: Standalone Research Script

Create a script to research topics:

```javascript
const { tavily } = require('@tavily/core');

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

async function researchTopic(topic) {
  const results = await tvly.search(topic, {
    searchDepth: "advanced",
    maxResults: 5
  });
  
  return results;
}

// Use it
researchTopic("Latest AI trends 2024")
  .then(results => console.log(results));
```

---

## 📝 Tavily API Examples

### Basic Search

```javascript
const { tavily } = require('@tavily/core');
const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

// Simple search
const results = await tvly.search("What is artificial intelligence?");
console.log(results);
```

### Advanced Search

```javascript
// Advanced search with options
const results = await tvly.search("Climate change solutions", {
  searchDepth: "advanced",      // "basic" or "advanced"
  maxResults: 10,                // Number of results (default: 5)
  includeImages: true,           // Include images
  includeAnswer: true,           // Include AI-generated answer
  includeDomains: [],            // Specific domains to search
  excludeDomains: []             // Domains to exclude
});

console.log(results.answer);     // AI-generated answer
console.log(results.results);    // Search results
console.log(results.images);     // Related images
```

### Search with Context

```javascript
// Search with additional context
const results = await tvly.search("Best practices", {
  searchDepth: "advanced",
  context: "software development and coding"
});
```

---

## 🔧 Integration with n8n

### Method 1: Use HTTP Request Node

1. **Add HTTP Request node** to your workflow
2. **Configure**:
   - Method: `POST`
   - URL: `https://api.tavily.com/search`
   - Headers: `Content-Type: application/json`
   - Body:
   ```json
   {
     "api_key": "tvly-YOUR_API_KEY",
     "query": "{{ $json.topic }}",
     "search_depth": "advanced",
     "max_results": 5
   }
   ```

### Method 2: Use Code Node

1. **Add Code node** to your workflow
2. **Add this code**:

```javascript
const { tavily } = require('@tavily/core');

const tvly = tavily({ 
  apiKey: "tvly-YOUR_API_KEY" 
});

// Get topic from previous node
const topic = $input.item.json.text;

// Search Tavily
const results = await tvly.search(topic, {
  searchDepth: "advanced",
  maxResults: 5
});

// Return results
return {
  json: {
    originalText: topic,
    researchResults: results.results,
    answer: results.answer
  }
};
```

---

## 🎯 Use Cases for Blog Workflow

### 1. Fact-Checking
Research facts before generating blog content:
```javascript
const facts = await tvly.search("Latest statistics on " + topic);
```

### 2. Current Events
Get latest information on trending topics:
```javascript
const news = await tvly.search(topic, {
  searchDepth: "advanced",
  includeAnswer: true
});
```

### 3. SEO Keywords
Research popular keywords and topics:
```javascript
const seo = await tvly.search("trending keywords for " + industry);
```

### 4. Competitive Research
Find what others are writing about:
```javascript
const competitors = await tvly.search(topic, {
  maxResults: 10,
  includeDomains: ["medium.com", "dev.to"]
});
```

---

## 💰 Pricing

| Plan | Searches/Month | Price |
|------|----------------|-------|
| **Free** | 1,000 | $0 |
| **Basic** | 10,000 | $29/mo |
| **Pro** | 100,000 | $99/mo |
| **Enterprise** | Custom | Contact |

**Cost per search**: ~$0.001 - $0.003

---

## 🔒 Environment Variables

Store your API key securely:

### 1. Create `.env` file

```bash
TAVILY_API_KEY=tvly-your-actual-key-here
```

### 2. Install dotenv

```bash
npm install dotenv
```

### 3. Use in code

```javascript
require('dotenv').config();
const { tavily } = require('@tavily/core');

const tvly = tavily({ 
  apiKey: process.env.TAVILY_API_KEY 
});
```

---

## 📊 Enhanced Blog Workflow Example

Here's how to create a research-enhanced blog workflow:

```javascript
const { tavily } = require('@tavily/core');
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function createResearchedBlog(topic, originalText) {
  // 1. Research the topic
  const research = await tvly.search(topic, {
    searchDepth: "advanced",
    maxResults: 5,
    includeAnswer: true
  });
  
  // 2. Combine original text with research
  const enhancedContent = `
    Original Content: ${originalText}
    
    Research Findings:
    ${research.answer}
    
    Sources:
    ${research.results.map(r => `- ${r.title}: ${r.content}`).join('\n')}
  `;
  
  // 3. Send to OpenAI for blog generation
  // (Your existing OpenAI code here)
  
  return enhancedContent;
}
```

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Check your API key is correct
- Make sure it starts with `tvly-`
- Verify your account is active

### Error: "Rate limit exceeded"
- You've exceeded your monthly quota
- Upgrade your plan or wait for reset

### Error: "Module not found"
- Run: `npm install @tavily/core`
- Make sure you're in the correct directory

---

## 📚 Resources

- **Tavily Website**: https://tavily.com/
- **API Documentation**: https://docs.tavily.com/
- **Pricing**: https://tavily.com/pricing
- **Support**: support@tavily.com

---

## ✅ Next Steps

1. **Get your API key**: https://tavily.com/
2. **Test the integration**: Run `node test-tavily.js`
3. **Add to workflow**: Enhance your blog generation
4. **Monitor usage**: Check your Tavily dashboard

---

**Ready to enhance your blogs with real-time research?** Get your API key and start testing! 🚀

