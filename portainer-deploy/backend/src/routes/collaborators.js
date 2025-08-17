const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const { db } = require('../config/firebase');

// Rota para listar todos os colaboradores
router.get('/', auth, authorize('admin', 'gerente'), async (req, res) => {
  try {
    const users = await User.findAllWithoutPasswords();
    res.json({
      success: true,
      message: 'Colaboradores carregados com sucesso',
      data: { users }
    });
  } catch (error) {
    console.error('Erro ao carregar colaboradores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao carregar colaboradores'
    });
  }
});

// Rota para criar novo colaborador
router.post('/', auth, authorize('admin', 'gerente'), [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres'),
  body('email').trim().isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').isIn(['funcionario', 'gerente', 'admin']).withMessage('Nível de permissão inválido'),
  body('phone').optional().trim().isLength({ max: 20 }).withMessage('Telefone deve ter no máximo 20 caracteres'),
  body('address').optional().trim().isLength({ max: 200 }).withMessage('Endereço deve ter no máximo 200 caracteres'),
  body('city').optional().trim().isLength({ max: 100 }).withMessage('Cidade deve ter no máximo 100 caracteres'),
  body('state').optional().trim().isLength({ max: 50 }).withMessage('Estado deve ter no máximo 50 caracteres'),
  body('zipCode').optional().trim().isLength({ max: 20 }).withMessage('CEP deve ter no máximo 20 caracteres'),
  body('hireDate').optional().custom((value) => {
    if (value && value !== '' && isNaN(new Date(value))) {
      throw new Error('Data de contratação deve ser uma data válida');
    }
    return true;
  }),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salário deve ser um número positivo'),
  body('department').optional().trim().isLength({ max: 100 }).withMessage('Departamento deve ter no máximo 100 caracteres'),
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
    const { 
      name, email, password, role, phone, address, city, state, 
      zipCode, hireDate, salary, department 
    } = req.body;
    
    // Adicional: Apenas admins podem criar outros admins
    if (role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem criar outros administradores.'
      });
    }

    const userData = {
      name,
      email,
      password,
      role,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      salary: salary || 0,
      department: department || 'Geral'
    };

    const user = await User.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'Colaborador criado com sucesso',
      data: { user }
    });
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor ao criar colaborador'
    });
  }
});

// Rota para atualizar colaborador
router.put('/:userId', auth, authorize('admin', 'gerente'), [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres'),
  body('email').trim().isEmail().withMessage('E-mail inválido'),
  body('role').isIn(['funcionario', 'gerente', 'admin']).withMessage('Nível de permissão inválido'),
  body('phone').optional().trim().isLength({ max: 20 }).withMessage('Telefone deve ter no máximo 20 caracteres'),
  body('address').optional().trim().isLength({ max: 200 }).withMessage('Endereço deve ter no máximo 200 caracteres'),
  body('city').optional().trim().isLength({ max: 100 }).withMessage('Cidade deve ter no máximo 100 caracteres'),
  body('state').optional().trim().isLength({ max: 50 }).withMessage('Estado deve ter no máximo 50 caracteres'),
  body('zipCode').optional().trim().isLength({ max: 20 }).withMessage('CEP deve ter no máximo 20 caracteres'),
  body('hireDate').optional().custom((value) => {
    if (value && value !== '' && isNaN(new Date(value))) {
      throw new Error('Data de contratação deve ser uma data válida');
    }
    return true;
  }),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salário deve ser um número positivo'),
  body('department').optional().trim().isLength({ max: 100 }).withMessage('Departamento deve ter no máximo 100 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erros de validação na edição:', errors.array());
    console.log('📦 Dados recebidos:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }

  try {
    const { userId } = req.params;
    const { 
      name, email, password, role, phone, address, city, state, 
      zipCode, hireDate, salary, department, isActive 
    } = req.body;

    // Adicional: Apenas admins podem alterar a role para admin
    if (role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem definir outros usuários como administradores.'
      });
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
        return res.status(404).json({ success: false, message: 'Colaborador não encontrado' });
    }

    // Adicional: Apenas admins podem editar outros admins
    if (userToUpdate.role === 'admin' && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Apenas administradores podem editar outros administradores.' });
    }

    const updateData = { 
      name, 
      email, 
      role,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      hireDate: hireDate ? new Date(hireDate) : userToUpdate.hireDate,
      salary: salary || 0,
      department: department || 'Geral',
      isActive: isActive !== undefined ? isActive : true
    };
    if (password && password.trim().length >= 6) {
      updateData.password = password;
    }

    const updatedUser = await User.update(userId, updateData);

    res.json({
      success: true,
      message: 'Colaborador atualizado com sucesso',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor ao atualizar colaborador'
    });
  }
});

// Rota para excluir colaborador
router.delete('/:userId', auth, authorize('admin', 'gerente'), async (req, res) => {
  try {
    const { userId } = req.params;

    // Adicional: Não pode excluir a si mesmo
    if (userId === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Você não pode excluir sua própria conta.' });
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
        return res.status(404).json({ success: false, message: 'Colaborador não encontrado' });
    }

    // Adicional: Apenas admins podem excluir outros admins ou gerentes
    if ((userToDelete.role === 'admin' || userToDelete.role === 'gerente') && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Você não tem permissão para excluir este colaborador.' });
    }

    await User.delete(userId);
    
    res.json({
      success: true,
      message: 'Colaborador excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir colaborador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao excluir colaborador'
    });
  }
});

module.exports = router;
