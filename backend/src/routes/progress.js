const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { getProgress } = require('../controllers/progressController');

router.get('/', requireAuth, getProgress);

module.exports = router;