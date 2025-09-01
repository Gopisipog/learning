// Simple Express server to serve a social-scroll UI for azure-ch03.md
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Absolute path to the markdown file
const mdPath = path.join(
  'c:\\Users\\gopic\\Documents\\augment-projects\\coding',
  'KnowledgeGraphExtractor',
  'azure-ch03.md'
);

// Serve static assets (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// API to fetch markdown content
app.get('/api/azure-ch03', (req, res) => {
  try {
    const content = fs.readFileSync(mdPath, 'utf8');
    res.type('text/plain').send(content);
  } catch (err) {
    console.error('Failed to read markdown:', err.message);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

app.listen(PORT, () => {
  console.log(`Azure Scroll server listening on http://localhost:${PORT}`);
});
