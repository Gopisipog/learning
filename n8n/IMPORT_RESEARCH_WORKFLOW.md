# Import Research Workflow - Step by Step

Quick guide to import and configure the research-enhanced workflow.

## ✅ n8n is Running!

n8n is now accessible at: **http://localhost:5678**

---

## 📥 Step 1: Import the Workflow

### 1.1 Open n8n
- n8n should be open in your browser
- If not, go to: http://localhost:5678

### 1.2 Import Workflow
1. Click **"Workflows"** in the left sidebar
2. Click **"Add workflow"** dropdown (top right)
3. Select **"Import from File"**
4. Navigate to: `C:\Users\gopic\Documents\augment-projects\coding\n8n\workflows`
5. Select: **`text-to-blog-with-research.json`**
6. Click **"Open"**

**The workflow will appear with 7 nodes!**

---

## 🔑 Step 2: Configure Tavily API Key

### 2.1 Get Tavily API Key
1. Open: https://tavily.com/
2. Sign up (free tier: 1,000 searches/month)
3. Copy your API key (starts with `tvly-`)

### 2.2 Add to Workflow
1. In n8n, click the **"Tavily Research"** node (the Code node)
2. You'll see JavaScript code
3. Find this line (around line 4):
   ```javascript
   const tvly = tavily({ apiKey: 'tvly-YOUR_API_KEY' });
   ```
4. Replace `'tvly-YOUR_API_KEY'` with your actual key:
   ```javascript
   const tvly = tavily({ apiKey: 'tvly-abc123xyz...' });
   ```
5. Click outside the node to save

---

## 🤖 Step 3: Configure OpenAI

### 3.1 Click OpenAI Chat Node
1. Click the **"OpenAI Chat"** node in the workflow

### 3.2 Add Credentials
1. Click **"Credential to connect with"** dropdown
2. If you already have OpenAI credentials:
   - Select your existing credential
3. If not:
   - Click **"- Create New -"**
   - Select **"OpenAI API"**
   - Enter your OpenAI API key
   - Click **"Save"**

**Get OpenAI key**: https://platform.openai.com/api-keys

---

## 🌐 Step 4: Configure WordPress

### 4.1 Click WordPress Node
1. Click the **"Publish to WordPress"** node

### 4.2 Update URL
1. Find the **"URL"** field
2. Change from:
   ```
   https://your-wordpress-site.com/wp-json/wp/v2/posts
   ```
3. To your actual WordPress site:
   ```
   https://yourblog.com/wp-json/wp/v2/posts
   ```

### 4.3 Add WordPress Credentials
1. Click **"Credential to connect with"** dropdown
2. If you already have WordPress credentials:
   - Select your existing credential
3. If not:
   - Click **"- Create New -"**
   - Select **"HTTP Basic Auth"**
   - Enter:
     - **Credential Name**: `My WordPress`
     - **User**: Your WordPress username
     - **Password**: Your WordPress **application password** (not login password!)
   - Click **"Save"**

**Create WordPress application password**:
- WordPress Admin → Users → Profile → Application Passwords

---

## ✅ Step 5: Activate Workflow

### 5.1 Save Workflow
1. Click **"Save"** button (top right)
2. Give it a name: `Text to Blog with Research`

### 5.2 Activate
1. Click the **"Active"** toggle switch (top right)
2. It should turn green/blue
3. Status shows **"Active"**

---

## 🧪 Step 6: Test the Workflow

### 6.1 Get Webhook URL
1. Click the **"Webhook"** node
2. Click **"Test URL"** or **"Production URL"**
3. Copy the URL (should be: `http://localhost:5678/webhook/create-blog`)

### 6.2 Test with Postman

