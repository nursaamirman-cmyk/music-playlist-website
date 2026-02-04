const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// connection to MongoDB
connectDB();

const app = express();

// Middleware to read JSON 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Music API is running...');
});

// Global Error Handling Middleware 
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});



// Connecting routes
app.use('/api/auth', require('./routes/authRoutes'));       // Registration and Login
app.use('/api/users', require('./routes/userRoutes'));      // User profile 
app.use('/api/resource', require('./routes/songRoutes'));   // Songs CRUD operations


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));