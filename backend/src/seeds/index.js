const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://orion_user:orion_password_2025@localhost:27017/orion_restaurant?authSource=orion_restaurant', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado para seeding');
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Limpar usuários existentes
    await User.deleteMany({});

    const users = [
      {
        name: 'Administrador',
        email: 'admin@orion.com',
        password: '123456',
        role: 'admin'
      },
      {
        name: 'Gerente Silva',
        email: 'gerente@orion.com', 
        password: '123456',
        role: 'manager'
      },
      {
        name: 'Usuário Teste',
        email: 'user@orion.com',
        password: '123456',
        role: 'user'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Usuários criados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error);
  }
};

const seedSuppliers = async () => {
  try {
    // Limpar fornecedores existentes
    await Supplier.deleteMany({});

    const suppliers = [
      {
        name: 'Hortifruti Silva',
        companyName: 'Silva Comércio de Alimentos Ltda',
        cnpj: '12.345.678/0001-90',
        contact: {
          phone: '(11) 99999-1111',
          email: 'contato@hortifrutisilva.com.br',
          whatsapp: '(11) 99999-1111'
        },
        address: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01000-000'
        },
        categories: ['vegetais', 'frutas'],
        paymentTerms: '30 dias',
        deliveryDays: ['segunda', 'quarta', 'sexta']
      },
      {
        name: 'Distribuidora Grãos & Cia',
        companyName: 'Grãos & Cia Distribuidora Ltda',
        cnpj: '98.765.432/0001-10',
        contact: {
          phone: '(11) 88888-2222',
          email: 'vendas@graosecia.com.br',
          whatsapp: '(11) 88888-2222'
        },
        address: {
          street: 'Avenida dos Grãos',
          number: '456',
          neighborhood: 'Industrial',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '02000-000'
        },
        categories: ['graos', 'temperos'],
        paymentTerms: '15 dias',
        deliveryDays: ['terça', 'quinta']
      },
      {
        name: 'Açougue Central',
        companyName: 'Central Carnes e Frios ME',
        contact: {
          phone: '(11) 77777-3333',
          email: 'pedidos@acouguecentral.com.br',
          whatsapp: '(11) 77777-3333'
        },
        address: {
          street: 'Rua da Carne',
          number: '789',
          neighborhood: 'Mercado',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '03000-000'
        },
        categories: ['carnes'],
        paymentTerms: 'à vista',
        deliveryDays: ['segunda', 'terça', 'quarta', 'quinta', 'sexta']
      },
      {
        name: 'Laticínios Bom Leite',
        companyName: 'Bom Leite Produtos Lácteos Ltda',
        cnpj: '11.222.333/0001-44',
        contact: {
          phone: '(11) 66666-4444',
          email: 'vendas@bomleite.com.br'
        },
        address: {
          street: 'Estrada do Leite',
          number: '100',
          neighborhood: 'Rural',
          city: 'Campinas',
          state: 'SP',
          zipCode: '13000-000'
        },
        categories: ['laticinios'],
        paymentTerms: '7 dias',
        deliveryDays: ['segunda', 'quarta', 'sexta']
      }
    ];

    const createdSuppliers = await Supplier.insertMany(suppliers);
    console.log('✅ Fornecedores criados com sucesso');
    return createdSuppliers;
  } catch (error) {
    console.error('❌ Erro ao criar fornecedores:', error);
    return [];
  }
};

