# 🔧 Troubleshooting - Image URL Issues

## ❌ Problem Identified

The error `"File with such name does not exist" (404)` indicates that the image URLs are **webpage URLs**, not **direct image URLs**.

### What Went Wrong?

The URLs in your data are links to webpages, not actual image files:
- ❌ `https://www.zedge.net/wallpapers/2800500f-bd31-4381-bd04-285364680b2f` (webpage)
- ❌ `https://www.freepik.com/free-vector/hand-drawn-thaipusam-festival_11105481.htm` (webpage)
- ❌ `https://unsplash.com/photos/a-large-statue-of-a-man-holding-a-staff-gcQkighWofc` (webpage)
- ❌ `https://www.pexels.com/photo/gold-statue-near-green-trees-3731615/` (webpage)

### What Creatomate Needs?

Creatomate requires **direct image URLs** that end with image extensions:
- ✅ `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- ✅ Example: `https://images.unsplash.com/photo-xyz/image.jpg`

## 🔧 Solutions

### Option 1: Use Direct Image URLs from Unsplash (Recommended)

Unsplash provides direct image URLs. Here's how to get them:

1. Go to Unsplash photo page
2. Click "Download" or right-click the image
3. Copy the direct image URL

**Format**: `https://images.unsplash.com/photo-{id}?w=1080&q=80`

### Option 2: Use Pexels Direct URLs

Pexels also provides direct URLs:

**Format**: `https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg`

### Option 3: Use Free Stock Image APIs

Use these free image sources with direct URLs:

1. **Unsplash API**: https://source.unsplash.com/1080x1920/?murugan,temple
2. **Picsum Photos**: https://picsum.photos/1080/1920
3. **Lorem Picsum**: https://loremflickr.com/1080/1920/murugan,temple

### Option 4: Upload Your Own Images

1. Upload images to a cloud storage (Google Drive, Dropbox, Imgur)
2. Get the direct download/view URL
3. Use those URLs in the script

## 🚀 Quick Fix Script

I'll create a new script with working image URLs using Unsplash's direct image service:

### Using Unsplash Source (No API Key Required)

```javascript
// Example working URLs:
background1: "https://source.unsplash.com/1080x1920/?hindu,temple,statue",
background2: "https://source.unsplash.com/1080x1920/?indian,festival,colorful",
background3: "https://source.unsplash.com/1080x1920/?peacock,feather,colorful",
background4: "https://source.unsplash.com/1080x1920/?temple,architecture,golden"
```

## 📝 How to Get Direct URLs

### From Unsplash:
1. Visit: https://unsplash.com/photos/{photo-id}
2. Click "Download free"
3. Right-click the downloaded image location
4. Copy the URL (should look like: `https://images.unsplash.com/photo-...`)

### From Pexels:
1. Visit the photo page
2. Click "Download"
3. Right-click and "Copy image address"
4. Use that URL

### From Freepik:
⚠️ Freepik requires attribution and may not allow direct hotlinking
- Download the image
- Upload to your own hosting (Imgur, Cloudinary, etc.)
- Use your hosted URL

### From Zedge:
⚠️ Zedge doesn't provide direct image URLs easily
- Download the wallpaper
- Upload to your own hosting
- Use your hosted URL

## 🎯 Recommended Solution

Use **Unsplash Source** for quick testing, then replace with specific images:

```javascript
const shortsData = [
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k",
    background1: "https://source.unsplash.com/1080x1920/?hindu,murugan,statue",
    text1: "முருகன் தமிழர்களுக்காக நல்ல வழிகாட்டி.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,colorful",
    text2: "Index,Teaching (Tamil)",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather",
    text3: "Index,பளமொழி (தமிழில்),English Meaning",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,architecture",
    text4: "முருகா அருள்புரிவாய்!"
  }
  // ... more shorts
];
```

## 🔄 Next Steps

1. **Download the images** from the original sources
2. **Upload to a hosting service**:
   - Imgur (free, easy): https://imgur.com
   - Cloudinary (free tier): https://cloudinary.com
   - Google Drive (make public)
   - Your own website
3. **Get direct image URLs** from your hosting
4. **Update the script** with the new URLs
5. **Re-run** the generation script

## 💡 Alternative: Use Creatomate's Asset Library

You can also:
1. Upload images to Creatomate's asset library
2. Use the Creatomate asset URLs in your script
3. This ensures compatibility and faster rendering

## 📞 Need Help?

If you need help getting direct image URLs, I can:
1. Create a script using Unsplash Source (random images)
2. Help you find specific Murugan/temple images with direct URLs
3. Guide you through uploading to a free hosting service

Let me know which approach you'd like to take!

