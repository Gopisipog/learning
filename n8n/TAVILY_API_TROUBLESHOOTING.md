# Tavily API Troubleshooting

## Error: "Authorization failed - please check your credentials"

This error means the Tavily API key is invalid or not being sent correctly.

---

## ✅ Solution Steps

### Step 1: Get a Valid Tavily API Key

The API key in your `.env.example` appears to be a placeholder or test key that doesn't work.

**Get your FREE API key**:

1. Go to: **https://tavily.com/**
2. Click **"Get API Key"** or **"Sign Up"**
3. Create a free account (GitHub or email)
4. Copy your API key (starts with `tvly-`)

**Free tier includes**:
- ✅ 1,000 searches per month
- ✅ No credit card required
- ✅ Full API access

---

### Step 2: Create `.env` File

n8n needs a `.env` file (not `.env.example`) to read environment variables.

1. **Copy the example file**:
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Edit `.env` file** and replace the API key:
   ```
   TAVILY_API_KEY=tvly-YOUR_ACTUAL_API_KEY_HERE
   ```

3. **Save the file**

---

### Step 3: Restart n8n

Environment variables are loaded when n8n starts, so you need to restart:

1. **Stop n8n**: Press `Ctrl+C` in the terminal
2. **Start n8n again**: `npm start`
3. **Wait for**: "Editor is now accessible via: http://localhost:5678"

---

### Step 4: Update Workflow

Since n8n might not read `.env` files by default, you should **hardcode the API key** in the workflow:

1. Open n8n: http://localhost:5678
2. Open the **"Tavily Search to File"** workflow
3. Click **"Tavily API Request"** node
4. Find the **"JSON Body"** field
5. Replace the entire JSON with:

```json
{
  "api_key": "tvly-YOUR_ACTUAL_API_KEY_HERE",
  "query": "{{ $json.searchQuery }}",
  "search_depth": "{{ $json.searchDepth }}",
  "max_results": {{ $json.maxResults }},
  "include_answer": true,
  "include_images": false
}
```

**Important**: Replace `tvly-YOUR_ACTUAL_API_KEY_HERE` with your real API key!

6. **Save** the workflow

---

## 🧪 Test the Fix

### Test 1: Simple cURL Test

Test Tavily API directly to verify your key works:

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    api_key = "tvly-YOUR_ACTUAL_API_KEY_HERE"
    query = "What is AI?"
    max_results = 3
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.tavily.com/search" -Method Post -Headers $headers -Body $body
```

**Expected**: JSON response with search results
**If error**: Your API key is invalid - get a new one from https://tavily.com/

---

### Test 2: Test n8n Workflow

Once the API key works in Test 1, test the workflow:

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    query = "What is artificial intelligence?"
    maxResults = 3
    searchDepth = "basic"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook/tavily-search" -Method Post -Headers $headers -Body $body
```

---

## 🔍 Common Issues

### Issue 1: API Key Format

**Wrong**:
- `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` (test/placeholder key)
- `your_api_key_here`
- `tvly-YOUR_API_KEY`

**Correct**:
- Starts with `tvly-`
- Followed by random characters
- Example: `tvly-abc123xyz789...` (your actual key from Tavily)

---

### Issue 2: n8n Not Reading .env File

n8n might not automatically read `.env` files. Solutions:

**Option A: Hardcode in Workflow** (Recommended)
- Edit the workflow JSON body directly
- Replace `$env.TAVILY_API_KEY` with your actual key

**Option B: Use n8n Environment Variables**
1. Stop n8n
2. Set environment variable:
   ```powershell
   $env:TAVILY_API_KEY = "tvly-YOUR_ACTUAL_API_KEY"
   npm start
   ```

**Option C: Use n8n Credentials**
1. In n8n: Settings → Credentials
2. Create new credential
3. Use in HTTP Request node

---

### Issue 3: Quota Exceeded

If you see "Quota exceeded" error:
- You've used all 1,000 free searches
- Wait until next month or upgrade plan
- Check usage at: https://tavily.com/dashboard

---

## ✅ Quick Fix Summary

1. **Get real API key**: https://tavily.com/
2. **Update workflow**: Hardcode key in "Tavily API Request" node
3. **Test directly**: Use PowerShell to test Tavily API
4. **Test workflow**: Send request to n8n webhook

---

## 📝 Example: Working Configuration

### Tavily API Request Node - JSON Body

```json
{
  "api_key": "tvly-abc123xyz789...",
  "query": "{{ $json.searchQuery }}",
  "search_depth": "{{ $json.searchDepth }}",
  "max_results": {{ $json.maxResults }},
  "include_answer": true,
  "include_images": false
}
```

**Note**: The `{{ }}` syntax is for n8n expressions, but `api_key` should be a plain string!

---

## 🎯 Recommended Approach

**For now, use hardcoded API key**:

1. Get your API key from https://tavily.com/
2. Open the workflow in n8n
3. Click "Tavily API Request" node
4. Update JSON Body with your actual key
5. Save and test

**Later, you can set up proper credentials in n8n if needed.**

---

## 🆘 Still Not Working?

If you still get "Authorization failed":

1. **Verify API key**: Log in to https://tavily.com/ and check your API key
2. **Test API directly**: Use the PowerShell test above
3. **Check Tavily status**: https://status.tavily.com/
4. **Contact Tavily support**: support@tavily.com

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Direct API test returns search results
- ✅ n8n workflow returns success message
- ✅ Text file is created in `~/.n8n/` directory
- ✅ File contains search results

---

**Next**: Get your API key from https://tavily.com/ and update the workflow! 🚀

