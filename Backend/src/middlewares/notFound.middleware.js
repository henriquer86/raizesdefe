/**
 * Middleware para tratar rotas não encontradas (404).
 * Retorna uma resposta JSON no formato padrão do projeto.
 */

const notFound = (req, res, next) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Ops! Rota não encontrada.',
    details: `A rota "${req.method} ${req.originalUrl}" não existe. Verifique a URL e tente novamente.`,
  });
};

module.exports = notFound;
