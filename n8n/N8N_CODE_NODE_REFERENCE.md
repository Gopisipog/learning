# n8n Code Node Reference - Special Variables & Methods

Complete guide to using `$` variables in n8n Code nodes.

## 🎯 Special Variables Overview

When you type `$` in an n8n Code node, you get access to:

| Variable | Description | Use Case |
|----------|-------------|----------|
| `$input` | Current input data | Access data from previous node |
| `$json` | Shorthand for `$input.item.json` | Quick access to JSON data |
| `$binary` | Binary data from input | Work with files/images |
| `$node` | Access other nodes | Get data from specific nodes |
| `$workflow` | Workflow information | Get workflow name, ID, etc. |
| `$execution` | Execution information | Get execution ID, mode |
| `$env` | Environment variables | Access env vars |
| `$now` | Current date/time | Timestamps |
| `$today` | Today's date | Date operations |

---

## 📝 Detailed Reference

### 1. `$input` - Input Data

Access data from the previous node.

```javascript
// Get all input items
const items = $input.all();

// Get first item
const firstItem = $input.first();

// Get last item
const lastItem = $input.last();

// Get specific item by index
const item = $input.item;

// Get item JSON data
const data = $input.item.json;

// Get binary data
const binary = $input.item.binary;
```

**Example**:
```javascript
// Access data from previous node
const inputText = $input.item.json.text;
const inputTitle = $input.item.json.title;

console.log('Input:', inputText);
```

---

### 2. `$json` - Quick JSON Access

Shorthand for `$input.item.json`.

```javascript
// Instead of this:
const text = $input.item.json.text;

// You can use:
const text = $json.text;
```

**Example**:
```javascript
// Access input fields directly
const text = $json.text;
const title = $json.title;
const author = $json.author;

return {
  json: {
    message: `Processing: ${title} by ${author}`
  }
};
```

---

### 3. `$node` - Access Other Nodes

Get data from specific nodes in your workflow.

```javascript
// Get data from a specific node
const nodeData = $node['Node Name'].json;

// Get all items from a node
const allItems = $node['Node Name'].all();

// Get first item from a node
const firstItem = $node['Node Name'].first();
```

**Example** (from our workflow):
```javascript
// Get data from "Tavily Research" node
const researchData = $node['Tavily Research'].json;
const researchSummary = researchData.researchSummary;
const sources = researchData.sources;

// Get data from "Format Blog" node
const blogData = $node['Format Blog'].json;
const title = blogData.title;
```

---

### 4. `$workflow` - Workflow Information

Access workflow metadata.

```javascript
// Get workflow name
const workflowName = $workflow.name;

// Get workflow ID
const workflowId = $workflow.id;

// Get workflow active status
const isActive = $workflow.active;
```

**Example**:
```javascript
return {
  json: {
    workflowName: $workflow.name,
    workflowId: $workflow.id,
    processedAt: new Date().toISOString()
  }
};
```

---

### 5. `$execution` - Execution Information

Get information about the current execution.

```javascript
// Get execution ID
const executionId = $execution.id;

// Get execution mode (manual, trigger, webhook, etc.)
const mode = $execution.mode;

// Get resume URL (for waiting workflows)
const resumeUrl = $execution.resumeUrl;
```

**Example**:
```javascript
return {
  json: {
    executionId: $execution.id,
    mode: $execution.mode,
    timestamp: new Date().toISOString()
  }
};
```

---

### 6. `$env` - Environment Variables

Access environment variables.

```javascript
// Get environment variable
const apiKey = $env.OPENAI_API_KEY;
const tavilyKey = $env.TAVILY_API_KEY;
```

**Example**:
```javascript
// Use environment variables for API keys
const { tavily } = require('@tavily/core');

const tvly = tavily({ 
  apiKey: $env.TAVILY_API_KEY || 'tvly-YOUR_API_KEY'
});
```

---

### 7. `$now` - Current Date/Time

Get current date and time.

```javascript
// Current date/time as Date object
const now = $now;

// ISO string
const isoString = $now.toISOString();

// Unix timestamp
const timestamp = $now.getTime();
```

**Example**:
```javascript
return {
  json: {
    processedAt: $now.toISOString(),
    timestamp: $now.getTime(),
    date: $now.toLocaleDateString()
  }
};
```

---

### 8. `$today` - Today's Date

Get today's date at midnight.

```javascript
// Today at 00:00:00
const today = $today;

// Format as string
const dateString = $today.toISOString();
```

**Example**:
```javascript
return {
  json: {
    today: $today.toISOString(),
    dayOfWeek: $today.getDay(),
    month: $today.getMonth() + 1
  }
};
```

