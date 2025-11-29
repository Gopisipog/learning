# Quick WordPress Setup - 5 Minutes ⚡

The fastest way to get WordPress running for your n8n workflow.

## 🎯 Recommended: Local by Flywheel (No PHP/Docker needed!)

This is the **easiest and fastest** method for Windows users.

---

## 📥 Step 1: Download Local (2 minutes)

1. **Open this link**: https://localwp.com/
2. Click the big green **"Download for Free"** button
3. Choose **Windows**
4. Fill in the form (or click "No thanks, just download")
5. Save the installer file

---

## 💿 Step 2: Install Local (2 minutes)

1. **Run the downloaded file** (e.g., `local-9.0.4-windows.exe`)
2. Click **Yes** when Windows asks for permission
3. Click **Next** through the installer
4. Accept the license agreement
5. Click **Install**
6. Wait for installation to complete
7. Click **Finish**
8. Local will open automatically

---

## 🌐 Step 3: Create WordPress Site (3 minutes)

### 3.1 Create New Site

1. In Local, click the big **"+ Create a new site"** button (or **"+ Add Local Site"**)
2. Choose **"Create a new site"**
3. Click **Continue**

### 3.2 Site Name

1. Enter site name: **`n8n-blog`**
2. Click **Continue**

### 3.3 Environment

1. Choose **"Preferred"** (recommended settings)
2. Click **Continue**

### 3.4 WordPress Setup

1. Enter WordPress credentials:
   - **WordPress Username**: `admin`
   - **WordPress Password**: `admin123!` (or your choice)
   - **WordPress Email**: your email address
2. Click **Add Site**
3. **Wait 2-3 minutes** while Local sets up WordPress

### 3.5 Start Site

1. Once complete, click **"Start site"** (if not already started)
2. The site status should show **"Running"** (green)

---

## ✅ Step 4: Access WordPress (1 minute)

### 4.1 Open WordPress Admin

1. In Local, click **"WP Admin"** button
2. WordPress login page opens in your browser
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin123!` (or what you set)
4. Click **Log In**

### 4.2 Note Your Site URL

In Local, you'll see your site URL. It will be something like:
- `http://n8n-blog.local`

**Write this down!** You'll need it for n8n.

---

## 🔑 Step 5: Create Application Password (2 minutes)

### 5.1 Go to Profile

1. In WordPress Admin, hover over your name (top right)
2. Click **"Edit Profile"** or go to **Users** → **Profile**

### 5.2 Scroll to Application Passwords

1. Scroll down to **"Application Passwords"** section
2. If you don't see it, update permalinks first (see below)

### 5.3 Create Password

1. In the **"New Application Password Name"** field, type: `n8n`
2. Click **"Add New Application Password"**
3. **IMPORTANT**: Copy the generated password immediately!
   - It looks like: `abcd 1234 efgh 5678 ijkl 9012`
   - You won't be able to see it again!
4. Save it in a text file or notepad

---

## 🔧 Step 6: Enable REST API (1 minute)

### 6.1 Update Permalinks

1. In WordPress Admin, go to **Settings** → **Permalinks**
2. Select **"Post name"** (or any option except "Plain")
3. Click **"Save Changes"**

### 6.2 Test REST API

1. Open a new browser tab
2. Go to: `http://n8n-blog.local/wp-json/wp/v2/posts`
3. You should see `[]` or a JSON response

**If you see JSON, the REST API is working!** ✅

---

## 🔌 Step 7: Configure n8n Workflow (2 minutes)

### 7.1 Update WordPress URL in n8n

1. Open n8n: `http://localhost:5678`
2. Open your imported workflow
3. Click the **"Publish to WordPress"** node
4. Change the URL to:
   ```
   http://n8n-blog.local/wp-json/wp/v2/posts
   ```
5. Click outside to save

### 7.2 Add WordPress Credentials

