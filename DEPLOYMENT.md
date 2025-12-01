# Deployment Guide for HamroShop

This guide will help you deploy HamroShop on Vercel (Frontend) and Render (Backend).

## Prerequisites

1. GitHub account with the repository
2. Vercel account (free tier available)
3. Render account (free tier available)
4. MongoDB Atlas account (free tier available) or MongoDB connection string

---

## Part 1: Deploy Backend on Render

### Step 1: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for Render)
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/hamroshop`)

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `hamroshop-backend` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables** (click "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_random_secret_key_here
   CLIENT_URL=https://your-vercel-app.vercel.app
   ESEWA_TEST_MODE=true
   ESEWA_ENV=uat
   ```

6. Click **"Create Web Service"**
7. Wait for deployment to complete
8. **Copy your Render URL** (e.g., `https://hamroshop-backend.onrender.com`)

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

5. **Add Environment Variables** (click "Environment Variables"):
   ```
   VITE_API_BASE=https://your-render-backend-url.onrender.com
   ```
   (Replace with your actual Render backend URL)

6. Click **"Deploy"**
7. Wait for deployment to complete
8. **Copy your Vercel URL** (e.g., `https://hamroshop.vercel.app`)

### Step 2: Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update the `CLIENT_URL` environment variable to your Vercel URL:
   ```
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
4. Save and redeploy

---

## Part 3: Verify Deployment

### Test Backend

1. Visit: `https://your-backend.onrender.com/api/health`
2. Should return: `{"status":"ok","message":"HamroShop API is running"}`

### Test Frontend

1. Visit your Vercel URL
2. Try to:
   - View products
   - Register/Login
   - Add items to cart
   - Checkout

---

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hamroshop
JWT_SECRET=your_random_secret_key_minimum_32_characters
CLIENT_URL=https://your-vercel-app.vercel.app
ESEWA_TEST_MODE=true
ESEWA_ENV=uat
```

### Frontend (Vercel)
```
VITE_API_BASE=https://your-backend.onrender.com
```

---

## Troubleshooting

### Backend Issues

1. **Build fails**: Check that `package.json` has correct scripts
2. **Server crashes**: Check Render logs for errors
3. **MongoDB connection fails**: 
   - Verify connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

### Frontend Issues

1. **Build fails**: Check Vite configuration
2. **API calls fail**: 
   - Verify `VITE_API_BASE` is set correctly
   - Check CORS settings in backend
   - Verify backend URL is accessible

### Common Issues

1. **CORS errors**: Make sure `CLIENT_URL` in backend matches your Vercel URL exactly
2. **Environment variables not working**: 
   - Restart the service after adding variables
   - Check variable names (case-sensitive)
   - For Vite, variables must start with `VITE_`

---

## Quick Deploy Commands

### Using Render CLI (Optional)
```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy using render.yaml
render deploy
```

### Using Vercel CLI (Optional)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd client
vercel --prod
```

---

## Notes

- Render free tier: Services spin down after 15 minutes of inactivity (first request may be slow)
- Vercel free tier: Generous limits, great for production
- MongoDB Atlas free tier: 512MB storage, perfect for development
- Always use strong `JWT_SECRET` in production (minimum 32 characters, random)

---

## Support

If you encounter issues:
1. Check deployment logs in Vercel/Render dashboards
2. Verify all environment variables are set correctly
3. Test API endpoints directly using Postman or curl
4. Check browser console for frontend errors


