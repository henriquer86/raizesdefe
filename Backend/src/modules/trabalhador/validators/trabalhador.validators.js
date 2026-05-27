const validateUuid = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Middleware para validar criação de trabalhador
const validateCreate = (req, res, next) => {
  const { pessoa, funcao, cadastradopor, alteradopor } = req.body;

  if (!pessoa || !validateUuid(pessoa)) {
    return res
      .status(400)
      .json({ error: 'Pessoa deve ser um UUID válido e é obrigatória.' });
  }

  if (!funcao || !validateUuid(funcao)) {
    return res
      .status(400)
      .json({ error: 'Função deve ser um UUID válido e é obrigatória.' });
  }

  if (!cadastradopor || !validateUuid(cadastradopor)) {
    return res
      .status(400)
      .json({
        error: 'Cadastrado por deve ser um UUID válido e é obrigatório.',
      });
  }

  if (alteradopor && !validateUuid(alteradopor)) {
    return res
      .status(400)
      .json({ error: 'Alterado por deve ser um UUID válido.' });
  }

  next();
};

// Middleware para validar atualização de trabalhador
const validateUpdate = (req, res, next) => {
  const { pessoa, funcao, alteradopor } = req.body;

  // Verifica se há pelo menos um campo editável
  const hasEditable =
    pessoa !== undefined || funcao !== undefined || alteradopor !== undefined;
  if (!hasEditable) {
    return res
      .status(400)
      .json({
        error:
          'Pelo menos um campo editável deve ser informado (pessoa, função ou alterado por).',
      });
  }

  // Alterado por é obrigatório em atualizações
  if (!alteradopor || !validateUuid(alteradopor)) {
    return res
      .status(400)
      .json({
        error:
          'Alterado por é obrigatório para atualizações e deve ser um UUID válido.',
      });
  }

  // Valida campos informados
  if (pessoa !== undefined && !validateUuid(pessoa)) {
    return res.status(400).json({ error: 'Pessoa deve ser um UUID válido.' });
  }

  if (funcao !== undefined && !validateUuid(funcao)) {
    return res.status(400).json({ error: 'Função deve ser um UUID válido.' });
  }

  next();
};

// Middleware para validar ID de trabalhador
const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !validateUuid(id)) {
    return res.status(400).json({ error: 'ID deve ser um UUID válido.' });
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
