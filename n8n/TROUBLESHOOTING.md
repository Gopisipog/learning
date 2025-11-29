# Troubleshooting Guide

## Import Issues

### "Bad control character in string literal in JSON" Error

This error occurs when the workflow JSON contains improperly escaped characters in JSON strings.

**Solution:**

✅ **This has been fixed in the latest version!** Re-download or re-import the workflow files:
- `workflows/text-to-blog-simple.json`
- `workflows/text-to-blog-ai-publisher.json`

The workflows now use `JSON.stringify()` instead of literal JSON strings with escape characters.

---

### "Could not find property option" Error

This error occurs when the workflow JSON contains node configurations that are incompatible with your n8n version.

**Solution:**

1. **Use the Simple Workflow** (Recommended for beginners):
   - Import: `workflows/text-to-blog-simple.json`
   - This uses standard HTTP Request nodes instead of LangChain nodes
   - More compatible across n8n versions

2. **Update n8n to the latest version**:
   ```bash
   npm install n8n@latest
   ```

3. **Build the workflow manually** (if import still fails):
   - See the "Manual Setup" section below

---

## Manual Workflow Setup

If you can't import the workflow, follow these steps to build it manually:

### Step 1: Create a New Workflow

1. Open n8n: `http://localhost:5678`
2. Click "Add workflow"
3. Name it: "Text to Blog AI Publisher"

### Step 2: Add Webhook Node

1. Click the "+" button
2. Search for "Webhook"
3. Configure:
   - **HTTP Method**: POST
   - **Path**: `create-blog`
   - **Response Mode**: "Using 'Respond to Webhook' Node"

### Step 3: Add "Extract Input" Node (Set)

1. Add a "Set" node
2. Connect it to the Webhook
3. Configure assignments:
   - **Name**: `inputText`, **Value**: `={{ $json.body.text }}`
   - **Name**: `blogTitle`, **Value**: `={{ $json.body.title || 'Untitled Blog Post' }}`
   - **Name**: `author`, **Value**: `={{ $json.body.author || 'AI Assistant' }}`

### Step 4: Add OpenAI Node

**Option A: Using HTTP Request (Recommended)**

1. Add "HTTP Request" node
2. Configure:
   - **Method**: POST
   - **URL**: `https://api.openai.com/v1/chat/completions`
   - **Authentication**: OpenAI API (create credential)
   - **Send Body**: Yes
   - **Body Content Type**: JSON
   - **JSON Body**:
   ```json
   {
     "model": "gpt-4o-mini",
     "messages": [
       {
         "role": "system",
         "content": "You are a professional blog writer. Transform the given text into a well-structured, engaging blog post with proper HTML formatting."
       },
       {
         "role": "user",
         "content": "Title: {{ $json.blogTitle }}\n\nOriginal Text:\n{{ $json.inputText }}\n\nPlease transform this into a complete blog post."
       }
     ],
     "temperature": 0.7,
     "max_tokens": 2000
   }
   ```

**Option B: Using OpenAI Chat Model Node**

1. Search for "OpenAI Chat Model"
2. Add your OpenAI credentials
3. Set model to "gpt-4o-mini"
4. Configure the prompt as above

### Step 5: Add "Format Blog" Node (Set)

1. Add another "Set" node
2. Configure assignments:
   - **Name**: `blogContent`, **Value**: `={{ $json.choices[0].message.content }}` (for HTTP) or `={{ $json.message.content }}` (for Chat Model)
   - **Name**: `title`, **Value**: `={{ $('Extract Input').item.json.blogTitle }}`
   - **Name**: `author`, **Value**: `={{ $('Extract Input').item.json.author }}`

### Step 6: Add WordPress Publishing Node

