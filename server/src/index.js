require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Authentication will fail. Please set it in your .env file.');
}

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      /\.vercel\.app$/,  // Allow all Vercel preview deployments
    ].filter(Boolean);
    
    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For eSewa form data

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HamroShop API is running' });
});

// Catch-all route for undefined API endpoints (for debugging)
app.use('/api/*', (req, res) => {
  console.warn(`404 - API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'API endpoint not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products (admin)',
      'PUT /api/products/:id (admin)',
      'DELETE /api/products/:id (admin)',
      'POST /api/orders',
      'GET /api/orders',
      'GET /api/orders/:id',
      'POST /api/payments/esewa/initiate',
      'POST /api/payments/esewa/test/complete',
      'POST /api/payments/esewa/success',
      'POST /api/payments/esewa/failure'
    ]
  });
});

// Mongo connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hamroshop';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server only after MongoDB connection is established
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
    
    // Handle server errors (e.g., port already in use)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use.`);
        console.error(`   Another process is using this port.`);
        console.error(`   Solutions:`);
        console.error(`   1. Kill the process using port ${PORT}`);
        console.error(`   2. Change PORT in your .env file`);
        console.error(`   3. On Windows, run: netstat -ano | findstr :${PORT} then taskkill /PID <PID> /F\n`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('Server will not start without database connection.');
    process.exit(1);
  });
