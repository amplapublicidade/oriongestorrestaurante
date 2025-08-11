const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const db = require('../db');

const router = express.Router();

// Rota para listar todos os produtos
router.get('/', auth, async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = [];
    
    productsSnapshot.forEach(doc => {
      const productData = doc.data();
      products.push({
        id: doc.id,
        name: productData.name,
        supplierId: productData.supplierId,
        unit: productData.unit,
        stock: productData.stock || 0,
        minStock: productData.minStock || 0,
        price: productData.price || 0,
        description: productData.description || '',
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt
      });
    });
    
    res.json({
      success: true,
      message: 'Produtos carregados com sucesso',
      data: { products }
    });
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao carregar produtos'
    });
  }
});

// Rota para buscar produto por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    const productData = productDoc.data();
    res.json({
      success: true,
      message: 'Produto encontrado',
      data: {
        product: {
          id: productDoc.id,
          name: productData.name,
          supplierId: productData.supplierId,
          unit: productData.unit,
          stock: productData.stock || 0,
          minStock: productData.minStock || 0,
          price: productData.price || 0,
          description: productData.description || '',
          createdAt: productData.createdAt,
          updatedAt: productData.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar produto'
    });
  }
});

// Rota para criar novo produto
router.post('/', auth, [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Nome deve ter entre 2 e 200 caracteres'),
  body('supplierId').notEmpty().withMessage('Fornecedor é obrigatório'),
  body('unit').trim().isLength({ min: 1, max: 20 }).withMessage('Unidade deve ter entre 1 e 20 caracteres'),
  body('stock').optional().isFloat({ min: 0 }).withMessage('Estoque deve ser um número não negativo'),
  body('minStock').optional().isFloat({ min: 0 }).withMessage('Estoque mínimo deve ser um número não negativo'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Preço deve ser um número não negativo'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
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
    const { name, supplierId, unit, stock, minStock, price, description } = req.body;
    
    // Verificar se o fornecedor existe
    const supplierDoc = await db.collection('suppliers').doc(supplierId).get();
    if (!supplierDoc.exists) {
      return res.status(400).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }
    
    // Verificar se já existe um produto com o mesmo nome para o mesmo fornecedor
    const existingProduct = await db.collection('products')
      .where('name', '==', name.trim())
      .where('supplierId', '==', supplierId)
      .get();
    
    if (!existingProduct.empty) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um produto com este nome para este fornecedor'
      });
    }
    
    const productData = {
      name: name.trim(),
      supplierId,
      unit: unit.trim(),
      stock: parseFloat(stock) || 0,
      minStock: parseFloat(minStock) || 0,
      price: parseFloat(price) || 0,
      description: description ? description.trim() : '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const productRef = await db.collection('products').add(productData);
    const productDoc = await productRef.get();
    
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: {
        product: {
          id: productDoc.id,
          ...productData
        }
      }
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar produto'
    });
  }
});

// Rota para atualizar produto
router.put('/:id', auth, [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Nome deve ter entre 2 e 200 caracteres'),
  body('supplierId').notEmpty().withMessage('Fornecedor é obrigatório'),
  body('unit').trim().isLength({ min: 1, max: 20 }).withMessage('Unidade deve ter entre 1 e 20 caracteres'),
  body('stock').optional().isFloat({ min: 0 }).withMessage('Estoque deve ser um número não negativo'),
  body('minStock').optional().isFloat({ min: 0 }).withMessage('Estoque mínimo deve ser um número não negativo'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Preço deve ser um número não negativo'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
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
    const { name, supplierId, unit, stock, minStock, price, description } = req.body;
    
    // Verificar se o produto existe
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    // Verificar se o fornecedor existe
    const supplierDoc = await db.collection('suppliers').doc(supplierId).get();
    if (!supplierDoc.exists) {
      return res.status(400).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }
    
    // Verificar se já existe outro produto com o mesmo nome para o mesmo fornecedor
    const existingProduct = await db.collection('products')
      .where('name', '==', name.trim())
      .where('supplierId', '==', supplierId)
      .get();
    
    const hasConflict = existingProduct.docs.some(doc => doc.id !== id);
    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'Já existe outro produto com este nome para este fornecedor'
      });
    }
    
    const updateData = {
      name: name.trim(),
      supplierId,
      unit: unit.trim(),
      stock: parseFloat(stock) || 0,
      minStock: parseFloat(minStock) || 0,
      price: parseFloat(price) || 0,
      description: description ? description.trim() : '',
      updatedAt: new Date()
    };
    
    await productRef.update(updateData);
    
    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: {
        product: {
          id,
          ...updateData
        }
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar produto'
    });
  }
});

// Rota para excluir produto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o produto existe
    const productRef = db.collection('products').doc(id);
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
      message: 'Produto excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao excluir produto'
    });
  }
});

// Rota para atualizar estoque
router.patch('/:id/stock', auth, [
  body('stock').isFloat({ min: 0 }).withMessage('Estoque deve ser um número não negativo'),
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
    const { stock } = req.body;
    
    // Verificar se o produto existe
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    await productRef.update({
      stock: parseFloat(stock),
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Estoque atualizado com sucesso',
      data: {
        stock: parseFloat(stock)
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar estoque'
    });
  }
});

module.exports = router; 