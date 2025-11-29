# n8n Tavily Research Workflow (SDK) - Complete Guide 🔬

Integrate Tavily's official **@tavily/core** SDK into your n8n workflows!

---

## 🎯 What This Is

An **n8n workflow** that executes a standalone Node.js script using the official Tavily SDK to generate comprehensive research reports.

### Architecture

```
Webhook → Extract Parameters → Execute Command → Parse Output → Respond
```

**Flow**:
1. **Webhook** receives POST request with research topic
2. **Extract Parameters** parses topic, searchDepth, maxResults
3. **Execute Command** runs `tavily-research-script.js` using @tavily/core SDK
4. **Parse Output** extracts JSON result from script output
5. **Respond** returns file info and success status

---

## 📦 Prerequisites

### 1. Install @tavily/core SDK

```bash
npm install @tavily/core
```

### 2. Set Your API Key

**Option 1: Environment Variable** (Recommended)
```bash
# Windows PowerShell
$env:TAVILY_API_KEY = "tvly-your-actual-api-key"

# Linux/Mac
export TAVILY_API_KEY="tvly-your-actual-api-key"
```

**Option 2: Edit the Script**

Open `tavily-research-script.js` and replace the API key.

**Get API key**: https://tavily.com/ (free tier: 1,000 searches/month)

---

## 🚀 Setup

### Step 1: Import Workflow

1. Open n8n: http://localhost:5678
2. Click **"+"** → **"Import from File"**
3. Select: `workflows/tavily-research-sdk.json`
4. Click **"Import"**

### Step 2: Activate Workflow

1. Open the imported workflow
2. Click the **toggle** in the top-right corner (should turn **green**)
3. Click **"Save"**

---

## 🎯 Workflow Nodes

### 1. Webhook (Trigger)
- **Type**: POST
- **Path**: `webhook-test/tavily-research-sdk`
- **URL**: `http://localhost:5678/webhook-test/tavily-research-sdk`

### 2. Extract Parameters (Code)
- Parses webhook body
- Extracts: `topic`, `searchDepth`, `maxResults`
- Sets defaults if not provided

### 3. Execute Tavily Research Script (Execute Command)
- Runs: `node tavily-research-script.js "topic" "searchDepth" "maxResults"`
- Uses @tavily/core SDK
- Generates HTML report
- Saves to Desktop/TavilyResearch/

### 4. Parse Script Output (Code)
- Extracts JSON from script stdout
- Handles errors
- Returns structured result

### 5. Respond to Webhook (Response)
- Returns JSON with file info
- Includes: success, topic, fileName, filePath, totalSections, totalResults

---

## 📡 API Usage

### Webhook URL

**Test URL** (works even when workflow is inactive):
```
http://localhost:5678/webhook-test/tavily-research-sdk
```

### Request Format

**Method**: POST

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "topic": "Your Research Topic",
  "searchDepth": "advanced",
  "maxResults": 15
}
```

**Parameters**:
- **topic** (required): Research topic
- **searchDepth** (optional): "basic" or "advanced" (default: "advanced")
- **maxResults** (optional): Total results across all sections (default: 10)

---

## 🧪 Testing

### Option 1: PowerShell Test Script

```powershell
.\test-tavily-research-sdk-workflow.ps1
```

This will:
- ✅ Check if n8n is running
- ✅ Check if @tavily/core is installed
- ✅ Call the workflow webhook
- ✅ Show results
- ✅ List generated files
- ✅ Offer to open latest report

---

### Option 2: Manual Test (PowerShell)

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    topic = "Artificial Intelligence in Healthcare 2024"
    searchDepth = "advanced"
    maxResults = 15
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/tavily-research-sdk" `
    -Method Post -Headers $headers -Body $body
