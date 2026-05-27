const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Valida o ID do PADE na URL
const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !UUID_REGEX.test(id)) {
    return res
      .status(400)
      .json({ message: 'ID do PADE deve ser um UUID válido.' });
  }

  next();
};

// Valida criação de PADE
const validateCreate = (req, res, next) => {
  const { atendimento, guia, cadastradopor, alteradopor } = req.body;

  // Campos obrigatórios
  if (!atendimento || !UUID_REGEX.test(atendimento)) {
    return res
      .status(400)
      .json({
        message: 'Atendimento é obrigatório e deve ser um UUID válido.',
      });
  }

  if (!guia || !UUID_REGEX.test(guia)) {
    return res
      .status(400)
      .json({ message: 'Guia é obrigatório e deve ser um UUID válido.' });
  }

  if (!cadastradopor || !UUID_REGEX.test(cadastradopor)) {
    return res
      .status(400)
      .json({
        message: 'Cadastrado por é obrigatório e deve ser um UUID válido.',
      });
  }

  // Alterado por opcional, mas deve ser UUID se informado
  if (alteradopor && !UUID_REGEX.test(alteradopor)) {
    return res
      .status(400)
      .json({ message: 'Alterado por deve ser um UUID válido.' });
  }

  next();
};

// Valida atualização de PADE
const validateUpdate = (req, res, next) => {
  const { atendimento, guia, alteradopor } = req.body;

  // Verifica se há pelo menos um campo editável (atendimento ou guia)
  const hasEditableFields = atendimento !== undefined || guia !== undefined;
  if (!hasEditableFields) {
    return res
      .status(400)
      .json({
        message:
          'Pelo menos um campo editável (atendimento ou guia) deve ser informado para atualização.',
      });
  }

  // Alterado por obrigatório para atualização
  if (!alteradopor || !UUID_REGEX.test(alteradopor)) {
    return res
      .status(400)
      .json({
        message:
          'Alterado por é obrigatório e deve ser um UUID válido para atualização.',
      });
  }

  // Valida campos informados
  if (atendimento !== undefined && !UUID_REGEX.test(atendimento)) {
    return res
      .status(400)
      .json({ message: 'Atendimento deve ser um UUID válido.' });
  }

  if (guia !== undefined && !UUID_REGEX.test(guia)) {
    return res.status(400).json({ message: 'Guia deve ser um UUID válido.' });
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
