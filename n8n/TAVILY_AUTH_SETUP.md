# Tavily API Authentication Setup for n8n

## ✅ Configuration Complete

Your Tavily API authentication has been configured! Here's what was set up:

### 1. Environment Variables (`.env` file)

```bash
TAVILY_API_KEY=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
```

### 2. Updated Workflows

Both workflows now use the environment variable:

**text-to-blog-with-research.json**
- Code Node: `Tavily Research` 
- Uses: `process.env.TAVILY_API_KEY`

**tavily-search-to-file.json**
- HTTP Request: `Tavily API Request`
- Uses: `$env.TAVILY_API_KEY`

---

## 🔑 How to Update Your API Key

### Option 1: Environment Variable (Recommended)

1. Open `.env` file
2. Update the `TAVILY_API_KEY` value:
   ```bash
   TAVILY_API_KEY=tvly-your-actual-api-key-here
   ```
3. Restart n8n:
   ```bash
   npm start
   ```

### Option 2: Direct in Workflow (Not Recommended)

You can also hardcode in the workflow, but this is less secure:

**For text-to-blog-with-research.json:**
- Open workflow in n8n
- Click on "Tavily Research" node
- Edit the code to replace the apiKey value

**For tavily-search-to-file.json:**
- Open workflow in n8n
- Click on "Tavily API Request" node
- Edit the JSON Body to replace the api_key value

---

## 🧪 Test Your Setup

### Test 1: Using the test script

```bash
node test-tavily.js
```

This should return search results about "Leo Messi".

### Test 2: Using n8n workflow

1. Start n8n: `npm start`
2. Import `tavily-search-to-file.json` workflow
3. Execute the workflow with a test query
4. Check for results in the output

---

## 📋 Current API Key

Your current API key is configured as:
```
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
```

**⚠️ Note**: This appears to be a development key. For production use:
1. Get your own key from https://tavily.com/
2. Update the `.env` file
3. Restart n8n

---

## 🔒 Security Best Practices

✅ **DO:**
- Store API keys in `.env` file (never commit to Git)
- Use environment variables in workflows
- Keep `.env` file in `.gitignore`

❌ **DON'T:**
- Hardcode API keys in workflow JSON files
- Commit `.env` file to version control
- Share your API keys publicly

---

## 🚀 Quick Start Commands

```bash
# 1. Create .env file (if not exists)
cp .env.example .env

# 2. Edit .env file with your API key
notepad .env

# 3. Test Tavily API
node test-tavily.js

# 4. Start n8n
npm start
```

---

## 🆘 Troubleshooting

### Error: "Invalid API key"
- Check `.env` file has correct key format: `tvly-xxxxx`
- Restart n8n after updating `.env`
- Verify key at https://tavily.com/

### Error: "TAVILY_API_KEY not found"
- Ensure `.env` file exists in project root
- Check n8n is loading environment variables
- Try hardcoding temporarily for testing

### Workflow fails silently
- Check n8n logs for errors
- Verify `@tavily/core` package is installed: `npm list @tavily/core`
- Test with `test-tavily.js` first

---

## 📚 Additional Resources

- [Tavily API Docs](https://docs.tavily.com/)
- [n8n Environment Variables](https://docs.n8n.io/hosting/environment-variables/)
- [Get Tavily API Key](https://tavily.com/)

---

## ✨ What's Next?

Now that authentication is set up, you can:

1. **Test the workflow**: Import and run `text-to-blog-with-research.json`
2. **Create research-powered blogs**: Use Tavily to enhance your content
3. **Save searches**: Use `tavily-search-to-file.json` for research
4. **Integrate with WordPress**: Combine Tavily + OpenAI + WordPress

Happy researching! 🎉
