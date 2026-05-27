const express = require('express');
const router = express.Router();

// Importações dos controllers
const { login, me, logout } = require('../controllers/auth.controller');

// Importações dos validators
const { validateLogin } = require('../validators/auth.validators');

// Importações dos middlewares
const { authenticateToken } = require('../../../middlewares/auth.middleware');

// Rota pública de login com validação
router.post('/', validateLogin, login);

// Rotas protegidas por JWT
router.get('/me', authenticateToken, me);
router.post('/logout', authenticateToken, logout);

module.exports = router;
