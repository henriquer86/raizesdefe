const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Middleware para validar ID nos parâmetros
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ error: 'ID do banho deve ser um UUID válido.' });
  }
  next();
};

// Middleware para validar criação de banho
const validateCreate = (req, res, next) => {
  const {
    atendimento,
    descricao,
    quantidade,
    dia,
    cadastradopor,
    alteradopor,
  } = req.body;

  // Valida atendimento obrigatório
  if (!atendimento || !isValidUUID(atendimento)) {
    return res
      .status(400)
      .json({ error: 'Atendimento é obrigatório e deve ser um UUID válido.' });
  }

  // Valida descrição obrigatória
  if (!descricao || descricao.trim().length === 0) {
    return res
      .status(400)
      .json({ error: 'Descrição é obrigatória e não pode estar vazia.' });
  }

  // Valida quantidade obrigatória
  if (
    quantidade === undefined ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    return res
      .status(400)
      .json({
        error: 'Quantidade é obrigatória, deve ser um inteiro positivo.',
      });
  }

  // Valida cadastradopor obrigatório
  if (!cadastradopor || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        error: 'Cadastrado por é obrigatório e deve ser um UUID válido.',
      });
  }

  // Valida alteradopor opcional
  if (alteradopor && !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({ error: 'Alterado por deve ser um UUID válido.' });
  }

  next();
};

// Middleware para validar atualização de banho
const validateUpdate = (req, res, next) => {
  const { id } = req.params;
  const { atendimento, descricao, quantidade, dia, alteradopor } = req.body;

  // Valida ID obrigatório
  if (!id || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ error: 'ID do banho deve ser um UUID válido.' });
  }

  // Verifica se pelo menos um campo editável foi informado
  const editables = ['atendimento', 'descricao', 'quantidade', 'dia'];
  const hasAnyEditable = editables.some(
    (field) => req.body[field] !== undefined,
  );
  if (!hasAnyEditable) {
    return res
      .status(400)
      .json({
        error:
          'Pelo menos um campo editável deve ser informado: atendimento, descrição, quantidade ou dia.',
      });
  }

  // Valida alteradopor obrigatório para atualização
  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        error:
          'Alterado por é obrigatório para atualizações e deve ser um UUID válido.',
      });
  }

  // Valida campos informados
  if (atendimento !== undefined && !isValidUUID(atendimento)) {
    return res
      .status(400)
      .json({ error: 'Atendimento deve ser um UUID válido.' });
  }

  if (
    descricao !== undefined &&
    (!descricao || descricao.trim().length === 0)
  ) {
    return res
      .status(400)
      .json({ error: 'Descrição, quando informada, não pode estar vazia.' });
  }

  if (
    quantidade !== undefined &&
    (!Number.isInteger(quantidade) || quantidade <= 0)
  ) {
    return res
      .status(400)
      .json({ error: 'Quantidade deve ser um inteiro positivo.' });
  }

  // dia é texto livre, opcional

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
