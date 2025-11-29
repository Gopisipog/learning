# WordPress Installation Guide

Complete guide to install WordPress locally for testing the n8n workflow.

## 🎯 Recommended Options for Windows

### Option 1: Local by Flywheel (Easiest - Recommended) ⭐

**Best for**: Beginners, quick setup, no technical knowledge required

#### Installation Steps

1. **Download Local**
   - Visit: https://localwp.com/
   - Click "Download for Free"
   - Fill in the form (or skip)
   - Download the Windows installer

2. **Install Local**
   - Run the downloaded `.exe` file
   - Follow the installation wizard
   - Accept the license agreement
   - Complete installation

3. **Create a WordPress Site**
   - Open Local application
   - Click **"+ Create a new site"**
   - Enter site name: `n8n-blog-test`
   - Click **Continue**
   - Choose **Preferred** environment
   - Click **Continue**
   - Set WordPress credentials:
     - Username: `admin`
     - Password: `admin` (or your choice)
     - Email: your email
   - Click **Add Site**
   - Wait for installation (2-3 minutes)

4. **Start the Site**
   - Click **Start Site** (if not already started)
   - Click **WP Admin** to open WordPress dashboard
   - Login with your credentials

5. **Get Your WordPress URL**
   - In Local, you'll see the site URL (e.g., `http://n8n-blog-test.local`)
   - This is your WordPress site URL for n8n

---

### Option 2: Docker (For Developers)

**Best for**: Developers familiar with Docker, portable setup

#### Prerequisites
- Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/

#### Installation Steps

1. **Create Docker Compose File**

Create `docker-compose.yml` in your project:

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_data:/var/www/html

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - db_data:/var/lib/mysql

volumes:
  wordpress_data:
  db_data:
```

2. **Start WordPress**

```bash
docker-compose up -d
```

3. **Access WordPress**
   - Open: http://localhost:8080
   - Complete WordPress installation wizard
   - Set username: `admin`
   - Set password: `admin` (or your choice)
   - Click **Install WordPress**

4. **Your WordPress URL**
   - Site URL: `http://localhost:8080`
   - Admin URL: `http://localhost:8080/wp-admin`

---

### Option 3: XAMPP (Traditional Method)

**Best for**: Those who want full control, familiar with PHP/MySQL

#### Installation Steps

1. **Download XAMPP**
   - Visit: https://www.apachefriends.org/
   - Download XAMPP for Windows
   - Run the installer

2. **Install XAMPP**
   - Choose components: Apache, MySQL, PHP, phpMyAdmin
   - Install to: `C:\xampp`
   - Complete installation

3. **Start Services**
   - Open XAMPP Control Panel
   - Click **Start** for Apache
   - Click **Start** for MySQL

4. **Download WordPress**
   - Visit: https://wordpress.org/download/
   - Download latest WordPress
   - Extract to: `C:\xampp\htdocs\wordpress`

5. **Create Database**
   - Open: http://localhost/phpmyadmin
   - Click **New** (left sidebar)
   - Database name: `wordpress`
   - Click **Create**

6. **Install WordPress**
   - Open: http://localhost/wordpress
   - Click **Let's go!**
   - Database settings:
     - Database Name: `wordpress`
     - Username: `root`
     - Password: (leave empty)
     - Database Host: `localhost`
     - Table Prefix: `wp_`
   - Click **Submit** → **Run the installation**
   - Set site title, username, password
   - Click **Install WordPress**

7. **Your WordPress URL**
   - Site URL: `http://localhost/wordpress`
   - Admin URL: `http://localhost/wordpress/wp-admin`

---

## 🔑 Enable WordPress REST API

After installing WordPress, you need to enable the REST API and create application passwords.

### Step 1: Update Permalink Structure

1. Login to WordPress Admin
2. Go to **Settings** → **Permalinks**
3. Select **Post name** (or any option except "Plain")
4. Click **Save Changes**

**Why**: WordPress REST API requires pretty permalinks to work properly.

### Step 2: Create Application Password

