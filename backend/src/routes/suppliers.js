const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { db } = require('../config/firebase');

const router = express.Router();

// Rota para listar todos os fornecedores
router.get('/', auth, async (req, res) => {
  try {
    const suppliersSnapshot = await db.collection('suppliers').get();
    const suppliers = [];
    
    suppliersSnapshot.forEach(doc => {
      const supplierData = doc.data();
      suppliers.push({
        id: doc.id,
        name: supplierData.name,
        email: supplierData.email || '',
        phone: supplierData.phone || '',
        address: supplierData.address || '',
        city: supplierData.city || '',
        state: supplierData.state || '',
        zip: supplierData.zip || '',
        code: supplierData.code || '',
        createdAt: supplierData.createdAt,
        updatedAt: supplierData.updatedAt
      });
    });
    
    res.json({
      success: true,
      message: 'Fornecedores carregados com sucesso',
      data: { suppliers }
    });
  } catch (error) {
    console.error('Erro ao carregar fornecedores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao carregar fornecedores'
    });
  }
});

// Rota para buscar fornecedor por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const supplierDoc = await db.collection('suppliers').doc(id).get();
    
    if (!supplierDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }
    
    const supplierData = supplierDoc.data();
    res.json({
      success: true,
      message: 'Fornecedor encontrado',
      data: {
        supplier: {
          id: supplierDoc.id,
          name: supplierData.name,
          email: supplierData.email || '',
          phone: supplierData.phone || '',
          address: supplierData.address || '',
          city: supplierData.city || '',
          state: supplierData.state || '',
          zip: supplierData.zip || '',
          code: supplierData.code || '',
          createdAt: supplierData.createdAt,
          updatedAt: supplierData.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar fornecedor'
    });
  }
});

