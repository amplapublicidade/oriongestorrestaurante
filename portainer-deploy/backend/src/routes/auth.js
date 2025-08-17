const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const { db } = require('../config/firebase');

// Middleware para verificar se o usuário é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Apenas administradores podem realizar esta ação.' 
    });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Registrar um novo usuário
// @access  Public
router.post('/register', [
  body('name', 'Nome é obrigatório').not().isEmpty(),
  body('email', 'Por favor inclua um email válido').isEmail(),
  body('password', 'Por favor insira uma senha com 6 ou mais caracteres').isLength({ min: 6 })
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

    const { name, email, password } = req.body;

    const user = await User.createUser({ name, email, password });
    
    const payload = {
      userId: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário e retornar token
// @access  Public
router.post('/login', [
  body('email', 'Por favor inclua um email válido').isEmail(),
  body('password', 'Senha é obrigatória').exists()
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

    const { email, password } = req.body;

    const user = await User.authenticateUser(email, password);
    
    const payload = {
      userId: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário atual
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByIdWithoutPassword(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', auth, [
  body('name', 'Nome é obrigatório').not().isEmpty()
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

    const { name } = req.body;
    const user = await User.update(req.user.userId, { name });

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Alterar senha do usuário
// @access  Private
router.post('/change-password', auth, [
  body('currentPassword', 'Senha atual é obrigatória').exists(),
  body('newPassword', 'Nova senha deve ter pelo menos 6 caracteres').isLength({ min: 6 })
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

    const { currentPassword, newPassword } = req.body;
    await User.updatePassword(req.user.userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Rota para listar todos os usuários (apenas admin)
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      });
    });
    
    res.json({
      success: true,
      message: 'Usuários carregados com sucesso',
      data: { users }
    });
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao carregar usuários'
    });
  }
});

// Rota para criar novo usuário (apenas admin)
router.post('/users', auth, requireAdmin, [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres'),
  body('email').trim().isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').isIn(['funcionario', 'gerente', 'admin']).withMessage('Nível de permissão inválido'),
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
    const { name, email, password, role } = req.body;
    
    // Verificar se o email já existe
    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({
        success: false,
        message: 'Este e-mail já está em uso'
      });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userRef = await db.collection('users').add(userData);
    const userDoc = await userRef.get();
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: {
          id: userDoc.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar usuário'
    });
  }
});

// Rota para atualizar usuário (apenas admin)
router.put('/users/:userId', auth, requireAdmin, [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres'),
  body('email').trim().isEmail().withMessage('E-mail inválido'),
  body('role').isIn(['funcionario', 'gerente', 'admin']).withMessage('Nível de permissão inválido'),
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
    const { userId } = req.params;
    const { name, email, password, role } = req.body;
    
    // Verificar se o usuário existe
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Verificar se o email já existe em outro usuário
    if (email !== userDoc.data().email) {
      const existingUser = await db.collection('users').where('email', '==', email).get();
      if (!existingUser.empty) {
        return res.status(400).json({
          success: false,
          message: 'Este e-mail já está em uso por outro usuário'
        });
      }
    }
    
    const updateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      updatedAt: new Date()
    };
    
    // Adicionar senha apenas se fornecida
    if (password && password.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    
    await userRef.update(updateData);
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: {
        user: {
          id: userId,
          ...updateData
        }
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar usuário'
    });
  }
});

// Rota para excluir usuário (apenas admin)
router.delete('/users/:userId', auth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificar se o usuário existe
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Verificar se não está tentando excluir a si mesmo
    if (userId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir sua própria conta'
      });
    }
    
    await userRef.delete();
    
    res.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao excluir usuário'
    });
  }
});

module.exports = router;