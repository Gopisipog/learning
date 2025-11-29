# API Reference

Complete API documentation for the Text to Blog AI Publisher workflow.

## 📡 Endpoint

```
POST http://localhost:5678/webhook/create-blog
```

---

## 📥 Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | ✅ Yes |

### Body Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | ✅ Yes | - | Raw text content to transform into a blog post |
| `title` | string | ❌ No | "Untitled Blog Post" | Title of the blog post |
| `author` | string | ❌ No | "AI Assistant" | Author name for the blog post |

### Request Example

```json
{
  "text": "Artificial Intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data, identify patterns, and make predictions with remarkable accuracy. From healthcare to finance, AI is revolutionizing industries by automating tasks, improving decision-making, and creating new opportunities for innovation.",
  "title": "The AI Revolution: Transforming Our World",
  "author": "Tech Insights Team"
}
```

### Validation Rules

- **text**: 
  - Minimum length: 10 characters
  - Maximum length: 10,000 characters (recommended)
  - Cannot be empty or null

- **title**:
  - Maximum length: 200 characters
  - Optional (uses default if not provided)

- **author**:
  - Maximum length: 100 characters
  - Optional (uses default if not provided)

---

## 📤 Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "title": "The AI Revolution: Transforming Our World",
    "wordpressPostId": 123,
    "wordpressLink": "https://your-wordpress-site.com/?p=123"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the operation was successful |
| `message` | string | Human-readable success message |
| `data.title` | string | Title of the created blog post |
| `data.wordpressPostId` | number | WordPress post ID |
| `data.wordpressLink` | string | Direct link to the WordPress post |

---

## ❌ Error Responses

### 400 Bad Request

**Cause**: Invalid or missing required parameters

```json
{
  "success": false,
  "error": "Missing required field: text",
  "code": "INVALID_REQUEST"
}
```

### 401 Unauthorized

**Cause**: Invalid OpenAI or WordPress credentials

```json
{
  "success": false,
  "error": "OpenAI API authentication failed",
  "code": "AUTH_FAILED"
}
```

### 500 Internal Server Error

**Cause**: Workflow execution error

```json
{
  "success": false,
  "error": "Failed to generate blog post",
  "code": "EXECUTION_ERROR"
}
```

### 503 Service Unavailable

**Cause**: n8n workflow not active or not found

```json
{
  "success": false,
  "error": "Workflow not active",
  "code": "WORKFLOW_INACTIVE"
}
```

---

## 🔧 Usage Examples

### cURL

```bash
curl -X POST http://localhost:5678/webhook/create-blog \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your content here...",
    "title": "My Blog Post",
    "author": "John Doe"
  }'
```

### PowerShell

```powershell
$Body = @{
    text = "Your content here..."
    title = "My Blog Post"
    author = "John Doe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook/create-blog" `
    -Method Post `
    -Body $Body `
    -ContentType "application/json"
```

### Python

```python
import requests

url = "http://localhost:5678/webhook/create-blog"
data = {
    "text": "Your content here...",
    "title": "My Blog Post",
    "author": "John Doe"
}

response = requests.post(url, json=data)
print(response.json())
```

### JavaScript (Fetch)

```javascript
fetch('http://localhost:5678/webhook/create-blog', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Your content here...",
    title: "My Blog Post",
    author: "John Doe"
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

axios.post('http://localhost:5678/webhook/create-blog', {
  text: "Your content here...",
  title: "My Blog Post",
  author: "John Doe"
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

---

## 🔐 Security Considerations

### Authentication

Currently, the webhook endpoint is **unauthenticated**. For production use:

1. **Add Basic Auth** to the webhook node
2. **Use API Keys** via custom headers
3. **Implement IP Whitelisting**
4. **Use HTTPS** in production

### Rate Limiting

Consider implementing rate limiting to prevent abuse:
- Recommended: 10 requests per minute per IP
- Use n8n's built-in rate limiting or external tools

### Data Validation

The workflow performs basic validation:
- ✅ Checks for required `text` field
- ✅ Applies default values for optional fields
- ⚠️ Does not sanitize HTML (WordPress handles this)

---

## 📊 Performance

### Response Times

| Scenario | Typical Time |
|----------|--------------|
| Short text (< 100 words) | 3-5 seconds |
| Medium text (100-500 words) | 5-10 seconds |
| Long text (500+ words) | 10-20 seconds |

### Factors Affecting Performance

- OpenAI API response time
- WordPress server response time
- Network latency
- Text length and complexity

### Optimization Tips

1. Use `gpt-4o-mini` instead of `gpt-4o` for faster responses
2. Reduce `max_tokens` if shorter posts are acceptable
3. Cache frequently used prompts
4. Use async processing for bulk operations

---

## 🧪 Testing

### Health Check

Test if the workflow is active:

```bash
curl -X POST http://localhost:5678/webhook/create-blog \
  -H "Content-Type: application/json" \
  -d '{"text": "test"}'
```

Expected: Any response (not 404) means workflow is active

### Minimal Test

```json
{
  "text": "This is a minimal test."
}
```

### Full Test

```json
{
  "text": "Comprehensive test with all fields populated. This text should be long enough to generate a meaningful blog post with multiple paragraphs and proper structure.",
  "title": "Full Feature Test",
  "author": "QA Team"
}
```

---

## 🔄 Workflow Behavior

### Processing Steps

1. **Receive Request** → Webhook validates JSON
2. **Extract Data** → Parse text, title, author
3. **Generate Blog** → OpenAI transforms text
4. **Format Output** → Prepare for WordPress
5. **Publish** → Create draft in WordPress
6. **Respond** → Return success with post details

### Timeout Settings

- **Default**: 120 seconds
- **Recommended**: 180 seconds for long content
- Configure in n8n workflow settings

---

## 📝 Notes

- Posts are created as **drafts** by default
- HTML formatting is automatically applied
- WordPress post status can be changed to "publish" in the workflow
- The workflow does not handle image uploads
- Categories and tags are not set (can be added)

---

## 🆘 Support

For issues or questions:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Visit n8n community: https://community.n8n.io/

