# Quick Start Guide - Text to Blog Automation

## 🎯 What This Integration Does

This Zapier integration automatically converts plain text into formatted blog posts with:
- HTML formatting
- Auto-generated excerpts
- Reading time calculations
- Word counts
- Tags and categories
- Publication metadata

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd text-to-blog-automation
npm install
```

### Step 2: Configure Zapier CLI

The `.zapierrc` file is already created for you. To authenticate:

```bash
# Login to Zapier (this will populate .zapierrc with your deploy key)
npx zapier-platform-cli login
```

This will:
- Open your browser for authentication
- Save your deploy key to `.zapierrc`
- Allow you to push integrations to Zapier

**Note:** The `.zapierrc` file contains sensitive credentials. Never commit it to version control!

### Step 3: Run Tests
```bash
npm test
```
You should see all tests passing ✅

### Step 4: Test Locally

Create a test file `test-local.js`:

```javascript
const zapier = require('zapier-platform-core');
const App = require('./index');

const appTester = zapier.createAppTester(App);

// Test the blog post creation
const testBlogPost = async () => {
  const bundle = {
    inputData: {
      text: 'Welcome to my blog!\n\nThis is an automated post created using Zapier.\n\nIt demonstrates how easy it is to convert text into a formatted blog post.',
      title: 'My First Automated Blog Post',
      author: 'Automation Bot',
      tags: 'automation, blogging, zapier',
      category: 'Technology',
      status: 'draft'
    }
  };

  const result = await appTester(
    App.creates.blog_post.operation.perform,
    bundle
  );

  console.log('✅ Blog Post Created:');
  console.log(JSON.stringify(result, null, 2));
};

testBlogPost().catch(console.error);
```

Run it:
```bash
node test-local.js
```

### Step 5: Deploy to Zapier

```bash
# If you haven't logged in yet (from Step 2)
npx zapier-platform-cli login

# Register your integration
npx zapier-platform-cli register "Text to Blog Automation"

# Push to Zapier
npx zapier-platform-cli push
```

### Step 6: Create Your First Zap

1. Go to https://zapier.com/app/zaps
2. Click "Create Zap"
3. Choose a trigger (e.g., "New Email in Gmail")
4. Add action: Search for "Text to Blog Automation"
5. Select "Create Blog Post from Text"
6. Map the email body to the "text" field
7. Map the email subject to the "title" field
8. Test and turn on your Zap!

## 📝 Example Use Cases

### Use Case 1: Email to Blog
**Scenario:** Convert emails into blog posts

**Zap Setup:**
- Trigger: Gmail - New Email
- Filter: Only emails with subject containing "[BLOG]"
- Action: Text to Blog - Create Blog Post
  - Text: Email body
  - Title: Email subject (remove "[BLOG]")
  - Author: Sender name
  - Tags: Extract from email

### Use Case 2: Google Docs to Blog
**Scenario:** Write in Google Docs, publish to blog

**Zap Setup:**
- Trigger: Google Docs - New Document in Folder
- Action: Text to Blog - Create Blog Post
  - Text: Document content
  - Title: Document title
  - Author: Document owner
  - Status: "published"

### Use Case 3: Notion to Blog
**Scenario:** Manage blog posts in Notion

**Zap Setup:**
- Trigger: Notion - New Database Item
- Filter: Status = "Ready to Publish"
- Action: Text to Blog - Create Blog Post
  - Text: Content field
  - Title: Title field
  - Tags: Tags field
  - Category: Category field

### Use Case 4: Scheduled Blog Posts
**Scenario:** Schedule blog posts in advance

**Zap Setup:**
- Trigger: Schedule - Every Day
- Action: Google Sheets - Lookup Row (find today's post)
- Action: Text to Blog - Create Blog Post
  - Text: Sheet content
  - Status: "published"

## 🔧 Customization

### Modify the Text Formatter

Edit `creates/blog_post.js` to customize formatting:

```javascript
const formatTextToBlog = (text, title, author, tags) => {
  // Add your custom formatting logic here
  // Examples:
  // - Add custom CSS classes
  // - Convert markdown to HTML
  // - Add featured images
  // - Generate SEO metadata
};
```

### Add More Fields

Edit `creates/blog_post.js` inputFields:

```javascript
inputFields: [
  // ... existing fields
  {
    key: 'featuredImage',
    label: 'Featured Image URL',
    type: 'string',
    required: false
  },
  {
    key: 'seoDescription',
    label: 'SEO Description',
    type: 'text',
    required: false
  }
]
```

### Connect to Your Blog Platform

Replace the JSONPlaceholder API with your actual blog API:

```javascript
const response = await z.request({
  method: 'POST',
  url: `${bundle.authData.blogUrl}/api/posts`,
  headers: {
    'Authorization': `Bearer ${bundle.authData.apiKey}`,
    'Content-Type': 'application/json'
  },
  body: blogPost
});
```

## 🐛 Troubleshooting

### Tests Failing?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Authentication Issues?
- Check your API key is valid
- Verify the blog URL is correct
- Test the auth endpoint manually

### Deployment Issues?
```bash
# Check your Zapier CLI version
npx zapier-platform-cli --version

# Update if needed
npm install -g zapier-platform-cli@latest
```

## 📚 Next Steps

1. ✅ Customize the text formatting logic
2. ✅ Add your blog platform's API endpoints
3. ✅ Add more input fields (images, SEO, etc.)
4. ✅ Create additional triggers (webhooks, RSS, etc.)
5. ✅ Add search actions (find posts, update posts)
6. ✅ Deploy to production

## 🎓 Learn More

- [Zapier Platform CLI Docs](https://github.com/zapier/zapier-platform/tree/main/packages/cli)
- [Zapier Integration Best Practices](https://platform.zapier.com/build/recommended-integration-features)
- [API Authentication Guide](https://platform.zapier.com/build/auth)

---

**Happy Automating! 🚀**

