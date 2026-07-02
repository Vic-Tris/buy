// server.js - Central API Gateway Entrypoint
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));

// Base Health Check Route
app.get('/api/status', (req, res) => {
    res.json({ message: 'BuyIt Core API Server Online & Secure' });
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});