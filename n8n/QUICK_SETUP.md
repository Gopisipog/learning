# Quick Setup - Use Your Existing WordPress Site

**Got a WordPress site already?** Perfect! Here's how to connect it in 5 minutes.

---

## ⚡ 3-Step Quick Setup

### Step 1: Get Application Password from WordPress (2 min)

1. **Login** to your WordPress admin panel
   - URL: `https://yoursite.com/wp-admin`

2. **Go to Profile**
   - Click your name (top right) → **Edit Profile**
   - OR: **Users** → **Profile**

3. **Create Application Password**
   - Scroll to **"Application Passwords"** section
   - Type name: `n8n`
   - Click **"Add New Application Password"**
   - **COPY THE PASSWORD** (you won't see it again!)
   - Example: `abcd 1234 efgh 5678 ijkl 9012`

**Don't see "Application Passwords"?**
- Go to **Settings** → **Permalinks**
- Select **"Post name"**
- Click **Save Changes**
- Go back to your profile

---

### Step 2: Configure n8n Workflow (2 min)

1. **Start n8n**
   ```bash
   npm start
   ```

2. **Open n8n**: http://localhost:5678

3. **Import workflow**
   - Click **Workflows** → **Import from File**
   - Select: `workflows/text-to-blog-simple.json`

4. **Update WordPress URL**
   - Click **"Publish to WordPress"** node
   - Change URL to:
     ```
     https://yoursite.com/wp-json/wp/v2/posts
     ```
   - Replace `yoursite.com` with your actual domain

5. **Add Credentials**
   - Click **"Credential to connect with"** dropdown
   - Click **"- Create New -"**
   - Select **"HTTP Basic Auth"**
   - Enter:
     - **User**: Your WordPress username
     - **Password**: The application password you copied
   - Click **"Save"**

6. **Add OpenAI Credentials**
   - Click **"OpenAI Chat"** node
   - Click **"Credential to connect with"** dropdown
   - Click **"- Create New -"**
   - Enter your OpenAI API key
   - Click **"Save"**

7. **Activate Workflow**
   - Click **"Active"** toggle (top right)

---

### Step 3: Test It! (1 min)

1. **Open Postman** (or use cURL)

2. **Create POST request**
   - URL: `http://localhost:5678/webhook/create-blog`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):

```json
{
  "text": "Artificial Intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data, identify patterns, and make predictions with remarkable accuracy.",
  "title": "The AI Revolution",
  "author": "Tech Team"
}
```

3. **Click Send**

4. **Check Response**
   ```json
   {
     "success": true,
     "message": "Blog post created successfully",
     "data": {
       "title": "The AI Revolution",
       "wordpressPostId": 123,
       "wordpressLink": "https://yoursite.com/?p=123"
     }
   }
   ```

5. **Check WordPress**
   - Go to **Posts** → **All Posts**
   - See your new AI-generated draft post! 🎉

---

## ✅ That's It!

You're now transforming text into blog posts with AI and publishing to WordPress!

---

## 🔧 Quick Troubleshooting

### Error: "401 Unauthorized"
- Make sure you're using the **Application Password**, not your login password
- Copy it exactly with spaces: `abcd 1234 efgh 5678 ijkl 9012`

### Error: "404 Not Found" on REST API
- Go to **Settings** → **Permalinks** in WordPress
- Select **"Post name"**
- Click **Save Changes**

### Error: "Connection refused"
- Make sure your WordPress site is online
- Check the URL is correct (include `https://`)

---

## 📚 Need More Help?

- **Detailed guide**: [CONNECT_EXISTING_WORDPRESS.md](CONNECT_EXISTING_WORDPRESS.md)
- **Testing guide**: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎯 What You Need

- ✅ Existing WordPress site (any hosting)
- ✅ WordPress admin access
- ✅ OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- ✅ n8n running locally

---

## 💡 Pro Tips

1. **Test with drafts first** - Posts are created as drafts by default
2. **Review AI content** - Check the generated content before publishing
3. **Customize the prompt** - Edit the OpenAI node to match your style
4. **Auto-publish** - Change status from "draft" to "publish" in the workflow

---

## 🚀 Next Steps

1. **Test with different content** - Try various topics
2. **Customize AI prompt** - Make it match your brand voice
3. **Add categories** - Modify the WordPress node
4. **Set up automation** - Connect to other tools
5. **Scale up** - Process multiple posts

---

**Ready to start?** Follow the 3 steps above! ⚡

