# Troubleshooting Deployment Issues

## Registration Failed Error

If you're seeing "Registration failed" after deploying to Vercel and Render, check these common issues:

### 1. Check Environment Variables

#### Vercel (Frontend)
Make sure `VITE_API_BASE` is set to your Render backend URL:
```
VITE_API_BASE=https://your-backend.onrender.com
```

**How to check:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_API_BASE` is set correctly
3. **Important:** After adding/updating environment variables, you need to **redeploy**!

#### Render (Backend)
Make sure these are set:
```
CLIENT_URL=https://your-vercel-app.vercel.app
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**How to check:**
1. Go to Render Dashboard → Your Service → Environment
2. Verify all variables are set
3. **Important:** After updating `CLIENT_URL`, restart the service

### 2. CORS Configuration

The backend must allow requests from your Vercel frontend URL.

**Check:**
1. In Render, verify `CLIENT_URL` matches your Vercel URL **exactly** (including `https://`)
2. No trailing slashes
3. Case-sensitive

**Example:**
```
✅ CORRECT: CLIENT_URL=https://hamroshop.vercel.app
❌ WRONG:   CLIENT_URL=https://hamroshop.vercel.app/
❌ WRONG:   CLIENT_URL=http://hamroshop.vercel.app (missing 's')
```

### 3. Test Backend Directly

Test if your backend is accessible:

1. Open browser and go to: `https://your-backend.onrender.com/api/health`
2. Should return: `{"status":"ok","message":"HamroShop API is running"}`

If this fails:
- Backend might be sleeping (Render free tier)
- Wait 30 seconds and try again
- Check Render logs for errors

### 4. Test API Endpoint

Test the registration endpoint directly:

**Using Browser Console (on your Vercel site):**
```javascript
fetch('https://your-backend.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err))
```

**Check the console for:**
- CORS errors → Backend CORS not configured correctly
- Network errors → Backend URL wrong or backend down
- 400/500 errors → Backend issue (check Render logs)

### 5. Check Browser Console

1. Open your Vercel site
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try to register
5. Look for errors:
   - `CORS policy` → CORS issue
   - `Failed to fetch` → Network/backend issue
   - `404` → Wrong API URL
   - `500` → Backend error (check Render logs)

### 6. Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to register
4. Find the `/api/auth/register` request
5. Check:
   - **Status Code:**
     - `200/201` → Success (but frontend error handling issue)
     - `400` → Bad request (validation error)
     - `401` → Authentication issue
     - `403` → CORS issue
     - `404` → Wrong URL
     - `500` → Server error
   - **Request URL:** Should be your Render backend URL
   - **Response:** Check what the server returned

### 7. Check Render Logs

1. Go to Render Dashboard → Your Service → Logs
2. Look for:
   - Connection errors
   - MongoDB errors
   - Application errors
   - CORS errors

### 8. Common Fixes

#### Fix 1: Update CORS in Backend
If CORS is the issue, the backend code should allow your Vercel URL. Check `server/src/index.js`:

```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
```

Make sure `CLIENT_URL` in Render matches your Vercel URL.

#### Fix 2: Redeploy After Environment Variable Changes
- **Vercel:** After adding `VITE_API_BASE`, trigger a new deployment
- **Render:** After updating `CLIENT_URL`, restart the service

#### Fix 3: Check MongoDB Connection
If backend logs show MongoDB errors:
- Verify `MONGO_URI` is correct in Render
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### 9. Quick Diagnostic Checklist

- [ ] `VITE_API_BASE` set in Vercel to Render backend URL
- [ ] `CLIENT_URL` set in Render to Vercel frontend URL
- [ ] Vercel redeployed after setting `VITE_API_BASE`
- [ ] Render service restarted after setting `CLIENT_URL`
- [ ] Backend health check works: `https://your-backend.onrender.com/api/health`
- [ ] No CORS errors in browser console
- [ ] MongoDB connection working (check Render logs)
- [ ] URLs match exactly (no trailing slashes, correct protocol)

### 10. Still Not Working?

1. **Check exact error in browser console**
2. **Check Render logs for backend errors**
3. **Verify all environment variables are set correctly**
4. **Test backend endpoint directly using Postman or curl**

## Quick Test Commands

### Test Backend Health
```bash
curl https://your-backend.onrender.com/api/health
```

### Test Registration Endpoint
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

If these work but the frontend doesn't, it's likely a CORS or environment variable issue.


