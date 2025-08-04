const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const Supplier = require('../models/Supplier');

// Listar todos os fornecedores
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive, limit } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (limit) filters.limit = parseInt(limit);

    const suppliers = filters.category || filters.isActive !== undefined 
      ? await Supplier.findWithFilters(filters)
      : await Supplier.findAll(parseInt(limit) || 100);

    res.json({
      success: true,
      data: { suppliers }
    });

  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar fornecedor por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      data: { supplier }
    });

  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Criar novo fornecedor
router.post('/', auth, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('phone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (11) 99999-9999'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
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

    const supplier = await Supplier.createSupplier(req.body);

    res.status(201).json({
      success: true,
      message: 'Fornecedor criado com sucesso',
      data: { supplier }
    });

  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao criar fornecedor'
    });
  }
});

// Atualizar fornecedor
router.put('/:id', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('phone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (11) 99999-9999'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
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

    const supplier = await Supplier.update(req.params.id, req.body);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Fornecedor atualizado com sucesso',
      data: { supplier }
    });

  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar fornecedor'
    });
  }
});

// Deletar fornecedor
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Supplier.delete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Fornecedor deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Atualizar rating do fornecedor
router.patch('/:id/rating', auth, [
  body('rating')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating deve ser um número entre 0 e 5')
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

    const supplier = await Supplier.updateRating(req.params.id, req.body.rating);

    res.json({
      success: true,
      message: 'Rating atualizado com sucesso',
      data: { supplier }
    });

  } catch (error) {
    console.error('Erro ao atualizar rating:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar rating'
    });
  }
});

// Buscar fornecedores por categoria
router.get('/category/:category', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.findByCategory(req.params.category);

    res.json({
      success: true,
      data: { suppliers }
    });

  } catch (error) {
    console.error('Erro ao buscar fornecedores por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar fornecedor por CNPJ
router.get('/cnpj/:cnpj', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByCNPJ(req.params.cnpj);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      data: { supplier }
    });

  } catch (error) {
    console.error('Erro ao buscar fornecedor por CNPJ:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 