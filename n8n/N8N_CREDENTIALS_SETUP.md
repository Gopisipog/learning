# n8n Credentials Setup Guide

## 🔐 Setting Up API Credentials in n8n

**Important**: n8n credentials MUST be configured through the web UI, not in workflow files. Follow these steps:

---

## 📋 Prerequisites

You'll need API keys for:
1. **OpenAI** - For AI content generation
2. **Tavily** - For research (optional)
3. **WordPress** - For publishing (if using WordPress)

---

## 🚀 Step-by-Step Setup

### 1. Start n8n

```powershell
# Stop any running instance
Get-Process | Where-Object {$_.ProcessName -like "*n8n*"} | Stop-Process -Force

# Start n8n
npm start
```

n8n will start on: **http://localhost:5678**

---

### 2. Configure OpenAI Credentials

#### A. In n8n Web UI:

1. **Open n8n**: Go to http://localhost:5678
2. **Import workflow**: Import `text-to-blog-with-research.json`
3. **Open the workflow**
4. **Click on "OpenAI Chat" node**
5. **You'll see "Credentials" section with an error**

#### B. Create OpenAI Credential:

1. Click **"Select Credential"** dropdown
2. Click **"Create New"**
3. Select **"OpenAI API"** credential type
4. Fill in:
   - **Name**: `OpenAI API`
   - **API Key**: Your OpenAI API key (starts with `sk-`)
5. Click **"Save"**

#### C. Get OpenAI API Key:

1. Go to: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-`)
4. Paste in n8n credential form

---

### 3. Configure WordPress Credentials (if using WordPress node)

#### A. In n8n Web UI:

1. **Click on "Publish to WordPress" node**
2. **Click "Select Credential"**
3. **Click "Create New"**
4. **Select "HTTP Basic Auth"** credential type

#### B. Fill in WordPress Credentials:

**Method 1: Using Application Password (Recommended)**

1. **User**: Your WordPress username
2. **Password**: WordPress Application Password (NOT your regular password)

**Get WordPress Application Password:**
1. Login to WordPress admin
2. Go to: **Users → Your Profile**
3. Scroll to **"Application Passwords"**
4. Create a new app password (e.g., "n8n Integration")
5. Copy the generated password (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. Use this in n8n credentials

**Method 2: Using .env file values**

Update your `.env` file:
```bash
WORDPRESS_URL=https://your-site.com
WORDPRESS_USERNAME=your_username
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

Then in n8n:
- **User**: Value from `WORDPRESS_USERNAME`
- **Password**: Value from `WORDPRESS_APP_PASSWORD`

---

### 4. Tavily API - No Credential Needed!

Tavily is used in the **Code node**, which reads from environment variables:

```javascript
const apiKey = process.env.TAVILY_API_KEY || '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';
```

Your `.env` file already has:
```bash
TAVILY_API_KEY=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
```

✅ **No additional setup needed in n8n UI for Tavily!**

---

## 🧪 Testing Credentials

### Test OpenAI:

1. Open workflow
2. Click **"OpenAI Chat"** node
3. Click **"Execute Node"**
4. Should see successful response

### Test WordPress:

1. Open workflow  
2. Click **"Publish to WordPress"** node
3. Click **"Execute Node"**
4. Should create a draft post in WordPress

### Test Tavily:

```powershell
node test-tavily.js
```

Should return search results.

---

## 🔧 Troubleshooting

### Error: "Authorization failed - please check your credentials"

**For OpenAI:**
- ✅ Check API key is valid at https://platform.openai.com/api-keys
- ✅ Check API key starts with `sk-`
- ✅ Check you have credits available
- ✅ Delete and recreate credential in n8n

**For WordPress:**
- ✅ Check URL format: `https://your-site.com` (no trailing slash)
- ✅ Use Application Password, NOT regular password
- ✅ Check WordPress REST API is enabled
- ✅ Test URL: `https://your-site.com/wp-json/wp/v2/posts`

**For Tavily:**
- ✅ Check `.env` file has `TAVILY_API_KEY`
- ✅ Restart n8n after updating `.env`
- ✅ Test with: `node test-tavily.js`

---

### Port 5678 Already in Use

```powershell
# Find and kill the process
Get-Process | Where-Object {$_.ProcessName -like "*n8n*"} | Stop-Process -Force

# Or change port
$env:N8N_PORT=5679
npm start
```

---

### OpenAI API Error: "Invalid API Key"

1. **Verify key format**: Must start with `sk-`
2. **Check key is active**: Go to OpenAI dashboard
3. **Check credits**: Ensure you have available credits
4. **Recreate key**: Delete old key and create new one

---

### WordPress 401 Unauthorized

**Check Application Password format:**
- ✅ Correct: `xxxx xxxx xxxx xxxx xxxx xxxx` (with spaces)
- ❌ Wrong: Your regular WordPress password

**Test REST API access:**
```powershell
curl -u "username:app_password" https://your-site.com/wp-json/wp/v2/posts
```

---

## 📝 Current Configuration Summary

### Your .env File:
```bash
# n8n
N8N_PORT=5678
N8N_HOST=localhost
N8N_PROTOCOL=http

# OpenAI - CONFIGURE IN N8N UI
OPENAI_API_KEY=your_openai_api_key_here

# Tavily - ALREADY CONFIGURED ✅
TAVILY_API_KEY=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

# WordPress - CONFIGURE IN N8N UI
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your_wordpress_username
WORDPRESS_APP_PASSWORD=your_wordpress_app_password
```

### What Needs Configuration in n8n UI:
- ✅ **OpenAI API** credential - Required
- ✅ **WordPress Basic Auth** credential - Required (if using WordPress node)
- ❌ **Tavily** - No UI config needed (uses environment variable)

---

## 🎯 Quick Start Checklist

- [ ] Start n8n: `npm start`
- [ ] Open: http://localhost:5678
- [ ] Import workflow: `text-to-blog-with-research.json`
- [ ] Configure OpenAI credential in "OpenAI Chat" node
- [ ] Configure WordPress credential in "Publish to WordPress" node
- [ ] Test Tavily: `node test-tavily.js`
- [ ] Execute workflow

---

## 📚 Additional Resources

- [n8n Credentials Documentation](https://docs.n8n.io/credentials/)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [WordPress Application Passwords](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/)
- [Tavily API Documentation](https://docs.tavily.com/)

---

## ⚡ Quick Commands

```powershell
# Start n8n
npm start

# Test Tavily
node test-tavily.js

# Stop n8n
Get-Process | Where-Object {$_.ProcessName -like "*n8n*"} | Stop-Process -Force

# View n8n logs
# (logs appear in terminal where npm start was run)
```

---

**🎉 Once credentials are configured, your workflow will be ready to:**
1. Research topics with Tavily
2. Generate AI content with OpenAI  
3. Publish to WordPress automatically

Good luck! 🚀
