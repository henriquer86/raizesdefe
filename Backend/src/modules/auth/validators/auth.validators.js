/**
 * Validações para o módulo de autenticação.
 * Verifica os campos necessários para login.
 */

const validateLogin = (req, res, next) => {
  const { nomeusuario, senha } = req.body;

  // Valida nome de usuário
  if (
    !nomeusuario ||
    typeof nomeusuario !== 'string' ||
    nomeusuario.trim().length === 0
  ) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Nome de usuário é obrigatório',
      details: 'O campo "nomeusuario" deve ser uma string não vazia.',
    });
  }

  // Valida senha (não expõe detalhes sensíveis)
  if (!senha || typeof senha !== 'string' || senha.length === 0) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Senha é obrigatória',
      details: 'O campo "senha" deve ser uma string não vazia.',
    });
  }

  // Aplica trim no nome de usuário
  req.body.nomeusuario = nomeusuario.trim();

  next();
};

module.exports = {
  validateLogin,
};
