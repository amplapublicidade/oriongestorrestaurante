const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação em todas as rotas
router.use(auth);

// @route   GET /api/products
// @desc    Listar produtos com filtros e paginação
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite deve ser entre 1 e 100'),
  query('category').optional().isIn(['carnes', 'vegetais', 'frutas', 'graos', 'laticinios', 'bebidas', 'temperos', 'outros']),
  query('stockStatus').optional().isIn(['low', 'normal', 'high']),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      category,
      supplier,
      stockStatus,
      isActive = true,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Construir filtros
    const filters = { isActive: isActive === 'true' };

    if (category) filters.category = category;
    if (supplier) filters.supplier = supplier;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Buscar produtos
    const products = await Product.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Product.countDocuments(filters);

    // Filtrar por status do estoque se necessário
    let filteredProducts = products;
    if (stockStatus) {
      filteredProducts = products.filter(product => {
        const status = product.currentStock <= product.minStock ? 'low' :
                      product.currentStock >= product.maxStock ? 'high' : 'normal';
        return status === stockStatus;
      });
    }

    res.json({
      success: true,
      data: {
        products: filteredProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Obter produto por ID
// @access  Private
router.get('/:id', async (req, res) => {
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

// @route   POST /api/products
// @desc    Criar novo produto
// @access  Private (Admin/Manager)
router.post('/', [
  authorize('admin', 'manager'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('category')
    .isIn(['carnes', 'vegetais', 'frutas', 'graos', 'laticinios', 'bebidas', 'temperos', 'outros'])
    .withMessage('Categoria inválida'),
  body('unit')
    .isIn(['kg', 'g', 'L', 'ml', 'unidade', 'caixa', 'pacote'])
    .withMessage('Unidade inválida'),
  body('supplier')
    .isMongoId()
    .withMessage('ID do fornecedor inválido'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Produto com este código de barras ou SKU já existe'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Atualizar produto
// @access  Private (Admin/Manager)
router.put('/:id', [
  authorize('admin', 'manager'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('category')
    .optional()
    .isIn(['carnes', 'vegetais', 'frutas', 'graos', 'laticinios', 'bebidas', 'temperos', 'outros'])
    .withMessage('Categoria inválida'),
  body('unit')
    .optional()
    .isIn(['kg', 'g', 'L', 'ml', 'unidade', 'caixa', 'pacote'])
    .withMessage('Unidade inválida'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Deletar produto (soft delete)
// @access  Private (Admin)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   POST /api/products/:id/stock/add
// @desc    Adicionar estoque
// @access  Private (Admin/Manager)
router.post('/:id/stock/add', [
  authorize('admin', 'manager'),
  body('quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantidade deve ser maior que zero'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Motivo não pode ter mais de 200 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    await product.addStock(req.body.quantity, req.body.reason);

    res.json({
      success: true,
      message: 'Estoque adicionado com sucesso',
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao adicionar estoque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   POST /api/products/:id/stock/remove
// @desc    Remover estoque
// @access  Private (Admin/Manager)
router.post('/:id/stock/remove', [
  authorize('admin', 'manager'),
  body('quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantidade deve ser maior que zero'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Motivo não pode ter mais de 200 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    await product.removeStock(req.body.quantity, req.body.reason);

    res.json({
      success: true,
      message: 'Estoque removido com sucesso',
      data: { product }
    });

  } catch (error) {
    if (error.message === 'Estoque insuficiente') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error('Erro ao remover estoque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 