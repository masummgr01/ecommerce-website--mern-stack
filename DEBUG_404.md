# Debugging 404 Errors

## Quick Checklist

### 1. Check Vercel Environment Variable

**Problem:** `VITE_API_BASE` not set or incorrect in Vercel.

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check if `VITE_API_BASE` exists
3. Value should be: `https://your-backend.onrender.com` (your Render backend URL)
4. **Important:** After adding/updating, you MUST redeploy!

### 2. Check Browser Console

Open your site and check the browser console (F12):

**Look for:**
- What URL is being requested?
- Is it trying to call `http://localhost:5000`? → `VITE_API_BASE` not set
- Is it calling the wrong backend URL? → Wrong value in `VITE_API_BASE`

### 3. Test Backend Directly

Open in browser:
```
https://your-backend.onrender.com/api/health
```

**Should return:**
```json
{"status":"ok","message":"HamroShop API is running"}
```

**If this fails:**
- Backend might be sleeping (Render free tier)
- Wait 30 seconds and try again
- Check Render logs for errors

### 4. Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to use the feature that's failing
4. Find the failed request
5. Check:
   - **Request URL:** What URL is it trying to call?
   - **Status:** 404?
   - **Response:** What does it say?

### 5. Common Issues

#### Issue: API calls going to localhost
**Symptom:** Console shows requests to `http://localhost:5000`

**Fix:**
- `VITE_API_BASE` is not set in Vercel
- Add it and redeploy

#### Issue: API calls going to wrong URL
**Symptom:** Requests going to old/wrong backend URL

**Fix:**
- Update `VITE_API_BASE` in Vercel
- Redeploy

#### Issue: Backend returns 404
**Symptom:** Backend is running but returns 404 for API calls

**Possible causes:**
- Route doesn't exist
- Wrong endpoint path
- Backend not deployed with latest code

**Fix:**
- Check Render logs
- Verify routes are correct
- Redeploy backend

## Step-by-Step Debugging

### Step 1: Verify VITE_API_BASE

In browser console on your Vercel site, run:
```javascript
console.log('API Base:', import.meta.env.VITE_API_BASE)
```

**Expected:** Your Render backend URL (e.g., `https://hamroshop-backend.onrender.com`)
**If undefined:** `VITE_API_BASE` not set in Vercel

### Step 2: Test API Endpoint

In browser console, run:
```javascript
fetch(import.meta.env.VITE_API_BASE + '/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend response:', d))
  .catch(e => console.error('Backend error:', e))
```

**Expected:** `{status: "ok", message: "HamroShop API is running"}`
**If error:** Backend not accessible or wrong URL

### Step 3: Check What's Failing

Look at the Network tab to see:
- Which endpoint is returning 404?
- What's the full URL?
- Is it a frontend route or API route?

## Quick Fixes

### Fix 1: Add VITE_API_BASE to Vercel

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - **Key:** `VITE_API_BASE`
   - **Value:** `https://your-backend.onrender.com`
3. **Redeploy** (Deployments → Latest → Redeploy)

### Fix 2: Verify Backend is Running

1. Go to Render Dashboard
2. Check if service is "Live"
3. Check logs for errors
4. Test health endpoint directly

### Fix 3: Check CORS

If you see CORS errors:
1. Verify `CLIENT_URL` in Render matches your Vercel URL exactly
2. Restart Render service

## Still Not Working?

1. **Check exact error in browser console**
2. **Check Network tab for failed requests**
3. **Check Render logs for backend errors**
4. **Verify all environment variables are set correctly**

