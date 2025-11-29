# Testing Guide

Complete guide for testing your Text to Blog AI Publisher workflow.

## 📋 Prerequisites

Before testing, ensure:
- ✅ n8n is running (`npm start`)
- ✅ Workflow is imported and activated
- ✅ OpenAI credentials are configured
- ✅ WordPress credentials are configured (if publishing)
- ✅ Webhook URL is accessible: `http://localhost:5678/webhook/create-blog`

---

## 🧪 Testing Methods

### Method 1: Postman (Recommended)

**Step 1: Create New Request**
1. Open Postman
2. Click "New" → "HTTP Request"
3. Set method to **POST**
4. URL: `http://localhost:5678/webhook/create-blog`

**Step 2: Set Headers**
1. Click "Headers" tab
2. Add header:
   - Key: `Content-Type`
   - Value: `application/json`

**Step 3: Set Body**
1. Click "Body" tab
2. Select "raw"
3. Select "JSON" from dropdown
4. Paste this JSON:

```json
{
  "text": "Artificial Intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data, identify patterns, and make predictions with remarkable accuracy. From healthcare to finance, AI is revolutionizing industries by automating tasks, improving decision-making, and creating new opportunities for innovation.",
  "title": "The AI Revolution: Transforming Our World",
  "author": "Tech Insights Team"
}
```

**Step 4: Send Request**
1. Click "Send"
2. Check response in the bottom panel

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "title": "The AI Revolution: Transforming Our World",
    "wordpressPostId": 123,
    "wordpressLink": "https://your-site.com/?p=123"
  }
}
```

---

### Method 2: Insomnia

**Step 1: Create New Request**
1. Open Insomnia
2. Click "+" → "HTTP Request"
3. Name it: "Test Blog Creation"

**Step 2: Configure Request**
1. Method: **POST**
2. URL: `http://localhost:5678/webhook/create-blog`
3. Body: Select "JSON"
4. Paste the JSON from Method 1

**Step 3: Send**
1. Click "Send"
2. View response on the right panel

---

### Method 3: PowerShell (Windows)

**Using the Test Script:**
```powershell
.\test-workflow.ps1
```

**Manual PowerShell:**
```powershell
$Body = @{
    text = "Artificial Intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data, identify patterns, and make predictions with remarkable accuracy."
    title = "The AI Revolution: Transforming Our World"
    author = "Tech Insights Team"
} | ConvertTo-Json

$Response = Invoke-RestMethod -Uri "http://localhost:5678/webhook/create-blog" `
    -Method Post `
    -Body $Body `
    -ContentType "application/json"

$Response | ConvertTo-Json -Depth 10
```

---

### Method 4: cURL (Linux/Mac/Windows)

**Using Example File:**
```bash
curl -X POST http://localhost:5678/webhook/create-blog \
  -H "Content-Type: application/json" \
  -d @example-request.json
```

**Inline JSON:**
```bash
curl -X POST http://localhost:5678/webhook/create-blog \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial Intelligence is transforming the way we work and live.",
    "title": "The AI Revolution",
    "author": "Tech Team"
  }'
```

**With Pretty Output (using jq):**
```bash
curl -X POST http://localhost:5678/webhook/create-blog \
  -H "Content-Type: application/json" \
  -d @example-request.json | jq
```

---

### Method 5: Python

```python
import requests
import json

url = "http://localhost:5678/webhook/create-blog"
headers = {"Content-Type": "application/json"}

data = {
    "text": "Artificial Intelligence is transforming the way we work and live.",
    "title": "The AI Revolution: Transforming Our World",
    "author": "Tech Insights Team"
}

response = requests.post(url, headers=headers, json=data)
print(json.dumps(response.json(), indent=2))
```

---

### Method 6: JavaScript/Node.js

```javascript
const axios = require('axios');

