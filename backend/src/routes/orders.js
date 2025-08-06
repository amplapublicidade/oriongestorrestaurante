const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');

// Middleware de validação para Firebase (IDs são strings)
const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Pedido deve ter pelo menos um item'),
  body('items.*.productId').isString().notEmpty().withMessage('ID do produto inválido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
  body('customerName').optional().trim().isLength({ min: 2 }).withMessage('Nome do cliente deve ter pelo menos 2 caracteres'),
  body('customerPhone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Observações muito longas')
];

// GET /api/orders - Listar pedidos
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    
    let query = db.collection('orders');
    
    // Aplicar filtros
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    query = query.orderBy('createdAt', 'desc');
    
    // Paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const snapshot = await query.get();
    const orders = [];
    
    snapshot.forEach(doc => {
      const orderData = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      };
      
      // Aplicar filtro de busca na memória se necessário
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          orderData.customerName?.toLowerCase().includes(searchLower) ||
          orderData.customerPhone?.includes(search) ||
          orderData.orderNumber?.toLowerCase().includes(searchLower);
        
        if (matchesSearch) {
          orders.push(orderData);
        }
      } else {
        orders.push(orderData);
      }
    });

    // Se estamos fazendo busca, precisamos recalcular a paginação
    if (search) {
      // Buscar todos os pedidos para aplicar o filtro de busca
      const allSnapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
      const allOrders = [];
      
      allSnapshot.forEach(doc => {
        const orderData = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        };
        
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          orderData.customerName?.toLowerCase().includes(searchLower) ||
          orderData.customerPhone?.includes(search) ||
          orderData.orderNumber?.toLowerCase().includes(searchLower);
        
        if (matchesSearch) {
          allOrders.push(orderData);
        }
      });
      
      // Aplicar paginação
      const start = (parseInt(page) - 1) * parseInt(limit);
      const end = start + parseInt(limit);
      const paginatedOrders = allOrders.slice(start, end);
      
      res.json({
        success: true,
        data: {
          orders: paginatedOrders,
          totalPages: Math.ceil(allOrders.length / parseInt(limit)),
          currentPage: parseInt(page),
          total: allOrders.length
        }
      });
    } else {
      // Contar total para paginação normal
      const totalSnapshot = await db.collection('orders').get();
      const total = totalSnapshot.size;

      res.json({
        success: true,
        data: {
          orders,
          totalPages: Math.ceil(total / parseInt(limit)),
          currentPage: parseInt(page),
          total
        }
      });
    }
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
    const orderDoc = await db.collection('orders').doc(req.params.id).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const order = {
      id: orderDoc.id,
      ...orderDoc.data(),
      createdAt: orderDoc.data().createdAt?.toDate?.() || orderDoc.data().createdAt
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

// POST /api/orders - Criar pedido com transação
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
    const orderRef = db.collection('orders').doc(); // Gera a referência do pedido antecipadamente

    // Executar a criação do pedido e a atualização de estoque como uma transação
    const createdOrder = await db.runTransaction(async (transaction) => {
      let total = 0;
      const validatedItems = [];
      const productUpdates = [];

      // 1. Ler todos os produtos e verificar estoque
      for (const item of items) {
        const productRef = db.collection('products').doc(item.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists) {
          throw new Error(`Produto com ID ${item.productId} não encontrado.`);
        }

        const productData = productDoc.data();
        if (productData.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${productData.name}.`);
        }

        const newStock = productData.stock - item.quantity;
        productUpdates.push({ ref: productRef, stock: newStock });

        const itemTotal = productData.price * item.quantity;
        validatedItems.push({
          productId: item.productId,
          productName: productData.name,
          quantity: item.quantity,
          price: productData.price,
          total: itemTotal
        });
        total += itemTotal;
      }

      // 2. Atualizar o estoque de todos os produtos
      for (const update of productUpdates) {
        transaction.update(update.ref, { 
          stock: update.stock, 
          updatedAt: new Date() 
        });
      }

      // 3. Criar o registro do pedido
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        customerName,
        customerPhone,
        items: validatedItems,
        total,
        status: 'pending',
        createdAt: new Date(),
        createdBy: req.user.userId,
        notes: notes || ''
      };
      transaction.set(orderRef, orderData);

      return { id: orderRef.id, ...orderData };
    });

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: { order: createdOrder }
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
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

    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const { items, customerName, customerPhone, notes, status } = req.body;

    // Se items foram fornecidos, recalcular total
    let updateData = {
      customerName,
      customerPhone,
      notes: notes || '',
      updatedAt: new Date()
    };

    if (items) {
      // Calcular total e validar produtos
      let total = 0;
      const validatedItems = [];
      
      for (const item of items) {
        const productDoc = await db.collection('products').doc(item.productId).get();
        
        if (!productDoc.exists) {
          return res.status(400).json({
            success: false,
            message: `Produto com ID ${item.productId} não encontrado`
          });
        }
        
        const productData = productDoc.data();
        const itemTotal = productData.price * item.quantity;
        
        validatedItems.push({
          productId: item.productId,
          productName: productData.name,
          quantity: item.quantity,
          price: productData.price,
          total: itemTotal
        });
        
        total += itemTotal;
      }
      
      updateData.items = validatedItems;
      updateData.total = total;
    }

    if (status) {
      updateData.status = status;
    }

    await orderRef.update(updateData);
    
    const updatedDoc = await orderRef.get();
    const order = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data().createdAt?.toDate?.() || updatedDoc.data().createdAt
    };

    res.json({
      success: true,
      message: 'Pedido atualizado com sucesso',
      data: { order }
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
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    await orderRef.delete();

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

    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    await orderRef.update({
      status,
      updatedAt: new Date()
    });

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