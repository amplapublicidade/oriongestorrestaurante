const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orion Gestor de Restaurante API',
      version: '1.0.0',
      description: 'API completa para gestão de restaurantes com controle de estoque, fornecedores, produtos e relatórios.',
      contact: {
        name: 'Orion Team',
        email: 'contato@orion.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.orion.com/api',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'manager', 'user'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            minStock: { type: 'integer' },
            category: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Supplier: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            companyName: { type: 'string' },
            cnpj: { type: 'string' },
            contact: {
              type: 'object',
              properties: {
                phone: { type: 'string' },
                email: { type: 'string', format: 'email' }
              }
            },
            rating: { type: 'number', minimum: 0, maximum: 5 },
            isActive: { type: 'boolean' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderNumber: { type: 'string' },
            customerName: { type: 'string' },
            customerPhone: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  productName: { type: 'string' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                  total: { type: 'number' }
                }
              }
            },
            total: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'delivered', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 