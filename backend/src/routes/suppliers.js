const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Supplier = require('../models/Supplier');
const { body, validationResult } = require('express-validator');

// Middleware de validação
const validateSupplier = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('address').optional().isLength({ min: 5 }).withMessage('Endereço deve ter pelo menos 5 caracteres'),
  body('cnpj').optional().isLength({ min: 14, max: 18 }).withMessage('CNPJ inválido')
];

// GET /api/suppliers - Listar fornecedores
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const suppliers = await Supplier.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Supplier.countDocuments(query);

    res.json({
      success: true,
      data: {
        suppliers,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/suppliers/:id - Buscar fornecedor por ID
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

// POST /api/suppliers - Criar fornecedor
router.post('/', [auth, ...validateSupplier], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { name, email, phone, address, cnpj, notes } = req.body;

    // Verificar se email já existe
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    const supplier = new Supplier({
      name,
      email,
      phone,
      address,
      cnpj,
      notes,
      createdBy: req.user.id
    });

    await supplier.save();

    res.status(201).json({
      success: true,
      message: 'Fornecedor criado com sucesso',
      data: { supplier }
    });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/suppliers/:id - Atualizar fornecedor
router.put('/:id', [auth, ...validateSupplier], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    const { name, email, phone, address, cnpj, notes } = req.body;

    // Verificar se email já existe (exceto para o próprio fornecedor)
    if (email !== supplier.email) {
      const existingSupplier = await Supplier.findOne({ email });
      if (existingSupplier) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }
    }

    supplier.name = name;
    supplier.email = email;
    supplier.phone = phone;
    supplier.address = address;
    supplier.cnpj = cnpj;
    supplier.notes = notes;
    supplier.updatedBy = req.user.id;

    await supplier.save();

    res.json({
      success: true,
      message: 'Fornecedor atualizado com sucesso',
      data: { supplier }
    });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/suppliers/:id - Deletar fornecedor
router.delete('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Fornecedor não encontrado'
      });
    }

    await Supplier.findByIdAndDelete(req.params.id);

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

module.exports = router; 