# Tavily Search to File - Quick Start ⚡

Get Tavily search results saved to text files in 3 minutes!

---

## 🎯 What You Get

**Simple workflow**:
```
Send search query → Tavily searches → Results saved to .txt file
```

**Perfect for**:
- ✅ Research and data collection
- ✅ Saving search results offline
- ✅ Building knowledge base
- ✅ Quick information gathering
- ✅ No WordPress needed!

---

## ⚡ 3-Step Setup

### Step 1: Import Workflow (30 sec)

1. Open n8n: http://localhost:5678
2. Click "Workflows" → "Import from File"
3. Select: `workflows/tavily-search-to-file.json`

---

### Step 2: Add Tavily API Key (1 min)

1. Click **"Tavily API Request"** node
2. Find **"JSON Body"** field
3. Replace `'tvly-YOUR_API_KEY'` with your actual key
4. Save

**Get key**: https://tavily.com/ (1,000 free searches/month)

---

### Step 3: Activate & Test (30 sec)

1. Click "Save"
2. Toggle "Active" (top right)
3. Test:

```bash
curl -X POST http://localhost:5678/webhook/tavily-search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is AI?"}'
```

**Done!** Check `~/.n8n/` for your text file!

---

## 🧪 Test Examples

### Simple Search
```json
{
  "query": "What is quantum computing?"
}
```

### Advanced Search
```json
{
  "query": "Climate change solutions",
  "maxResults": 10,
  "searchDepth": "advanced"
}
```

### Quick Search
```json
{
  "query": "Python tips",
  "maxResults": 3
}
```

---

## 📄 Output Example

**File**: `tavily-search-what-is-ai-1732531200000.txt`

```
TAVILY SEARCH RESULTS
======================

Query: What is AI?
Search Depth: basic
Max Results: 5
Timestamp: 2024-11-25T10:00:00.000Z

AI SUMMARY:
-----------
Artificial Intelligence (AI) refers to computer systems
that can perform tasks requiring human intelligence...

SEARCH RESULTS (5 found):
================

1. What is Artificial Intelligence?
   URL: https://example.com/what-is-ai
   Score: 0.95
   Content: AI is the simulation of human intelligence...

[... more results ...]
```

---

## 📁 Where Files Are Saved

**Windows**: `C:\Users\YourUsername\.n8n\`
**Linux/Mac**: `~/.n8n/`

**File format**: `tavily-search-{query}-{timestamp}.txt`

---

## 🎯 Use Cases

### 1. Research Assistant
```bash
curl -X POST http://localhost:5678/webhook/tavily-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Latest AI research papers", "maxResults": 10}'
```

### 2. News Aggregator
```bash
curl -X POST http://localhost:5678/webhook/tavily-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Tech news today", "maxResults": 5}'
```

### 3. Learning Tool
```bash
curl -X POST http://localhost:5678/webhook/tavily-search \
  -H "Content-Type: application/json" \
  -d '{"query": "How does blockchain work?", "searchDepth": "advanced"}'
```

---

## 💰 Cost

- **Free tier**: 1,000 searches/month
- **After free tier**: ~$0.001-0.003 per search
- **This workflow**: FREE for first 1,000 searches!

---

## 🔧 Workflow Nodes

```
Webhook → Extract Parameters → Tavily API Request → Format Results → Write to File → Respond
```

**Total nodes**: 6
**Setup time**: 3 minutes
**No WordPress needed!**

---

## 📊 Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | Required | Search query |
| `maxResults` | number | 5 | Results count (1-10) |
| `searchDepth` | string | "basic" | "basic" or "advanced" |

---

## 🐛 Quick Troubleshooting

**File not found?**
- Check `~/.n8n/` or `C:\Users\YourUsername\.n8n\`

**Tavily error?**
- Verify API key starts with `tvly-`
- Check quota at https://tavily.com/

**Webhook not responding?**
- Make sure workflow is Active
- Verify n8n is running

---

## 📚 Full Documentation

**Detailed guide**: [TAVILY_TO_FILE_SETUP.md](TAVILY_TO_FILE_SETUP.md)

---

## ✅ Quick Test

**PowerShell**:
```powershell
.\test-tavily-to-file.ps1
```

**cURL**:
```bash
curl -X POST http://localhost:5678/webhook/tavily-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello World"}'
```

**Postman**:
```
POST http://localhost:5678/webhook/tavily-search
Body: {"query": "Test search"}
```

---

## 🎉 You're Ready!

1. ✅ Import workflow
2. ✅ Add Tavily API key
3. ✅ Activate
4. ✅ Send test request
5. ✅ Check file in `~/.n8n/`

**Start searching!** 🔍🚀

