# Changelog

All notable changes to the Text to Blog AI Publisher workflow.

## [1.1.0] - 2024-11-24

### 🐛 Fixed
- **Critical**: Fixed "Bad control character in string literal in JSON" error
  - Changed all JSON body parameters from literal strings to `JSON.stringify()` expressions
  - Affects: OpenAI Chat node, WordPress node, Respond to Webhook node
  - Both workflows updated: `text-to-blog-simple.json` and `text-to-blog-ai-publisher.json`

- **Input Format**: Updated input parsing to accept direct JSON format
  - Changed from `$json.body.text` to `$json.text`
  - Changed from `$json.body.title` to `$json.title`
  - Changed from `$json.body.author` to `$json.author`

### ✨ Added
- **Documentation**: Created comprehensive testing guide (`TESTING_GUIDE.md`)
- **Documentation**: Created API reference (`API_REFERENCE.md`)
- **Documentation**: Created getting started guide (`GETTING_STARTED.md`)
- **Documentation**: Created workflow comparison guide (`WORKFLOW_COMPARISON.md`)
- **Documentation**: Created troubleshooting guide (`TROUBLESHOOTING.md`)
- **Documentation**: Updated README with documentation index

### 📝 Changed
- Simplified JSON body expressions for better compatibility
- Updated all example requests to match new input format
- Improved error handling documentation

---

## [1.0.0] - 2024-11-24

### ✨ Initial Release
- Created Text to Blog AI Publisher workflow
- OpenAI GPT-4o-mini integration for blog generation
- WordPress REST API integration for publishing
- Webhook-based API endpoint
- Two workflow versions: Simple and Advanced
- Complete documentation suite
- Test scripts for PowerShell and Bash

---

## Technical Details

### JSON Body Fix (v1.1.0)

**Before (Broken)**:
```json
"jsonBody": "={\n  \"title\": \"{{ $json.title }}\",\n  \"content\": \"{{ $json.blogContent }}\"\n}"
```

**After (Fixed)**:
```json
"jsonBody": "={{ JSON.stringify({ title: $json.title, content: $json.blogContent }) }}"
```

**Why**: The literal newline characters (`\n`) in the JSON string were causing parsing errors. Using `JSON.stringify()` properly escapes all characters and generates valid JSON.

---

## Migration Guide

### From v1.0.0 to v1.1.0

If you imported the workflow before this fix:

1. **Delete the old workflow** from n8n
2. **Re-import** the updated workflow file
3. **Reconfigure credentials** (OpenAI, WordPress)
4. **Update your API requests** to use the new input format (if needed)

**Input Format Change**:
```json
// OLD (v1.0.0)
{
  "body": {
    "text": "...",
    "title": "...",
    "author": "..."
  }
}

// NEW (v1.1.0)
{
  "text": "...",
  "title": "...",
  "author": "..."
}
```

---

## Known Issues

### None currently

All known issues from v1.0.0 have been resolved in v1.1.0.

---

## Upcoming Features

Planned for future releases:

- [ ] Image generation integration
- [ ] SEO keyword optimization
- [ ] Multi-language support
- [ ] Content scheduling
- [ ] Social media auto-posting
- [ ] Analytics integration
- [ ] A/B testing for titles
- [ ] Custom templates support

---

## Support

For issues or questions:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Visit n8n community: https://community.n8n.io/

---

## Contributors

- Initial development and documentation
- Bug fixes and improvements
- Community feedback and testing

---

## License

MIT License - See LICENSE file for details

