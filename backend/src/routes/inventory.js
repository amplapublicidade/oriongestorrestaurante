const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// Middleware de validação
const validateInventoryMovement = [
  body('productId').isMongoId().withMessage('ID do produto inválido'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
  body('type').isIn(['in', 'out']).withMessage('Tipo deve ser "in" ou "out"'),
  body('reason').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Motivo deve ter entre 3 e 200 caracteres'),
  body('supplierId').optional().isMongoId().withMessage('ID do fornecedor inválido')
];

// GET /api/inventory - Listar movimentações de estoque
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, productId = '', type = '', startDate = '', endDate = '' } = req.query;
    
    const query = {};
    if (productId) {
      query.productId = productId;
    }
    if (type) {
      query.type = type;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Por enquanto, retornar dados mockados
    const mockMovements = [
      {
        _id: '1',
        productId: '1',
        productName: 'Hambúrguer',
        type: 'in',
        quantity: 50,
        reason: 'Compra de fornecedor',
        supplierId: '1',
        supplierName: 'Fornecedor ABC',
        createdAt: new Date(),
        createdBy: req.user.id
      },
      {
        _id: '2',
        productId: '1',
        productName: 'Hambúrguer',
        type: 'out',
        quantity: 10,
        reason: 'Venda',
        createdAt: new Date(),
        createdBy: req.user.id
      }
    ];

    res.json({
      success: true,
      data: {
        movements: mockMovements,
        totalPages: 1,
        currentPage: parseInt(page),
        total: mockMovements.length
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
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (lowStock === 'true') {
      query.stock = { $lte: 10 }; // Produtos com estoque baixo
    }

    const products = await Product.find(query)
      .sort({ stock: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        total: count
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

    // Buscar produto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Atualizar estoque
    if (type === 'in') {
      product.stock += quantity;
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Estoque insuficiente'
        });
      }
      product.stock -= quantity;
    }

    await product.save();

    // Aqui você salvaria a movimentação no banco
    const movement = {
      productId,
      productName: product.name,
      type,
      quantity,
      reason,
      supplierId,
      createdAt: new Date(),
      createdBy: req.user.id
    };

    res.status(201).json({
      success: true,
      message: 'Movimentação registrada com sucesso',
      data: { movement, newStock: product.stock }
    });
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
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

    // Por enquanto, retornar dados mockados
    const reports = {
      totalProducts: 25,
      lowStockProducts: 3,
      outOfStockProducts: 1,
      totalValue: 15000.00,
      movements: {
        in: 150,
        out: 120
      },
      topProducts: [
        { name: 'Hambúrguer', quantity: 50 },
        { name: 'Batata Frita', quantity: 45 },
        { name: 'Refrigerante', quantity: 40 }
      ]
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

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const oldStock = product.stock;
    product.stock = newStock;
    await product.save();

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