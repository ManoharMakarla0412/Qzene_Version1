const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./config/db.config");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const recipeRoutes = require('./routes/recipe.routes');

dotenv.config();

const app = express();
const swaggerDocument = YAML.load(path.join(process.cwd(), "swagger", "swagger.yaml"));
const PORT = process.env.PORT || 5001;

// Updated CORS configuration
const allowedOrigins = [
  'http://localhost:3000',   // React dev server
  'http://localhost:8080',   // Alternative dev port
  'http://localhost:5173',   // Vite dev server
  'https://qzene-dummy.vercel.app',
  // Add your production domain here
];

// Enhanced CORS options
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser({maxAge: 24 * 60 * 60 * 1000}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Pre-flight requests
app.options('*', cors());

// Routes
app.use('/api', recipeRoutes);

// Swagger UI Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  } else if (err.message.includes('CORS')) {
    res.status(403).json({ error: 'CORS error: ' + err.message });
  } else {
    res.status(500).json({ error: err.message });
  }
});

// Start server only after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      // console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

module.exports = app;