```

---

### Option 3: Manual Test (cURL)

```bash
curl -X POST http://localhost:5678/webhook-test/tavily-research-sdk \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Artificial Intelligence in Healthcare 2024",
    "searchDepth": "advanced",
    "maxResults": 15
  }'
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "topic": "Artificial Intelligence in Healthcare 2024",
  "fileName": "research-report-artificial-intelligence-in-healthcare-2024-1732531200000.html",
  "filePath": "C:\\Users\\YourUsername\\Desktop\\TavilyResearch\\research-report-artificial-intelligence-in-healthcare-2024-1732531200000.html",
  "saveDirectory": "C:\\Users\\YourUsername\\Desktop\\TavilyResearch",
  "totalSections": 5,
  "totalResults": 15,
  "fileSize": 102400,
  "timestamp": "2024-11-25T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here",
  "stdout": "Script output...",
  "stderr": "Error output...",
  "exitCode": 1
}
```

---

## 📁 Output Files

### File Location
```
C:\Users\YourUsername\Desktop\TavilyResearch\
```

### File Naming
```
research-report-{topic}-{timestamp}.html
```

### File Contents
- **5 Research Sections**: Overview, Trends, Benefits, Challenges, Future
- **AI Summaries**: Key insights for each section
- **Multiple Sources**: With relevance scores
- **Professional Design**: Blue gradient, table of contents
- **Print-Ready**: Optimized for PDF export

---

## ⏱️ Performance

| Search Depth | Max Results | Time | API Calls | File Size |
|--------------|-------------|------|-----------|-----------|
| Basic | 10 | ~15-25 sec | 5 | ~50-80 KB |
| Advanced | 15 | ~30-50 sec | 5 | ~80-120 KB |

**Note**: All 5 API calls run in parallel!

---

## 💡 Advantages of This Approach

### Using Execute Command + SDK Script:
✅ **Official SDK** - Uses @tavily/core maintained by Tavily
✅ **Full npm Access** - Can use any npm package
✅ **Better Error Handling** - SDK handles retries and errors
✅ **File System Access** - Can save files directly to disk
✅ **Reusable** - Script can be used standalone or in n8n
✅ **Type Safety** - TypeScript support
✅ **Future-Proof** - Gets SDK updates automatically

### vs. HTTP Request Node:
❌ Manual HTTP request construction
❌ Manual error handling
❌ No automatic retries
❌ More code to maintain

### vs. Code Node with require():
❌ Cannot require npm packages in n8n Code nodes
❌ Limited file system access
❌ No access to external modules

---

## 🔧 Customization

### Change Research Sections

Edit `tavily-research-script.js`:

```javascript
const queries = [
  `${topic} overview and introduction`,
  `${topic} latest developments and trends`,
  `${topic} key benefits and advantages`,
  `${topic} challenges and limitations`,
  `${topic} future predictions and outlook`
];
```

Add or modify sections as needed!

---

### Change Save Location

Edit `tavily-research-script.js`:

```javascript
const saveDir = path.join(homeDir, 'Desktop', 'TavilyResearch');
```

Change to any folder you want!

---

### Change HTML Design

Edit the `generateHTMLReport()` function in `tavily-research-script.js`.

Modify CSS styles, colors, layout, etc.

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@tavily/core'"

**Solution**:
```bash
npm install @tavily/core
```

---

### Issue: "Authorization failed"

**Solution**: Set your actual API key
```bash
$env:TAVILY_API_KEY = "tvly-your-actual-api-key"
```

---

### Issue: "Workflow not found" or "Webhook not registered"

**Solution**:
1. Make sure workflow is imported
2. Make sure workflow is **Active** (green toggle)
3. Use correct webhook URL: `http://localhost:5678/webhook-test/tavily-research-sdk`

---

### Issue: Script runs but no file created

**Check**:
1. Desktop/TavilyResearch folder permissions
2. Disk space
3. Check n8n execution log for errors

---

## ✅ Summary

**What you have**:
- ✅ n8n workflow using Execute Command node
- ✅ Standalone script using @tavily/core SDK
- ✅ Generates 5-section research reports
- ✅ Parallel API calls (fast!)
- ✅ Professional HTML output
- ✅ Auto-saves to Desktop
- ✅ JSON response with file info
- ✅ Test script included
- ✅ Complete documentation

**Files**:
- `workflows/tavily-research-sdk.json` - n8n workflow
- `tavily-research-script.js` - Standalone SDK script
- `test-tavily-research-sdk-workflow.ps1` - Test script
- `N8N_TAVILY_SDK_WORKFLOW_GUIDE.md` - This guide

**Next steps**:
1. Install SDK: `npm install @tavily/core`
2. Set API key: `$env:TAVILY_API_KEY = "tvly-your-key"`
3. Import workflow: `workflows/tavily-research-sdk.json`
4. Activate workflow in n8n
5. Test: `.\test-tavily-research-sdk-workflow.ps1`

---

**Ready to research?** Import the workflow and run the test! 🚀

