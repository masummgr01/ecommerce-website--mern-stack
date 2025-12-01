# Quick Fix for 404 Error

## Step 1: Check if VITE_API_BASE is Set in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Look for `VITE_API_BASE`
4. **If it's NOT there or wrong:**
   - Click **Add New**
   - **Key:** `VITE_API_BASE`
   - **Value:** `https://ecommerce-website-mern-stack-ogp1.onrender.com`
   - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

## Step 2: Redeploy Vercel

**IMPORTANT:** After adding/updating environment variables, you MUST redeploy!

1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment to complete

## Step 3: Verify in Browser

1. Open your Vercel site
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Run this command:
   ```javascript
   console.log('API Base:', import.meta.env.VITE_API_BASE)
   ```

**Expected:** Should show `https://ecommerce-website-mern-stack-ogp1.onrender.com`
**If undefined:** VITE_API_BASE not set in Vercel

## Step 4: Test Backend

Open this URL in your browser:
```
https://ecommerce-website-mern-stack-ogp1.onrender.com/api/health
```

**Should return:**
```json
{"status":"ok","message":"HamroShop API is running"}
```

**If it fails:**
- Backend might be sleeping (wait 30 seconds)
- Check Render logs for errors

## Step 5: Check Network Tab

1. Open your Vercel site
2. Press **F12** → **Network** tab
3. Try the action that's failing
4. Find the failed request (red, 404)
5. Check the **Request URL** - what is it trying to call?

## Common Issues

### Issue 1: VITE_API_BASE Not Set
**Symptom:** Console shows `undefined` or requests go to `localhost:5000`

**Fix:** Set `VITE_API_BASE` in Vercel and redeploy

### Issue 2: Wrong Backend URL
**Symptom:** Requests going to wrong URL

**Fix:** Update `VITE_API_BASE` in Vercel with correct Render URL

### Issue 3: Backend Not Running
**Symptom:** `/api/health` doesn't work

**Fix:** Check Render dashboard, restart service if needed

## Still Not Working?

Share:
1. What the console shows for `import.meta.env.VITE_API_BASE`
2. The exact URL from Network tab that's returning 404
3. Whether `/api/health` works in browser

