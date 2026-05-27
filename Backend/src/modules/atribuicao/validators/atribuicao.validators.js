const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Função auxiliar para validar UUID v4
function isValidUUID(str) {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  return trimmed.length === 36 && uuidRegex.test(trimmed);
}

const validateId = (req, res, next) => {
  // Valida ID na URL para busca/atualização/exclusão
  if (!req.params.id || !isValidUUID(req.params.id)) {
    return res
      .status(400)
      .json({ erro: 'O ID da atribuição deve ser um UUID válido.' });
  }
  next();
};

const validateCreate = (req, res, next) => {
  // Valida body para criação de atribuição
  const { funcao, cadastradopor, alteradopor, nome, descricao } = req.body;

  // Função obrigatória
  if (funcao === undefined || !isValidUUID(funcao)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "funcao" é obrigatório e deve ser um UUID válido.',
      });
  }

  // Cadastrado por obrigatório
  if (cadastradopor === undefined || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "cadastradopor" é obrigatório e deve ser um UUID válido.',
      });
  }

  // Alterado por opcional
  if (alteradopor !== undefined && !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "alteradopor", se informado, deve ser um UUID válido.',
      });
  }

  // Nome opcional, mas válido se presente
  if (nome !== undefined) {
    if (typeof nome !== 'string') {
      return res
        .status(400)
        .json({ erro: 'O campo "nome" deve ser uma string.' });
    }
    const nomeTrimmed = nome.trim();
    if (nomeTrimmed.length < 1 || nomeTrimmed.length > 100) {
      return res
        .status(400)
        .json({ erro: 'O campo "nome" deve ter entre 1 e 100 caracteres.' });
    }
  }

  // Descrição opcional, mas string se presente
  if (descricao !== undefined && typeof descricao !== 'string') {
    return res
      .status(400)
      .json({ erro: 'O campo "descricao" deve ser uma string.' });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  // Valida body para atualização parcial de atribuição
  const { alteradopor, nome, descricao, funcao } = req.body;

  // Alterado por obrigatório para update
  if (alteradopor === undefined || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        erro: 'O campo "alteradopor" é obrigatório para atualizações e deve ser um UUID válido.',
      });
  }

  // Pelo menos um campo editável
  const camposEditaveis = ['nome', 'descricao', 'funcao'];
  const temEditavel = camposEditaveis.some(
    (campo) => req.body[campo] !== undefined,
  );
  if (!temEditavel) {
    return res
      .status(400)
      .json({
        erro: 'Pelo menos um campo editável deve ser fornecido: nome, descricao ou funcao.',
      });
  }

  // Valida nome se presente
  if (nome !== undefined) {
    if (typeof nome !== 'string') {
      return res
        .status(400)
        .json({ erro: 'O campo "nome" deve ser uma string.' });
    }
    const nomeTrimmed = nome.trim();
    if (nomeTrimmed.length < 1 || nomeTrimmed.length > 100) {
      return res
        .status(400)
        .json({ erro: 'O campo "nome" deve ter entre 1 e 100 caracteres.' });
    }
  }

  // Valida descricao se presente
  if (descricao !== undefined && typeof descricao !== 'string') {
    return res
      .status(400)
      .json({ erro: 'O campo "descricao" deve ser uma string.' });
  }

  // Valida funcao se presente
  if (funcao !== undefined && !isValidUUID(funcao)) {
    return res
      .status(400)
      .json({ erro: 'O campo "funcao" deve ser um UUID válido.' });
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
