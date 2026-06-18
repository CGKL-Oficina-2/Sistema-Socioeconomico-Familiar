const express = require('express');
const { getForms, getSchools } = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();
router.get('/forms', authenticate, getForms);
router.get('/schools', authenticate, getSchools);
module.exports = router;
