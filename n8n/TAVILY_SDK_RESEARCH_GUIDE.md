# Tavily SDK Research Script - Complete Guide 🔬

Generate comprehensive research reports using the official **@tavily/core** SDK!

---

## 🎯 What This Is

A **standalone Node.js script** that uses Tavily's official SDK to conduct comprehensive research and generate beautiful HTML reports.

### Key Features
✅ **Uses @tavily/core SDK** - Official Tavily JavaScript/TypeScript library
✅ **5 Research Sections** - Comprehensive coverage of any topic
✅ **Parallel API Calls** - All 5 sections researched simultaneously
✅ **AI Summaries** - Key insights for each section
✅ **Professional HTML Reports** - Blue gradient design, table of contents
✅ **Auto-Save to Desktop** - Saves to `Desktop/TavilyResearch/`
✅ **Command Line Interface** - Easy to use from terminal or n8n
✅ **JSON Output** - Returns structured data for automation

---

## 📦 Installation

### Step 1: Install @tavily/core

```bash
npm install @tavily/core
```

**Verify installation**:
```bash
npm list @tavily/core
```

---

### Step 2: Set Your API Key

**Option 1: Environment Variable** (Recommended)
```bash
# Windows PowerShell
$env:TAVILY_API_KEY = "tvly-your-actual-api-key"

# Linux/Mac
export TAVILY_API_KEY="tvly-your-actual-api-key"
```

**Option 2: Edit the Script**

Open `tavily-research-script.js` and replace:
```javascript
const client = tavily({ apiKey: process.env.TAVILY_API_KEY || "tvly-dev-********************************" });
```

With:
```javascript
const client = tavily({ apiKey: "tvly-your-actual-api-key" });
```

**Get API key**: https://tavily.com/ (free tier: 1,000 searches/month)

---

## 🚀 Usage

### Basic Usage

```bash
node tavily-research-script.js "Your Research Topic"
```

**Example**:
```bash
node tavily-research-script.js "Artificial Intelligence in Healthcare 2024"
```

---

### Advanced Usage

```bash
node tavily-research-script.js "Topic" "SearchDepth" "MaxResults"
```

**Parameters**:
- **Topic** (required): Research topic
- **SearchDepth** (optional): "basic" or "advanced" (default: "advanced")
- **MaxResults** (optional): Total results across all sections (default: 10)

**Examples**:
```bash
# Advanced search with 15 results
node tavily-research-script.js "Quantum Computing" "advanced" "15"

# Basic search with 10 results (faster)
node tavily-research-script.js "Climate Change" "basic" "10"

# Default settings
node tavily-research-script.js "Blockchain Technology"
```

---

## 🧪 Quick Test

Run the test script:

```powershell
.\test-tavily-sdk.ps1
```

This will:
- ✅ Check if @tavily/core is installed
- ✅ Run a comprehensive research test
- ✅ Save HTML report to Desktop
- ✅ Show file location and size
- ✅ Offer to open the report in browser

---

## 📊 What It Does

### Research Process

1. **Takes your topic** (e.g., "AI in Healthcare 2024")
2. **Generates 5 research queries**:
   - Overview and introduction
   - Latest developments and trends
   - Key benefits and advantages
   - Challenges and limitations
   - Future predictions and outlook
3. **Calls Tavily API 5 times in parallel** (using `@tavily/core` SDK)
4. **Aggregates all results**
5. **Generates professional HTML report**
6. **Saves to Desktop/TavilyResearch/**
7. **Returns JSON output** with file info

---

## 📁 Output

### File Location
```
C:\Users\YourUsername\Desktop\TavilyResearch\
```

### File Naming
```
research-report-{topic}-{timestamp}.html
```

**Examples**:
- `research-report-artificial-intelligence-in-healthcare-2024-1732531200000.html`
- `research-report-quantum-computing-1732531300000.html`

### File Size
- **Basic search**: ~50-80 KB
- **Advanced search**: ~80-120 KB

---

## 🎨 Report Design

Same professional design as the n8n workflow:

- **Header**: Blue gradient with research topic
- **Metadata Bar**: Sections count, total sources, date
- **Table of Contents**: Clickable links to all 5 sections
- **5 Research Sections**: Each with:
  - Blue gradient header with orange numbered badge
  - Yellow "Key Insights" box with AI summary
  - Multiple source cards with relevance scores
- **Footer**: Metadata and "Powered by Tavily Research API (@tavily/core SDK)"

---

## ⏱️ Performance

| Search Depth | Max Results | Time | API Calls | Cost (Free Tier) |
|--------------|-------------|------|-----------|------------------|
| Basic | 10 | ~15-25 sec | 5 | 5 searches |
| Advanced | 15 | ~30-50 sec | 5 | 5 searches |

**Note**: All 5 API calls run in parallel, so it's fast!

---

## 🔧 Integration with n8n

You can call this script from n8n using the **Execute Command** node!

### n8n Workflow Setup

1. **Add Execute Command node**
2. **Command**:
   ```
   node tavily-research-script.js "{{ $json.topic }}" "{{ $json.searchDepth }}" "{{ $json.maxResults }}"
   ```
3. **Working Directory**: `C:\Users\gopic\Documents\augment-projects\coding\n8n`
4. **Output**: JSON with file info

---

## 💡 Advantages Over HTTP API Approach

### Using @tavily/core SDK:
✅ **Official SDK** - Maintained by Tavily
✅ **Type Safety** - TypeScript support
✅ **Better Error Handling** - Built-in error messages
✅ **Automatic Retries** - SDK handles retries
✅ **Cleaner Code** - No manual HTTP requests
✅ **Future-Proof** - Gets updates automatically

### vs. Direct HTTP API:
❌ Manual HTTP request construction
❌ Manual error handling
❌ No type safety
❌ More code to maintain

---

## 🎯 Use Cases

### 1. Academic Research
Generate comprehensive literature reviews

### 2. Business Intelligence
Research market trends, competitors, industries

### 3. Content Creation
Gather information for blog posts, articles

### 4. Due Diligence
Research companies, technologies, investments

### 5. Learning & Education
Create study materials on any subject

### 6. Automation
Integrate with n8n for automated research workflows

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

Or edit the script and replace the placeholder key.

---

### Issue: Script runs but no file created

**Check**:
1. Desktop/TavilyResearch folder permissions
2. Disk space
3. Console output for errors

---

## 📚 SDK Documentation

**Official Tavily SDK**:
- GitHub: https://github.com/tavily-ai/tavily-js
- NPM: https://www.npmjs.com/package/@tavily/core
- Docs: https://docs.tavily.com/

**SDK Methods Used**:
- `client.search(query, options)` - Main search method

**Options**:
- `searchDepth`: "basic" or "advanced"
- `maxResults`: Number of results
- `includeAnswer`: true (AI summary)
- `includeRawContent`: false
- `includeImages`: false

---

## ✅ Summary

**What you have**:
- ✅ Standalone Node.js script using @tavily/core SDK
- ✅ Generates 5-section research reports
- ✅ Parallel API calls (fast!)
- ✅ Professional HTML output
- ✅ Auto-saves to Desktop
- ✅ Command line interface
- ✅ JSON output for automation
- ✅ Easy n8n integration
- ✅ Test script included

**Next steps**:
1. Install: `npm install @tavily/core`
2. Set API key: `$env:TAVILY_API_KEY = "tvly-your-key"`
3. Test: `.\test-tavily-sdk.ps1`
4. Use: `node tavily-research-script.js "Your Topic"`

---

**Ready to research?** Run `.\test-tavily-sdk.ps1` now! 🚀

