// server.js - Central API Gateway Entrypoint
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors()); // Permits your frontend domain to talk to this server
app.use(express.json()); // Parses incoming json request payloads
app.use('/api/products', require('./routes/products'));
// Base Health Check Route
app.get('/api/status', (req, res) => {
    res.json({ message: "BuyIt Core API Server Online & Secure" });
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});