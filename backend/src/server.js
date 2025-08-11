const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Importar configurações
const specs = require('./config/swagger');
const { requestLogger, errorLogger } = require('./config/logger');
const { cacheMiddleware } = require('./config/redis-fallback');
const { sanitizeData } = require('./middleware/validation');

// Importar configuração do Firebase
const { db } = require('./config/firebase');

// Importar rotas
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const suppliersRoutes = require('./routes/suppliers');
const ordersRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');
const branchesRoutes = require('./routes/branches');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.'
  }
});

// Middleware de segurança e performance
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(morgan('combined'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:8000',
    'https://orion-gestor.netlify.app',
    'https://orion-gestor-restaurante.netlify.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware customizado
app.use(sanitizeData);
app.use(requestLogger);

// Cache para rotas GET
app.use('/api/products', cacheMiddleware(300)); // 5 min cache
app.use('/api/suppliers', cacheMiddleware(300));
app.use('/api/inventory', cacheMiddleware(60)); // 1 min cache

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Orion Backend API - Bem-vindo!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
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
  res.status(200).json({
    success: true,
    message: 'Orion Backend API está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Orion API Documentation'
}));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/inventory', inventoryRoutes);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware de tratamento de erros
app.use(errorLogger);
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`✅ Firebase conectado com sucesso`);
});

module.exports = app; 