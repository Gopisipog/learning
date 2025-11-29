# Configuration Guide

## 📋 Required Files

### `.zapierrc` - Zapier CLI Credentials

This file stores your Zapier deployment credentials. It's **automatically created** when you run:

```bash
npx zapier-platform-cli login
```

**File Structure:**
```json
{
  "deployKey": "your_deploy_key_here"
}
```

**⚠️ IMPORTANT SECURITY NOTES:**
- ✅ Already included in `.gitignore`
- ❌ **NEVER** commit this file to version control
- ❌ **NEVER** share this file publicly
- ✅ Each developer should have their own `.zapierrc`

**What it does:**
- Authenticates you with Zapier's platform
- Allows you to push integrations to your Zapier account
- Links your local development to your Zapier apps

---

### `.env` - Environment Variables (Optional)

Create this file for local testing with real credentials:

```bash
# Copy the example file
cp .env.example .env
```

**File Structure:**
```bash
# Your blog platform API key (for testing)
API_KEY=sk_test_1234567890abcdef

# Your blog URL (optional)
BLOG_URL=https://yourblog.com

# Zapier environment
ZAPIER_DEPLOY_KEY=
```

**⚠️ SECURITY NOTES:**
- ✅ Already included in `.gitignore`
- ❌ **NEVER** commit this file
- ✅ Use `.env.example` as a template

---

## 🔐 Authentication Setup

### Step 1: Login to Zapier CLI

```bash
npx zapier-platform-cli login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Save your deploy key to `.zapierrc`

### Step 2: Verify Authentication

```bash
npx zapier-platform-cli whoami
```

You should see your Zapier account email.

### Step 3: Link to an App (Optional)

If you already have a Zapier app:

```bash
npx zapier-platform-cli link
```

Or register a new one:

```bash
npx zapier-platform-cli register "Text to Blog Automation"
```

---

## 🛠️ Configuration Options

### Package.json Scripts

The `package.json` includes these helpful scripts:

```json
{
  "scripts": {
    "test": "jest --testTimeout 10000",
    "validate": "zapier validate",
    "push": "zapier push"
  }
}
```

**Usage:**
```bash
npm test      # Run all tests
npm run validate  # Validate integration before pushing
npm run push      # Push to Zapier
```

---

## 🔧 Customizing Authentication

### Current Setup: API Key Authentication

The integration uses API key authentication. To customize:

**Edit `authentication.js`:**

```javascript
module.exports = {
  type: 'custom',  // Options: 'custom', 'oauth2', 'session', 'basic'
  
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      helpText: 'Your blog platform API key'
    }
  ],
  
  test: testAuth,  // Function to verify credentials
};
```

### Switching to OAuth2

If your blog platform uses OAuth2:

```javascript
module.exports = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: 'https://yourblog.com/oauth/authorize',
    accessTokenUrl: 'https://yourblog.com/oauth/token',
    scope: 'read,write',
    autoRefresh: true
  },
  // ... rest of config
};
```

### Switching to Session Auth

For username/password authentication:

```javascript
module.exports = {
  type: 'session',
  sessionConfig: {
    perform: async (z, bundle) => {
      const response = await z.request({
        url: 'https://yourblog.com/api/login',
        method: 'POST',
        body: {
          username: bundle.authData.username,
          password: bundle.authData.password
        }
      });
      return {
        sessionKey: response.data.sessionKey
      };
    }
  },
  // ... rest of config
};
```

---

## 📝 Environment-Specific Configuration

### Development
```bash
# Use test API keys
API_KEY=sk_test_123
BLOG_URL=https://staging.yourblog.com
```

### Production
```bash
# Use production API keys
API_KEY=sk_live_456
BLOG_URL=https://yourblog.com
```

---

## 🧪 Testing Configuration

### Test with Mock Data

The integration uses JSONPlaceholder for testing. To use your real API:

**Edit `creates/blog_post.js`:**

```javascript
const response = await z.request({
  method: 'POST',
  url: `${bundle.authData.blogUrl}/api/posts`,  // Your real API
  headers: {
    'Authorization': `Bearer ${bundle.authData.apiKey}`,
    'Content-Type': 'application/json'
  },
  body: blogPost
});
```

---

## 🚀 Deployment Configuration

### Version Management

Update version in `package.json`:

```json
{
  "version": "1.0.0"  // Increment for each deployment
}
```

### Push to Zapier

```bash
# Validate first
npx zapier-platform-cli validate

# Push to Zapier
npx zapier-platform-cli push

# Promote to production
npx zapier-platform-cli promote 1.0.0
```

---

## 🔍 Troubleshooting

### "Not authenticated" error
```bash
# Re-login
npx zapier-platform-cli login
```

### "Invalid deploy key" error
```bash
# Delete .zapierrc and login again
rm .zapierrc
npx zapier-platform-cli login
```

### "App not found" error
```bash
# Link to your app
npx zapier-platform-cli link

# Or register a new one
npx zapier-platform-cli register "App Name"
```

---

## 📚 Additional Resources

- [Zapier CLI Authentication Docs](https://platform.zapier.com/build/auth)
- [Environment Variables Guide](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md#environment-variables)
- [Deployment Best Practices](https://platform.zapier.com/publish/integration-publishing-requirements)

