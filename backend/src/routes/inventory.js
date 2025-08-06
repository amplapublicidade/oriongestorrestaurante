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
    const { page = 1, limit = 10, search = '', lowStock = 'false', category = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Caminho 1: Busca por texto (requer junção na memória)
    if (search) {
      const nameQuery = db.collection('products').where('name', '>=', search).where('name', '<=', search + '\uf8ff');
      const categoryQuery = db.collection('products').where('category', '>=', search).where('category', '<=', search + '\uf8ff');
      
      const [nameSnapshot, categorySnapshot] = await Promise.all([
        nameQuery.get(),
        categoryQuery.get()
      ]);
      
      const productsMap = new Map();
      nameSnapshot.forEach(doc => productsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      categorySnapshot.forEach(doc => productsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      
      let results = Array.from(productsMap.values());
      
      // Filtrar estoque baixo se necessário
      if (lowStock === 'true') {
        results = results.filter(p => p.stock <= p.minStock);
      }
      
      results.sort((a, b) => a.stock - b.stock);
      
      const paginatedProducts = results.slice(offset, offset + limitNum);
      
      res.json({
        success: true,
        data: {
          products: paginatedProducts,
          totalPages: Math.ceil(results.length / limitNum),
          currentPage: pageNum,
          total: results.length
        }
      });
      return;
    }

    // Caminho 2: Filtro de estoque baixo (requer leitura de todos os docs para filtrar na memória)
    if (lowStock === 'true') {
      let baseQuery = db.collection('products');
      if (category) {
        baseQuery = baseQuery.where('category', '==', category);
      }

      const allSnapshot = await baseQuery.get();
      let allLowStockProducts = [];
      allSnapshot.forEach(doc => {
        const productData = doc.data();
        if (productData.stock <= productData.minStock) {
          allLowStockProducts.push({ id: doc.id, ...productData });
        }
      });
      
      allLowStockProducts.sort((a, b) => a.stock - b.stock);
      
      const paginatedProducts = allLowStockProducts.slice(offset, offset + limitNum);
      
      res.json({
        success: true,
        data: {
          products: paginatedProducts,
          totalPages: Math.ceil(allLowStockProducts.length / limitNum),
          currentPage: pageNum,
          total: allLowStockProducts.length
        }
      });
      return;
    }

    // Caminho 3: Query paginada e eficiente (sem search, sem lowStock)
    let query = db.collection('products');
    if (category) {
      query = query.where('category', '==', category);
    }

    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    const dataQuery = query
      .orderBy('name', 'asc')
      .limit(limitNum)
      .offset(offset);
      
    const snapshot = await dataQuery.get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        total
      }
    });
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

module.exports = router; 