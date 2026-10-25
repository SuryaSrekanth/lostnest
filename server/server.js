const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Health check routes
app.get('/', (req, res) => {
    res.send('Welcome to the LostNest Corporate API! ☸');
});

// Base API route
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        message: 'LostNest Workplace API Gateway',
        availableEndpoints: [
            'GET  /api/items',
            'POST /api/items',
            'POST /api/auth/register',
            'POST /api/auth/login',
        ],
    });
});

// Auth Routes
app.use('/api/auth', require('./routes/auth'));

// Items Routes
app.use('/api/items', require('./routes/items'));

// 3. Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log(' ✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });
