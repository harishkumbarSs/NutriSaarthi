/**
 * NutriSaarthi Backend Entry Point
 * ================================
 * This is the main file that starts our Express server.
 * Think of it as the "power button" for our backend.
 */

// Load environment variables FIRST (before anything else)
// This reads our .env file and makes those values available via process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Initialize Express application
// Express is like a toolbox that helps us build web servers easily
const app = express();

// Get port from environment or use 5000 as default
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE SETUP
// ============================================
// Middleware = functions that run BEFORE our route handlers
// Think of them as "security guards" that check/modify requests

// Helmet: Adds security headers to protect against common attacks
// Like wearing a helmet for your server!
app.use(helmet());

// CORS: Allows our frontend (different origin) to talk to backend
// Without this, browsers would block requests from localhost:5173 to localhost:5000
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
}));

// Morgan: Logs every request to console (helpful for debugging)
// 'dev' format shows: METHOD URL STATUS RESPONSE_TIME
app.use(morgan('dev'));

// JSON Parser: Converts incoming JSON data to JavaScript objects
// Without this, req.body would be undefined
app.use(express.json({ limit: '10mb' }));

// URL Encoded Parser: Handles form submissions
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================

// Import route files
const authRoutes = require('./routes/auth.routes');
const mealRoutes = require('./routes/meal.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Health check endpoint - useful for monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NutriSaarthi API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - when no route matches
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler - catches all errors
// Must have 4 parameters for Express to recognize it as error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Then start listening for requests
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🥗 NutriSaarthi API Server                              ║
║                                                           ║
║   Status:      Running                                    ║
║   Port:        ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                               ║
║   MongoDB:     Connected                                  ║
║                                                           ║
║   Health:      http://localhost:${PORT}/api/health            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Call the function to start everything
startServer();

