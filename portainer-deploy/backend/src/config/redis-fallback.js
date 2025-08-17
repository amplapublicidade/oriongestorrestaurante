const redis = require('redis');

// Configuração do cliente Redis com fallback
let client = null;
let isRedisAvailable = false;

const initializeRedis = async () => {
  try {
    const redisConfig = {
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.log('⚠️  Redis não disponível, usando modo sem cache');
            return false;
          }
          return Math.min(retries * 100, 1000);
        }
      }
    };

    // Se REDIS_URL estiver definido e válido, usar URL
    if (process.env.REDIS_URL && process.env.REDIS_URL !== 'NONE') {
      redisConfig.url = process.env.REDIS_URL;
    }

    client = redis.createClient(redisConfig);

    client.on('connect', () => {
      console.log('✅ Redis conectado com sucesso');
      isRedisAvailable = true;
    });

    client.on('error', (err) => {
      console.error('❌ Erro no Redis:', err.message);
      isRedisAvailable = false;
    });

    client.on('ready', () => {
      console.log('✅ Redis pronto para uso');
      isRedisAvailable = true;
    });

    client.on('end', () => {
      console.log('🔌 Conexão Redis encerrada');
      isRedisAvailable = false;
    });

    await client.connect();
    return true;
  } catch (error) {
    console.error('❌ Falha ao conectar ao Redis:', error.message);
    console.log('⚠️  Continuando sem Redis (cache desabilitado)');
    isRedisAvailable = false;
    return false;
  }
};

/**
 * Middleware de cache para Express
 */
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Pular cache para requisições não-GET
    if (req.method !== 'GET') {
      return next();
    }

    // Se Redis não estiver disponível, pular cache
    if (!isRedisAvailable || !client?.isReady) {
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
        if (isRedisAvailable && client?.isReady) {
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
    if (!isRedisAvailable || !client?.isReady) {
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

// Inicializar Redis
initializeRedis();

module.exports = {
  client: () => client,
  isRedisAvailable: () => isRedisAvailable,
  cacheMiddleware,
  invalidateCache
}; 