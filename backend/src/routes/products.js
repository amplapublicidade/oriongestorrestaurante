const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { db } = require('../config/firebase');

// Listar todos os produtos
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive, limit = 100 } = req.query;
    
    let query = db.collection('products');
    
    // Aplicar filtros
    if (category) {
      query = query.where('category', '==', category);
    }
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive === 'true');
    }
    
    // Ordenar por nome
    query = query.orderBy('name', 'asc');
    
    // Limitar resultados
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const products = [];
    
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar produto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const productDoc = await db.collection('products').doc(req.params.id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const product = {
      id: productDoc.id,
      ...productDoc.data()
    };

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Criar novo produto
router.post('/', auth, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro positivo'),
  body('minStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque mínimo deve ser um número inteiro positivo')
], async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      stock: req.body.stock || 0,
      minStock: req.body.minStock || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productRef = await db.collection('products').add(productData);
    const productDoc = await productRef.get();

    const product = {
      id: productDoc.id,
      ...productDoc.data()
    };

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao criar produto'
    });
  }
});

// Atualizar produto
router.put('/:id', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro positivo'),
  body('minStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque mínimo deve ser um número inteiro positivo')
], async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await productRef.update(updateData);
    
    const updatedDoc = await productRef.get();
    const product = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar produto'
    });
  }
});

// Deletar produto
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    await productRef.delete();

    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Atualizar estoque
router.patch('/:id/stock', auth, [
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro positivo')
], async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const updateData = {
      stock: req.body.stock,
      updatedAt: new Date()
    };

    await productRef.update(updateData);
    
    const updatedDoc = await productRef.get();
    const product = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };

    res.json({
      success: true,
      message: 'Estoque atualizado com sucesso',
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar estoque'
    });
  }
});

// Buscar produtos por categoria
router.get('/category/:category', auth, async (req, res) => {
  try {
    const snapshot = await db.collection('products')
      .where('category', '==', req.params.category)
      .where('isActive', '==', true)
      .orderBy('name', 'asc')
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar produtos com estoque baixo
router.get('/low-stock', auth, async (req, res) => {
  try {
    const snapshot = await db.collection('products')
      .where('isActive', '==', true)
      .get();

    const products = [];
    snapshot.forEach(doc => {
      const productData = doc.data();
      // Filtrar produtos com estoque baixo (estoque <= estoque mínimo)
      if (productData.stock <= productData.minStock) {
        products.push({
          id: doc.id,
          ...productData
        });
      }
    });

    // Ordenar por estoque (menor primeiro)
    products.sort((a, b) => a.stock - b.stock);

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos com estoque baixo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar produto por código de barras
router.get('/barcode/:barcode', auth, async (req, res) => {
  try {
    const snapshot = await db.collection('products')
      .where('barcode', '==', req.params.barcode)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const productDoc = snapshot.docs[0];
    const product = {
      id: productDoc.id,
      ...productDoc.data()
    };

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao buscar produto por código de barras:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 