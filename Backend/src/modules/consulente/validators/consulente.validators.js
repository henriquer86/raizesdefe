/*
 * Validações para o módulo Consulente
 * Backend Raízes de Fé
 */

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/**
 * Verifica se uma string é um UUID válido.
 */
function isValidUUID(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

/**
 * Middleware para validar criação de consulente.
 * Exige pessoa, cadastradopor e alteradopor como UUIDs válidos.
 */
function validateCreate(req, res, next) {
  const { pessoa, cadastradopor, alteradopor } = req.body;

  if (!pessoa || !isValidUUID(pessoa)) {
    return res
      .status(400)
      .json({ erro: 'Pessoa é obrigatória e deve ser um UUID válido.' });
  }

  if (!cadastradopor || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        erro: 'Cadastrado por é obrigatório e deve ser um UUID válido.',
      });
  }

  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({ erro: 'Alterado por é obrigatório e deve ser um UUID válido.' });
  }

  next();
}

/**
 * Middleware para validar atualização de consulente.
 * Exige alteradopor como UUID válido.
 * Exige pelo menos um campo editável (pessoa) informado.
 * Valida UUIDs nos campos presentes.
 */
function validateUpdate(req, res, next) {
  const { pessoa, alteradopor } = req.body;

  // Alteradopor obrigatório
  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        erro: 'Alterado por é obrigatório e deve ser um UUID válido para atualizações.',
      });
  }

  // Pelo menos um campo editável deve ser informado
  const editableFields = ['pessoa'];
  const hasEditableField = editableFields.some((field) =>
    req.body.hasOwnProperty(field),
  );
  if (!hasEditableField) {
    return res
      .status(400)
      .json({
        erro: 'Pelo menos um campo editável (pessoa) deve ser informado para atualização.',
      });
  }

  // Valida pessoa se presente
  if (pessoa !== undefined && !isValidUUID(pessoa)) {
    return res.status(400).json({ erro: 'Pessoa deve ser um UUID válido.' });
  }

  next();
}

/**
 * Middleware para validar ID na URL.
 */
function validateId(req, res, next) {
  const { id } = req.params;

  if (!id || !isValidUUID(id)) {
    return res.status(400).json({ erro: 'ID deve ser um UUID válido.' });
  }

  next();
}

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
