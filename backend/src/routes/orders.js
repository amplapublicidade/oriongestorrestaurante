const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Middleware de validação
const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Pedido deve ter pelo menos um item'),
  body('items.*.productId').isMongoId().withMessage('ID do produto inválido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
  body('customerName').optional().trim().isLength({ min: 2 }).withMessage('Nome do cliente deve ter pelo menos 2 caracteres'),
  body('customerPhone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Observações muito longas')
];

// GET /api/orders - Listar pedidos
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Por enquanto, retornar dados mockados
    const mockOrders = [
      {
        _id: '1',
        orderNumber: 'ORD-001',
        customerName: 'João Silva',
        customerPhone: '(11) 99999-9999',
        items: [
          { productId: '1', productName: 'Hambúrguer', quantity: 2, price: 25.00 }
        ],
        total: 50.00,
        status: 'pending',
        createdAt: new Date(),
        notes: 'Sem cebola'
      }
    ];

    res.json({
      success: true,
      data: {
        orders: mockOrders,
        totalPages: 1,
        currentPage: parseInt(page),
        total: mockOrders.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/orders/:id - Buscar pedido por ID
router.get('/:id', auth, async (req, res) => {
  try {
    // Mock data
    const order = {
      _id: req.params.id,
      orderNumber: 'ORD-001',
      customerName: 'João Silva',
      customerPhone: '(11) 99999-9999',
      items: [
        { productId: '1', productName: 'Hambúrguer', quantity: 2, price: 25.00 }
      ],
      total: 50.00,
      status: 'pending',
      createdAt: new Date(),
      notes: 'Sem cebola'
    };

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/orders - Criar pedido
router.post('/', [auth, ...validateOrder], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { items, customerName, customerPhone, notes } = req.body;

    // Gerar número do pedido
    const orderNumber = `ORD-${Date.now()}`;

    // Calcular total
    let total = 0;
    for (const item of items) {
      // Aqui você buscaria o preço do produto no banco
      total += item.price * item.quantity;
    }

    const order = {
      orderNumber,
      customerName,
      customerPhone,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
      createdBy: req.user.id,
      notes
    };

    // Aqui você salvaria no banco de dados

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: { order }
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/orders/:id - Atualizar pedido
router.put('/:id', [auth, ...validateOrder], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { items, customerName, customerPhone, notes, status } = req.body;

    // Aqui você buscaria e atualizaria o pedido no banco

    res.json({
      success: true,
      message: 'Pedido atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/orders/:id - Deletar pedido
router.delete('/:id', auth, async (req, res) => {
  try {
    // Aqui você deletaria o pedido do banco

    res.json({
      success: true,
      message: 'Pedido deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/orders/:id/status - Atualizar status do pedido
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    // Aqui você atualizaria o status no banco

    res.json({
      success: true,
      message: 'Status atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 