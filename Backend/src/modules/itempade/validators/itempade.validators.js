const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Função auxiliar para validar UUID
function isValidUUID(str) {
  return typeof str === 'string' && uuidRegex.test(str);
}

// Middleware para validar criação de itempade
const validateCreate = (req, res, next) => {
  const { pade, item, cadastradopor, alteradopor } = req.body;

  if (pade == null || !isValidUUID(pade)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "pade" é obrigatório e deve ser um UUID válido.',
      });
  }

  if (item == null || !isValidUUID(item)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "item" é obrigatório e deve ser um UUID válido.',
      });
  }

  if (cadastradopor == null || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "cadastradopor" é obrigatório e deve ser um UUID válido.',
      });
  }

  if (alteradopor != null && !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "alteradopor", quando informado, deve ser um UUID válido.',
      });
  }

  next();
};

// Middleware para validar atualização de itempade
const validateUpdate = (req, res, next) => {
  const { pade, item, alteradopor } = req.body;

  if (alteradopor == null || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "alteradopor" é obrigatório e deve ser um UUID válido.',
      });
  }

  if (pade == null && item == null) {
    return res
      .status(400)
      .json({
        erro: 'Pelo menos um dos campos editáveis ("pade" ou "item") deve ser informado.',
      });
  }

  if (pade != null && !isValidUUID(pade)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "pade", quando informado, deve ser um UUID válido.',
      });
  }

  if (item != null && !isValidUUID(item)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "item", quando informado, deve ser um UUID válido.',
      });
  }

  next();
};

// Middleware para validar ID nos parâmetros
const validateId = (req, res, next) => {
  const { id } = req.params;

  if (id == null || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ erro: 'O parâmetro "id" deve ser um UUID válido.' });
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