// Rota para criar novo fornecedor
router.post('/', auth, [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres'),
  body('email').optional({ nullable: true, checkFalsy: false }).custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return require('validator').isEmail(value) ? true : 'E-mail inválido';
  }).withMessage('E-mail inválido'),
  body('phone').optional({ nullable: true, checkFalsy: false }).custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return typeof value === 'string' && value.length >= 8 && value.length <= 20 ? true : 'Telefone deve ter entre 8 e 20 caracteres';
  }).withMessage('Telefone deve ter entre 8 e 20 caracteres'),
  body('address').optional({ nullable: true, checkFalsy: false }).custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return typeof value === 'string' && value.length <= 200 ? true : 'Endereço deve ter no máximo 200 caracteres';
  }).withMessage('Endereço deve ter no máximo 200 caracteres'),
  body('city').optional({ nullable: true, checkFalsy: false }).custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return typeof value === 'string' && value.length <= 100 ? true : 'Cidade deve ter no máximo 100 caracteres';
  }).withMessage('Cidade deve ter no máximo 100 caracteres'),
  body('state').optional({ nullable: true, checkFalsy: false }).custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return typeof value === 'string' && value.length <= 2 ? true : 'Estado deve ter no máximo 2 caracteres';
  }).withMessage('Estado deve ter no máximo 2 caracteres'),
  body('zip').optional({ nullable: true, checkFalsy: false }).custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return typeof value === 'string' && value.length <= 10 ? true : 'CEP deve ter no máximo 10 caracteres';
  }).withMessage('CEP deve ter no máximo 10 caracteres'),
  body('code').optional({ nullable: true, checkFalsy: false }).custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return typeof value === 'string' && value.length <= 50 ? true : 'Código deve ter no máximo 50 caracteres';
  }).withMessage('Código deve ter no máximo 50 caracteres'),
], async (req, res) => {
  console.log('🔍 POST /suppliers - Dados recebidos:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validação falhou:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }

  try {
    const { name, email, phone, address, city, state, zip, code } = req.body;
    console.log('📝 Dados extraídos:', { name, email, phone, address, city, state, zip, code });
    
    // Verificar se já existe um fornecedor com o mesmo nome
    const existingSupplier = await db.collection('suppliers')
      .where('name', '==', name.trim())
      .get();
    
    if (!existingSupplier.empty) {
      console.log('⚠️ Fornecedor já existe:', name.trim());
      return res.status(400).json({
        success: false,
        message: 'Já existe um fornecedor com este nome'
      });
    }
    
    // Verificar se já existe um fornecedor com o mesmo email (se fornecido)
    if (email && email.trim()) {
      const existingEmail = await db.collection('suppliers')
        .where('email', '==', email.trim().toLowerCase())
        .get();
      
      if (!existingEmail.empty) {
        console.log('⚠️ Email já existe:', email.trim().toLowerCase());
        return res.status(400).json({
          success: false,
          message: 'Já existe um fornecedor com este e-mail'
        });
      }
    }
    
    const supplierData = {
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : '',
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      city: city ? city.trim() : '',
      state: state ? state.trim().toUpperCase() : '',
      zip: zip ? zip.trim() : '',
      code: code ? code.trim() : `SUP_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('💾 Dados do fornecedor para salvar:', supplierData);
    
    const supplierRef = await db.collection('suppliers').add(supplierData);
    const supplierDoc = await supplierRef.get();
    
    console.log('✅ Fornecedor criado com sucesso, ID:', supplierRef.id);
    
    res.status(201).json({
      success: true,
      message: 'Fornecedor criado com sucesso',
      data: {
        supplier: {
          id: supplierDoc.id,
          ...supplierData
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar fornecedor'
    });
  }
});

// Rota para atualizar fornecedor
router.put('/:id', auth, [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres'),
  body('email').optional().isEmail().withMessage('E-mail inválido'),
  body('phone').optional().isString().isLength({ min: 8, max: 20 }).withMessage('Telefone deve ter entre 8 e 20 caracteres'),
  body('address').optional().isString().isLength({ max: 200 }).withMessage('Endereço deve ter no máximo 200 caracteres'),
  body('city').optional().isString().isLength({ max: 100 }).withMessage('Cidade deve ter no máximo 100 caracteres'),
  body('state').optional().isString().isLength({ max: 2 }).withMessage('Estado deve ter no máximo 2 caracteres'),
  body('zip').optional().isString().isLength({ max: 10 }).withMessage('CEP deve ter no máximo 10 caracteres'),
  body('code').optional().isString().isLength({ max: 50 }).withMessage('Código deve ter no máximo 50 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }

  try {
    const { id } = req.params;
    const { name, email, phone, address, city, state, zip, code } = req.body;
    
    // Verificar se o fornecedor existe
    const supplierRef = db.collection('suppliers').doc(id);
    const supplierDoc = await supplierRef.get();
    
    if (!supplierDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }
    
    const currentData = supplierDoc.data();
    
    // Verificar se já existe outro fornecedor com o mesmo nome
    if (name.trim() !== currentData.name) {
      const existingSupplier = await db.collection('suppliers')
        .where('name', '==', name.trim())
        .get();
      
      const hasConflict = existingSupplier.docs.some(doc => doc.id !== id);
      if (hasConflict) {
        return res.status(400).json({
          success: false,
          message: 'Já existe outro fornecedor com este nome'
        });
      }
    }
    
    // Verificar se já existe outro fornecedor com o mesmo email (se alterado)
    if (email && email.trim() !== currentData.email) {
      const existingEmail = await db.collection('suppliers')
        .where('email', '==', email.trim().toLowerCase())
        .get();
      
      const hasConflict = existingEmail.docs.some(doc => doc.id !== id);
      if (hasConflict) {
        return res.status(400).json({
          success: false,
          message: 'Já existe outro fornecedor com este e-mail'
        });
      }
    }
    
    const updateData = {
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : currentData.email || '',
      phone: phone ? phone.trim() : currentData.phone || '',
      address: address ? address.trim() : currentData.address || '',
      city: city ? city.trim() : currentData.city || '',
      state: state ? state.trim().toUpperCase() : currentData.state || '',
      zip: zip ? zip.trim() : currentData.zip || '',
      code: code ? code.trim() : currentData.code || '',
      updatedAt: new Date()
    };
    
    await supplierRef.update(updateData);
    
    res.json({
      success: true,
      message: 'Fornecedor atualizado com sucesso',
      data: {
        supplier: {
          id,
          ...updateData
        }
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar fornecedor'
    });
  }
});

// Rota para excluir fornecedor
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o fornecedor existe
    const supplierRef = db.collection('suppliers').doc(id);
    const supplierDoc = await supplierRef.get();
    
    if (!supplierDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }
    
    // Verificar se existem produtos associados a este fornecedor
    const productsWithSupplier = await db.collection('products')
      .where('supplierId', '==', id)
      .get();
    
    if (!productsWithSupplier.empty) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir o fornecedor. Existem produtos associados a ele.'
      });
    }
    
    await supplierRef.delete();
    
    res.json({
      success: true,
      message: 'Fornecedor excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao excluir fornecedor'
    });
  }
});

// Rota para buscar fornecedor por nome (para autocomplete)
router.get('/search/:name', auth, async (req, res) => {
  try {
    const { name } = req.params;
    const searchTerm = name.toLowerCase();
    
    const suppliersSnapshot = await db.collection('suppliers').get();
    const suppliers = [];
    
    suppliersSnapshot.forEach(doc => {
      const supplierData = doc.data();
      if (supplierData.name.toLowerCase().includes(searchTerm)) {
        suppliers.push({
          id: doc.id,
          name: supplierData.name,
          email: supplierData.email || '',
          phone: supplierData.phone || '',
          code: supplierData.code || ''
        });
      }
    });
    
    res.json({
      success: true,
      message: 'Busca realizada com sucesso',
      data: { suppliers }
    });
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar fornecedores'
    });
  }
});

module.exports = router; 