# Connect to Existing WordPress Site

Quick guide to connect your n8n workflow to an existing WordPress site.

## 🎯 What You Need

- ✅ Your WordPress site URL (e.g., `https://yourblog.com`)
- ✅ WordPress admin access
- ✅ WordPress version 5.6+ (for Application Passwords)

---

## 🔑 Step 1: Create Application Password (2 minutes)

### 1.1 Login to WordPress Admin

1. Go to your WordPress admin panel
2. URL is usually: `https://yoursite.com/wp-admin`
3. Login with your credentials

### 1.2 Go to Your Profile

1. Hover over your name (top right corner)
2. Click **"Edit Profile"**
   
   OR
   
1. Click **"Users"** in left sidebar
2. Click **"Profile"**

### 1.3 Enable Application Passwords (if needed)

If you don't see "Application Passwords" section:

1. Go to **Settings** → **Permalinks**
2. Select **"Post name"** (or any option except "Plain")
3. Click **"Save Changes"**
4. Go back to your profile page
5. Refresh the page

### 1.4 Create Application Password

1. Scroll down to **"Application Passwords"** section
2. In the **"New Application Password Name"** field, type: **`n8n`**
3. Click **"Add New Application Password"**
4. **IMPORTANT**: A password will appear - **COPY IT IMMEDIATELY!**
   - Format: `abcd 1234 efgh 5678 ijkl 9012`
   - You won't be able to see it again!
5. Save it in a safe place (notepad, password manager, etc.)

---

## 🔧 Step 2: Configure n8n Workflow (3 minutes)

### 2.1 Start n8n

```bash
npm start
```

### 2.2 Open n8n

1. Open browser: http://localhost:5678
2. Open your imported workflow (or import it now)

### 2.3 Update WordPress URL

1. Click on the **"Publish to WordPress"** node
2. Find the **"URL"** field
3. Change from:
   ```
   https://your-wordpress-site.com/wp-json/wp/v2/posts
   ```
   To your actual site:
   ```
   https://yourblog.com/wp-json/wp/v2/posts
   ```
   
   **Examples**:
   - `https://myblog.com/wp-json/wp/v2/posts`
   - `https://example.wordpress.com/wp-json/wp/v2/posts`
   - `https://blog.mycompany.com/wp-json/wp/v2/posts`

4. Click outside the field to save

### 2.4 Add WordPress Credentials

1. Still in the **"Publish to WordPress"** node
2. Click **"Credential to connect with"** dropdown
3. Click **"- Create New -"**
4. Select **"HTTP Basic Auth"**
5. Fill in:
   - **Credential Name**: `My WordPress Site`
   - **User**: Your WordPress username (e.g., `admin`)
   - **Password**: Paste the **Application Password** you copied
     - Example: `abcd 1234 efgh 5678 ijkl 9012`
     - Include the spaces!
6. Click **"Save"**

### 2.5 Activate Workflow

1. Click the **"Active"** toggle switch (top right)
2. It should turn green/blue
3. Status should show "Active"

---

## ✅ Step 3: Test REST API (1 minute)

Before testing the full workflow, verify your WordPress REST API is accessible:

### 3.1 Test in Browser

Open this URL in your browser (replace with your domain):
```
https://yourblog.com/wp-json/wp/v2/posts
```

**Expected Response**: JSON array (might be empty `[]` or list of posts)

**If you get an error**: See troubleshooting section below

---

## 🧪 Step 4: Test the Workflow (2 minutes)

### 4.1 Using Postman

1. **Method**: POST
2. **URL**: `http://localhost:5678/webhook/create-blog`
3. **Headers**: 
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body** (select "raw" and "JSON"):

```json
{
  "text": "Artificial Intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data, identify patterns, and make predictions with remarkable accuracy. From healthcare to finance, AI is revolutionizing industries by automating tasks, improving decision-making, and creating new opportunities for innovation.",
  "title": "The AI Revolution: Transforming Our World",
  "author": "Tech Insights Team"
}
```

5. Click **"Send"**

