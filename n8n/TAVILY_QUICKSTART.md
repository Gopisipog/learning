# Tavily Quick Start - 3 Minutes ⚡

Add AI-powered research to your blog workflow!

---

## ✅ Installation Complete

Tavily has been installed:
```bash
✅ @tavily/core installed
✅ Test file created (test-tavily.js)
✅ Documentation ready (TAVILY_SETUP.md)
```

---

## 🚀 Quick Start - 3 Steps

### Step 1: Get API Key (1 min)

1. **Sign up**: https://tavily.com/
2. **Get your API key** from the dashboard
3. **Copy it** (starts with `tvly-`)

**Free tier**: 1,000 searches/month

---

### Step 2: Test Tavily (1 min)

1. **Open** `test-tavily.js`

2. **Replace** the API key:
   ```javascript
   const tvly = tavily({ apiKey: "tvly-YOUR_ACTUAL_KEY" });
   ```

3. **Run the test**:
   ```bash
   npm run test:tavily
   ```
   
   OR
   
   ```bash
   node test-tavily.js
   ```

4. **See results**:
   ```json
   {
     "results": [
       {
         "title": "Lionel Messi - Wikipedia",
         "content": "Lionel Andrés Messi is an Argentine...",
         "url": "https://en.wikipedia.org/wiki/Lionel_Messi"
       }
     ]
   }
   ```

---

### Step 3: Use in Your Code (1 min)

```javascript
const { tavily } = require('@tavily/core');

const tvly = tavily({ apiKey: "tvly-YOUR_KEY" });

// Search for information
const results = await tvly.search("Who is Leo Messi?");
console.log(results);
```

---

## 💡 What Can You Do With Tavily?

### 1. Research Topics Before Writing
```javascript
// Research a topic
const research = await tvly.search("Latest AI trends 2024");

// Use research in your blog
const blogPrompt = `
  Write a blog about AI trends.
  Research: ${research.answer}
`;
```

### 2. Fact-Check Content
```javascript
// Verify facts
const facts = await tvly.search("Is AI replacing jobs?", {
  searchDepth: "advanced",
  includeAnswer: true
});
```

### 3. Get Current Information
```javascript
// Get latest news
const news = await tvly.search("Latest developments in " + topic);
```

### 4. Find Related Content
```javascript
// Find similar articles
const related = await tvly.search(topic, {
  maxResults: 10
});
```

---

## 🔌 Add to n8n Workflow

### Option 1: Code Node (Recommended)

1. **Add Code node** before OpenAI node
2. **Paste this code**:

```javascript
const { tavily } = require('@tavily/core');

const tvly = tavily({ 
  apiKey: "tvly-YOUR_KEY" 
});

// Get input
const topic = $input.item.json.text;

// Research topic
const research = await tvly.search(topic, {
  searchDepth: "advanced",
  maxResults: 5,
  includeAnswer: true
});

// Return enhanced content
return {
  json: {
    originalText: topic,
    researchSummary: research.answer,
    sources: research.results,
    enhancedPrompt: `${topic}\n\nResearch: ${research.answer}`
  }
};
```

3. **Connect** to OpenAI node
4. **Use** `$json.enhancedPrompt` in OpenAI

---

### Option 2: HTTP Request Node

1. **Add HTTP Request node**
2. **Configure**:
   - Method: `POST`
   - URL: `https://api.tavily.com/search`
   - Body:
   ```json
   {
     "api_key": "tvly-YOUR_KEY",
     "query": "{{ $json.text }}",
     "search_depth": "advanced"
   }
   ```

---

## 📊 Enhanced Workflow

```
Input Text
   ↓
Research with Tavily  ← NEW!
   ↓
Combine Text + Research
   ↓
Generate Blog with OpenAI
   ↓
Publish to WordPress
```

**Result**: More accurate, well-researched blog posts!

---

## 💰 Pricing

| Plan | Searches | Cost |
|------|----------|------|
| Free | 1,000/mo | $0 |
| Basic | 10,000/mo | $29/mo |
| Pro | 100,000/mo | $99/mo |

**Cost per search**: ~$0.001

---

## 🔒 Store API Key Securely

### Create `.env` file:

```bash
TAVILY_API_KEY=tvly-your-actual-key
```

### Use in code:

```javascript
require('dotenv').config();

const tvly = tavily({ 
  apiKey: process.env.TAVILY_API_KEY 
});
```

### Install dotenv:

```bash
npm install dotenv
```

---

## 🧪 Test Commands

```bash
# Test Tavily
npm run test:tavily

# Or directly
node test-tavily.js
```

---

## 📚 Documentation

- **Quick Start**: This file
- **Detailed Guide**: [TAVILY_SETUP.md](TAVILY_SETUP.md)
- **API Docs**: https://docs.tavily.com/
- **Get API Key**: https://tavily.com/

---

## ✅ Next Steps

1. ✅ Tavily installed
2. ⚠️ Get API key: https://tavily.com/
3. ⚠️ Test: `npm run test:tavily`
4. ⚠️ Add to workflow
5. ⚠️ Create better blogs!

---

## 🎯 Example: Complete Research Flow

```javascript
const { tavily } = require('@tavily/core');

async function createResearchedBlog(topic) {
  const tvly = tavily({ apiKey: "tvly-YOUR_KEY" });
  
  // 1. Research
  const research = await tvly.search(topic, {
    searchDepth: "advanced",
    maxResults: 5,
    includeAnswer: true
  });
  
  // 2. Create enhanced prompt
  const prompt = `
    Topic: ${topic}
    
    Research Summary: ${research.answer}
    
    Key Sources:
    ${research.results.map(r => `- ${r.title}`).join('\n')}
    
    Write a comprehensive blog post incorporating this research.
  `;
  
  // 3. Send to OpenAI (your existing code)
  // const blog = await openai.chat.completions.create({...});
  
  return prompt;
}
```

---

**Ready to add research to your blogs?** Get your API key and start testing! 🚀

