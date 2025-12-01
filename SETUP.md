# HamroShop Setup Guide

## Issues Fixed

1. **Express 5.x Compatibility**: Downgraded from Express 5.1.0 to Express 4.21.2 for better stability and compatibility
2. **Server Startup**: Server now waits for MongoDB connection before starting
3. **Error Handling**: Added proper error handling for missing environment variables
4. **CORS Configuration**: Improved CORS settings for deployment

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://127.0.0.1:27017/hamroshop

# Server Port
PORT=5000

# JWT Secret Key (REQUIRED - generate a random string)
JWT_SECRET=your-secret-key-here-change-in-production

# Client URL (for CORS and redirects)
CLIENT_URL=http://localhost:5173

# eSewa Configuration (optional - for payment integration)
ESEWA_TEST_MODE=true
ESEWA_ENV=uat
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=replace_with_esewa_secret
ESEWA_FORM_URL_UAT=https://uat.esewa.com.np/epay/main
ESEWA_FORM_URL_PROD=https://esewa.com.np/epay/main
ESEWA_SUCCESS_URL=http://localhost:5000/api/payments/esewa/success
ESEWA_FAILURE_URL=http://localhost:5000/api/payments/esewa/failure
ESEWA_STATUS_URL_UAT=https://uat.esewa.com.np/epay/transaction/status/
ESEWA_STATUS_URL_PROD=https://esewa.com.np/epay/transaction/status/
```

## Client Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE=http://localhost:5000
```

For production, set this to your backend URL.

## Running Locally

### Server
```bash
cd server
npm install
npm run dev  # or npm start for production
```

### Client
```bash
cd client
npm install
npm run dev
```

## Deployment Notes

### Vercel (Frontend)
- Set `VITE_API_BASE` to your backend URL
- Build command: `npm run build`
- Output directory: `dist`

### Render (Backend)
- Set all environment variables in Render dashboard
- Build command: `npm install`
- Start command: `npm start`
- Make sure `MONGO_URI` points to your MongoDB instance (MongoDB Atlas or Render MongoDB)

## Common Issues

1. **JWT_SECRET not set**: The server will warn you but may still start. Authentication will fail without it.
2. **MongoDB connection failed**: Server will exit if it can't connect to MongoDB.
3. **CORS errors**: Make sure `CLIENT_URL` matches your frontend URL.


