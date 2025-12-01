# MongoDB Atlas Setup Guide

## Quick Setup for HamroShop

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you have one)

### Step 2: Create a Free Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free tier)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click **"Create"** (cluster name is optional)

### Step 3: Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `hamroshop-admin`)
5. Click **"Autogenerate Secure Password"** and **COPY IT** (you'll need it!)
6. Click **"Add User"**

### Step 4: Whitelist IP Address

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For local development, click **"Add Current IP Address"**
4. For deployment (Render), click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
5. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File

Replace the connection string with your actual credentials:

```env
MONGO_URI=mongodb+srv://hamroshop-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hamroshop?retryWrites=true&w=majority
```

**Important**: 
- Replace `YOUR_PASSWORD` with the password you copied in Step 3
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- The `/hamroshop` at the end is the database name (you can change it)

### Step 7: Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it to your `.env` file:

```env
JWT_SECRET=your_generated_secret_here
```

### Step 8: Complete .env File

Your `server/.env` file should look like this:

```env
# MongoDB Connection (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hamroshop?retryWrites=true&w=majority

# Server Port
PORT=5000

# JWT Secret Key (REQUIRED)
JWT_SECRET=your_generated_secret_here

# Client URL (for CORS and redirects)
CLIENT_URL=http://localhost:5173
```

### Step 9: Test Connection

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. You should see: `Connected to MongoDB` ✅

## Troubleshooting

### Connection Timeout
- Check that your IP is whitelisted in Network Access
- Verify the connection string is correct
- Make sure you replaced `<username>` and `<password>` in the connection string

### Authentication Failed
- Double-check username and password
- Make sure special characters in password are URL-encoded (use `%` encoding if needed)
- Try regenerating the database user password

### Still Can't Connect?
- Check MongoDB Atlas dashboard for any error messages
- Verify the cluster is running (not paused)
- Try using the connection string from "Connect" → "Connect your application"

## For Deployment

When deploying to Render, use the same MongoDB Atlas connection string in your Render environment variables. The connection string works from anywhere once you've whitelisted `0.0.0.0/0`.


