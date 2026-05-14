const express = require('express');
const { body } = require('express-validator');
const { getAll, create, update, remove } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', getAll);
router.post('/', [
  body('name').notEmpty().withMessage('Nome obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
], create);
router.put('/:id', [
  body('name').notEmpty().withMessage('Nome obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
], update);
router.delete('/:id', remove);

module.exports = router;
