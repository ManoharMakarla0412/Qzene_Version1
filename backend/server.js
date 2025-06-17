const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./config/db.config");
const authRoutes = require("./routes/admin/auth.routes");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require('./swagger/swagger.config');
const recipeRoutes = require('./routes/user/recipe.routes');
const adminReciepRoutes = require('./routes/admin/recipe.routes')
const adminDashboardRoutes = require('./routes/admin/dashboard.routes')
const adminChefRoutes = require('./routes/admin/chef.routes')
const adminEarningRoutes = require('./routes/admin/earnings.routes')
const adminEnumRoutes = require('./routes/admin/enum.routes')
const adminIngredientsRoutes = require('./routes/admin/ingredients.routes')
const adminOrderRoutes = require('./routes/admin/order.routes')
const adminPaymentRoutes = require('./routes/admin/payment.routes')

dotenv.config();

const app = express();

// Environment-based configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';

// Port configuration
const PORT = process.env.PORT || (isDevelopment && 5001);

// CORS configuration based on environment
const corsOptions = {
  origin: isDevelopment 
    ? ['http://localhost:8080'] // Development origins
    : ['https://qzene.manoharmakarla.com'], // Production origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser({ maxAge: 24 * 60 * 60 * 1000 }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Documentation (only in development)
if (isDevelopment) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Routes
app.use("/api/auth", authRoutes);
app.use('/api', recipeRoutes);
app.use('/api/v1/admin/dashboard', adminDashboardRoutes);
app.use('/api/v1/admin/recipes', adminReciepRoutes);
app.use('/api/v1/admin/ingredients', adminIngredientsRoutes);
app.use('/api/v1/admin/orders', adminOrderRoutes);
app.use('/api/v1/admin/payments', adminPaymentRoutes);
app.use('/api/v1/admin/earnings', adminEarningRoutes);
app.use('/api/v1/admin/chefs', adminChefRoutes);
app.use('/api/v1/admin/enums', adminEnumRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Handle specific error types
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Invalid token',
      message: isDevelopment ? err.message : 'Authentication failed'
    });
  }
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({ 
      error: 'CORS error',
      message: isDevelopment ? err.message : 'Cross-origin request blocked'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: isDevelopment ? err.message : 'Invalid resource ID'
    });
  }

  // Generic error response
  return res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Database connection and server startup
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode`);
      console.log(`🌐 Server URL: ${isDevelopment ? `http://localhost:${PORT}` : 'https://osaw.in/v1'}`);
      
      if (isDevelopment) {
        console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
        console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
      } else {
        console.log(`🔍 Health Check: https://osaw.in/v1/health`);
      }
      
      console.log(`🎯 CORS Origins: ${corsOptions.origin.join(', ')}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('🔌 Database connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('🔌 Database connection closed');
    process.exit(0);
  });
});

module.exports = app;