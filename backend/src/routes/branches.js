const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { db } = require('../config/firebase');

// Listar filiais
router.get('/', auth, async (req, res) => {
  try {
    const snapshot = await db.collection('branches').orderBy('name', 'asc').get();
    const branches = [];
    snapshot.forEach((doc) => branches.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: { branches } });
  } catch (error) {
    console.error('Erro ao listar filiais:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Obter filial por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ref = db.collection('branches').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Filial não encontrada' });
    res.json({ success: true, data: { branch: { id: doc.id, ...doc.data() } } });
  } catch (error) {
    console.error('Erro ao buscar filial:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Criar filial
router.post(
  '/',
  auth,
  [
    body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres'),
    body('email').optional().isEmail().withMessage('E-mail inválido'),
    body('phone').optional().isString().isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: errors.array() });
    }
    try {
      const payload = {
        name: req.body.name,
        email: req.body.email || null,
        phone: req.body.phone || null,
        address: req.body.address || null,
        city: req.body.city || null,
        state: req.body.state || null,
        zip: req.body.zip || null,
        code: req.body.code || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const ref = await db.collection('branches').add(payload);
      const doc = await ref.get();
      res.status(201).json({ success: true, message: 'Filial criada com sucesso', data: { branch: { id: doc.id, ...doc.data() } } });
    } catch (error) {
      console.error('Erro ao criar filial:', error);
      res.status(400).json({ success: false, message: error.message || 'Erro ao criar filial' });
    }
  }
);

// Atualizar filial
router.put(
  '/:id',
  auth,
  [
    body('name').optional().trim().isLength({ min: 2, max: 120 }),
    body('email').optional().isEmail(),
    body('phone').optional().isString().isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: errors.array() });
    }
    try {
      const ref = db.collection('branches').doc(req.params.id);
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ success: false, message: 'Filial não encontrada' });
      const update = { ...req.body, updatedAt: new Date() };
      await ref.update(update);
      const updated = await ref.get();
      res.json({ success: true, message: 'Filial atualizada com sucesso', data: { branch: { id: updated.id, ...updated.data() } } });
    } catch (error) {
      console.error('Erro ao atualizar filial:', error);
      res.status(400).json({ success: false, message: error.message || 'Erro ao atualizar filial' });
    }
  }
);

// Deletar filial
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const ref = db.collection('branches').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Filial não encontrada' });
    await ref.delete();
    res.json({ success: true, message: 'Filial deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar filial:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;

