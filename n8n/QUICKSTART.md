# Quick Start Guide

Get your Text to Blog AI Publisher workflow running in 5 minutes!

## Step 1: Start n8n

```bash
npm start
```

This will start n8n on `http://localhost:5678`

## Step 2: First Time Setup

1. Open your browser and go to: `http://localhost:5678`
2. Create your n8n account (local instance)
3. Complete the initial setup wizard

## Step 3: Import the Workflow

1. In n8n, click **"Workflows"** in the left sidebar
2. Click **"Add workflow"** → **"Import from file"**
3. Select the file: `workflows/text-to-blog-ai-publisher.json`
4. Click **"Import"**

## Step 4: Configure API Keys

### OpenAI API Key

1. Get your API key from: https://platform.openai.com/api-keys
2. In the workflow, click on the **"OpenAI"** node
3. Click **"Create New Credential"**
4. Paste your API key
5. Click **"Save"**

### WordPress Credentials

1. In WordPress, go to: **Users → Profile → Application Passwords**
2. Create a new application password (copy it!)
3. In the workflow, click on the **"Publish to WordPress"** node
4. Click **"Create New Credential"** → Select **"HTTP Basic Auth"**
5. Enter:
   - **Username**: Your WordPress username
   - **Password**: The application password you just created
6. Click **"Save"**

### Update Environment Variables

1. Edit the **"Publish to WordPress"** node
2. Update the URL field with your WordPress site URL:
   ```
   https://your-wordpress-site.com/wp-json/wp/v2/posts
   ```

## Step 5: Activate the Workflow

1. Click the **"Inactive"** toggle in the top right corner
2. It should change to **"Active"**
3. Your webhook is now live at: `http://localhost:5678/webhook/create-blog`

## Step 6: Test It!

### Option 1: Use PowerShell (Windows)

```powershell
.\test-workflow.ps1
```

### Option 2: Use cURL

```bash
curl -X POST http://localhost:5678/webhook/create-blog \
  -H "Content-Type: application/json" \
  -d @example-request.json
```

### Option 3: Use Postman or Insomnia

1. Create a new POST request
2. URL: `http://localhost:5678/webhook/create-blog`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "text": "Your text content here...",
  "title": "My First AI Blog Post",
  "author": "Your Name"
}
```

## Expected Result

You should receive a JSON response like:

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "title": "My First AI Blog Post",
    "wordCount": 350,
    "generatedAt": "2024-11-24T10:30:00.000Z",
    "wordpressPostId": 123,
    "wordpressLink": "https://your-site.com/?p=123"
  }
}
```

Check your WordPress admin panel - you should see a new draft post!

## Optional: Google Sheets Logging

If you want to log all generated posts to Google Sheets:

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL
3. In the workflow, click on the **"Log to Google Sheets"** node
4. Click **"Create New Credential"**
5. Follow the OAuth flow to connect your Google account
6. Update the Sheet ID in the node settings
7. Save and you're done!

## Troubleshooting

### "Workflow is not active"
- Make sure you clicked the toggle to activate the workflow

### "OpenAI API error"
- Verify your API key is correct
- Check you have credits in your OpenAI account

### "WordPress authentication failed"
- Double-check your application password
- Ensure your WordPress user has publishing permissions
- Verify the WordPress URL is correct (include `/wp-json/wp/v2/posts`)

### "Cannot connect to webhook"
- Ensure n8n is running (`npm start`)
- Check the webhook URL matches your n8n instance

## Next Steps

- Customize the AI prompt in the OpenAI node
- Add more publishing platforms (Medium, Dev.to, etc.)
- Set up scheduled content generation
- Integrate with your CMS or content calendar

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Visit [n8n Community](https://community.n8n.io/)
- Check [n8n Documentation](https://docs.n8n.io/)

Happy automating! 🚀

