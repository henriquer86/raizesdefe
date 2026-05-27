const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Verifica se o valor é um UUID válido.
 */
function isValidUUID(uuid) {
  return typeof uuid === 'string' && uuidRegex.test(uuid);
}

/**
 * Middleware para validar criação de função.
 * - cadastradopor: obrigatório, UUID válido
 * - nome: opcional, string 1-100 chars
 * - descricao: opcional, string
 * - alteradopor: opcional, UUID se informado
 */
function validateCreate(req, res, next) {
  // Valida cadastradopor obrigatório
  if (!req.body.cadastradopor || !isValidUUID(req.body.cadastradopor)) {
    return res
      .status(400)
      .json({
        mensagem: 'Cadastrado por deve ser um UUID válido e é obrigatório.',
      });
  }

  // Valida nome se presente
  if (req.body.nome !== undefined) {
    if (typeof req.body.nome !== 'string') {
      return res.status(400).json({ mensagem: 'Nome deve ser uma string.' });
    }
    const nomeTrim = req.body.nome.trim();
    if (nomeTrim.length === 0 || nomeTrim.length > 100) {
      return res
        .status(400)
        .json({ mensagem: 'Nome deve ter entre 1 e 100 caracteres.' });
    }
  }

  // Valida descricao se presente
  if (req.body.descricao !== undefined) {
    if (typeof req.body.descricao !== 'string') {
      return res
        .status(400)
        .json({ mensagem: 'Descrição deve ser uma string.' });
    }
  }

  // Valida alteradopor se presente
  if (req.body.alteradopor !== undefined) {
    if (!isValidUUID(req.body.alteradopor)) {
      return res
        .status(400)
        .json({ mensagem: 'Alterado por deve ser um UUID válido.' });
    }
  }

  next();
}

/**
 * Middleware para validar atualização de função.
 * - alteradopor: obrigatório, UUID válido
 * - Pelo menos um de: nome ou descricao
 * - Validações similares à criação para campos presentes
 */
function validateUpdate(req, res, next) {
  // Valida alteradopor obrigatório
  if (!req.body.alteradopor || !isValidUUID(req.body.alteradopor)) {
    return res
      .status(400)
      .json({
        mensagem:
          'Alterado por deve ser um UUID válido e é obrigatório para atualização.',
      });
  }

  // Exige pelo menos um campo editável
  if (req.body.nome === undefined && req.body.descricao === undefined) {
    return res
      .status(400)
      .json({
        mensagem:
          'Pelo menos um campo editável (nome ou descrição) deve ser informado.',
      });
  }

  // Valida nome se presente
  if (req.body.nome !== undefined) {
    if (typeof req.body.nome !== 'string') {
      return res.status(400).json({ mensagem: 'Nome deve ser uma string.' });
    }
    const nomeTrim = req.body.nome.trim();
    if (nomeTrim.length === 0 || nomeTrim.length > 100) {
      return res
        .status(400)
        .json({ mensagem: 'Nome deve ter entre 1 e 100 caracteres.' });
    }
  }

  // Valida descricao se presente
  if (req.body.descricao !== undefined) {
    if (typeof req.body.descricao !== 'string') {
      return res
        .status(400)
        .json({ mensagem: 'Descrição deve ser uma string.' });
    }
  }

  next();
}

/**
 * Middleware para validar ID na URL (req.params.id).
 */
function validateId(req, res, next) {
  const id = req.params.id;
  if (!id || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ mensagem: 'ID da função deve ser um UUID válido.' });
  }
  next();
}

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
