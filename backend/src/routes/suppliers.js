const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
// Supondo que você criará um Model para Supplier, assim como fez para User
const Supplier = require('../models/Supplier'); 

// Listar todos os fornecedores
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive, limit = 100, cnpj } = req.query;

    // A rota apenas delega a busca para o Model
    const suppliers = await Supplier.findWithFilters(req.query);

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
      return res.status(404).json({ success: false, message: 'Fornecedor não encontrado' });
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

    // A lógica de criação, incluindo valores padrão, fica no model
    const supplier = await Supplier.create(req.body);
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

    // A lógica de atualização, incluindo a verificação de existência,
    // fica encapsulada no Model.
    const supplier = await Supplier.update(req.params.id, req.body);

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Fornecedor não encontrado' });
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

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
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

    // A lógica de atualização de um campo específico também vai para o Model
    const supplier = await Supplier.updateRating(req.params.id, req.body.rating);

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Fornecedor não encontrado' });
    }
    
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

module.exports = router; 