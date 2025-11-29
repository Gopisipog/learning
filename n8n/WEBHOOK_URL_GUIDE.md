# n8n Webhook URL Guide 🔗

How to find and use the correct webhook URL for your n8n workflows.

---

## 🎯 The Issue

The error you're seeing:
```
"The requested webhook \"POST create-blog/webhook-test/webhook-test/tavily-research-sdk\" is not registered."
```

This shows that n8n is adding prefixes to your webhook path, causing the URL to be incorrect.

---

## ✅ How to Find the Correct Webhook URL

### Step 1: Open Your Workflow in n8n

1. Go to http://localhost:5678
2. Open the **"Tavily Research (SDK)"** workflow
3. Click on the **Webhook** node (the first node)

### Step 2: Get the Webhook URLs

In the Webhook node, you'll see **two URLs**:

#### **Test URL** (Always Works)
```
http://localhost:5678/webhook-test/tavily-research-sdk
```
- ✅ Works even when workflow is **inactive**
- ✅ Shows execution on canvas in real-time
- ✅ Perfect for testing

#### **Production URL** (Only Works When Active)
```
http://localhost:5678/webhook/tavily-research-sdk
```
- ⚠️ Only works when workflow is **active** (green toggle)
- ⚠️ Doesn't show on canvas (only in executions list)
- ✅ Used for production

---

## 🔧 How to Fix Your Test Script

### Option 1: Copy URL from n8n (Recommended)

1. Open the workflow in n8n
2. Click the **Webhook** node
3. Look for the **"Test URL"** or **"Production URL"**
4. **Copy** the exact URL shown
5. Update your test script with that URL

### Option 2: Use the Correct Path

Based on the error, it looks like n8n might be adding a prefix. The workflow path is set to:
```
tavily-research-sdk
```

So the full URL should be:
```
http://localhost:5678/webhook-test/tavily-research-sdk
```

If this doesn't work, n8n might be adding a prefix like `create-blog`. In that case, the URL would be:
```
http://localhost:5678/webhook-test/create-blog/tavily-research-sdk
```

---

## 🧪 Test the Webhook URL

### Quick Test (PowerShell)

```powershell
# Test if the webhook is registered
$testUrl = "http://localhost:5678/webhook-test/tavily-research-sdk"

Write-Host "Testing webhook URL: $testUrl" -ForegroundColor Cyan

$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    topic = "Test Topic"
    searchDepth = "basic"
    maxResults = 5
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri $testUrl -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "✅ Webhook is working!" -ForegroundColor Green
    Write-Host "Response: $($result | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "❌ Webhook failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try alternative URL
    $altUrl = "http://localhost:5678/webhook-test/create-blog/tavily-research-sdk"
    Write-Host "`nTrying alternative URL: $altUrl" -ForegroundColor Yellow
    
    try {
        $result = Invoke-RestMethod -Uri $altUrl -Method Post -Headers $headers -Body $body -ErrorAction Stop
        Write-Host "✅ Alternative webhook is working!" -ForegroundColor Green
        Write-Host "Use this URL: $altUrl" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Alternative webhook also failed!" -ForegroundColor Red
        Write-Host "`nPlease check the webhook URL in n8n!" -ForegroundColor Yellow
    }
}
```

---

## 📋 Checklist

Before testing, make sure:

- [ ] n8n is running (`http://localhost:5678`)
- [ ] Workflow is **imported** in n8n
- [ ] Workflow is **saved**
- [ ] For Test URL: Workflow can be inactive
- [ ] For Production URL: Workflow must be **active** (green toggle)
- [ ] You're using the **exact URL** shown in the Webhook node

---

## 🎯 Common Issues

### Issue 1: "Webhook not registered"

**Cause**: Wrong URL or workflow not imported

**Solution**:
1. Check if workflow is imported in n8n
2. Copy the exact URL from the Webhook node in n8n
3. Make sure you're using the Test URL (not Production URL)

---

### Issue 2: "Workflow must be active"

**Cause**: Using Production URL with inactive workflow

**Solution**:
1. Either activate the workflow (green toggle)
2. Or use the Test URL instead

---

### Issue 3: URL has extra prefixes

**Cause**: n8n might be configured with a path prefix

**Solution**:
1. Check the actual URL shown in the Webhook node
2. Use that exact URL
3. Don't assume the URL format

---

## 💡 Pro Tips

### Tip 1: Always Use Test URL for Development

The Test URL is more convenient because:
- Works even when workflow is inactive
- Shows execution on canvas
- Easier to debug

### Tip 2: Copy URL from n8n

Don't guess the URL! Always copy it from the Webhook node in n8n.

### Tip 3: Check Webhook Node After Import

After importing a workflow, always:
1. Open the workflow
2. Click the Webhook node
3. Verify the URLs shown
4. Update your test scripts with the correct URLs

---

## 🔍 How to Debug

### Step 1: Check n8n Logs

Look at the n8n console output for webhook registration messages.

### Step 2: List All Webhooks

In n8n, go to:
- **Workflows** → Your workflow → **Webhook** node
- Check both Test URL and Production URL

### Step 3: Test with cURL

```bash
curl -X POST http://localhost:5678/webhook-test/tavily-research-sdk \
  -H "Content-Type: application/json" \
  -d '{"topic": "Test", "searchDepth": "basic", "maxResults": 5}'
```

If this fails, try:
```bash
curl -X POST http://localhost:5678/webhook-test/create-blog/tavily-research-sdk \
  -H "Content-Type: application/json" \
  -d '{"topic": "Test", "searchDepth": "basic", "maxResults": 5}'
```

---

## ✅ Summary

**To find the correct webhook URL**:
1. Open workflow in n8n
2. Click Webhook node
3. Copy the **Test URL** shown
4. Use that exact URL in your test script

**Don't assume the URL format!** Always copy it from n8n.

---

**Need help?** Check the Webhook node in n8n for the exact URL! 🚀

