# n8n $ Variables Cheat Sheet

Quick reference for n8n Code node special variables.

## 🎯 Most Common Variables

```javascript
// Get input from previous node
$json.fieldName              // Quick access to field
$input.item.json             // Full JSON object
$input.all()                 // All input items

// Get data from specific node
$node['Node Name'].json      // Data from named node
$node['Node Name'].first()   // First item from node

// Workflow & execution info
$workflow.name               // Workflow name
$execution.id                // Execution ID

// Date & time
$now                         // Current date/time
$now.toISOString()          // ISO format
$today                       // Today at midnight

// Environment variables
$env.VARIABLE_NAME           // Access env var
```

---

## 📋 Complete List

### Input Data
```javascript
$input.item.json            // Current item JSON data
$input.item.binary          // Current item binary data
$input.all()                // Array of all input items
$input.first()              // First input item
$input.last()               // Last input item
$json                       // Shorthand for $input.item.json
$binary                     // Shorthand for $input.item.binary
```

### Node Data
```javascript
$node['Node Name'].json     // JSON from specific node
$node['Node Name'].binary   // Binary from specific node
$node['Node Name'].all()    // All items from node
$node['Node Name'].first()  // First item from node
$node['Node Name'].last()   // Last item from node
```

### Workflow Info
```javascript
$workflow.name              // Workflow name
$workflow.id                // Workflow ID
$workflow.active            // Is workflow active?
```

### Execution Info
```javascript
$execution.id               // Current execution ID
$execution.mode             // Execution mode (manual/trigger/webhook)
$execution.resumeUrl        // Resume URL for waiting workflows
```

### Environment
```javascript
$env.VARIABLE_NAME          // Environment variable
```

### Date & Time
```javascript
$now                        // Current Date object
$now.toISOString()         // "2024-11-25T10:30:00.000Z"
$now.getTime()             // Unix timestamp
$today                      // Today at 00:00:00
```

---

## 💡 Common Use Cases

### 1. Access Input Field
```javascript
const text = $json.text;
const title = $json.title;
```

### 2. Get Data from Previous Node
```javascript
const previousData = $input.item.json;
```

### 3. Get Data from Specific Node
```javascript
const webhookData = $node['Webhook'].json;
const researchData = $node['Tavily Research'].json;
```

### 4. Process All Items
```javascript
const allItems = $input.all();
allItems.forEach(item => {
  console.log(item.json);
});
```

### 5. Add Timestamp
```javascript
return {
  json: {
    data: $json,
    processedAt: $now.toISOString()
  }
};
```

### 6. Use Environment Variable
```javascript
const apiKey = $env.TAVILY_API_KEY;
```

---

## 🔧 Return Format

Always return data in this format:

```javascript
// Single item
return {
  json: {
    field1: value1,
    field2: value2
  }
};

// Multiple items
return [
  { json: { field: value1 } },
  { json: { field: value2 } }
];
```

---

## ⚠️ Common Mistakes

### ❌ Wrong
```javascript
// Don't return raw data
return data;

// Don't forget to check if field exists
const text = $json.text; // Might be undefined
```

### ✅ Correct
```javascript
// Return proper format
return { json: data };

// Check if field exists
const text = $json.text || 'Default value';
```

---

## 🎯 Examples for Our Workflow

### Access Webhook Input
```javascript
const text = $json.text;
const title = $json.title;
const author = $json.author;
```

### Get Research Data
```javascript
const researchSummary = $node['Tavily Research'].json.researchSummary;
const sources = $node['Tavily Research'].json.sources;
```

### Get OpenAI Response
```javascript
const aiResponse = $node['OpenAI Chat'].json;
const blogContent = aiResponse.choices[0].message.content;
```

### Combine Multiple Node Data
```javascript
return {
  json: {
    title: $node['Extract Input'].json.blogTitle,
    research: $node['Tavily Research'].json.researchSummary,
    content: $node['OpenAI Chat'].json.choices[0].message.content,
    timestamp: $now.toISOString()
  }
};
```

---

## 📚 Full Documentation

For complete details, see: [N8N_CODE_NODE_REFERENCE.md](N8N_CODE_NODE_REFERENCE.md)

---

**Quick tip**: Type `$` in the Code node editor to see autocomplete suggestions! 💡

