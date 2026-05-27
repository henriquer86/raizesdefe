const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Função auxiliar para validar UUID
function isValidUUID(uuid) {
  return UUID_REGEX.test(uuid);
}

// Valida o ID do item nos parâmetros da requisição (para busca e atualização)
const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ error: 'ID do item deve ser um UUID válido.' });
  }

  next();
};

// Valida entrada para criação de item
const validateCreate = (req, res, next) => {
  const { nome, cadastradopor, alteradopor } = req.body;

  // Nome obrigatório: string de 1 a 150 caracteres
  if (
    !nome ||
    typeof nome !== 'string' ||
    nome.length < 1 ||
    nome.length > 150
  ) {
    return res
      .status(400)
      .json({
        error: 'Nome é obrigatório e deve ter entre 1 e 150 caracteres.',
      });
  }

  // Cadastrado por obrigatório: UUID válido
  if (!cadastradopor || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        error: 'Cadastrado por é obrigatório e deve ser um UUID válido.',
      });
  }

  // Alterado por opcional: UUID válido se informado
  if (alteradopor && !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({ error: 'Alterado por deve ser um UUID válido.' });
  }

  next();
};

// Valida entrada para atualização de item
// Exige nome (único campo editável) e alteradopor
const validateUpdate = (req, res, next) => {
  const { nome, alteradopor } = req.body;

  // Pelo menos nome deve ser informado (campo editável)
  if (nome === undefined) {
    return res
      .status(400)
      .json({
        error: 'Pelo menos o campo "nome" deve ser informado para atualização.',
      });
  }

  // Nome: string de 1 a 150 caracteres
  if (typeof nome !== 'string' || nome.length < 1 || nome.length > 150) {
    return res
      .status(400)
      .json({ error: 'Nome deve ter entre 1 e 150 caracteres.' });
  }

  // Alterado por obrigatório: UUID válido
  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        error:
          'Alterado por é obrigatório e deve ser um UUID válido para atualização.',
      });
  }

  next();
};

module.exports = {
  validateId,
  validateCreate,
  validateUpdate,
};
