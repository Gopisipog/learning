# Getting Started - Quick Reference

The fastest way to get your Text to Blog AI Publisher up and running!

## 🚀 3-Step Quick Start

### Step 1: Start n8n
```bash
npm start
```
Wait for: `Editor is now accessible via: http://localhost:5678`

### Step 2: Import Workflow
1. Open: http://localhost:5678
2. Click: **Workflows** → **Import from File**
3. Select: **`workflows/text-to-blog-simple.json`** ⭐ (Recommended)

### Step 3: Configure & Test
1. Add OpenAI API key (click OpenAI node → Add credential)
2. Update WordPress URL (click WordPress node → change URL)
3. Add WordPress credentials
4. Click **Active** toggle (top right)
5. Test with Postman!

---

## 📬 Test with Postman

### Quick Setup
1. **Method**: POST
2. **URL**: `http://localhost:5678/webhook/create-blog`
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):

```json
{
  "text": "Artificial Intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data, identify patterns, and make predictions with remarkable accuracy.",
  "title": "The AI Revolution: Transforming Our World",
  "author": "Tech Insights Team"
}
```

5. **Click Send** → Get response with WordPress post link!

---

## ✅ Expected Response

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "title": "The AI Revolution: Transforming Our World",
    "wordpressPostId": 123,
    "wordpressLink": "https://your-site.com/?p=123"
  }
}
```

---

## 📚 Documentation Index

Choose what you need:

| Document | When to Use |
|----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | First time setup (5 minutes) |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | Learn all testing methods |
| **[API_REFERENCE.md](API_REFERENCE.md)** | API documentation & examples |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Having issues? Start here |
| **[WORKFLOW_COMPARISON.md](WORKFLOW_COMPARISON.md)** | Compare simple vs advanced |
| **[PLATFORM_SETUP.md](PLATFORM_SETUP.md)** | Detailed platform configuration |
| **[README.md](README.md)** | Complete documentation |

---

## 🎯 Common Tasks

### Change AI Model
1. Click **OpenAI Chat** node
2. Find the JSON body
3. Change `"model": "gpt-4o-mini"` to `"model": "gpt-4o"`

### Publish Instead of Draft
1. Click **Publish to WordPress** node
2. Find: `"status": "draft"`
3. Change to: `"status": "publish"`

### Adjust Creativity
1. Click **OpenAI Chat** node
2. Find: `"temperature": 0.7`
3. Change to `0.9` (more creative) or `0.3` (more focused)

### Make Posts Longer
1. Click **OpenAI Chat** node
2. Find: `"max_tokens": 2000`
3. Change to `3000` or higher

---

## 🔑 Getting API Keys

### OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Click: **Create new secret key**
3. Copy the key (starts with `sk-`)
4. Add to n8n credentials

### WordPress Application Password
1. WordPress Admin → **Users** → **Profile**
2. Scroll to: **Application Passwords**
3. Name: `n8n`
4. Click: **Add New Application Password**
5. Copy the generated password
6. Use with your WordPress username in n8n

---

## 🐛 Quick Troubleshooting

### Import Error: "Could not find property option"
**Solution**: Use `workflows/text-to-blog-simple.json` instead

### Error: Connection Refused
**Solution**: Make sure n8n is running (`npm start`)

### Error: 404 Not Found
**Solution**: Activate the workflow (toggle in top right)

### Error: OpenAI 401 Unauthorized
**Solution**: Check your API key and account has credits

### Error: WordPress 401 Unauthorized
**Solution**: Use application password, not regular password

---

## 💡 Pro Tips

1. **Save Your Postman Request** - Create a collection for easy re-testing
2. **Test Without WordPress First** - Disable WordPress node to test AI generation only
3. **Start with Short Text** - Test with simple content first
4. **Check n8n Executions** - View execution history to debug issues
5. **Export Your Workflow** - Save your customized version

---

## 🎓 Learning Path

### Beginner
1. ✅ Import simple workflow
2. ✅ Test with Postman
3. ✅ View draft in WordPress
4. ✅ Customize AI prompt

### Intermediate
1. ✅ Modify response format
2. ✅ Add categories/tags to WordPress
3. ✅ Change to auto-publish
4. ✅ Add error handling

### Advanced
1. ✅ Add image generation
2. ✅ Integrate with content calendar
3. ✅ Build approval workflow
4. ✅ Add analytics tracking

---

## 📊 What Gets Created

When you send a request:

```
Your Input (JSON)
    ↓
OpenAI Processing (5-15 seconds)
    ↓
WordPress Draft Post Created
    ↓
Response with Post Link
```

The blog post will have:
- ✅ Professional HTML formatting
- ✅ Proper headings (H2, H3)
- ✅ Paragraphs and lists
- ✅ SEO-friendly structure
- ✅ Engaging introduction
- ✅ Clear conclusion

---

## 🔄 Next Steps

After your first successful test:

1. **Customize the AI Prompt**
   - Edit the system message in OpenAI node
   - Adjust for your writing style

2. **Configure WordPress Settings**
   - Add default categories
   - Set featured images
   - Configure SEO plugins

3. **Integrate with Your Workflow**
   - Connect to your CMS
   - Add to content calendar
   - Set up notifications

4. **Scale Up**
   - Process multiple posts
   - Schedule regular publishing
   - Add quality checks

---

## 🆘 Need Help?

1. **Check Documentation** - See index above
2. **View n8n Logs** - Check terminal where n8n is running
3. **Test Each Node** - Click "Execute Node" to test individually
4. **n8n Community** - https://community.n8n.io/
5. **OpenAI Status** - https://status.openai.com/

---

## 📞 Quick Links

- **n8n UI**: http://localhost:5678
- **Webhook URL**: http://localhost:5678/webhook/create-blog
- **OpenAI Dashboard**: https://platform.openai.com/
- **WordPress Admin**: https://your-site.com/wp-admin

---

**Ready to start?** Open Postman and send your first request! 🚀

