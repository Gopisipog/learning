# Tavily Research Report Generator - Complete Guide 📊

Generate comprehensive, professional research reports using Tavily's advanced research API!

---

## 🎯 What This Does

**Input**: Research topic via webhook
**Output**: Multi-section HTML research report saved to `Desktop/TavilyResearch/`

### Key Features
✅ **5 Research Sections** - Comprehensive coverage of any topic
✅ **AI Summaries** - Key insights for each section
✅ **Multiple Sources** - 10-15 sources per report
✅ **Professional Design** - Blue gradient, table of contents, numbered sections
✅ **Clickable Links** - Direct access to all sources
✅ **Relevance Scores** - See which sources are most relevant
✅ **Print-Ready** - Optimized for PDF export
✅ **Auto-Save** - Saves to Desktop/TavilyResearch folder

---

## 🔬 Research Sections

For any topic, the workflow automatically generates 5 comprehensive sections:

1. **Overview and Introduction** - What is it? Basic concepts
2. **Latest Developments and Trends** - What's new? Current state
3. **Key Benefits and Advantages** - Why is it important? Positive aspects
4. **Challenges and Limitations** - What are the problems? Obstacles
5. **Future Predictions and Outlook** - Where is it going? Future trends

**Example**: For "Artificial Intelligence in Healthcare 2024"
- Section 1: AI in Healthcare overview and introduction
- Section 2: AI in Healthcare latest developments and trends
- Section 3: AI in Healthcare key benefits and advantages
- Section 4: AI in Healthcare challenges and limitations
- Section 5: AI in Healthcare future predictions and outlook

---

## 🚀 Quick Start

### Step 1: Import Workflow (30 sec)

1. Open n8n: http://localhost:5678
2. Click "Workflows" → "Import from File"
3. Select: `workflows/tavily-research-report.json`
4. Workflow imported!

---

### Step 2: Add Tavily API Key (1 min)

1. Click **"Tavily Research API"** node
2. Find **"JSON Body"** field
3. Replace `"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"` with your actual API key
4. Save

**Get API key**: https://tavily.com/ (free tier: 1,000 searches/month)

**Note**: This workflow uses 5 API calls per report (one per section)

---

### Step 3: Activate & Test (30 sec)

1. Click "Save"
2. Toggle "Active" (top right)
3. Run test script:

```powershell
.\test-tavily-research.ps1
```

**Done!** Check `Desktop/TavilyResearch/` for your research report!

---

## 🧪 Test Examples

### Comprehensive Research (Advanced)
```powershell
$headers = @{ "Content-Type" = "application/json" }
$body = @{
    topic = "Quantum Computing Applications 2024"
    searchDepth = "advanced"
    maxResults = 15
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/tavily-research" `
    -Method Post -Headers $headers -Body $body
