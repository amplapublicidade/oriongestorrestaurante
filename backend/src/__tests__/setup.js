// Setup para testes
require('dotenv').config({ path: '.env.test' });

// Mock do Firebase para testes
jest.mock('../config/firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      add: jest.fn(),
      get: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn(),
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            offset: jest.fn(() => ({
              get: jest.fn()
            }))
          }))
        }))
      })),
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          offset: jest.fn(() => ({
            get: jest.fn()
          }))
        }))
      })),
      limit: jest.fn(() => ({
        offset: jest.fn(() => ({
          get: jest.fn()
        }))
      })),
      offset: jest.fn(() => ({
        get: jest.fn()
      }))
    })),
    runTransaction: jest.fn(),
    batch: jest.fn(() => ({
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn()
    }))
  },
  auth: {
    verifyIdToken: jest.fn()
  }
}));

// Configurar variáveis de ambiente para teste
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test'; 