---

## 🔧 Common Patterns

### Pattern 1: Access Previous Node Data

```javascript
// Get data from previous node
const inputData = $input.item.json;

// Process it
const result = processData(inputData);

// Return new data
return {
  json: {
    original: inputData,
    processed: result
  }
};
```

---

### Pattern 2: Access Specific Node Data

```javascript
// Get data from multiple nodes
const webhookData = $node['Webhook'].json;
const researchData = $node['Tavily Research'].json;
const aiData = $node['OpenAI Chat'].json;

// Combine data
return {
  json: {
    input: webhookData,
    research: researchData,
    generated: aiData
  }
};
```

---

### Pattern 3: Loop Through All Items

```javascript
// Process all input items
const items = $input.all();

const results = items.map(item => {
  return {
    json: {
      original: item.json,
      processed: processItem(item.json)
    }
  };
});

return results;
```

---

### Pattern 4: Use Environment Variables

```javascript
// Safely use environment variables
const apiKey = $env.API_KEY || 'fallback-key';

// Use in API call
const response = await fetch('https://api.example.com', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
});
```

---

## 💡 Practical Examples

### Example 1: Enhanced Tavily Research (Current Workflow)

```javascript
const { tavily } = require('@tavily/core');

// Use environment variable or hardcoded key
const tvly = tavily({ 
  apiKey: $env.TAVILY_API_KEY || 'tvly-YOUR_API_KEY' 
});

// Get input from previous node
const topic = $input.item.json.inputText;
const title = $input.item.json.blogTitle;

// Research the topic
const research = await tvly.search(title + ' ' + topic, {
  searchDepth: 'advanced',
  maxResults: 5,
  includeAnswer: true
});

// Return enhanced data
return {
  json: {
    inputText: topic,
    blogTitle: title,
    researchSummary: research.answer,
    sources: research.results,
    processedAt: $now.toISOString()
  }
};
```

---

### Example 2: Combine Data from Multiple Nodes

```javascript
// Get data from different nodes
const originalInput = $node['Extract Input'].json;
const researchData = $node['Tavily Research'].json;
const blogContent = $node['OpenAI Chat'].json;

// Create comprehensive response
return {
  json: {
    workflow: $workflow.name,
    executionId: $execution.id,
    input: {
      title: originalInput.blogTitle,
      author: originalInput.author
    },
    research: {
      summary: researchData.researchSummary,
      sourcesCount: researchData.sources.length
    },
    output: {
      content: blogContent.choices[0].message.content,
      wordCount: blogContent.choices[0].message.content.split(' ').length
    },
    timestamp: $now.toISOString()
  }
};
```

---

### Example 3: Error Handling with Node Data

```javascript
try {
  // Try to get data from previous node
  const data = $input.item.json;
  
  // Process data
  const result = await processData(data);
  
  return {
    json: {
      success: true,
      result: result,
      executionId: $execution.id
    }
  };
  
} catch (error) {
  // Return error information
  return {
    json: {
      success: false,
      error: error.message,
      executionId: $execution.id,
      timestamp: $now.toISOString()
    }
  };
}
```

---

## 🎯 Best Practices

### 1. Use Descriptive Variable Names
```javascript
// Good
const userInput = $json.text;
const blogTitle = $json.title;

// Avoid
const x = $json.text;
const y = $json.title;
```

### 2. Check Data Exists
```javascript
// Safe
const text = $json.text || 'Default text';
const title = $json.title || 'Untitled';

// Risky (might throw error if undefined)
const text = $json.text;
```

### 3. Use Environment Variables for Secrets
```javascript
// Good - use environment variables
const apiKey = $env.API_KEY;

// Bad - hardcode secrets
const apiKey = 'sk-abc123...';
```

### 4. Return Proper Structure
```javascript
// Good - return object with json property
return {
  json: {
    result: data
  }
};

// Bad - return raw data
return data;
```

---

## 📚 Additional Resources

- **n8n Docs**: https://docs.n8n.io/code-examples/
- **Code Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/
- **Expressions**: https://docs.n8n.io/code-examples/expressions/

---

## ✅ Quick Reference Card

```javascript
// Input data
$input.item.json          // Current item JSON
$input.all()              // All items
$json.fieldName           // Quick access to field

// Other nodes
$node['Node Name'].json   // Get data from specific node

// Workflow info
$workflow.name            // Workflow name
$execution.id             // Execution ID

// Environment
$env.VARIABLE_NAME        // Environment variable

// Date/Time
$now                      // Current date/time
$today                    // Today at midnight
```

---

**Happy coding in n8n!** 🚀

