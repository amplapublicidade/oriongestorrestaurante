const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');

// Middleware de validação para Firebase (IDs são strings, não ObjectIds)
const validateInventoryMovement = [
  body('productId').isString().notEmpty().withMessage('ID do produto inválido'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
  body('type').isIn(['in', 'out', 'adjust']).withMessage('Tipo deve ser "in", "out" ou "adjust"'),
  body('reason').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Motivo deve ter entre 3 e 200 caracteres'),
  body('supplierId').optional().isString().notEmpty().withMessage('ID do fornecedor inválido')
];

// GET /api/inventory - Listar movimentações de estoque
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, productId = '', type = '', startDate = '', endDate = '' } = req.query;
    
    let query = db.collection('inventoryMovements');
    
    // Aplicar filtros
    if (productId) {
      query = query.where('productId', '==', productId);
    }
    if (type) {
      query = query.where('type', '==', type);
    }
    if (startDate || endDate) {
      if (startDate) {
        query = query.where('createdAt', '>=', new Date(startDate));
      }
      if (endDate) {
        query = query.where('createdAt', '<=', new Date(endDate));
      }
    }

    // Ordenar por data de criação (mais recente primeiro)
    query = query.orderBy('createdAt', 'desc');

    // Paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const snapshot = await query.get();
    const movements = [];
    
    snapshot.forEach(doc => {
      movements.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      });
    });

    // Contar total de documentos para paginação
    const totalSnapshot = await db.collection('inventoryMovements').get();
    const total = totalSnapshot.size;

    res.json({
      success: true,
      data: {
        movements,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/inventory/stock - Listar estoque atual
router.get('/stock', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', lowStock = false } = req.query;

    let query = db.collection('products');
    
    // Aplicar filtros
    if (search) {
      // Firestore não suporta $or diretamente, então fazemos duas queries
      const nameQuery = query.where('name', '>=', search).where('name', '<=', search + '\uf8ff');
      const categoryQuery = query.where('category', '>=', search).where('category', '<=', search + '\uf8ff');
      
      const [nameSnapshot, categorySnapshot] = await Promise.all([
        nameQuery.get(),
        categoryQuery.get()
      ]);
      
      // Combinar resultados
      const products = new Map();
      nameSnapshot.forEach(doc => {
        products.set(doc.id, { id: doc.id, ...doc.data() });
      });
      categorySnapshot.forEach(doc => {
        products.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      let productsArray = Array.from(products.values());
      
      // Filtrar estoque baixo se necessário
      if (lowStock === 'true') {
        productsArray = productsArray.filter(p => p.stock <= p.minStock);
      }
      
      // Ordenar por estoque
      productsArray.sort((a, b) => a.stock - b.stock);
      
      // Paginação manual
      const start = (parseInt(page) - 1) * parseInt(limit);
      const end = start + parseInt(limit);
      const paginatedProducts = productsArray.slice(start, end);
      
      res.json({
        success: true,
        data: {
          products: paginatedProducts,
          totalPages: Math.ceil(productsArray.length / parseInt(limit)),
          currentPage: parseInt(page),
          total: productsArray.length
        }
      });
    } else {
      // Query simples sem busca
      if (lowStock === 'true') {
        query = query.where('stock', '<=', 10); // Produtos com estoque baixo
      }
      
      query = query.orderBy('stock', 'asc').orderBy('name', 'asc');
      query = query.limit(parseInt(limit)).offset((parseInt(page) - 1) * parseInt(limit));
      
      const snapshot = await query.get();
      const products = [];
      
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Contar total
      const totalSnapshot = await db.collection('products').get();
      const total = totalSnapshot.size;

      res.json({
        success: true,
        data: {
          products,
          totalPages: Math.ceil(total / parseInt(limit)),
          currentPage: parseInt(page),
          total
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/inventory/movement - Registrar movimentação de estoque
router.post('/movement', [auth, ...validateInventoryMovement], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { productId, quantity, type, reason, supplierId } = req.body;
    const movementQuantity = parseInt(quantity);

    const productRef = db.collection('products').doc(productId);
    const movementRef = db.collection('inventoryMovements').doc();

    // Usar uma transação para garantir a consistência dos dados
    await db.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists) {
        throw new Error('Produto não encontrado');
      }

      const productData = productDoc.data();
      let newStock = productData.stock || 0;

      if (type === 'in') {
        newStock += movementQuantity;
      } else if (type === 'out') {
        if (newStock < movementQuantity) {
          throw new Error('Estoque insuficiente');
        }
        newStock -= movementQuantity;
      } else if (type === 'adjust') {
        newStock = movementQuantity; // Para ajustes, a quantidade é o novo valor
      }

      // 1. Atualiza o estoque do produto
      transaction.update(productRef, { 
        stock: newStock, 
        updatedAt: new Date() 
      });

      // 2. Cria o registro da movimentação
      const movementData = {
        productId,
        productName: productData.name,
        type,
        quantity: type === 'adjust' ? movementQuantity : movementQuantity,
        previousStock: productData.stock || 0,
        newStock,
        reason,
        supplierId: supplierId || null,
        createdAt: new Date(),
        createdBy: req.user.userId
      };
      transaction.set(movementRef, movementData);
    });

    const finalProductState = await productRef.get();

    res.status(201).json({
      success: true,
      message: 'Movimentação registrada com sucesso',
      data: { 
        newStock: finalProductState.data().stock,
        movementId: movementRef.id
      }
    });
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

// GET /api/inventory/reports - Relatórios de estoque
router.get('/reports', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // dias

    // Calcular datas
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Buscar produtos
    const productsSnapshot = await db.collection('products').get();
    const products = [];
    productsSnapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Buscar movimentações do período
    const movementsSnapshot = await db.collection('inventoryMovements')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<=', endDate)
      .get();

    const movements = [];
    movementsSnapshot.forEach(doc => {
      movements.push({ id: doc.id, ...doc.data() });
    });

    // Calcular estatísticas
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

    const movementsIn = movements.filter(m => m.type === 'in').length;
    const movementsOut = movements.filter(m => m.type === 'out').length;

    // Top produtos por quantidade
    const topProducts = products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5)
      .map(p => ({ name: p.name, quantity: p.stock }));

    const reports = {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      movements: {
        in: movementsIn,
        out: movementsOut
      },
      topProducts
    };

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    console.error('Erro ao gerar relatórios:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/inventory/adjust - Ajuste de estoque
router.post('/adjust', auth, async (req, res) => {
  try {
    const { productId, newStock, reason } = req.body;

    if (!productId || newStock === undefined || newStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos'
      });
    }

    const productRef = db.collection('products').doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const productData = productDoc.data();
    const oldStock = productData.stock || 0;

    // Usar transação para garantir consistência
    await db.runTransaction(async (transaction) => {
      // Atualizar produto
      transaction.update(productRef, { 
        stock: newStock, 
        updatedAt: new Date() 
      });

      // Registrar movimentação de ajuste
      const movementRef = db.collection('inventoryMovements').doc();
      const movementData = {
        productId,
        productName: productData.name,
        type: 'adjust',
        quantity: newStock,
        previousStock: oldStock,
        newStock,
        reason: reason || 'Ajuste manual de estoque',
        createdAt: new Date(),
        createdBy: req.user.userId
      };
      transaction.set(movementRef, movementData);
    });

    res.json({
      success: true,
      message: 'Estoque ajustado com sucesso',
      data: {
        productId,
        oldStock,
        newStock,
        reason
      }
    });
  } catch (error) {
    console.error('Erro ao ajustar estoque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 