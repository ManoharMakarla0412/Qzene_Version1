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
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ['https://qzene.manoharmakarla.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser({maxAge: 24 * 60 * 60 * 1000}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.options('*', cors());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/auth", authRoutes);
app.use('/api', recipeRoutes);
app.use('/api/v1/admin/dashboard', adminDashboardRoutes); // FIX: Corrected typo 'ap' to 'api'
app.use('/api/v1/admin/recipes', adminReciepRoutes);
app.use('/api/v1/admin/ingredients', adminIngredientsRoutes);
app.use('/api/v1/admin/orders', adminOrderRoutes);
app.use('/api/v1/admin/payments', adminPaymentRoutes);
app.use('/api/v1/admin/earnings', adminEarningRoutes);
app.use('/api/v1/admin/chefs', adminChefRoutes);
app.use('/api/v1/admin/enums', adminEnumRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the full error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  } else if (err.message.includes('CORS')) {
    return res.status(403).json({ error: 'CORS error: ' + err.message });
  }
  return res.status(500).json({ error: err.message || 'An unexpected error occurred.' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

module.exports = app;