// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const sqlPrepRoutes = require('./routes/sqlPrepRoutes');

const app = express(); // Initialize Express app

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Define API routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/sql-prep', sqlPrepRoutes); // SQL preparation routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
