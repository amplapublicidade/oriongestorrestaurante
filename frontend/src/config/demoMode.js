// Modo de demonstração - funciona sem backend
export const DEMO_MODE = process.env.NODE_ENV === 'production' && 
  window.location.hostname !== 'localhost';

export const DEMO_USER = {
  id: 'demo-user-123',
  name: 'Usuário Demo',
  email: 'demo@orion.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const DEMO_TOKEN = 'demo-token-123';

// Dados de demonstração
export const DEMO_DATA = {
  products: [
    {
      id: 'prod-1',
      name: 'Hambúrguer Clássico',
      description: 'Hambúrguer com queijo, alface e tomate',
      price: 25.90,
      category: 'Lanches',
      stock: 50,
      supplier: 'Fornecedor A',
      barcode: '1234567890123',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'prod-2',
      name: 'Batata Frita',
      description: 'Porção de batatas fritas crocantes',
      price: 12.50,
      category: 'Acompanhamentos',
      stock: 30,
      supplier: 'Fornecedor B',
      barcode: '1234567890124',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'prod-3',
      name: 'Refrigerante Cola',
      description: 'Refrigerante cola 350ml',
      price: 6.90,
      category: 'Bebidas',
      stock: 100,
      supplier: 'Fornecedor C',
      barcode: '1234567890125',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  suppliers: [
    {
      id: 'supp-1',
      name: 'Fornecedor A',
      email: 'contato@fornecedora.com',
      phone: '(11) 99999-9999',
      address: 'Rua A, 123 - São Paulo, SP',
      category: 'Carnes',
      rating: 4.5,
      cnpj: '12.345.678/0001-90',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'supp-2',
      name: 'Fornecedor B',
      email: 'contato@fornecedorb.com',
      phone: '(11) 88888-8888',
      address: 'Rua B, 456 - São Paulo, SP',
      category: 'Hortifruti',
      rating: 4.2,
      cnpj: '98.765.432/0001-10',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  orders: [
    {
      id: 'order-1',
      orderNumber: 'ORD-2024001',
      customerName: 'João Silva',
      customerPhone: '(11) 77777-7777',
      items: [
        {
          productId: 'prod-1',
          productName: 'Hambúrguer Clássico',
          quantity: 2,
          price: 25.90,
          total: 51.80
        },
        {
          productId: 'prod-2',
          productName: 'Batata Frita',
          quantity: 1,
          price: 12.50,
          total: 12.50
        }
      ],
      total: 64.30,
      status: 'completed',
      createdAt: new Date(),
      notes: 'Sem cebola'
    }
  ],
  inventoryMovements: [
    {
      id: 'mov-1',
      productId: 'prod-1',
      productName: 'Hambúrguer Clássico',
      type: 'in',
      quantity: 50,
      previousStock: 0,
      newStock: 50,
      reason: 'Entrada inicial',
      createdAt: new Date()
    },
    {
      id: 'mov-2',
      productId: 'prod-1',
      productName: 'Hambúrguer Clássico',
      type: 'out',
      quantity: 2,
      previousStock: 50,
      newStock: 48,
      reason: 'Venda',
      createdAt: new Date()
    }
  ]
};

// Simular delay de API
export const simulateApiDelay = (ms = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Simular erro aleatório (10% de chance)
export const simulateRandomError = () => 
  Math.random() < 0.1; 