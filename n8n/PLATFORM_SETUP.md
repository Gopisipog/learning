# Platform Setup Guide

Detailed instructions for setting up each platform integration.

## 🔑 OpenAI Setup

### 1. Create an OpenAI Account
- Go to: https://platform.openai.com/signup
- Sign up or log in

### 2. Get Your API Key
- Navigate to: https://platform.openai.com/api-keys
- Click **"Create new secret key"**
- Give it a name (e.g., "n8n-blog-generator")
- **Copy the key immediately** (you won't see it again!)

### 3. Add Credits
- Go to: https://platform.openai.com/account/billing
- Add payment method
- Add credits (minimum $5 recommended)

### 4. Model Information
- **Default Model**: `gpt-4o-mini` (cost-effective)
- **Alternative**: `gpt-4o` (higher quality, more expensive)
- **Pricing**: Check https://openai.com/pricing

### 5. Configure in n8n
- In the OpenAI node, paste your API key
- Adjust temperature (0.0-1.0) for creativity
- Set max tokens (500-2000 for blog posts)

---

## 📝 WordPress Setup

### 1. Enable REST API
WordPress REST API is enabled by default in WordPress 4.7+

To verify:
- Visit: `https://your-site.com/wp-json/wp/v2/posts`
- You should see JSON data (not a 404 error)

### 2. Create Application Password

**For WordPress 5.6+:**
1. Log in to WordPress admin
2. Go to: **Users → Profile**
3. Scroll to **"Application Passwords"**
4. Enter a name: "n8n Blog Publisher"
5. Click **"Add New Application Password"**
6. **Copy the password** (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)

**For older WordPress versions:**
- Install the "Application Passwords" plugin
- Follow the same steps above

### 3. Test API Access

Using cURL:
```bash
curl -X GET https://your-site.com/wp-json/wp/v2/posts \
  -u "username:xxxx xxxx xxxx xxxx xxxx xxxx"
```

### 4. Common Issues

**"REST API disabled"**
- Check if a security plugin is blocking it
- Disable "Disable REST API" settings

**"Authentication failed"**
- Ensure you're using the application password, not your regular password
- Check username is correct (case-sensitive)

**"Insufficient permissions"**
- User must have "Author" role or higher
- Check user can create posts in WordPress admin

---

## 📊 Google Sheets Setup (Optional)

### 1. Create a Google Sheet
1. Go to: https://sheets.google.com
2. Create a new spreadsheet
3. Name it: "Blog Post Tracker"
4. Add headers in row 1:
   - Title
   - Author
   - Word Count
   - Generated At
   - WordPress Link
   - Status

### 2. Get Sheet ID
From the URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```
Copy the `SHEET_ID_HERE` part

### 3. Enable Google Sheets API
1. Go to: https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable "Google Sheets API"
4. Create OAuth 2.0 credentials

### 4. Configure in n8n
1. Click on "Log to Google Sheets" node
2. Create new credential
3. Follow OAuth flow
4. Paste your Sheet ID
5. Set sheet name (default: "Sheet1")

---

## 🌐 Alternative Publishing Platforms

### Medium

**Setup:**
1. Get Integration Token: https://medium.com/me/settings/security
2. Add HTTP Request node
3. Endpoint: `https://api.medium.com/v1/users/{{userId}}/posts`
4. Headers: `Authorization: Bearer YOUR_TOKEN`

**Body:**
```json
{
  "title": "{{ $json.title }}",
  "contentFormat": "html",
  "content": "{{ $json.blogContent }}",
  "publishStatus": "draft"
}
```

### Dev.to

**Setup:**
1. Get API Key: https://dev.to/settings/extensions
2. Add HTTP Request node
3. Endpoint: `https://dev.to/api/articles`
4. Headers: `api-key: YOUR_API_KEY`

**Body:**
```json
{
  "article": {
    "title": "{{ $json.title }}",
    "body_markdown": "{{ $json.blogContent }}",
    "published": false
  }
}
```

### Ghost

**Setup:**
1. Get Admin API Key from Ghost Admin
2. Add HTTP Request node
3. Endpoint: `https://your-ghost-site.com/ghost/api/admin/posts/`
4. Use JWT authentication

---

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Always use `.env.example` as template
   - Add `.env` to `.gitignore`

2. **Use Application Passwords**
   - Never use your main WordPress password
   - Create separate passwords for each integration

3. **Limit API Permissions**
   - Use least privilege principle
   - Create dedicated API users with minimal permissions

4. **Rotate Keys Regularly**
   - Change API keys every 90 days
   - Revoke unused application passwords

5. **Monitor Usage**
   - Check OpenAI usage dashboard
   - Monitor WordPress activity logs
   - Set up billing alerts

---

## 💰 Cost Estimation

### OpenAI Costs (GPT-4o-mini)
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens
- Average blog post: ~$0.01-0.05 per post

### WordPress
- Free (self-hosted)
- WordPress.com: Varies by plan

### Google Sheets
- Free for personal use
- Workspace: Included in subscription

---

## 📞 Support Resources

- **OpenAI**: https://help.openai.com
- **WordPress**: https://wordpress.org/support/
- **n8n**: https://community.n8n.io
- **Google Sheets API**: https://developers.google.com/sheets

---

## ✅ Checklist

Before going live, ensure:

- [ ] OpenAI API key is valid and has credits
- [ ] WordPress REST API is accessible
- [ ] Application password is created and tested
- [ ] Webhook URL is correct
- [ ] Workflow is activated in n8n
- [ ] Test request returns successful response
- [ ] Draft post appears in WordPress
- [ ] (Optional) Google Sheets logging works