```

### Quick Research (Basic)
```powershell
$body = @{
    topic = "Renewable Energy Trends"
    searchDepth = "basic"
    maxResults = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook-test/tavily-research" `
    -Method Post -Headers $headers -Body $body
```

---

## 📁 File Location

**Save Directory**: `C:\Users\YourUsername\Desktop\TavilyResearch\`

**File Naming**: `research-report-{topic}-{timestamp}.html`

**Examples**:
- `research-report-artificial-intelligence-in-healthcare-2024-1732531200000.html`
- `research-report-climate-change-solutions-1732531300000.html`
- `research-report-quantum-computing-applications-2024-1732531400000.html`

---

## 🎨 Report Design

### Header Section
- **Blue gradient background** (professional look)
- **Large title**: "📊 Research Report"
- **Topic subtitle**: Your research topic
- **Metadata bar**: Sections count, total sources, date

### Table of Contents
- **Numbered list** of all 5 sections
- **Clickable links** to jump to sections
- **Gray background** for easy scanning

### Research Sections (5 total)
Each section includes:

1. **Section Header**
   - Blue gradient background
   - Orange numbered badge (1, 2, 3, 4, 5)
   - Section title

2. **Key Insights Box**
   - Yellow background (stands out)
   - AI-generated summary
   - Light bulb icon

3. **Sources List**
   - Multiple source cards (2-3 per section)
   - Source title
   - Clickable URL
   - Relevance score badge (green)
   - Content preview (500 characters)
   - Hover effects

### Footer
- Dark background
- Total sections and sources
- Generation timestamp
- "Powered by Tavily Research API"

---

## 🔧 Workflow Nodes

| Node | Type | Purpose |
|------|------|---------|
| **Webhook** | Trigger | Receives POST requests |
| **Extract Parameters** | Code | Parses topic, searchDepth, maxResults |
| **Generate Research Queries** | Code | Creates 5 research questions |
| **Split into Items** | Code | Splits queries for parallel processing |
| **Tavily Research API** | HTTP Request | Calls Tavily API (5 times in parallel) |
| **Aggregate Research** | Code | Combines all research results |
| **Generate HTML Report** | Code | Creates beautiful HTML + saves to Desktop |
| **Respond to Webhook** | Response | Returns success with file info |

**Total**: 8 nodes
**API Calls**: 5 per report (one per section)
**Processing**: Parallel (all 5 sections researched simultaneously)

---

## 📊 Request Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `topic` | string | "Artificial Intelligence trends 2024" | Research topic (required) |
| `searchDepth` | string | "advanced" | "basic" or "advanced" |
| `maxResults` | number | 10 | Total results across all sections |

**Note**: `maxResults` is divided across 5 sections (e.g., 10 results = 2 per section)

---

## ⏱️ Performance

| Search Depth | Results | Time | API Calls | Cost (Free Tier) |
|--------------|---------|------|-----------|------------------|
| Basic | 10 | ~20-30 sec | 5 | 5 searches |
| Advanced | 15 | ~40-60 sec | 5 | 5 searches |

**Free Tier**: 1,000 searches/month = 200 research reports/month

---

## 🎯 Use Cases

### 1. Academic Research
Generate comprehensive literature reviews on any topic

### 2. Business Intelligence
Research market trends, competitors, industry analysis

### 3. Content Creation
Gather information for blog posts, articles, presentations

### 4. Due Diligence
Research companies, technologies, investments

### 5. Learning & Education
Create study materials on any subject

### 6. Consulting Reports
Professional research reports for clients

---

## 💡 Pro Tips

### Tip 1: Specific Topics Work Best
❌ "Technology"
✅ "Artificial Intelligence in Healthcare 2024"

### Tip 2: Use Advanced Search for Important Reports
Basic = faster, less detailed
Advanced = slower, more comprehensive

### Tip 3: Export to PDF
Open HTML → Print → Save as PDF for sharing

### Tip 4: Customize Sections
Edit "Generate Research Queries" node to change the 5 sections

### Tip 5: Batch Processing
Generate multiple reports on related topics

---

## 🎨 Customization

### Change Research Sections

Edit **"Generate Research Queries"** node:

```javascript
// Current: 5 sections
const queries = [
  `${topic} overview and introduction`,
  `${topic} latest developments and trends`,
  `${topic} key benefits and advantages`,
  `${topic} challenges and limitations`,
  `${topic} future predictions and outlook`
];

// Custom: 3 sections
const queries = [
  `${topic} current state`,
  `${topic} best practices`,
  `${topic} case studies`
];
```

### Change Save Location

Edit **"Generate HTML Report"** node:

```javascript
// Current (Desktop/TavilyResearch)
const saveDir = path.join(homeDir, 'Desktop', 'TavilyResearch');

// Save to Documents
const saveDir = path.join(homeDir, 'Documents', 'Research');

// Custom folder
const saveDir = 'C:/MyResearch/Reports';
```

### Change Color Scheme

Edit **"Generate HTML Report"** node CSS:

```css
/* Current: Blue gradient */
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);

/* Green gradient */
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);

/* Purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## 🐛 Troubleshooting

### Issue: Workflow takes too long

**Cause**: Advanced search with many results
**Solution**: Use "basic" search depth or reduce maxResults

### Issue: Some sections have no sources

**Cause**: Topic too specific or API key quota exceeded
**Solution**: Broaden topic or check API key quota

### Issue: API key error

**Solution**: See [TAVILY_API_TROUBLESHOOTING.md](TAVILY_API_TROUBLESHOOTING.md)

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Workflow completes in 20-60 seconds
- ✅ HTML file appears in Desktop/TavilyResearch
- ✅ File opens with professional design
- ✅ All 5 sections are populated
- ✅ Each section has AI summary and sources
- ✅ Links are clickable

---

## 📚 Related Documentation

| Guide | Purpose |
|-------|---------|
| **[test-tavily-research.ps1](test-tavily-research.ps1)** | Test script |
| **[TAVILY_API_TROUBLESHOOTING.md](TAVILY_API_TROUBLESHOOTING.md)** | Fix API issues |
| **[test-tavily-api-key.ps1](test-tavily-api-key.ps1)** | Verify API key |

---

## 🎉 Example Output

When you run a research report, you'll get:

**Header**: Blue gradient with "📊 Research Report"
**Metadata**: 5 sections, 15 sources, date
**Table of Contents**: Clickable links to all sections
**Section 1**: Overview + AI summary + 3 sources
**Section 2**: Latest developments + AI summary + 3 sources
**Section 3**: Benefits + AI summary + 3 sources
**Section 4**: Challenges + AI summary + 3 sources
**Section 5**: Future outlook + AI summary + 3 sources
**Footer**: Metadata and timestamp

**Try it now**: `.\test-tavily-research.ps1` 🚀

