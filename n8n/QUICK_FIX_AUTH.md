# 🔐 QUICK FIX: Authorization Failed Error

## The Problem
You're seeing "Authorization failed - please check your credentials" because **n8n credentials must be configured in the web UI**, not in the workflow files.

---

## ✅ Solution (3 Steps)

### Step 1: Access n8n
n8n appears to be running. Open your browser:
```
http://localhost:5678
```

### Step 2: Configure OpenAI Credentials

1. **Import your workflow** (if not already done)
2. **Click on "OpenAI Chat" node**
3. **In the credential dropdown:**
   - Click "Create New"
   - Select "OpenAI API"
   - Name: `OpenAI API`
   - API Key: `sk-your-actual-key-here`
   - Click "Save"

**Get OpenAI Key:** https://platform.openai.com/api-keys

### Step 3: Test the Node

1. Click **"Execute Node"** on the OpenAI node
2. Should work now! ✅

---

## 🆘 Still Not Working?

### If n8n won't open (http://localhost:5678):

```powershell
# Stop any running instance
Get-Process | Where-Object {$_.ProcessName -like "*n8n*"} | Stop-Process -Force

# Start fresh
npm start
```

### Common OpenAI Errors:

| Error | Solution |
|-------|----------|
| "Invalid API Key" | Check key starts with `sk-` |
| "Insufficient credits" | Add credits at platform.openai.com |
| "Rate limit" | Wait a minute, try again |

---

## 📋 What Each API Needs

| API | Where to Configure | Format |
|-----|-------------------|--------|
| **OpenAI** | n8n UI (in node) | `sk-proj-xxxxx...` |
| **Tavily** | .env file ✅ DONE | `tvly-xxxxx...` |
| **WordPress** | n8n UI (in node) | Application Password |

---

## 🎯 Your Next Steps

1. ✅ Tavily is already configured (via .env)
2. ⚠️ **Configure OpenAI in n8n UI** ← DO THIS NOW
3. ⚠️ Configure WordPress (if using that node)

**See full guide:** `N8N_CREDENTIALS_SETUP.md`

---

## 🚀 Quick Test

After configuring OpenAI credential:

```powershell
# Test Tavily (should work already)
node test-tavily.js

# Test full workflow in n8n UI
# 1. Open workflow
# 2. Click "Execute Workflow"
# 3. Should work!
```

---

**💡 Remember**: Environment variables (.env) are for Code nodes. HTTP Request nodes need credentials configured in the n8n UI!
