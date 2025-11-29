# Text to Blog AI Publisher - n8n Workflow

An automated n8n workflow that transforms simple text input into professional, SEO-optimized blog posts using AI and publishes them to WordPress.

## 🎯 Quick Start

**New to this project?** Start here: **[GETTING_STARTED.md](GETTING_STARTED.md)** - Get running in 3 steps!

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | ⭐ Start here - 3-step quick start |
| **[RESEARCH_WORKFLOW_SETUP.md](RESEARCH_WORKFLOW_SETUP.md)** | 🔍 NEW! Research-enhanced workflow with Tavily |
| **[WORKFLOW_VERSIONS.md](WORKFLOW_VERSIONS.md)** | 📊 Compare all workflow versions |
| **[CONNECT_EXISTING_WORDPRESS.md](CONNECT_EXISTING_WORDPRESS.md)** | 🔌 Connect to your existing WordPress site |
| **[QUICK_WORDPRESS_SETUP.md](QUICK_WORDPRESS_SETUP.md)** | ⚡ Install WordPress locally in 5 minutes |
| **[WORDPRESS_INSTALLATION.md](WORDPRESS_INSTALLATION.md)** | Complete WordPress installation guide |
| **[TAVILY_QUICKSTART.md](TAVILY_QUICKSTART.md)** | ⚡ Tavily research setup guide |
| **[TAVILY_TO_FILE_SETUP.md](TAVILY_TO_FILE_SETUP.md)** | 🔍 NEW! Tavily search to file workflow |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | Complete testing guide with Postman, cURL, etc. |
| **[API_REFERENCE.md](API_REFERENCE.md)** | Full API documentation |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Solutions for common issues |
| **[WORKFLOW_COMPARISON.md](WORKFLOW_COMPARISON.md)** | Simple vs Advanced workflow |
| **[PLATFORM_SETUP.md](PLATFORM_SETUP.md)** | Detailed platform configuration |
| **[N8N_CODE_NODE_REFERENCE.md](N8N_CODE_NODE_REFERENCE.md)** | 📖 n8n Code node $ variables guide |
| **[N8N_DOLLAR_CHEATSHEET.md](N8N_DOLLAR_CHEATSHEET.md)** | ⚡ Quick reference for $ variables |

## 🚀 Available Workflows

### Blog Generation Workflows

1. **Simple Workflow** (`text-to-blog-simple.json`)
   - Uses HTTP Request nodes for OpenAI
   - Easy to configure
   - Recommended for beginners

2. **Advanced Workflow** (`text-to-blog-ai-publisher.json`)
   - Uses LangChain OpenAI nodes
   - Cleaner interface
   - Better for LangChain users

3. **Research-Enhanced Workflow** ⭐ (`text-to-blog-with-research.json`)
   - Includes Tavily AI research
   - Generates well-researched content
   - Cites credible sources
   - Best for professional content

### Utility Workflows

4. **Tavily Search to File** 🔍 (`tavily-search-to-file.json`)
   - Simple Tavily API search
   - Saves results to local text file
   - Perfect for research and data collection
   - No WordPress needed!

## 🌟 Features

- **AI-Powered Content Generation**: Uses OpenAI GPT-4o-mini to transform raw text into engaging blog posts
- **Automatic Publishing**: Publishes directly to WordPress as draft posts
- **Logging**: Tracks all generated posts in Google Sheets (optional)
- **Webhook API**: Simple REST API endpoint for easy integration
- **Structured Output**: Generates well-formatted HTML content with proper headings and structure

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- An OpenAI API account with API key
- A WordPress site with REST API access
- (Optional) Google Sheets API access for logging

## 🚀 Installation

1. **Install n8n** (if not already installed):
   ```bash
   npm install n8n
   ```

2. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file** with your credentials:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `WORDPRESS_URL`: Your WordPress site URL
   - `WORDPRESS_USERNAME`: WordPress username
   - `WORDPRESS_APP_PASSWORD`: WordPress application password
   - `GOOGLE_SHEET_ID`: (Optional) Google Sheet ID for logging

## 🔧 Setup Instructions

### 1. Start n8n

```bash
npx n8n
```

n8n will start on `http://localhost:5678`

