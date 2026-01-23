const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const bountyRoutes = require('./routes/bounties');
const recipeRoutes = require('./routes/recipes');
const restaurantRoutes = require('./routes/restaurants');

// Initialize express app
const app = express();

// Middleware
app.use(cors());                         // Allows frontend to talk to backend
app.use(express.json());                 // Parses JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/bounties', bountyRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Test route - visit http://localhost:5000/ to check if server is running
app.get('/', (req, res) => {
  res.json({ message: 'From the Source API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
