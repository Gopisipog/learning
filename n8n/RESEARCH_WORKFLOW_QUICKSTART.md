# Research Workflow Quick Start - 5 Minutes ⚡

Create well-researched blog posts with AI-powered research!

---

## 🎯 What You Get

**Before** (Simple workflow):
```
Input Text → OpenAI → Blog Post
```

**After** (Research workflow):
```
Input Text → Tavily Research → Enhanced Content → OpenAI → Better Blog Post
```

**Benefits**:
- ✅ Fact-based content
- ✅ Credible sources cited
- ✅ AI research summaries
- ✅ Higher quality blogs
- ✅ SEO-friendly content

---

## ⚡ Quick Setup - 5 Steps

### Step 1: Import Workflow (1 min)

1. **Start n8n**: `npm start`
2. **Open**: http://localhost:5678
3. **Import**: `workflows/text-to-blog-with-research.json`

---

### Step 2: Add Tavily API Key (1 min)

1. **Get API key**: https://tavily.com/ (free tier: 1,000 searches/month)

2. **Click "Tavily Research" node**

3. **Find this line**:
   ```javascript
   const tvly = tavily({ apiKey: 'tvly-YOUR_API_KEY' });
   ```

4. **Replace with your key**:
   ```javascript
   const tvly = tavily({ apiKey: 'tvly-abc123...' });
   ```

5. **Save** (click outside)

---

### Step 3: Add OpenAI Credentials (1 min)

1. **Click "OpenAI Chat" node**
2. **Add credential** → Select "OpenAI API"
3. **Enter your OpenAI API key**
4. **Save**

---

### Step 4: Configure WordPress (2 min)

1. **Click "Publish to WordPress" node**

2. **Update URL**:
   ```
   https://yourblog.com/wp-json/wp/v2/posts
   ```

3. **Add credentials**:
   - Type: HTTP Basic Auth
   - User: Your WordPress username
   - Password: WordPress application password

---

### Step 5: Activate & Test (1 min)

1. **Click "Active" toggle** (top right)

2. **Test with Postman**:
   ```
   POST http://localhost:5678/webhook/create-blog
   Content-Type: application/json
   
   {
     "text": "AI is transforming healthcare with machine learning.",
     "title": "AI in Healthcare 2024",
     "author": "Tech Team"
   }
   ```

3. **Get response**:
   ```json
   {
     "success": true,
     "message": "Blog post created successfully with research",
     "data": {
       "title": "AI in Healthcare 2024",
       "wordCount": 687,
       "researchSummary": "AI in healthcare has shown...",
       "sourcesCount": 5,
       "wordpressPostId": 123,
       "wordpressLink": "https://yourblog.com/?p=123"
     }
   }
   ```

---

## 🔍 How It Works

### 1. Input
```json
{
  "text": "Your content here",
  "title": "Blog Title",
  "author": "Author Name"
}
```

### 2. Tavily Research
- Searches web for: "Blog Title + Your content"
- Finds 5 credible sources
- Generates AI research summary
- Extracts key information

### 3. Enhanced Content
```
Original: "Your content here"
+
Research: "AI-generated summary from 5 sources"
+
Sources: [Wikipedia, TechCrunch, Forbes, ...]
```

### 4. OpenAI Generation
- Receives enhanced content
- Generates comprehensive blog
- Naturally integrates research
- Cites sources in content

### 5. WordPress Publishing
- Creates draft post
- Adds research summary as excerpt
- Includes all content
- Returns post link

---

## 💡 Example Flow

### Input:
```
Title: "Cloud Computing Trends 2024"
Text: "Cloud computing is evolving rapidly."
```

### Tavily Finds:
```
✅ 5 credible sources
✅ Latest statistics
✅ Industry trends
✅ Expert opinions
✅ AI-generated summary
```

### OpenAI Creates:
```
📝 800-word blog post
📝 Well-structured with H2/H3
📝 Research naturally integrated
📝 Professional tone
📝 SEO-optimized
```

### WordPress Gets:
```
✅ Draft post created
✅ Research summary as excerpt
✅ HTML-formatted content
✅ Ready to review & publish
```

---

## 📊 What's Different?

| Feature | Simple Workflow | Research Workflow |
|---------|----------------|-------------------|
| **Research** | ❌ None | ✅ Tavily AI |
| **Sources** | ❌ None | ✅ 5 credible sources |
| **Summary** | ❌ None | ✅ AI research summary |
| **Quality** | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Cost** | $0.01-0.05 | $0.011-0.053 |
| **Setup** | 5 min | 10 min |

**Extra cost**: ~$0.001 per post (Tavily)
**Extra value**: Much higher quality content!

---

## 💰 Pricing

### Per Blog Post
- **Tavily**: $0.001 - $0.003 (1 search)
- **OpenAI**: $0.01 - $0.05 (GPT-4o-mini)
- **Total**: ~$0.011 - $0.053

### Free Tiers
- **Tavily**: 1,000 searches/month FREE
- **OpenAI**: $5 credit for new accounts

**First 1,000 posts**: Essentially same cost as simple workflow!

---

## 🎯 API Keys Needed

1. **Tavily API Key**
   - Get: https://tavily.com/
   - Free: 1,000 searches/month
   - Cost: $0.001 per search after

2. **OpenAI API Key**
   - Get: https://platform.openai.com/api-keys
   - Cost: ~$0.01-0.05 per blog

3. **WordPress Application Password**
   - Create in: WordPress → Users → Profile
   - Free: Always

---

## ✅ Checklist

Before testing:

- [ ] Tavily installed (`@tavily/core` ✅ already installed)
- [ ] Tavily API key obtained
- [ ] Tavily key added to workflow
- [ ] OpenAI credentials configured
- [ ] WordPress URL updated
- [ ] WordPress credentials added
- [ ] Workflow activated
- [ ] Test request sent
- [ ] Draft post created in WordPress

---

## 🐛 Quick Troubleshooting

### "tavily is not defined"
```bash
npm install @tavily/core
```

### "Invalid Tavily API key"
- Check key starts with `tvly-`
- Verify at https://tavily.com/

### Research fails but workflow continues
- This is normal! Workflow has error handling
- Blog still generated without research
- Check Tavily quota

### No sources in response
- Tavily might not find relevant sources
- Try different topic
- Check API quota

---

## 📚 Full Documentation

- **Detailed Setup**: [RESEARCH_WORKFLOW_SETUP.md](RESEARCH_WORKFLOW_SETUP.md)
- **Compare Workflows**: [WORKFLOW_VERSIONS.md](WORKFLOW_VERSIONS.md)
- **Tavily Guide**: [TAVILY_QUICKSTART.md](TAVILY_QUICKSTART.md)
- **Testing**: [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🎉 You're Ready!

**Next steps**:
1. ✅ Get Tavily API key: https://tavily.com/
2. ✅ Follow 5-step setup above
3. ✅ Test with sample content
4. ✅ Review blog in WordPress
5. ✅ Create amazing content!

---

**Questions?** Check [RESEARCH_WORKFLOW_SETUP.md](RESEARCH_WORKFLOW_SETUP.md) for detailed guide! 🚀

