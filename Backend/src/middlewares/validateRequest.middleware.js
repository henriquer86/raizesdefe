const validateRequest = (req, res, next) => {
  // Verifica erros de validação em locais comuns
  let errors = null;

  if (req.validationErrors) {
    errors = req.validationErrors;
  } else if (req.errors) {
    errors = req.errors;
  } else if (res.locals && res.locals.validationErrors) {
    errors = res.locals.validationErrors;
  }

  // Função auxiliar para coletar detalhes dos erros de forma robusta
  const collectDetails = (errs) => {
    if (!errs) return null;

    const details = [];

    if (Array.isArray(errs)) {
      errs.forEach((err) => {
        if (typeof err === 'string') {
          details.push(err);
        } else if (err && typeof err === 'object' && err.msg) {
          details.push(err.msg);
        } else {
          details.push(JSON.stringify(err));
        }
      });
    } else if (typeof errs === 'string') {
      details.push(errs);
    } else if (errs && typeof errs === 'object') {
      // Suporte a objetos de erros (ex: { campo: 'mensagem' } ou { campo: [{msg: '...'}] })
      Object.values(errs).forEach((value) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (typeof v === 'string') {
              details.push(v);
            } else if (v && v.msg) {
              details.push(v.msg);
            } else {
              details.push(JSON.stringify(v));
            }
          });
        } else if (typeof value === 'string') {
          details.push(value);
        } else if (value && value.msg) {
          details.push(value.msg);
        } else {
          details.push(JSON.stringify(value));
        }
      });
    }

    return details.length > 0 ? details : null;
  };

  const details = collectDetails(errors);

  if (details) {
    // Resposta de erro padronizada
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Erro de validação na requisição',
      details,
    });
  }

  // Sem erros, prossegue para o próximo middleware
  next();
};

module.exports = validateRequest;
