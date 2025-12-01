# Deployment Troubleshooting Guide

## Registration/Login Failing After Deployment

If you see "Registration failed" or "Login failed" errors after deploying, follow these steps:

### Step 1: Verify Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Verify `VITE_API_BASE` is set to your Render backend URL:
   ```
   VITE_API_BASE=https://your-backend.onrender.com
   ```
   **Important**: 
   - No trailing slash
   - Use `https://` not `http://`
   - Must match your Render URL exactly

4. **Redeploy** after adding/changing environment variables:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

### Step 2: Verify Environment Variables in Render

1. Go to your Render service dashboard
2. Click on **Environment** tab
3. Verify these variables are set:

   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```

   **Critical**: `CLIENT_URL` must match your Vercel URL exactly (including `https://`)

4. After updating, Render will automatically redeploy

### Step 3: Test Backend Directly

Test if your backend is accessible:

1. Open browser and go to:
   ```
   https://your-backend.onrender.com/api/health
   ```

2. You should see:
   ```json
   {"status":"ok","message":"HamroShop API is running"}
   ```

3. If you get an error or timeout:
   - Check Render logs for errors
   - Verify MongoDB connection is working
   - Check if service is running (not sleeping)

### Step 4: Check CORS Configuration

The backend CORS must allow your Vercel domain. Check `server/src/index.js`:

```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
```

**Make sure** `CLIENT_URL` in Render matches your Vercel URL exactly.

### Step 5: Check Browser Console

1. Open your Vercel app in browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try to register/login
5. Look for error messages:
   - **CORS error**: Backend CORS not configured correctly
   - **Network error**: Backend URL incorrect or backend down
   - **404 error**: API endpoint not found

### Step 6: Verify API Base URL

Check what URL the frontend is using:

1. In browser console, type:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE)
   ```
   Or check the Network tab to see what URL requests are being made to.

### Common Issues and Solutions

#### Issue 1: "Cannot connect to server"
**Cause**: `VITE_API_BASE` not set or incorrect in Vercel
**Solution**: 
- Add `VITE_API_BASE` in Vercel environment variables
- Redeploy Vercel app

#### Issue 2: CORS Error
**Cause**: `CLIENT_URL` in Render doesn't match Vercel URL
**Solution**:
- Update `CLIENT_URL` in Render to match Vercel URL exactly
- Wait for Render to redeploy

#### Issue 3: 404 Not Found
**Cause**: Backend URL incorrect or API route doesn't exist
**Solution**:
- Verify backend is running: `https://your-backend.onrender.com/api/health`
- Check API routes in `server/src/routes/authRoutes.js`

#### Issue 4: Backend Timeout (Render Free Tier)
**Cause**: Render free tier services sleep after 15 minutes
**Solution**:
- First request may take 30-60 seconds to wake up
- Consider upgrading to paid tier for always-on service

### Quick Checklist

- [ ] `VITE_API_BASE` set in Vercel to Render backend URL
- [ ] `CLIENT_URL` set in Render to Vercel frontend URL
- [ ] Backend health check works: `https://backend.onrender.com/api/health`
- [ ] MongoDB connection working (check Render logs)
- [ ] Both services are deployed and running
- [ ] No CORS errors in browser console
- [ ] Network requests show correct backend URL

### Testing Locally with Production URLs

To test locally with production backend:

1. Create `client/.env.local`:
   ```
   VITE_API_BASE=https://your-backend.onrender.com
   ```

2. Restart dev server:
   ```bash
   cd client
   npm run dev
   ```

### Getting More Detailed Errors

The updated code now shows more specific error messages:
- Network errors: "Cannot connect to server..."
- Server errors: Shows actual error message from backend
- CORS errors: Will show in browser console

Check browser console (F12) for detailed error information.