1. Add "HTTP Request" node
2. Configure:
   - **Method**: POST
   - **URL**: `https://your-wordpress-site.com/wp-json/wp/v2/posts`
   - **Authentication**: HTTP Basic Auth
   - **Username**: Your WordPress username
   - **Password**: Your WordPress application password
   - **Send Body**: Yes
   - **Body Content Type**: JSON
   - **JSON Body**:
   ```json
   {
     "title": "{{ $json.title }}",
     "content": "{{ $json.blogContent }}",
     "status": "draft"
   }
   ```

### Step 7: Add Response Node

1. Add "Respond to Webhook" node
2. Configure:
   - **Respond With**: JSON
   - **Response Body**:
   ```json
   {
     "success": true,
     "message": "Blog post created successfully",
     "data": {
       "title": "{{ $('Format Blog').item.json.title }}",
       "wordpressPostId": {{ $json.id }},
       "wordpressLink": "{{ $json.link }}"
     }
   }
   ```

### Step 8: Connect All Nodes

Connect them in this order:
```
Webhook → Extract Input → OpenAI → Format Blog → WordPress → Respond to Webhook
```

### Step 9: Activate

Click the "Inactive" toggle to activate the workflow.

---

## Common Errors

### 1. "Workflow could not be activated"

**Cause**: Missing credentials or invalid configuration

**Solution**:
- Check all credential nodes (OpenAI, WordPress)
- Ensure credentials are saved properly
- Test each node individually

### 2. "OpenAI API Error: 401 Unauthorized"

**Cause**: Invalid or missing API key

**Solution**:
- Verify your OpenAI API key at: https://platform.openai.com/api-keys
- Recreate the credential in n8n
- Ensure no extra spaces in the API key

### 3. "WordPress: 401 Unauthorized"

**Cause**: Invalid WordPress credentials

**Solution**:
- Use application password, not regular password
- Create new application password in WordPress
- Verify username is correct (case-sensitive)
- Test with cURL first:
  ```bash
  curl -X GET https://your-site.com/wp-json/wp/v2/posts \
    -u "username:application-password"
  ```

### 4. "Cannot read property 'content' of undefined"

**Cause**: Incorrect data path in expression

**Solution**:
- For HTTP Request to OpenAI: Use `$json.choices[0].message.content`
- For OpenAI Chat Model node: Use `$json.message.content`
- Click "Execute Node" to see the actual data structure

### 5. "Webhook not responding"

**Cause**: Missing "Respond to Webhook" node or workflow not active

**Solution**:
- Ensure workflow is activated (toggle in top right)
- Add "Respond to Webhook" node at the end
- Check webhook URL is correct

---

## Testing Individual Nodes

### Test Webhook
1. Click on Webhook node
2. Click "Listen for Test Event"
3. Send a test request with cURL or Postman
4. Verify data is received

### Test OpenAI
1. Click on OpenAI node
2. Click "Execute Node"
3. Check the output contains the generated blog post

### Test WordPress
1. Click on WordPress node
2. Click "Execute Node"
3. Check WordPress admin for the draft post

---

## Version Compatibility

This workflow is tested with:
- **n8n**: v1.120.4+
- **Node.js**: v18+
- **OpenAI API**: v1 (current)
- **WordPress**: 5.6+ (REST API enabled)

If you're using an older version of n8n, consider updating:
```bash
npm install n8n@latest
```

---

## Getting Help

If you're still having issues:

1. **Check n8n logs**:
   - Look in the terminal where n8n is running
   - Check for error messages

2. **Test with simple workflow**:
   - Use `text-to-blog-simple.json` instead
   - This has fewer dependencies

3. **n8n Community**:
   - Visit: https://community.n8n.io/
   - Search for similar issues
   - Post your error message

4. **Export your workflow**:
   - If you built it manually and it works
   - Export and save for future use

---

## Alternative: Start from Scratch

If all else fails, you can build a minimal version:

1. **Webhook** → Receives data
2. **HTTP Request to OpenAI** → Generates blog
3. **Respond to Webhook** → Returns result

Skip WordPress publishing initially and just return the AI-generated content. Add publishing later once the basic flow works.

