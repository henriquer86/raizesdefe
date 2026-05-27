/*
 * Middleware global de tratamento de erros para a API Raízes de Fé.
 * Padroniza respostas de erro no formato { code, message, details }.
 * Mensagens em português do Brasil.
 */

const getDefaultCode = (status) => {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
};

const getDefaultMessage = (status) => {
  switch (status) {
    case 400:
      return 'Requisição inválida';
    case 401:
      return 'Não autorizado';
    case 403:
      return 'Acesso proibido';
    case 404:
      return 'Recurso não encontrado';
    case 422:
      return 'Entidade não processável';
    default:
      return 'Erro interno do servidor';
  }
};

const errorHandler = (err, req, res, next) => {
  // Se a resposta já foi enviada, delega para o próximo middleware
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const code = err.code || getDefaultCode(status);
  let message = err.message;
  if (!message || message.trim() === '') {
    message = getDefaultMessage(status);
  } else {
    message = message.trim();
  }

  let details = err.details;

  if (process.env.NODE_ENV === 'development') {
    details = details || err.stack || message;
  } else {
    details = details !== undefined ? details : message;
  }

  res.status(status).json({
    code,
    message,
    details,
  });
};

module.exports = errorHandler;