1. Go to **Users** → **Profile**
2. Scroll down to **Application Passwords** section
3. Enter application name: `n8n`
4. Click **Add New Application Password**
5. **Copy the generated password** (you won't see it again!)
6. Save it somewhere safe

**Example Application Password**: `abcd 1234 efgh 5678 ijkl 9012`

---

## 🔧 Configure n8n Workflow

Now update your n8n workflow with WordPress credentials:

### Step 1: Update WordPress URL

1. Open n8n workflow
2. Click **Publish to WordPress** node
3. Change URL from:
   ```
   https://your-wordpress-site.com/wp-json/wp/v2/posts
   ```
   To (based on your installation):
   
   **Local by Flywheel**:
   ```
   http://n8n-blog-test.local/wp-json/wp/v2/posts
   ```
   
   **Docker**:
   ```
   http://localhost:8080/wp-json/wp/v2/posts
   ```
   
   **XAMPP**:
   ```
   http://localhost/wordpress/wp-json/wp/v2/posts
   ```

### Step 2: Add WordPress Credentials

1. Click **Publish to WordPress** node
2. Click **Credential to connect with** dropdown
3. Click **Create New Credential**
4. Select **HTTP Basic Auth**
5. Enter:
   - **Username**: Your WordPress username (e.g., `admin`)
   - **Password**: The **Application Password** you created (not your regular password!)
6. Click **Save**

---

## ✅ Test WordPress API

### Test 1: Check API is Working

Open in browser:
- **Local**: `http://n8n-blog-test.local/wp-json/wp/v2/posts`
- **Docker**: `http://localhost:8080/wp-json/wp/v2/posts`
- **XAMPP**: `http://localhost/wordpress/wp-json/wp/v2/posts`

**Expected**: JSON response with `[]` (empty array if no posts)

### Test 2: Test with cURL

```bash
curl http://localhost:8080/wp-json/wp/v2/posts
```

**Expected**: JSON array of posts

### Test 3: Test Authentication

```bash
curl -X POST http://localhost:8080/wp-json/wp/v2/posts \
  -u "admin:abcd 1234 efgh 5678 ijkl 9012" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test content","status":"draft"}'
```

**Expected**: JSON response with created post details

---

## 🐛 Troubleshooting

### Error: "REST API disabled"

**Solution**: Install plugin "Application Passwords" (for WordPress < 5.6)

### Error: "Sorry, you are not allowed to create posts"

**Solution**: 
1. Check you're using Application Password, not regular password
2. Verify user has "Editor" or "Administrator" role

### Error: "404 Not Found" on API endpoint

**Solution**: 
1. Update permalink structure (Settings → Permalinks)
2. Save changes even if already set

### Error: "Connection refused"

**Solution**:
1. Make sure WordPress is running
2. Check the URL is correct
3. For Local: Make sure site is started

---

## 📊 Quick Comparison

| Method | Difficulty | Speed | Best For |
|--------|-----------|-------|----------|
| **Local by Flywheel** | ⭐ Easy | ⚡ Fast | Beginners |
| **Docker** | ⭐⭐ Medium | ⚡⚡ Very Fast | Developers |
| **XAMPP** | ⭐⭐⭐ Hard | ⚡ Medium | Full control |

---

## 🎯 Recommended: Local by Flywheel

For this project, I recommend **Local by Flywheel** because:
- ✅ Easiest to install and use
- ✅ No configuration needed
- ✅ Built-in SSL support
- ✅ Easy to start/stop sites
- ✅ Perfect for testing

---

## 📝 Next Steps

After installing WordPress:

1. ✅ Create Application Password
2. ✅ Update n8n workflow with WordPress URL
3. ✅ Add WordPress credentials to n8n
4. ✅ Test the workflow with Postman
5. ✅ Check WordPress for the created draft post

---

## 🆘 Need Help?

- **Local Support**: https://localwp.com/help-docs/
- **Docker Support**: https://docs.docker.com/
- **WordPress REST API**: https://developer.wordpress.org/rest-api/
- **n8n WordPress**: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.wordpress/

---

**Ready to install?** Choose your preferred method and follow the steps above! 🚀

