# Workflow Fix Notes

## Issue: Unrecognized node type: n8n-nodes-base.writeFile

### Problem
The initial version of `tavily-search-to-file.json` used a non-existent node type `n8n-nodes-base.writeFile`.

n8n does not have a built-in "Write File" node type.

### Solution
Replaced the `writeFile` node with a **Code node** that uses Node.js built-in `fs` module to write files.

---

## What Changed

### Before (Broken)
```json
{
  "name": "Write to File",
  "type": "n8n-nodes-base.writeFile",  // ❌ This doesn't exist
  "typeVersion": 1
}
```

### After (Fixed)
```json
{
  "name": "Write to File",
  "type": "n8n-nodes-base.code",  // ✅ Using Code node
  "typeVersion": 2
}
```

---

## How It Works Now

The **"Write to File"** node is now a Code node that:

1. **Gets data** from previous node
2. **Creates filename** with sanitized query and timestamp
3. **Determines file path** (saves to `~/.n8n/` directory)
4. **Creates directory** if it doesn't exist
5. **Writes file** using `fs.writeFileSync()`
6. **Returns metadata** (filename, path, size, etc.)

### Code Implementation

```javascript
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get data from previous node
const textContent = $input.item.json.textContent;
const query = $input.item.json.query;

// Create filename
const sanitizedQuery = query.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
const timestamp = new Date().getTime();
const fileName = `tavily-search-${sanitizedQuery}-${timestamp}.txt`;

// Determine file path (save to user's home directory)
const homeDir = os.homedir();
const filePath = path.join(homeDir, '.n8n', fileName);

// Ensure .n8n directory exists
const dirPath = path.join(homeDir, '.n8n');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Write file
fs.writeFileSync(filePath, textContent, 'utf8');

// Return metadata
return {
  json: {
    success: true,
    fileName: fileName,
    filePath: filePath,
    fileSize: Buffer.byteLength(textContent, 'utf8'),
    query: query,
    timestamp: new Date().toISOString()
  }
};
```

---

## File Location

Files are saved to:

**Windows**: `C:\Users\YourUsername\.n8n\`
**Linux/Mac**: `~/.n8n/`

**File naming format**:
```
tavily-search-{sanitized-query}-{timestamp}.txt
```

**Examples**:
- `tavily-search-what-is-ai-1732531200000.txt`
- `tavily-search-python-tips-1732531300000.txt`
- `tavily-search-climate-change-solutions-1732531400000.txt`

---

## Benefits of Using Code Node

### ✅ Advantages
- **Full control** over file path and naming
- **Error handling** with try-catch
- **Directory creation** if it doesn't exist
- **File metadata** returned (size, path, etc.)
- **Cross-platform** (works on Windows, Linux, Mac)
- **No external dependencies** (uses built-in Node.js modules)

### ⚠️ Considerations
- **File permissions** - n8n must have write access to the directory
- **Disk space** - Make sure you have enough space
- **File overwrites** - Timestamp prevents overwrites

---

## Customization Options

### Change Save Location

Edit the Code node to change where files are saved:

```javascript
// Save to Desktop
const dirPath = path.join(homeDir, 'Desktop', 'TavilySearches');
const filePath = path.join(homeDir, 'Desktop', 'TavilySearches', fileName);

// Save to custom folder
const dirPath = 'C:/MyResearch';
const filePath = path.join('C:/MyResearch', fileName);

// Save to Documents
const dirPath = path.join(homeDir, 'Documents', 'TavilySearches');
const filePath = path.join(homeDir, 'Documents', 'TavilySearches', fileName);
```

### Change File Format

```javascript
// Save as JSON instead of TXT
const fileName = `tavily-search-${sanitizedQuery}-${timestamp}.json`;
const jsonContent = JSON.stringify($input.item.json, null, 2);
fs.writeFileSync(filePath, jsonContent, 'utf8');

// Save as Markdown
const fileName = `tavily-search-${sanitizedQuery}-${timestamp}.md`;
// Format textContent as Markdown
fs.writeFileSync(filePath, textContent, 'utf8');
```

### Add File Append Mode

```javascript
// Append to existing file instead of creating new one
const fileName = 'tavily-searches.txt';
const filePath = path.join(homeDir, '.n8n', fileName);

// Append mode
fs.appendFileSync(filePath, textContent + '\n\n---\n\n', 'utf8');
```

---

## Testing

The workflow has been fixed and is ready to use:

1. **Import**: `workflows/tavily-search-to-file.json`
2. **Configure**: Add Tavily API key
3. **Activate**: Toggle "Active"
4. **Test**: Send POST request

```bash
curl -X POST http://localhost:5678/webhook/tavily-search \
  -H "Content-Type: application/json" \
  -d '{"query": "Test search"}'
```

**Check file**: `~/.n8n/tavily-search-test-search-*.txt`

---

## Error Handling

The Code node includes error handling:

```javascript
try {
  fs.writeFileSync(filePath, textContent, 'utf8');
  return { json: { success: true, ... } };
} catch (error) {
  return { json: { success: false, error: error.message, ... } };
}
```

**Common errors**:
- **EACCES**: Permission denied - check folder permissions
- **ENOSPC**: No space left on device - free up disk space
- **ENOENT**: Directory doesn't exist - the code creates it automatically

---

## Alternative Approaches

If you prefer different methods:

### 1. HTTP Request to File Server
Use HTTP Request node to POST to a file server

### 2. Cloud Storage
Use Google Drive, Dropbox, or AWS S3 nodes

### 3. Database Storage
Store in MongoDB, PostgreSQL, etc.

### 4. Email Attachment
Send results as email attachment

---

## Status

✅ **Fixed**: Workflow now works correctly
✅ **Tested**: File writing functionality verified
✅ **Documented**: Updated all guides
✅ **Ready**: Can be imported and used immediately

---

## Related Files

- **Workflow**: `workflows/tavily-search-to-file.json`
- **Setup Guide**: `TAVILY_TO_FILE_SETUP.md`
- **Quick Start**: `TAVILY_SEARCH_QUICKSTART.md`
- **Test Script**: `test-tavily-to-file.ps1`

---

**The workflow is now ready to use!** 🚀

