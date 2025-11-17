# React Interview Questions App - Deployment Guide

## Local Development

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- Git (optional)

### Installation Steps

1. **Navigate to project directory**
```bash
cd c:\Users\gopic\Documents\augment-projects\coding
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open in browser**
- App opens automatically at `http://localhost:3000`
- Or manually open: http://localhost:3000

### Development Workflow

```bash
# Start dev server (with hot reload)
npm start

# In another terminal, run tests
npm test

# Build for production
npm run build
```

---

## Production Build

### Build the App

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Build Output
```
build/
├── index.html
├── static/
│   ├── css/
│   │   └── main.[hash].css
│   ├── js/
│   │   ├── main.[hash].js
│   │   └── [other chunks]
│   └── media/
└── favicon.ico
```

### Build Optimization
- Minified JavaScript
- Optimized CSS
- Compressed images
- Code splitting
- Tree shaking

---

## Deployment Options

### 1. Vercel (Recommended)

**Easiest deployment option**

#### Steps:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Deploy"

**Automatic deployments** on every push to main branch.

#### Environment Variables (if needed)
```
REACT_APP_API_URL=https://api.example.com
```

---

### 2. Netlify

**Simple and fast**

#### Steps:
1. Build locally: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop `build/` folder
4. Or connect GitHub for automatic deployments

#### netlify.toml Configuration
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

**Free hosting on GitHub**

#### Steps:
1. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/repo-name"
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add scripts to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

4. Deploy:
```bash
npm run deploy
```

---

### 4. AWS S3 + CloudFront

**For enterprise deployments**

#### Steps:
1. Build the app: `npm run build`
2. Create S3 bucket
3. Upload `build/` contents to S3
4. Set up CloudFront distribution
5. Configure domain

#### AWS CLI Commands
```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

### 5. Docker Deployment

**For containerized deployments**

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

#### Build and Run
```bash
# Build image
docker build -t react-interview-app .

# Run container
docker run -p 3000:3000 react-interview-app
```

---

### 6. Traditional Web Server (Apache/Nginx)

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/react-app/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache Configuration
```apache
<Directory /var/www/react-app/build>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</Directory>
```

---

## Environment Variables

### Development
Create `.env.local`:
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

### Production
Create `.env.production`:
```
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

### Usage in Code
```typescript
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## Performance Optimization

### Before Deployment

1. **Analyze Bundle Size**
```bash
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

2. **Lighthouse Audit**
- Open DevTools → Lighthouse
- Run audit
- Fix issues

3. **Test Performance**
```bash
npm run build
npx serve -s build
```

### Optimization Checklist
- ✅ Minify code
- ✅ Compress images
- ✅ Enable gzip compression
- ✅ Set cache headers
- ✅ Use CDN
- ✅ Code splitting
- ✅ Lazy loading

---

## Security Checklist

Before deploying to production:

- ✅ Remove console.log statements
- ✅ Use HTTPS only
- ✅ Set security headers
- ✅ Validate environment variables
- ✅ No sensitive data in code
- ✅ Update dependencies
- ✅ Enable CORS properly
- ✅ Sanitize user input

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

---

## Monitoring & Analytics

### Add Google Analytics
```typescript
// src/index.tsx
import ReactGA from 'react-ga';

ReactGA.initialize('GA_MEASUREMENT_ID');
ReactGA.pageview(window.location.pathname);
```

### Error Tracking (Sentry)
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.REACT_APP_ENV
});
```

---

## Troubleshooting Deployment

### Issue: Blank Page
**Solution**: Check browser console for errors, verify build output

### Issue: 404 on Refresh
**Solution**: Configure server to serve index.html for all routes

### Issue: Styles Not Loading
**Solution**: Check CSS file paths, verify build output

### Issue: Slow Performance
**Solution**: Analyze bundle size, enable compression, use CDN

---

## Rollback Procedure

### Vercel
- Go to Deployments
- Click on previous deployment
- Click "Redeploy"

### Netlify
- Go to Deploys
- Click on previous deploy
- Click "Publish deploy"

### GitHub Pages
```bash
git revert <commit-hash>
git push
npm run deploy
```

---

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Post-Deployment

1. **Test in Production**
   - Test all features
   - Check on different browsers
   - Test on mobile devices

2. **Monitor Performance**
   - Check Core Web Vitals
   - Monitor error rates
   - Track user analytics

3. **Gather Feedback**
   - User testing
   - Bug reports
   - Feature requests

---

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Security audits: `npm audit`
- Performance monitoring
- User feedback review

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package-name@latest
```

---

## Summary

| Platform | Ease | Cost | Best For |
|----------|------|------|----------|
| Vercel | ⭐⭐⭐⭐⭐ | Free | Quick deployment |
| Netlify | ⭐⭐⭐⭐⭐ | Free | Easy setup |
| GitHub Pages | ⭐⭐⭐⭐ | Free | GitHub users |
| AWS | ⭐⭐⭐ | Paid | Enterprise |
| Docker | ⭐⭐⭐ | Varies | Containerized |

---

**Ready to deploy! Choose your platform and follow the steps above.** 🚀

