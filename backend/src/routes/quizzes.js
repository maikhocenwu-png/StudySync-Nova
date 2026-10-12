const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { createQuiz, submitQuiz } = require('../controllers/quizController');

router.post('/', requireAuth, createQuiz);
router.post('/:id/submit', requireAuth, submitQuiz);

module.exports = router;