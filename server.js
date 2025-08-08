const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:8000',
    'https://orion-gestor.netlify.app',
    'https://orion-gestor-restaurante.netlify.app',
    'https://wondrous-bavarois-f4498e.netlify.app'
  ],
  credentials: true
}));

app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Orion Backend API - Bem-vindo!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      suppliers: '/api/suppliers',
      orders: '/api/orders',
      inventory: '/api/inventory'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Orion Backend API está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota de teste da API
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

module.exports = app; 