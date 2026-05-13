const express = require('express');
const { body } = require('express-validator');
const { getAll, getById, create, update, remove, getAllSimple } = require('../controllers/school.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

const schoolValidation = [
  body('name').notEmpty().withMessage('Nome obrigatório'),
  body('city').notEmpty().withMessage('Cidade obrigatória'),
  body('state').notEmpty().isLength({ min: 2, max: 2 }).withMessage('Estado inválido (ex: PR)'),
  body('address').notEmpty().withMessage('Endereço obrigatório'),
];

router.get('/simple', getAllSimple);
router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, schoolValidation, create);
router.put('/:id', authenticate, schoolValidation, update);
router.delete('/:id', authenticate, authorize('ADMIN'), remove);

module.exports = router;