### 2. Import the Workflow

1. Open n8n in your browser: `http://localhost:5678`
2. Click on "Workflows" in the left sidebar
3. Click "Import from File"
4. Select one of these workflows:
   - **`workflows/text-to-blog-simple.json`** (Recommended - uses standard HTTP nodes)
   - **`workflows/text-to-blog-ai-publisher.json`** (Advanced - uses LangChain nodes)

**Having import issues?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions.

### 3. Configure Credentials

#### OpenAI Credentials
1. Click on the "OpenAI" node
2. Click "Create New Credential"
3. Enter your OpenAI API key
4. Save the credential

#### WordPress Credentials
1. Click on the "Publish to WordPress" node
2. Click "Create New Credential"
3. Select "HTTP Basic Auth"
4. Enter:
   - **Username**: Your WordPress username
   - **Password**: Your WordPress application password
5. Save the credential

**Note**: To create a WordPress application password:
- Go to WordPress Admin → Users → Profile
- Scroll to "Application Passwords"
- Create a new application password

#### Google Sheets Credentials (Optional)
1. Click on the "Log to Google Sheets" node
2. Click "Create New Credential"
3. Follow the OAuth2 flow to connect your Google account
4. Save the credential

### 4. Activate the Workflow

1. Click the "Active" toggle in the top right
2. The webhook will now be available at: `http://localhost:5678/webhook/create-blog`

## 📝 Usage

> **📚 For detailed testing instructions, see [TESTING_GUIDE.md](TESTING_GUIDE.md)**
> **📡 For complete API documentation, see [API_REFERENCE.md](API_REFERENCE.md)**

### Using the API

Send a POST request to the webhook endpoint with the following JSON structure:

```json
{
  "text": "Your raw text content here...",
  "title": "Your Blog Post Title",
  "author": "Author Name"
}
```

### Example with cURL

```bash
curl -X POST http://localhost:5678/webhook/create-blog \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial Intelligence is transforming the way we work...",
    "title": "The AI Revolution",
    "author": "Tech Team"
  }'
```

### Example with PowerShell

```powershell
.\test-workflow.ps1
```

### Example with Postman or Insomnia

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

### Example with Bash

```bash
chmod +x test-workflow.sh
./test-workflow.sh
```

## 🔄 Workflow Overview

The workflow consists of the following steps:

1. **Webhook**: Receives text input via HTTP POST
2. **Extract Input**: Parses and validates the incoming data
3. **OpenAI**: Transforms text into a professional blog post with:
   - Engaging introduction
   - Well-structured body with subheadings
   - Key takeaways
   - Compelling conclusion
   - SEO-friendly HTML formatting
4. **Format Blog**: Prepares the data for publishing
5. **Publish to WordPress**: Creates a draft post in WordPress
6. **Log to Google Sheets**: (Optional) Records the post details
7. **Respond to Webhook**: Returns success response with post details

## 📊 Response Format

Successful response:

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "title": "Your Blog Post Title",
    "wordCount": 450,
    "generatedAt": "2024-11-24T10:30:00.000Z",
    "wordpressPostId": 123,
    "wordpressLink": "https://your-site.com/?p=123"
  }
}
```

## 🎨 Customization

### Modify AI Prompt

Edit the OpenAI node to customize how the blog post is generated:
- Adjust the system message for different writing styles
- Change temperature (0.0-1.0) for creativity level
- Modify max tokens for longer/shorter posts

### Change Publishing Status

By default, posts are created as "draft". To publish immediately:
1. Edit the "Publish to WordPress" node
2. Change `"status": "draft"` to `"status": "publish"`

### Add More Publishing Platforms

You can extend the workflow to publish to multiple platforms:
- Medium
- Dev.to
- Ghost
- Custom CMS

## 🛠️ Troubleshooting

### Workflow not triggering
- Ensure the workflow is activated (toggle in top right)
- Check that n8n is running
- Verify the webhook URL is correct

### OpenAI errors
- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure you have access to the specified model

### WordPress publishing fails
- Verify WordPress REST API is enabled
- Check application password is correct
- Ensure your WordPress user has publishing permissions

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

## 📄 License

This project is open source and available under the MIT License.

