# 🔧 Troubleshooting Guide

## Motion Canvas Not Loading

### ✅ Server Status: RUNNING
The Vite dev server is running successfully on **http://localhost:9000**

### Quick Fixes

#### 1. Hard Refresh the Browser
- **Windows/Linux:** Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** Press `Cmd + Shift + R`
- This clears the browser cache and reloads

#### 2. Clear Browser Cache
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### 3. Check Browser Console
1. Press `F12` to open DevTools
2. Click the "Console" tab
3. Look for any red error messages
4. Share any errors you see

#### 4. Try a Different Browser
- Chrome
- Firefox
- Edge
- Safari

#### 5. Check if Port is Blocked
Sometimes antivirus or firewall blocks localhost. Try:
- Temporarily disable antivirus
- Allow localhost:9000 in firewall

---

## Common Issues & Solutions

### Issue: Blank White Screen

**Solution 1: Wait for Build**
- The first load can take 10-30 seconds
- Wait for "Dependencies optimized" message in terminal

**Solution 2: Check Network Tab**
1. Open DevTools (F12)
2. Go to "Network" tab
3. Refresh page
4. Check if files are loading (should see green 200 status)

**Solution 3: Restart Server**
```bash
# Stop server (Ctrl+C in terminal)
# Then restart:
npm start
```

### Issue: "Cannot find module" Error

**Solution:**
```bash
# Reinstall dependencies
npm install
npm start
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Check for errors
npm run build

# If errors, check the scene files
```

### Issue: Images Not Showing

**Check:**
1. All PNG files are in `story/` folder
2. File names match exactly: `scene-01.png` through `scene-05.png`
3. No typos in import paths

### Issue: Audio Not Playing

**Check:**
1. All MP3 files are in `story/` folder
2. Browser allows audio autoplay
3. Volume is not muted
4. Try clicking on the page first (browsers block autoplay until user interaction)

---

## Verification Steps

### 1. Check Server is Running
Look for this in terminal:
```
VITE v4.5.14  ready in 308 ms
➜  Local:   http://localhost:9000/
```

✅ **Status:** Server is running!

### 2. Check Files Exist
```bash
# List story files
dir story
```

Should show:
- scene-01.png through scene-05.png
- voiceover-1.mp3 through voiceover-5.mp3

✅ **Status:** All files present!

### 3. Check Scene Files
```bash
# List scene files
dir src\scenes
```

Should show:
- scene1.tsx through scene5.tsx

✅ **Status:** All scenes created!

---

## Manual Testing

### Test 1: Open URL Directly
1. Open browser
2. Type: `http://localhost:9000`
3. Press Enter
4. Wait 10 seconds

### Test 2: Check DevTools Console
1. Press F12
2. Look for errors in Console tab
3. Common errors:
   - "Failed to fetch" - Server not running
   - "Module not found" - Missing file
   - "Syntax error" - Code error

### Test 3: Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Should see many files loading with status 200

---

## Advanced Troubleshooting

### Clear Vite Cache
```bash
# Stop server (Ctrl+C)
# Delete cache
Remove-Item -Recurse -Force node_modules\.vite
# Restart
npm start
```

### Reinstall Everything
```bash
# Stop server (Ctrl+C)
# Delete node_modules
Remove-Item -Recurse -Force node_modules
# Reinstall
npm install
# Start
npm start
```

### Check Port Availability
```bash
# Check if port 9000 is in use
netstat -ano | findstr :9000
```

If port is in use by another process, you can:
1. Kill that process
2. Or change port in `vite.config.ts`

---

## What Should You See?

### In Browser:
1. **Motion Canvas Editor** - Dark interface
2. **Timeline** at bottom
3. **Preview area** in center
4. **Play button** (▶️) at bottom left
5. **Scene list** on left sidebar showing:
   - scene1
   - scene2
   - scene3
   - scene4
   - scene5

### When You Click Play:
1. Title card appears: "Luna's Magical Night"
2. Scene 1 plays with narration
3. Transitions to Scene 2 with firefly effects
4. Scene 3 with mushroom glows
5. Scene 4 with shooting stars
6. Scene 5 with "The End"

---

## Still Not Working?

### Collect Information:

1. **Browser Console Errors:**
   - Press F12
   - Copy any red errors
   - Share them

2. **Terminal Output:**
   - Copy the full terminal output
   - Look for error messages

3. **Browser Version:**
   - What browser are you using?
   - What version?

4. **What You See:**
   - Blank white screen?
   - Loading spinner?
   - Error message?
   - Something else?

---

## Quick Reset

If nothing works, try this complete reset:

```bash
# 1. Stop server (Ctrl+C)

# 2. Clean everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force node_modules\.vite

# 3. Reinstall
npm install

# 4. Start fresh
npm start

# 5. Open browser
Start-Process "http://localhost:9000"

# 6. Wait 30 seconds for build

# 7. Hard refresh browser (Ctrl+Shift+R)
```

---

## Current Status

✅ **Server:** Running on http://localhost:9000
✅ **Files:** All scene files created
✅ **Assets:** All story assets copied
✅ **Code:** No TypeScript errors
✅ **HTTP:** Server responding with 200 OK

**Next Step:** Try hard refreshing your browser (Ctrl+Shift+R)

If you see any error messages in the browser console (F12), please share them!

