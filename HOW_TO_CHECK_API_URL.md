# How to Check API Base URL in Browser Console

## ❌ Don't Do This (Will Cause Error)

```javascript
// This will NOT work in browser console:
console.log(import.meta.env.VITE_API_BASE)  // ❌ Error!
```

**Why?** `import.meta` only works in ES modules, not in browser console.

## ✅ Correct Ways to Check

### Method 1: Use Window Object (Easiest)

After the page loads, open browser console (F12) and run:

```javascript
// Check the API base URL
console.log('API Base:', window.__API_BASE__)

// Check if VITE_API_BASE is set
console.log('VITE_API_BASE:', window.__VITE_API_BASE__)
```

### Method 2: Check Console on Page Load

When you open your site, the console will automatically show:
```
🔧 API Base URL: https://your-backend.onrender.com
💡 Tip: Check API base with: window.__API_BASE__ or window.__VITE_API_BASE__
```

### Method 3: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to use a feature (register, checkout, etc.)
4. Look at the failed request
5. Check the **Request URL** - this shows what API URL is being used

### Method 4: Check What's Actually Being Called

In Network tab, find any API request and check:
- **Request URL:** Shows the full URL being called
- If it shows `http://localhost:5000` → VITE_API_BASE not set in Vercel
- If it shows your Render URL → Good!

## Quick Diagnostic

### Step 1: Open Your Site
1. Go to your Vercel site
2. Press **F12** to open Developer Tools
3. Go to **Console** tab

### Step 2: Check What You See

**If you see:**
```
🔧 API Base URL: https://ecommerce-website-mern-stack-ogp1.onrender.com
```
✅ **Good!** API base is set correctly.

**If you see:**
```
🔧 API Base URL: http://localhost:5000
⚠️ VITE_API_BASE not set! Using default: http://localhost:5000
⚠️ Set VITE_API_BASE in Vercel environment variables!
```
❌ **Problem!** VITE_API_BASE not set in Vercel.

### Step 3: Use Window Object

In console, type:
```javascript
window.__API_BASE__
```

This will show the current API base URL being used.

## Fix If Not Set

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add:
   - **Key:** `VITE_API_BASE`
   - **Value:** `https://ecommerce-website-mern-stack-ogp1.onrender.com`
3. **Save**
4. **Redeploy** (Deployments → Latest → Redeploy)
5. Wait 2-3 minutes
6. Refresh your site and check console again

