require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectRedis } = require('./config/redis');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ======================
// Routes
// ======================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Coffee Shop API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// ======================
// Error handling
// ======================
app.use(notFound);
app.use(errorHandler);

// ======================
// Start server
// ======================
async function startServer() {
  try {
    await connectRedis();
    console.log('Redis connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();