# Text-to-Blog Automation - Zapier Integration

A powerful Zapier integration that automatically converts plain text into beautifully formatted blog posts with metadata, excerpts, reading time calculations, and more.

## 🚀 Features

### ✨ Trigger: New Text for Blog
- Monitors for new text input from various sources
- Provides text content, suggested titles, and word counts
- Supports filtering by source (email, documents, API, etc.)

### 📝 Action: Create Blog Post from Text
Automatically transforms plain text into a complete blog post with:
- **Smart Formatting**: Converts paragraphs into HTML-formatted content
- **Auto-Generated Excerpts**: Creates 150-character excerpts automatically
- **Reading Time**: Calculates estimated reading time (200 words/minute)
- **Word Count**: Tracks total word count
- **Metadata**: Includes author, tags, categories, and publication status
- **Timestamps**: Adds publication timestamps

### 🔐 Authentication
- API Key authentication for secure blog platform access
- Optional blog URL configuration
- Automatic header injection for all requests

## 📦 Installation

```bash
# Install dependencies
npm install

# Run tests
npm test

# All tests should pass ✅
```

## 🧪 Testing

The integration includes comprehensive tests:

```bash
npm test
```

Tests cover:
- ✅ Blog post creation with full metadata
- ✅ Text formatting and HTML conversion
- ✅ Minimal input handling with defaults
- ✅ Trigger functionality

## 🎯 Usage Examples

### Example 1: Simple Blog Post
**Input:**
```javascript
{
  text: "This is my blog post.\n\nIt has multiple paragraphs.",
  title: "My First Post"
}
```

**Output:**
```javascript
{
  id: 101,
  title: "My First Post",
  content: "<p>This is my blog post.</p>\n<p>It has multiple paragraphs.</p>",
  excerpt: "This is my blog post. It has multiple paragraphs.",
  author: "Anonymous",
  tags: [],
  category: "General",
  status: "draft",
  wordCount: 8,
  readingTime: 1,
  publishedAt: "2025-11-24T08:00:00.000Z"
}
```

### Example 2: Full Blog Post with Metadata
**Input:**
```javascript
{
  text: "Long blog content here...",
  title: "Advanced Zapier Automation",
  author: "John Doe",
  tags: "automation, zapier, productivity",
  category: "Technology",
  status: "published"
}
```

**Output:**
```javascript
{
  id: 102,
  title: "Advanced Zapier Automation",
  content: "<p>Long blog content here...</p>",
  excerpt: "Long blog content here...",
  author: "John Doe",
  tags: ["automation", "zapier", "productivity"],
  category: "Technology",
  status: "published",
  wordCount: 150,
  readingTime: 1,
  publishedAt: "2025-11-24T08:00:00.000Z"
}
```

## 🔧 Configuration

### Input Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `text` | text | Yes | - | Main blog content (use `\n\n` for paragraphs) |
| `title` | string | Yes | - | Blog post title |
| `author` | string | No | "Anonymous" | Author name |
| `tags` | string | No | - | Comma-separated tags |
| `category` | string | No | "General" | Blog category |
| `status` | string | No | "draft" | Status: draft, published, or scheduled |

### Output Fields

The integration provides these fields for use in subsequent Zap steps:
- `id` - Post ID
- `title` - Blog title
- `content` - HTML-formatted content
- `excerpt` - Auto-generated excerpt
- `author` - Author name
- `tags` - Array of tags
- `category` - Category
- `status` - Publication status
- `wordCount` - Total word count
- `readingTime` - Estimated reading time in minutes
- `publishedAt` - Publication timestamp

## 🚀 Deployment

```bash
# Register the integration on Zapier
npx zapier-platform-cli register "Text to Blog Automation"

# Or link to an existing integration
npx zapier-platform-cli link

# Push to Zapier
npx zapier-platform-cli push

# Promote to production (when ready)
npx zapier-platform-cli promote 1.0.0
```

## 📁 Project Structure

```
text-to-blog-automation/
├── creates/
│   └── blog_post.js          # Blog post creation action
├── triggers/
│   └── new_text.js            # New text trigger
├── test/
│   ├── creates/
│   │   └── blog_post.test.js  # Blog post tests
│   ├── triggers/
│   │   └── new_text.test.js   # Trigger tests
│   └── example.test.js        # Basic tests
├── authentication.js          # API key authentication
├── index.js                   # Main integration file
├── package.json
└── README.md
```

## 🔗 Integration Workflows

### Common Zap Examples:

1. **Email to Blog Post**
   - Trigger: New Email (Gmail)
   - Action: Create Blog Post from Text

2. **Google Docs to Blog**
   - Trigger: New Document (Google Docs)
   - Action: Create Blog Post from Text

3. **Notion to Blog**
   - Trigger: New Database Item (Notion)
   - Action: Create Blog Post from Text

4. **Webhook to Blog**
   - Trigger: Catch Hook (Webhooks)
   - Action: Create Blog Post from Text

## 📚 Resources

- [Zapier Platform Documentation](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md)
- [Zapier Platform Schema](https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md)
- [Best Practices](https://platform.zapier.com/build/recommended-integration-features)

## 🤝 Contributing

To add more features:

```bash
# Add a new trigger
npx zapier-platform-cli scaffold trigger <name>

# Add a new action
npx zapier-platform-cli scaffold create <name>

# Add a search
npx zapier-platform-cli scaffold search <name>
```

## 📝 License

This integration is for demonstration purposes. Customize it for your specific blog platform and use case.

---

**Built with ❤️ using Zapier Platform CLI**
