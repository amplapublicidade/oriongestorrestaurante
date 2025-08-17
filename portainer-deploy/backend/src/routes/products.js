const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { db } = require('../config/firebase');

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
    updatedAt: new Date(),
    isLowStock: (parseFloat(stock) || 0) <= (parseFloat(minStock) || 0)
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
  body('stock').toFloat().optional().isFloat({ min: 0 }).withMessage('Estoque deve ser um número não negativo'),
  body('minStock').toFloat().optional().isFloat({ min: 0 }).withMessage('Estoque mínimo deve ser um número não negativo'),
  body('price').toFloat().optional().isFloat({ min: 0 }).withMessage('Preço deve ser um número não negativo'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erros de validação:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }

  try {
    const { id } = req.params;
    const { name, supplierId, unit, stock, minStock, price, description } = req.body;
    
    console.log('🔍 Dados recebidos para atualização:', { id, name, supplierId, unit, stock, minStock, price, description });
    
    // Verificar se o produto existe
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      console.log('❌ Produto não encontrado:', id);
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    // Verificar se o fornecedor existe
    const supplierDoc = await db.collection('suppliers').doc(supplierId).get();
    if (!supplierDoc.exists) {
        console.log('❌ Fornecedor não encontrado:', supplierId);
        return res.status(400).json({
            success: false,
            message: 'Fornecedor não encontrado'
        });
    }
    
    // Lógica de verificação de conflito aprimorada
    const existingData = productDoc.data();
    const isRenaming = name.trim() !== existingData.name;
    const isChangingSupplier = supplierId !== existingData.supplierId;

    // Executar a verificação de conflito apenas se o nome ou o fornecedor forem alterados
    if (isRenaming || isChangingSupplier) {
      const conflictQuery = await db.collection('products')
        .where('name', '==', name.trim())
        .where('supplierId', '==', supplierId)
        .get();

      if (!conflictQuery.empty) {
        console.log('❌ Conflito de nome de produto detectado para o mesmo fornecedor.');
        return res.status(400).json({
          success: false,
          message: 'Já existe outro produto com este nome para este fornecedor'
        });
      }
    }
    
    // Preparar dados para atualização com conversão segura
    const updateData = {
      name: name.trim(),
      supplierId,
      unit: unit.trim(),
      stock: stock || 0,
      minStock: minStock || 0,
      price: price || 0,
      description: description ? description.trim() : '',
      updatedAt: new Date(),
      isLowStock: (stock || 0) <= (minStock || 0)
    };
    
    console.log('📝 Dados para atualização:', updateData);
    
    await productRef.update(updateData);
    
    console.log('✅ Produto atualizado com sucesso:', id);
    
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
    console.error('❌ Erro ao atualizar produto:', error);
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
    
    const current = productDoc.data();
    const newStock = parseFloat(stock);
    const minStock = parseFloat(current.minStock) || 0;
    await productRef.update({
      stock: newStock,
      updatedAt: new Date(),
      isLowStock: newStock <= minStock
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

// Rota para upload de arquivo Excel
router.post('/upload-excel', auth, async (req, res) => {
  try {
    console.log('🚀 Iniciando upload de Excel...');
    
    // Verificar se há arquivo no request
    if (!req.files || !req.files.excelFile) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo Excel foi enviado'
      });
    }

    const excelFile = req.files.excelFile;
    console.log('📁 Arquivo recebido:', excelFile.name, 'Tamanho:', excelFile.size);

    // Verificar extensão do arquivo
    if (!excelFile.name.endsWith('.xlsx') && !excelFile.name.endsWith('.xls')) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo deve ser um Excel (.xlsx ou .xls)'
      });
    }

    // Processar o arquivo Excel
    const XLSX = require('xlsx');
    const workbook = XLSX.read(excelFile.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('📊 Dados extraídos:', data.length, 'linhas');

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo Excel não contém dados válidos'
      });
    }

    let produtosCriados = 0;
    let fornecedoresCriados = 0;

    // Processar cada linha do Excel
    for (const row of data) {
      try {
        // Validar dados obrigatórios (usando os nomes das colunas do Excel)
        if (!row.PRODUTOS || !row.FORNECEDORES) {
          console.log('⚠️ Linha ignorada - dados obrigatórios faltando:', row);
          continue;
        }

        // Criar ou buscar fornecedor
        let supplierId;
        const supplierQuery = await db.collection('suppliers')
          .where('name', '==', row.FORNECEDORES)
          .limit(1)
          .get();

                  if (supplierQuery.empty) {
            // Criar novo fornecedor
            const supplierRef = await db.collection('suppliers').add({
              name: row.FORNECEDORES,
              email: row.EMAIL_FORNECEDOR || '',
              phone: row.TELEFONE_FORNECEDOR || '',
              address: row.ENDERECO_FORNECEDOR || '',
              createdAt: new Date(),
              updatedAt: new Date()
            });
            supplierId = supplierRef.id;
            fornecedoresCriados++;
            console.log('✅ Fornecedor criado:', row.FORNECEDORES);
          } else {
            supplierId = supplierQuery.docs[0].id;
          }

        // Criar produto
        const productData = {
          name: row.PRODUTOS,
          description: row.DESCRICAO || '',
          price: parseFloat(row.PRECO) || 0,
          stock: parseFloat(row.ESTOQUE) || 0,
          minStock: parseFloat(row.ESTOQUE_MINIMO) || 0,
          unit: row.UNIDADE || 'un',
          supplierId: supplierId,
          createdAt: new Date(),
          updatedAt: new Date(),
          isLowStock: (parseFloat(row.ESTOQUE) || 0) <= (parseFloat(row.ESTOQUE_MINIMO) || 0)
        };

        await db.collection('products').add(productData);
        produtosCriados++;
        console.log('✅ Produto criado:', row.PRODUTOS);

      } catch (rowError) {
        console.error('❌ Erro ao processar linha:', row, rowError.message);
      }
    }

    console.log('🎉 Upload concluído!', produtosCriados, 'produtos,', fornecedoresCriados, 'fornecedores');

    res.json({
      success: true,
      message: 'Upload concluído com sucesso',
      data: {
        produtosCriados,
        fornecedoresCriados,
        totalLinhas: data.length
      }
    });

  } catch (error) {
    console.error('❌ Erro no upload do Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao processar arquivo Excel',
      error: error.message
    });
  }
});

module.exports = router;