const data = {
  text: "Artificial Intelligence is transforming the way we work and live.",
  title: "The AI Revolution: Transforming Our World",
  author: "Tech Insights Team"
};

axios.post('http://localhost:5678/webhook/create-blog', data, {
  headers: { 'Content-Type': 'application/json' }
})
.then(response => {
  console.log(JSON.stringify(response.data, null, 2));
})
.catch(error => {
  console.error('Error:', error.message);
});
```

---

## ✅ Verification Steps

After sending a request:

### 1. Check Response
- ✅ Status code: 200 OK
- ✅ `success: true` in response
- ✅ `wordpressPostId` is present
- ✅ `wordpressLink` is valid

### 2. Check WordPress
1. Log into WordPress admin
2. Go to Posts → All Posts
3. Look for your new draft post
4. Verify:
   - ✅ Title matches
   - ✅ Content is formatted HTML
   - ✅ Status is "Draft"

### 3. Check n8n Execution
1. Go to n8n UI: `http://localhost:5678`
2. Click "Executions" in left sidebar
3. Find your workflow execution
4. Click to view details
5. Verify all nodes executed successfully (green checkmarks)

---

## 🧪 Test Cases

### Test Case 1: Basic Functionality
```json
{
  "text": "This is a simple test.",
  "title": "Test Post",
  "author": "Tester"
}
```
**Expected**: Blog post created with minimal content

### Test Case 2: Long Content
```json
{
  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit... (500+ words)",
  "title": "Long Form Content Test",
  "author": "Content Team"
}
```
**Expected**: Comprehensive blog post with multiple sections

### Test Case 3: Missing Optional Fields
```json
{
  "text": "Testing with minimal data."
}
```
**Expected**: Uses default title "Untitled Blog Post" and author "AI Assistant"

### Test Case 4: Special Characters
```json
{
  "text": "Testing with special chars: @#$%^&*()",
  "title": "Special Characters Test: @#$%",
  "author": "QA Team"
}
```
**Expected**: Handles special characters correctly

### Test Case 5: Technical Content
```json
{
  "text": "JavaScript async/await makes asynchronous code look synchronous. Use try/catch for error handling.",
  "title": "Understanding Async/Await in JavaScript",
  "author": "Dev Team"
}
```
**Expected**: Properly formats code-related content

---

## 🐛 Troubleshooting

### Issue: Connection Refused
**Error**: `ECONNREFUSED`
**Solution**: 
- Ensure n8n is running
- Check URL is correct: `http://localhost:5678`

### Issue: 404 Not Found
**Error**: `Cannot POST /webhook/create-blog`
**Solution**:
- Verify workflow is activated
- Check webhook path in workflow matches URL

### Issue: 401 Unauthorized (OpenAI)
**Error**: `Invalid API key`
**Solution**:
- Verify OpenAI API key in credentials
- Check API key has credits

### Issue: 401 Unauthorized (WordPress)
**Error**: `rest_cannot_create`
**Solution**:
- Use application password, not regular password
- Verify username is correct
- Check user has permission to create posts

### Issue: Timeout
**Error**: Request times out
**Solution**:
- OpenAI might be slow, increase timeout
- Check internet connection
- Try with shorter text

---

## 📊 Performance Testing

### Response Time Benchmarks
- **Fast**: < 5 seconds
- **Normal**: 5-15 seconds
- **Slow**: > 15 seconds

### Load Testing (Optional)
```bash
# Using Apache Bench
ab -n 10 -c 2 -p example-request.json -T application/json \
  http://localhost:5678/webhook/create-blog
```

---

## 🎯 Next Steps

Once basic testing works:
1. ✅ Test with your own content
2. ✅ Customize AI prompt for your style
3. ✅ Adjust WordPress settings (categories, tags)
4. ✅ Set up monitoring/logging
5. ✅ Consider rate limiting for production

---

**Pro Tip**: Save successful requests in Postman/Insomnia as a collection for easy re-testing!

