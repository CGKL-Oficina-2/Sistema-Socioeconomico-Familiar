const express = require('express');
const { body } = require('express-validator');
const { getAll, getById, create, update, remove } = require('../controllers/form.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

const formValidation = [
  body('familyIncome').isFloat({ min: 0 }).withMessage('Renda familiar inválida'),
  body('residents').isInt({ min: 1 }).withMessage('Número de moradores deve ser pelo menos 1'),
];

// Public route for anonymous form submission
router.post('/public', formValidation, create);

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, formValidation, create);
router.put('/:id', authenticate, formValidation, update);
router.delete('/:id', authenticate, authorize('ADMIN'), remove);

module.exports = router;
