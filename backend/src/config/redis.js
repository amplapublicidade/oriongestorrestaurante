const redis = require('redis');

// Configuração do cliente Redis
const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Máximo de tentativas de reconexão Redis excedido');
        return false;
      }
      return Math.min(retries * 100, 3000);
    }
  }
};

// Se REDIS_URL estiver definido, usar URL
if (process.env.REDIS_URL && process.env.REDIS_URL !== 'NONE') {
  redisConfig.url = process.env.REDIS_URL;
}

const client = redis.createClient(redisConfig);

// Conectar ao Redis
client.on('connect', () => {
  console.log('✅ Redis conectado com sucesso');
});

client.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
});

client.on('ready', () => {
  console.log('✅ Redis pronto para uso');
});

client.on('end', () => {
  console.log('🔌 Conexão Redis encerrada');
});

// Conectar com tratamento de erro
const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('❌ Falha ao conectar ao Redis:', error.message);
    console.log('⚠️  Continuando sem Redis (cache desabilitado)');
  }
};

connectRedis();

/**
 * Middleware de cache para Express
 */
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Pular cache para requisições não-GET
    if (req.method !== 'GET') {
      return next();
    }

    // Se Redis não estiver conectado, pular cache
    if (!client.isReady) {
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
        if (client.isReady) {
          client.setEx(key, duration, JSON.stringify(data)).catch(console.error);
        }
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
    if (!client.isReady) {
      console.log('⚠️  Redis não disponível, cache não invalidado');
      return;
    }
    
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