// Script de inicialização do MongoDB
// Este script é executado automaticamente quando o container MongoDB é iniciado pela primeira vez

// Conectar ao banco admin
db = db.getSiblingDB('admin');

// Criar usuário para o banco orion_restaurant
db.createUser({
  user: 'orion_user',
  pwd: 'orion_password_2025',
  roles: [
    {
      role: 'readWrite',
      db: 'orion_restaurant'
    }
  ]
});

// Conectar ao banco orion_restaurant
db = db.getSiblingDB('orion_restaurant');

// Criar coleções iniciais
db.createCollection('users');
db.createCollection('products');
db.createCollection('suppliers');
db.createCollection('orders');
db.createCollection('inventory_movements');

// Criar índices para melhor performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.products.createIndex({ "name": 1 });
db.products.createIndex({ "category": 1 });
db.suppliers.createIndex({ "email": 1 }, { unique: true });
db.suppliers.createIndex({ "name": 1 });
db.orders.createIndex({ "orderNumber": 1 }, { unique: true });
db.orders.createIndex({ "createdAt": -1 });
db.inventory_movements.createIndex({ "productId": 1 });
db.inventory_movements.createIndex({ "createdAt": -1 });

print('✅ Banco de dados Orion inicializado com sucesso!');
print('📊 Coleções criadas: users, products, suppliers, orders, inventory_movements');
print('🔍 Índices criados para otimização de consultas'); 