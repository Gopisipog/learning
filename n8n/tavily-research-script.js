// Tavily Research Script using @tavily/core SDK
// Usage: node tavily-research-script.js "Your Research Topic"

const { tavily } = require('@tavily/core');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get topic from command line argument
const topic = process.argv[2] || 'Artificial Intelligence trends 2024';
const searchDepth = process.argv[3] || 'advanced';
const maxResults = parseInt(process.argv[4]) || 10;

// Initialize Tavily client
const client = tavily({ apiKey: process.env.TAVILY_API_KEY || "tvly-dev-********************************" });

// Define research queries
const queries = [
  `${topic} overview and introduction`,
  `${topic} latest developments and trends`,
  `${topic} key benefits and advantages`,
  `${topic} challenges and limitations`,
  `${topic} future predictions and outlook`
];

console.log(`🔬 Starting research on: "${topic}"`);
console.log(`📊 Search depth: ${searchDepth}`);
console.log(`📚 Max results per section: ${Math.ceil(maxResults / queries.length)}`);
console.log('');

// Perform research for all queries in parallel
async function conductResearch() {
  try {
    const resultsPerSection = Math.ceil(maxResults / queries.length);
    
    // Execute all searches in parallel
    const searchPromises = queries.map(async (query, index) => {
      console.log(`🔍 Searching: ${query}...`);
      
      const response = await client.search(query, {
        searchDepth: searchDepth,
        maxResults: resultsPerSection,
        includeAnswer: true,
        includeRawContent: false,
        includeImages: false
      });
      
      console.log(`✅ Section ${index + 1} complete: ${response.results.length} results found`);
      
      return {
        query: query,
        answer: response.answer || 'No summary available',
        results: response.results || [],
        resultsCount: response.results ? response.results.length : 0
      };
    });
    
    // Wait for all searches to complete
    const sections = await Promise.all(searchPromises);
    
    const totalResults = sections.reduce((sum, section) => sum + section.resultsCount, 0);
    
    console.log('');
    console.log(`✅ Research complete!`);
    console.log(`   Total sections: ${sections.length}`);
    console.log(`   Total sources: ${totalResults}`);
    console.log('');
    
    // Generate HTML report
    const htmlContent = generateHTMLReport(topic, sections, totalResults);
    
    // Save to Desktop
    const sanitizedTopic = topic.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const fileName = `research-report-${sanitizedTopic}-${Date.now()}.html`;
    const homeDir = os.homedir();
    const saveDir = path.join(homeDir, 'Desktop', 'TavilyResearch');
    const filePath = path.join(saveDir, fileName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    
    console.log(`💾 Report saved to:`);
    console.log(`   ${filePath}`);
    console.log(`   Size: ${(Buffer.byteLength(htmlContent, 'utf8') / 1024).toFixed(2)} KB`);
    console.log('');
    console.log(`🎉 Done! Open the file in your browser to view the report.`);
    
    // Return result as JSON for n8n
    const result = {
      success: true,
      topic: topic,
      fileName: fileName,
      filePath: filePath,
      saveDirectory: saveDir,
      totalSections: sections.length,
      totalResults: totalResults,
      fileSize: Buffer.byteLength(htmlContent, 'utf8'),
      timestamp: new Date().toISOString()
    };
    
    console.log('');
    console.log('JSON Output:');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function generateHTMLReport(topic, sections, totalResults) {
  const formattedDate = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' });
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Research Report: ${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.8;
      color: #2c3e50;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 30px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.4);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 60px 50px;
      text-align: center;
      border-bottom: 5px solid #f39c12;
    }
    
    .header h1 {
      font-size: 3em;
      margin-bottom: 15px;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .header .subtitle {
      font-size: 1.2em;
      opacity: 0.9;
      font-style: italic;
    }

    .meta-bar {
      background: #34495e;
      color: white;
      padding: 20px 50px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 20px;
    }

    .meta-item {
      text-align: center;
    }

    .meta-label {
      font-size: 0.85em;
      opacity: 0.8;
      display: block;
      margin-bottom: 5px;
    }

    .meta-value {
      font-size: 1.5em;
      font-weight: bold;
      color: #f39c12;
    }

    .toc {
      background: #ecf0f1;
      padding: 40px 50px;
      border-bottom: 1px solid #bdc3c7;
    }

    .toc h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.8em;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }

    .toc ol {
      margin-left: 25px;
    }

    .toc li {
      margin: 10px 0;
      font-size: 1.1em;
    }

    .toc a {
      color: #2980b9;
      text-decoration: none;
      transition: color 0.3s;
    }

    .toc a:hover {
      color: #3498db;
      text-decoration: underline;
    }

    .content {
      padding: 50px;
    }

    .section {
      margin-bottom: 60px;
      page-break-inside: avoid;
    }

    .section-header {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      padding: 25px 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .section-number {
      display: inline-block;
      background: #f39c12;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      font-weight: bold;
      margin-right: 15px;
      font-size: 1.2em;
    }

    .section-title {
      font-size: 1.8em;
      display: inline;
      vertical-align: middle;
    }

    .summary-box {
      background: #fff9e6;
      border-left: 5px solid #f39c12;
      padding: 25px 30px;
      margin-bottom: 30px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .summary-box h3 {
      color: #d68910;
      margin-bottom: 15px;
      font-size: 1.3em;
    }

    .summary-box p {
      color: #7d6608;
      font-size: 1.05em;
      line-height: 1.9;
    }

    .sources h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.4em;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }

    .source-card {
      background: white;
      border: 1px solid #dfe6e9;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 15px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .source-card:hover {
      box-shadow: 0 6px 12px rgba(52, 152, 219, 0.2);
      transform: translateX(5px);
      border-color: #3498db;
    }

    .source-title {
      font-size: 1.2em;
      color: #2c3e50;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .source-url {
      color: #3498db;
      text-decoration: none;
      font-size: 0.9em;
      display: block;
      margin-bottom: 12px;
      word-break: break-all;
    }

    .source-url:hover {
      text-decoration: underline;
    }

    .source-score {
      display: inline-block;
      background: #27ae60;
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 600;
      margin-right: 10px;
    }

    .source-content {
      color: #555;
      line-height: 1.7;
      margin-top: 12px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.95em;
    }

    .footer {
      background: #2c3e50;
      color: white;
      padding: 40px 50px;
      text-align: center;
    }

    .footer p {
      margin: 8px 0;
      opacity: 0.9;
    }

    .footer strong {
      color: #f39c12;
    }

    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
      .source-card { page-break-inside: avoid; }
    }

    @media (max-width: 768px) {
      body { padding: 10px; }
      .header { padding: 40px 25px; }
      .header h1 { font-size: 2em; }
      .content, .toc { padding: 25px; }
      .meta-bar { padding: 15px 25px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Research Report</h1>
      <div class="subtitle">${topic}</div>
    </div>

    <div class="meta-bar">
      <div class="meta-item">
        <span class="meta-label">Research Sections</span>
        <div class="meta-value">${sections.length}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">Total Sources</span>
        <div class="meta-value">${totalResults}</div>
      </div>
      <div class="meta-item">
        <span class="meta-label">Generated</span>
        <div class="meta-value">${new Date().toLocaleDateString()}</div>
      </div>
    </div>

    <div class="toc">
      <h2>📑 Table of Contents</h2>
      <ol>
`;

  sections.forEach((section, index) => {
    const sectionId = `section-${index + 1}`;
    html += `        <li><a href="#${sectionId}">${section.query}</a></li>\n`;
  });

  html += `      </ol>
    </div>

    <div class="content">
`;

  sections.forEach((section, index) => {
    const sectionId = `section-${index + 1}`;
    html += `
      <div class="section" id="${sectionId}">
        <div class="section-header">
          <span class="section-number">${index + 1}</span>
          <h2 class="section-title">${section.query}</h2>
        </div>

        <div class="summary-box">
          <h3>💡 Key Insights</h3>
          <p>${section.answer}</p>
        </div>

        <div class="sources">
          <h3>📚 Sources (${section.resultsCount} found)</h3>
`;

    section.results.forEach((result, resultIndex) => {
      const score = result.score ? (result.score * 100).toFixed(0) : 'N/A';
      const content = result.content ? result.content.substring(0, 500) : 'No content available';

      html += `
          <div class="source-card">
            <div class="source-title">${resultIndex + 1}. ${result.title}</div>
            <a href="${result.url}" target="_blank" class="source-url">${result.url}</a>
            ${result.score ? `<span class="source-score">Relevance: ${score}%</span>` : ''}
            <div class="source-content">${content}...</div>
          </div>
`;
    });

    html += `
        </div>
      </div>
`;
  });

  html += `
    </div>

    <div class="footer">
      <p><strong>Research Topic:</strong> ${topic}</p>
      <p><strong>Total Sections:</strong> ${sections.length}</p>
      <p><strong>Total Sources:</strong> ${totalResults}</p>
      <p><strong>Generated:</strong> ${formattedDate}</p>
      <p><strong>Powered by:</strong> Tavily Research API (@tavily/core SDK)</p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

// Run the research
conductResearch();

