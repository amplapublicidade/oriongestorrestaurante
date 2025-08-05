const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { db } = require('../config/firebase');

// Listar todos os fornecedores
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive, limit = 100, cnpj } = req.query;

    let query = db.collection('suppliers');

    // Aplicar filtros
    if (category) {
      query = query.where('category', '==', category);
    }
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive === 'true');
    }
    if (cnpj) {
      query = query.where('cnpj', '==', cnpj);
    }

    query = query.orderBy('name', 'asc').limit(parseInt(limit));

    const snapshot = await query.get();
    const suppliers = [];
    snapshot.forEach(doc => suppliers.push({ id: doc.id, ...doc.data() }));

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
    const supplierDoc = await db.collection('suppliers').doc(req.params.id).get();

    if (!supplierDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    res.json({
      success: true,
      data: { supplier: { id: supplierDoc.id, ...supplierDoc.data() } }
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

    const supplierData = {
      ...req.body,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      rating: req.body.rating || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const supplierRef = await db.collection('suppliers').add(supplierData);
    const newDoc = await supplierRef.get();

    const supplier = { id: newDoc.id, ...newDoc.data() };

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

    const supplierRef = db.collection('suppliers').doc(req.params.id);
    const doc = await supplierRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    const updateData = { ...req.body, updatedAt: new Date() };
    await supplierRef.update(updateData);

    const updatedDoc = await supplierRef.get();
    const supplier = { id: updatedDoc.id, ...updatedDoc.data() };

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
    const supplierRef = db.collection('suppliers').doc(req.params.id);
    const doc = await supplierRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    await supplierRef.delete();

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

    const supplierRef = db.collection('suppliers').doc(req.params.id);
    const doc = await supplierRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    const updateData = { 
      rating: req.body.rating, 
      updatedAt: new Date() 
    };
    await supplierRef.update(updateData);

    const updatedDoc = await supplierRef.get();
    const supplier = { id: updatedDoc.id, ...updatedDoc.data() };

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