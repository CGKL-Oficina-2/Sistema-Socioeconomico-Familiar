const express = require('express');
const { getAll } = require('../controllers/log.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const router = express.Router();
router.get('/', authenticate, authorize('ADMIN'), getAll);
module.exports = router;