const seedProducts = async (suppliers) => {
  try {
    // Limpar produtos existentes
    await Product.deleteMany({});

    const products = [
      // Vegetais e Frutas - Hortifruti Silva
      {
        name: 'Tomate',
        description: 'Tomate maduro tipo caqui',
        category: 'vegetais',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Hortifruti Silva')._id,
        price: 8.50,
        cost: 6.00,
        minStock: 20,
        maxStock: 100,
        currentStock: 45,
        expirationDays: 7
      },
      {
        name: 'Cebola',
        description: 'Cebola branca tamanho médio',
        category: 'vegetais',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Hortifruti Silva')._id,
        price: 3.50,
        cost: 2.50,
        minStock: 15,
        maxStock: 80,
        currentStock: 8,
        expirationDays: 30
      },
      {
        name: 'Banana Prata',
        description: 'Banana prata madura',
        category: 'frutas',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Hortifruti Silva')._id,
        price: 5.90,
        cost: 4.20,
        minStock: 25,
        maxStock: 60,
        currentStock: 35,
        expirationDays: 5
      },
      
      // Grãos - Distribuidora Grãos & Cia
      {
        name: 'Arroz Branco',
        description: 'Arroz tipo 1 longo fino',
        category: 'graos',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Distribuidora Grãos & Cia')._id,
        price: 4.20,
        cost: 3.10,
        minStock: 50,
        maxStock: 200,
        currentStock: 12,
        expirationDays: 365
      },
      {
        name: 'Feijão Carioca',
        description: 'Feijão carioca tipo 1',
        category: 'graos',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Distribuidora Grãos & Cia')._id,
        price: 7.80,
        cost: 5.90,
        minStock: 30,
        maxStock: 150,
        currentStock: 25,
        expirationDays: 720
      },
      {
        name: 'Sal Refinado',
        description: 'Sal refinado iodado',
        category: 'temperos',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Distribuidora Grãos & Cia')._id,
        price: 2.10,
        cost: 1.50,
        minStock: 10,
        maxStock: 50,
        currentStock: 18,
        expirationDays: 1095
      },
      
      // Carnes - Açougue Central
      {
        name: 'Contrafilé Bovino',
        description: 'Contrafilé bovino limpo',
        category: 'carnes',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Açougue Central')._id,
        price: 38.90,
        cost: 28.50,
        minStock: 10,
        maxStock: 50,
        currentStock: 15,
        expirationDays: 3
      },
      {
        name: 'Frango Inteiro',
        description: 'Frango inteiro resfriado',
        category: 'carnes',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Açougue Central')._id,
        price: 12.80,
        cost: 9.50,
        minStock: 20,
        maxStock: 80,
        currentStock: 22,
        expirationDays: 5
      },
      
      // Laticínios - Laticínios Bom Leite
      {
        name: 'Leite Integral',
        description: 'Leite integral UHT',
        category: 'laticinios',
        unit: 'L',
        supplier: suppliers.find(s => s.name === 'Laticínios Bom Leite')._id,
        price: 4.50,
        cost: 3.20,
        minStock: 30,
        maxStock: 100,
        currentStock: 45,
        expirationDays: 120
      },
      {
        name: 'Queijo Mussarela',
        description: 'Queijo mussarela fatiado',
        category: 'laticinios',
        unit: 'kg',
        supplier: suppliers.find(s => s.name === 'Laticínios Bom Leite')._id,
        price: 24.90,
        cost: 18.50,
        minStock: 5,
        maxStock: 25,
        currentStock: 8,
        expirationDays: 30
      }
    ];

    await Product.insertMany(products);
    console.log('✅ Produtos criados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar produtos:', error);
  }
};

const seedDatabase = async () => {
  console.log('🌱 Iniciando seeding do banco de dados...');
  
  await connectDB();
  
  await seedUsers();
  const suppliers = await seedSuppliers();
  await seedProducts(suppliers);
  
  console.log('✅ Seeding concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log('👤 Usuários: admin@orion.com, gerente@orion.com, user@orion.com');
  console.log('🏪 Fornecedores: 4 fornecedores');
  console.log('📦 Produtos: 11 produtos com estoque');
  console.log('🔑 Senha padrão: 123456');
  
  process.exit(0);
};

// Executar seeding se for chamado diretamente
if (require.main === module) {
  seedDatabase().catch((error) => {
    console.error('❌ Erro no seeding:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase }; 