# How to Activate n8n Workflows 🚀

Quick guide to activate your n8n workflows and fix webhook registration errors.

---

## 🎯 The Problem

You're seeing this error:
```
"The requested webhook \"GET create-blog\" is not registered."
```

**Why?** The workflow exists but is **not active** in n8n.

---

## ✅ Solution: Activate the Workflow

### Step 1: Open n8n

Go to: http://localhost:5678

---

### Step 2: Find Your Workflows

You should see these workflows in the list:
- **Text to Blog AI Publisher** (needs to be activated)
- **Tavily Research (SDK)** (needs to be activated)
- Any other workflows you've imported

---

### Step 3: Activate Each Workflow

For each workflow:

1. **Click** on the workflow name to open it
2. Look at the **top-right corner** of the editor
3. Find the **toggle switch** (it's probably gray/off)
4. **Click the toggle** to turn it **ON** (it should turn green)
5. **Save** the workflow (Ctrl+S or click Save button)

**Visual Guide**:
```
┌─────────────────────────────────────────┐
│  Workflow Name              [OFF] Save  │  ← Toggle is OFF (gray)
└─────────────────────────────────────────┘

Click the toggle:

┌─────────────────────────────────────────┐
│  Workflow Name              [ON]  Save  │  ← Toggle is ON (green)
└─────────────────────────────────────────┘
```

---

### Step 4: Verify Webhook URLs

After activating, click on the **Webhook** node (first node) to see:

**For "Text to Blog AI Publisher"**:
- **Test URL**: `http://localhost:5678/webhook-test/create-blog`
- **Production URL**: `http://localhost:5678/webhook/create-blog`

**For "Tavily Research (SDK)"**:
- **Test URL**: `http://localhost:5678/webhook-test/tavily-research-sdk`
- **Production URL**: `http://localhost:5678/webhook/tavily-research-sdk`

---

## 🧪 Test Your Workflows

### Test "Text to Blog AI Publisher"

**Using Test URL** (works even if inactive):
```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    text = "Artificial intelligence is transforming healthcare. AI can analyze medical images, predict diseases, and personalize treatment plans."
    title = "AI in Healthcare: A Revolution"
    author = "Tech Writer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/create-blog" `
    -Method Post -Headers $headers -Body $body
```

**Note**: The webhook is configured for GET but should probably be POST for sending data!

---

### Test "Tavily Research (SDK)"

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    topic = "Quantum Computing 2024"
    searchDepth = "advanced"
    maxResults = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/tavily-research-sdk" `
    -Method Post -Headers $headers -Body $body
```

---

## 🔍 How to Check if Workflow is Active

### Method 1: In the Workflow Editor

1. Open the workflow
2. Look at the top-right corner
3. If the toggle is **green** → Active ✅
4. If the toggle is **gray** → Inactive ❌

---

### Method 2: In the Workflows List

1. Go to the main workflows page
2. Look for a **green dot** or **"Active"** label next to the workflow name
3. Green dot = Active ✅
4. No dot or gray = Inactive ❌

---

## 📋 Checklist for Each Workflow

Before using a workflow, make sure:

- [ ] Workflow is **imported** in n8n
- [ ] Workflow is **opened** in the editor
- [ ] Toggle switch is **ON** (green)
- [ ] Workflow is **saved** (Ctrl+S)
- [ ] Webhook node shows the correct URLs
- [ ] You're using the correct webhook URL in your scripts

---

## 🎯 Quick Activation Script

Run this to check which workflows need activation:

```powershell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  n8n Workflow Activation Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Please check these workflows in n8n:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Text to Blog AI Publisher" -ForegroundColor White
Write-Host "   Webhook: http://localhost:5678/webhook-test/create-blog" -ForegroundColor Gray
Write-Host "   Status: Check if toggle is GREEN" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Tavily Research (SDK)" -ForegroundColor White
Write-Host "   Webhook: http://localhost:5678/webhook-test/tavily-research-sdk" -ForegroundColor Gray
Write-Host "   Status: Check if toggle is GREEN" -ForegroundColor Gray
Write-Host ""
Write-Host "To activate:" -ForegroundColor Cyan
Write-Host "  1. Open n8n: http://localhost:5678" -ForegroundColor White
Write-Host "  2. Click on each workflow" -ForegroundColor White
Write-Host "  3. Click the toggle in top-right (make it GREEN)" -ForegroundColor White
Write-Host "  4. Save the workflow" -ForegroundColor White
Write-Host ""
```

---

## 💡 Pro Tips

### Tip 1: Use Test URLs During Development

Test URLs work even when the workflow is inactive, making them perfect for development and testing.

### Tip 2: Activate Before Production

Always activate workflows before using Production URLs or deploying to production.

### Tip 3: Check After Import

After importing a workflow, it's usually **inactive** by default. Always activate it!

### Tip 4: Save After Activating

Don't forget to **save** the workflow after activating it!

---

## 🐛 Common Issues

### Issue: "Webhook not registered"

**Cause**: Workflow is not active

**Solution**: Activate the workflow (green toggle)

---

### Issue: "Workflow not found"

**Cause**: Workflow not imported

**Solution**: Import the workflow JSON file

---

### Issue: Toggle is green but webhook still doesn't work

**Cause**: Workflow not saved after activation

**Solution**: Save the workflow (Ctrl+S)

---

## ✅ Summary

**To activate a workflow**:
1. Open n8n: http://localhost:5678
2. Click on the workflow
3. Click the toggle (make it green)
4. Save the workflow
5. Test the webhook URL

**Remember**: Workflows are **inactive by default** after import!

---

**Go activate your workflows now!** 🚀

