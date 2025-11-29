# Research-Enhanced Blog Workflow Setup

Complete guide to set up the Tavily research-enhanced n8n workflow.

## 🎯 What This Workflow Does

```
1. Receive text input via webhook
   ↓
2. Research topic with Tavily AI  ← NEW!
   ↓
3. Combine original text + research
   ↓
4. Generate comprehensive blog with OpenAI
   ↓
5. Publish to WordPress with research summary
   ↓
6. Return success response with sources
```

**Result**: Well-researched, fact-based blog posts with credible sources!

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ n8n installed and running
- ✅ Tavily API key ([Get one](https://tavily.com/))
- ✅ OpenAI API key ([Get one](https://platform.openai.com/api-keys))
- ✅ WordPress site with REST API enabled
- ✅ WordPress application password

---

## 🚀 Setup - 5 Steps

### Step 1: Import the Workflow (1 min)

1. **Start n8n**:
   ```bash
   npm start
   ```

2. **Open n8n**: http://localhost:5678

3. **Import workflow**:
   - Click **Workflows** → **Import from File**
   - Select: `workflows/text-to-blog-with-research.json`
   - Click **Import**

---

### Step 2: Configure Tavily API Key (1 min)

1. **Click on "Tavily Research" node**

2. **Find this line in the code**:
   ```javascript
   const tvly = tavily({ apiKey: 'tvly-YOUR_API_KEY' });
   ```

3. **Replace with your actual Tavily API key**:
   ```javascript
   const tvly = tavily({ apiKey: 'tvly-abc123xyz...' });
   ```

4. **Click outside to save**

**Don't have a Tavily API key?**
- Get one at: https://tavily.com/
- Free tier: 1,000 searches/month

---

### Step 3: Configure OpenAI Credentials (1 min)

1. **Click on "OpenAI Chat" node**

2. **Click "Credential to connect with" dropdown**

3. **Select existing or create new**:
   - Click **"- Create New -"**
   - Select **"OpenAI API"**
   - Enter your OpenAI API key
   - Click **"Save"**

---

### Step 4: Configure WordPress (2 min)

1. **Click on "Publish to WordPress" node**

2. **Update the URL**:
   - Change from: `https://your-wordpress-site.com/wp-json/wp/v2/posts`
   - To your site: `https://yourblog.com/wp-json/wp/v2/posts`

3. **Add WordPress credentials**:
   - Click **"Credential to connect with"** dropdown
   - Click **"- Create New -"**
   - Select **"HTTP Basic Auth"**
   - Enter:
     - **User**: Your WordPress username
     - **Password**: Your WordPress application password
   - Click **"Save"**

---

### Step 5: Activate Workflow (30 sec)

1. **Click the "Active" toggle** (top right)
2. **Status should show "Active"** (green/blue)

---

## ✅ Test the Workflow

### Using Postman

1. **Create POST request**:
   - URL: `http://localhost:5678/webhook/create-blog`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):

```json
{
  "text": "Artificial Intelligence is transforming industries worldwide. Machine learning algorithms are becoming more sophisticated, enabling automation and intelligent decision-making across sectors.",
  "title": "The AI Revolution in 2024",
  "author": "Tech Insights Team"
}
```

2. **Click Send**

3. **Expected Response**:

```json
{
  "success": true,
  "message": "Blog post created successfully with research",
  "data": {
    "title": "The AI Revolution in 2024",
    "wordCount": 650,
    "researchSummary": "Artificial Intelligence in 2024 has seen significant advancements...",
    "sourcesCount": 5,
    "wordpressPostId": 123,
    "wordpressLink": "https://yourblog.com/?p=123"
  }
}
```

---

## 🔍 How the Research Works

### Tavily Research Node

The workflow uses a **Code node** to:

1. **Initialize Tavily** with your API key
2. **Search** for information about the topic
3. **Get AI summary** of research findings
4. **Extract sources** (up to 5 credible sources)
5. **Combine** original text with research
6. **Pass enhanced content** to OpenAI

### What Gets Researched

The workflow searches for:
- **Topic**: Your blog title + input text
- **Depth**: Advanced search (more comprehensive)
- **Results**: Top 5 most relevant sources
- **Summary**: AI-generated research summary

### Research Output

The research node provides:
- `researchSummary`: AI summary of findings
- `sources`: Array of credible sources with URLs
- `enhancedContent`: Original text + research combined

---

## 📊 Workflow Nodes Explained

| Node | Purpose | Configuration Needed |
|------|---------|---------------------|
| **Webhook** | Receives POST requests | None (auto-configured) |
| **Extract Input** | Parses text, title, author | None |
| **Tavily Research** | Researches topic | ✅ Tavily API key |
| **OpenAI Chat** | Generates blog post | ✅ OpenAI credentials |
| **Format Blog** | Structures response | None |
| **Publish to WordPress** | Creates draft post | ✅ WordPress URL & credentials |
| **Respond to Webhook** | Returns success response | None |

---

## 💡 Customization Options

### Adjust Research Depth

In the **Tavily Research** node, change:

```javascript
// More results (up to 10)
maxResults: 10,

// Basic search (faster, less comprehensive)
searchDepth: 'basic',
```

### Change AI Model

In the **OpenAI Chat** node, change:

```javascript
model: 'gpt-4o',  // More powerful, more expensive
// OR
model: 'gpt-4o-mini',  // Faster, cheaper
```

### Auto-Publish Instead of Draft

In the **Publish to WordPress** node, change:

```javascript
status: 'publish',  // Auto-publish
// Instead of
status: 'draft',  // Save as draft
```

### Include Research Sources in Post

Modify the OpenAI prompt to include sources at the end:

```javascript
content: $json.enhancedContent + '\\n\\nPlease include a "Sources" section at the end with the research sources.'
```

---

## 🐛 Troubleshooting

### Error: "tavily is not defined"

**Cause**: Tavily package not installed

**Solution**:
```bash
npm install @tavily/core
```

### Error: "Invalid Tavily API key"

**Cause**: Wrong or missing API key

**Solution**:
1. Check your API key at https://tavily.com/
2. Make sure it starts with `tvly-`
3. Update the key in the "Tavily Research" node

### Research Node Fails But Workflow Continues

**This is normal!** The workflow has error handling:
- If Tavily fails, it continues without research
- Blog post is still generated with original text
- Check the error message in n8n execution log

### No Research Summary in Response

**Cause**: Tavily didn't return a summary

**Solution**:
- Check your Tavily API quota
- Try a different search query
- The workflow will still work, just without research

---

## 💰 Cost Estimate

### Per Blog Post

| Service | Cost | Notes |
|---------|------|-------|
| **Tavily** | $0.001 - $0.003 | 1 search per post |
| **OpenAI** | $0.01 - $0.05 | GPT-4o-mini |
| **WordPress** | Free | Self-hosted or WordPress.com |
| **Total** | ~$0.011 - $0.053 | Per blog post |

### Monthly (100 posts)

- **Tavily**: $0.10 - $0.30
- **OpenAI**: $1 - $5
- **Total**: ~$1.10 - $5.30/month

**Free tiers**:
- Tavily: 1,000 searches/month free
- OpenAI: $5 free credit for new accounts

---

## 🎯 Example: Complete Flow

### Input:
```json
{
  "text": "Cloud computing is changing how businesses operate.",
  "title": "Cloud Computing Trends 2024",
  "author": "Tech Team"
}
```

### Tavily Research:
```
Searches for: "Cloud Computing Trends 2024 Cloud computing is changing..."
Returns:
- AI Summary: "Cloud computing in 2024 shows growth in..."
- 5 Sources: Wikipedia, TechCrunch, Forbes, etc.
```

### OpenAI Generation:
```
Receives: Original text + Research summary + Sources
Generates: Comprehensive 600-800 word blog post
Includes: Research findings naturally integrated
```

### WordPress:
```
Creates draft post with:
- Title: "Cloud Computing Trends 2024"
- Content: AI-generated blog (HTML formatted)
- Excerpt: Research summary
```

### Response:
```json
{
  "success": true,
  "data": {
    "title": "Cloud Computing Trends 2024",
    "wordCount": 687,
    "researchSummary": "Cloud computing in 2024...",
    "sourcesCount": 5,
    "wordpressPostId": 45,
    "wordpressLink": "https://yourblog.com/?p=45"
  }
}
```

---

## 📝 Next Steps

After setup:

1. ✅ Test with sample content
2. ✅ Review generated blog in WordPress
3. ✅ Adjust research depth if needed
4. ✅ Customize AI prompt for your style
5. ✅ Set up monitoring for API usage
6. ✅ Create more blog posts!

---

## 🔒 Security Best Practices

1. **Store API keys securely**:
   - Use environment variables
   - Don't commit keys to git
   - Rotate keys regularly

2. **Limit WordPress permissions**:
   - Use application passwords
   - Create dedicated user with Editor role
   - Revoke unused passwords

3. **Monitor API usage**:
   - Check Tavily dashboard
   - Monitor OpenAI usage
   - Set up billing alerts

---

## 📚 Additional Resources

- **Tavily Docs**: https://docs.tavily.com/
- **OpenAI Docs**: https://platform.openai.com/docs
- **WordPress REST API**: https://developer.wordpress.org/rest-api/
- **n8n Docs**: https://docs.n8n.io/

---

**Ready to create well-researched blog posts?** Follow the setup steps and start testing! 🚀

