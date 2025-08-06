const redis = require('redis');

// Configuração do cliente Redis
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End server if we cannot connect to Redis
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End retry after a specific timeout
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // Reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
});

// Conectar ao Redis
client.on('connect', () => {
  console.log('✅ Redis conectado com sucesso');
});

client.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
});

// Conectar
client.connect().catch(console.error);

/**
 * Middleware de cache para Express
 */
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Pular cache para requisições não-GET
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      
      if (cached) {
        const data = JSON.parse(cached);
        return res.json(data);
      }
      
      // Interceptar a resposta para cachear
      const originalSend = res.json;
      res.json = function(data) {
        client.setEx(key, duration, JSON.stringify(data));
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Erro no cache:', error);
      next();
    }
  };
};

/**
 * Função para invalidar cache
 */
const invalidateCache = async (pattern) => {
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`Cache invalidado: ${keys.length} chaves removidas`);
    }
  } catch (error) {
    console.error('Erro ao invalidar cache:', error);
  }
};

module.exports = {
  client,
  cacheMiddleware,
  invalidateCache
}; 