1. **Open Postman** (or download from https://www.postman.com/)

2. **Create new request**:
   - Method: **POST**
   - URL: `http://localhost:5678/webhook/create-blog`

3. **Add header**:
   - Key: `Content-Type`
   - Value: `application/json`

4. **Add body** (select "raw" and "JSON"):
   ```json
   {
     "text": "Artificial Intelligence is revolutionizing industries worldwide. Machine learning algorithms are becoming more sophisticated, enabling automation and intelligent decision-making across healthcare, finance, and technology sectors.",
     "title": "The AI Revolution in 2024",
     "author": "Tech Insights Team"
   }
   ```

5. **Click "Send"**

### 6.3 Expected Response

```json
{
  "success": true,
  "message": "Blog post created successfully with research",
  "data": {
    "title": "The AI Revolution in 2024",
    "wordCount": 687,
    "researchSummary": "Artificial Intelligence in 2024 has seen significant advancements in machine learning, automation, and cross-industry applications...",
    "sourcesCount": 5,
    "wordpressPostId": 123,
    "wordpressLink": "https://yourblog.com/?p=123"
  }
}
```

### 6.4 Check WordPress

1. Go to your WordPress admin
2. Click **Posts** → **All Posts**
3. You should see your new draft post!
4. Click on it to view the AI-generated, research-enhanced content

---

## 🎯 What Happens When You Test

```
1. Postman sends request
   ↓
2. n8n Webhook receives it
   ↓
3. Tavily searches for research
   ↓
4. OpenAI generates blog with research
   ↓
5. WordPress creates draft post
   ↓
6. Response sent back to Postman
```

---

## 🐛 Troubleshooting

### Workflow won't import
- Make sure you selected the correct file: `text-to-blog-with-research.json`
- Check the file path is correct

### Tavily node shows error
- Make sure you replaced `'tvly-YOUR_API_KEY'` with your actual key
- Check the key starts with `tvly-`
- Verify your Tavily account is active

### OpenAI node shows error
- Make sure you added OpenAI credentials
- Check your API key is valid
- Verify you have credits in your OpenAI account

### WordPress node shows error
- Check the URL is correct (include `https://` or `http://`)
- Make sure you're using **application password**, not login password
- Verify WordPress REST API is enabled (Settings → Permalinks)

### No response from webhook
- Make sure workflow is **Active** (toggle is on)
- Check the webhook URL is correct
- Try clicking "Execute Workflow" button in n8n

---

## 📊 Workflow Nodes Overview

| Node | What It Does | Configuration |
|------|--------------|---------------|
| **Webhook** | Receives POST requests | Auto-configured |
| **Extract Input** | Parses text, title, author | Auto-configured |
| **Tavily Research** | Searches web for research | ✅ Add API key |
| **OpenAI Chat** | Generates blog post | ✅ Add credentials |
| **Format Blog** | Structures response | Auto-configured |
| **Publish to WordPress** | Creates draft post | ✅ Add URL & credentials |
| **Respond to Webhook** | Returns success response | Auto-configured |

---

## ✅ Configuration Checklist

Before testing, make sure:

- [ ] Workflow imported successfully
- [ ] Tavily API key added to "Tavily Research" node
- [ ] OpenAI credentials added to "OpenAI Chat" node
- [ ] WordPress URL updated in "Publish to WordPress" node
- [ ] WordPress credentials added
- [ ] Workflow saved
- [ ] Workflow activated (toggle is on)
- [ ] Webhook URL copied
- [ ] Postman request ready

---

## 🎉 You're Ready!

Once all steps are complete:

1. ✅ Send test request from Postman
2. ✅ Wait 10-20 seconds for processing
3. ✅ Check response in Postman
4. ✅ Verify draft post in WordPress
5. ✅ Review the AI-generated, research-enhanced content!

---

## 📚 Need Help?

- **Detailed setup**: [RESEARCH_WORKFLOW_SETUP.md](RESEARCH_WORKFLOW_SETUP.md)
- **Tavily setup**: [TAVILY_QUICKSTART.md](TAVILY_QUICKSTART.md)
- **WordPress setup**: [CONNECT_EXISTING_WORDPRESS.md](CONNECT_EXISTING_WORDPRESS.md)
- **Testing guide**: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Happy blogging with AI research!** 🚀