1. Still in the **"Publish to WordPress"** node
2. Click **"Credential to connect with"** dropdown
3. Click **"Create New Credential"**
4. Select **"HTTP Basic Auth"**
5. Enter:
   - **Name**: `WordPress Local`
   - **Username**: `admin`
   - **Password**: Paste your **Application Password** (e.g., `abcd 1234 efgh 5678 ijkl 9012`)
6. Click **"Save"**

### 7.3 Activate Workflow

1. Click the **"Active"** toggle in the top right
2. It should turn green/blue

---

## 🧪 Step 8: Test the Complete Workflow! (1 minute)

### 8.1 Test with Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:5678/webhook/create-blog`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):

```json
{
  "text": "Artificial Intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data, identify patterns, and make predictions with remarkable accuracy. From healthcare to finance, AI is revolutionizing industries.",
  "title": "The AI Revolution",
  "author": "Tech Team"
}
```

6. Click **Send**

### 8.2 Expected Response

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "title": "The AI Revolution",
    "wordpressPostId": 1,
    "wordpressLink": "http://n8n-blog.local/?p=1"
  }
}
```

### 8.3 Verify in WordPress

1. Go back to WordPress Admin
2. Click **Posts** → **All Posts**
3. You should see your new post as a **Draft**!
4. Click on it to view the AI-generated content

---

## 🎉 Success!

You now have:
- ✅ WordPress running locally
- ✅ REST API enabled
- ✅ Application password created
- ✅ n8n workflow configured
- ✅ Successfully created a blog post with AI!

---

## 🔄 Daily Usage

### Starting Your Environment

1. **Start Local**:
   - Open Local application
   - Click on your site (`n8n-blog`)
   - Click **"Start site"** if not running

2. **Start n8n**:
   ```bash
   npm start
   ```

3. **Test**:
   - Send POST request to `http://localhost:5678/webhook/create-blog`
   - Check WordPress for new draft posts

### Stopping Your Environment

1. **Stop n8n**: Press `Ctrl+C` in terminal
2. **Stop Local**: Click **"Stop site"** in Local (or just close Local)

---

## 🐛 Quick Troubleshooting

### Can't see Application Passwords section?

**Solution**: 
1. Go to Settings → Permalinks
2. Select "Post name"
3. Save changes
4. Refresh your profile page

### Error: "Connection refused" in n8n

**Solution**:
1. Make sure Local site is **Running** (green status)
2. Check the URL matches exactly: `http://n8n-blog.local`

### Error: "401 Unauthorized"

**Solution**:
1. Make sure you're using the **Application Password**, not your regular password
2. Copy the password exactly as shown (with spaces)

### WordPress site won't load

**Solution**:
1. In Local, click **"Stop site"** then **"Start site"**
2. Wait 30 seconds for it to fully start

---

## 📊 What You Have Now

```
┌─────────────────────────────────────┐
│  Your Computer                      │
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   n8n        │  │  WordPress  │ │
│  │ :5678        │→ │  :80        │ │
│  │              │  │  (Local)    │ │
│  └──────────────┘  └─────────────┘ │
│         ↑                           │
│         │                           │
│    ┌────────┐                       │
│    │Postman │                       │
│    └────────┘                       │
└─────────────────────────────────────┘
```

---

## 📝 Your Configuration Summary

Save this for reference:

```
WordPress URL: http://n8n-blog.local
WordPress Admin: http://n8n-blog.local/wp-admin
WordPress Username: admin
WordPress Password: admin123! (your login password)
Application Password: [the one you copied]

n8n Webhook: http://localhost:5678/webhook/create-blog
n8n Admin: http://localhost:5678

WordPress REST API: http://n8n-blog.local/wp-json/wp/v2/posts
```

---

## 🚀 Next Steps

Now that everything is working:

1. **Customize the AI prompt** in the OpenAI node
2. **Change post status** from "draft" to "publish" for auto-publishing
3. **Add categories** to WordPress posts
4. **Experiment** with different content types
5. **Build more workflows** with n8n!

---

**Need help?** Check [WORDPRESS_INSTALLATION.md](WORDPRESS_INSTALLATION.md) for detailed troubleshooting!

