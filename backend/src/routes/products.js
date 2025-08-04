const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Product = require('../models/Product');

// Listar todos os produtos
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive, limit } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (limit) filters.limit = parseInt(limit);

    const products = filters.category || filters.isActive !== undefined 
      ? await Product.findWithFilters(filters)
      : await Product.findAll(parseInt(limit) || 100);

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
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

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

    const product = await Product.createProduct(req.body);

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

    const product = await Product.update(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

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
    const result = await Product.delete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

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

    const product = await Product.updateStock(req.params.id, req.body.stock);

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
    const products = await Product.findByCategory(req.params.category);

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
    const products = await Product.findLowStock();

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
    const product = await Product.findByBarcode(req.params.barcode);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

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