### 4.2 Expected Response

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "title": "The AI Revolution: Transforming Our World",
    "wordpressPostId": 123,
    "wordpressLink": "https://yourblog.com/?p=123"
  }
}
```

### 4.3 Verify in WordPress

1. Go to your WordPress admin
2. Click **"Posts"** → **"All Posts"**
3. You should see your new post as a **Draft**
4. Click on it to view the AI-generated content!

---

## 🐛 Troubleshooting

### Error: "REST API disabled" or 404 on `/wp-json`

**Cause**: REST API is disabled or permalinks not set

**Solution**:
1. Login to WordPress admin
2. Go to **Settings** → **Permalinks**
3. Select **"Post name"** (or any option except "Plain")
4. Click **"Save Changes"**
5. Test the REST API URL again

---

### Error: "401 Unauthorized" or "Sorry, you are not allowed to create posts"

**Cause**: Wrong credentials or insufficient permissions

**Solution**:
1. Make sure you're using the **Application Password**, NOT your regular login password
2. Copy the application password exactly as shown (with spaces)
3. Verify your WordPress user has "Editor" or "Administrator" role
4. Try creating a new application password

---

### Error: "Connection refused" or "ECONNREFUSED"

**Cause**: n8n can't reach your WordPress site

**Solution**:
1. Verify your WordPress site is online (open it in browser)
2. Check the URL is correct (include `https://` or `http://`)
3. If using HTTPS, make sure SSL certificate is valid
4. Check if your hosting blocks REST API requests

---

### Error: "SSL certificate problem" or "self-signed certificate"

**Cause**: SSL certificate issue

**Solution**:
1. In n8n, click the **"Publish to WordPress"** node
2. Scroll down to **"Options"**
3. Enable **"Ignore SSL Issues"** (for testing only)
4. For production, fix your SSL certificate

---

### WordPress REST API returns empty or error

**Cause**: Plugin conflict or REST API disabled

**Solution**:
1. Check if a security plugin is blocking REST API
2. Temporarily disable security plugins
3. Check `.htaccess` file for REST API blocks
4. Contact your hosting provider

---

## 🔒 Security Considerations

### For Production Use:

1. **Use HTTPS**: Always use `https://` for your WordPress site
2. **Strong Application Password**: WordPress generates secure passwords automatically
3. **Limit Permissions**: Create a dedicated user with "Editor" role (not Administrator)
4. **Revoke Old Passwords**: Delete unused application passwords
5. **Monitor Usage**: Check WordPress logs for API usage

### Revoking Application Password:

1. Go to **Users** → **Profile**
2. Scroll to **"Application Passwords"**
3. Click **"Revoke"** next to the password you want to remove

---

## 📊 What Happens When You Send a Request

```
1. Postman/API Client
   ↓ POST request with text
   
2. n8n Webhook
   ↓ Receives request
   
3. Extract Input
   ↓ Parses text, title, author
   
4. OpenAI API
   ↓ Generates blog post
   
5. Format Blog
   ↓ Prepares HTML content
   
6. WordPress REST API
   ↓ Creates draft post
   
7. Response
   ↓ Returns post ID and link
```

---

## ✅ Configuration Checklist

Before going live, verify:

- [ ] WordPress site is accessible online
- [ ] REST API endpoint works (`/wp-json/wp/v2/posts`)
- [ ] Application password created and saved
- [ ] n8n workflow updated with correct URL
- [ ] WordPress credentials added to n8n
- [ ] OpenAI credentials configured
- [ ] Workflow is activated
- [ ] Test request successful
- [ ] Draft post appears in WordPress

---

## 🎯 Next Steps

Now that your workflow is connected:

1. **Test with different content** - Try various text inputs
2. **Customize AI prompt** - Edit the OpenAI node to match your style
3. **Change to auto-publish** - Change status from "draft" to "publish"
4. **Add categories** - Modify WordPress node to include categories
5. **Add featured images** - Integrate with image generation APIs
6. **Set up monitoring** - Track successful posts

---

## 📝 Your Configuration Summary

Save this for reference:

```
WordPress Site: https://yourblog.com
WordPress Admin: https://yourblog.com/wp-admin
WordPress Username: [your username]
Application Password: [the password you copied]

WordPress REST API: https://yourblog.com/wp-json/wp/v2/posts

n8n Webhook: http://localhost:5678/webhook/create-blog
n8n Admin: http://localhost:5678
```

---

## 🚀 You're All Set!

Your n8n workflow is now connected to your WordPress site. Send a test request and watch the magic happen! ✨

**Need help?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more solutions.

