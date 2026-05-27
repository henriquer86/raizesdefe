const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação JWT.
 * Lê token do header Authorization (Bearer <token>),
 * valida com JWT_SECRET e anexa dados em req.user.
 */
function authenticateToken(req, res, next) {
  // Verifica chave secreta
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Erro de configuração do servidor',
      details: 'Variável de ambiente JWT_SECRET não definida',
    });
  }

  // Extrai token do header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Acesso negado',
      details:
        'Token de autenticação não fornecido. Use Authorization: Bearer <token>',
    });
  }

  // Valida token
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Token inválido ou expirado',
        details: err.message,
      });
    }

    req.user = user;
    next();
  });
}

const requireAuth = authenticateToken;

module.exports = {
  authenticateToken,
  requireAuth,
};
