// Validações para o módulo Agenda

// Função auxiliar para validar UUID
function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str,
  );
}

// Middleware para validar ID da agenda
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !isValidUUID(id)) {
    return res.status(400).json({ erro: 'ID deve ser um UUID válido.' });
  }
  next();
};

// Middleware para validar criação de agenda
const validateCreate = (req, res, next) => {
  const { atendimento, tratamento, data, cadastradopor, presente, observacao } =
    req.body;

  // Campos obrigatórios
  if (!atendimento || !isValidUUID(atendimento)) {
    return res
      .status(400)
      .json({
        erro: 'Campo "atendimento" é obrigatório e deve ser um UUID válido.',
      });
  }
  if (!tratamento || !isValidUUID(tratamento)) {
    return res
      .status(400)
      .json({
        erro: 'Campo "tratamento" é obrigatório e deve ser um UUID válido.',
      });
  }
  if (!data) {
    return res.status(400).json({ erro: 'Campo "data" é obrigatório.' });
  }
  const parsedData = new Date(data);
  if (isNaN(parsedData.getTime())) {
    return res
      .status(400)
      .json({ erro: 'Campo "data" deve ser uma data válida.' });
  }
  if (!cadastradopor || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        erro: 'Campo "cadastradopor" é obrigatório e deve ser um UUID válido.',
      });
  }

  // Campos opcionais
  if (presente !== undefined && typeof presente !== 'boolean') {
    return res
      .status(400)
      .json({ erro: 'Campo "presente" deve ser um booleano.' });
  }
  if (
    observacao !== undefined &&
    (observacao === null || typeof observacao !== 'string')
  ) {
    return res
      .status(400)
      .json({ erro: 'Campo "observacao" deve ser um texto.' });
  }

  next();
};

// Middleware para validar atualização de agenda
const validateUpdate = (req, res, next) => {
  const { atendimento, tratamento, data, presente, observacao, alteradopor } =
    req.body;

  // Verificar se há pelo menos um campo editável
  const hasEditable = [
    'atendimento',
    'tratamento',
    'data',
    'presente',
    'observacao',
  ].some((field) => {
    const value = req.body[field];
    return value !== undefined && value !== null;
  });

  if (!hasEditable) {
    return res.status(400).json({
      erro: 'Pelo menos um dos campos editáveis deve ser informado: atendimento, tratamento, data, presente, observacao.',
    });
  }

  // Validar alteradopor (obrigatório na atualização)
  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        erro: 'Campo "alteradopor" é obrigatório e deve ser um UUID válido.',
      });
  }

  // Validar campos informados
  if (atendimento !== undefined) {
    if (!atendimento || !isValidUUID(atendimento)) {
      return res
        .status(400)
        .json({ erro: 'Campo "atendimento" deve ser um UUID válido.' });
    }
  }
  if (tratamento !== undefined) {
    if (!tratamento || !isValidUUID(tratamento)) {
      return res
        .status(400)
        .json({ erro: 'Campo "tratamento" deve ser um UUID válido.' });
    }
  }
  if (data !== undefined) {
    if (!data) {
      return res.status(400).json({ erro: 'Campo "data" não pode ser vazio.' });
    }
    const parsedData = new Date(data);
    if (isNaN(parsedData.getTime())) {
      return res
        .status(400)
        .json({ erro: 'Campo "data" deve ser uma data válida.' });
    }
  }
  if (presente !== undefined && typeof presente !== 'boolean') {
    return res
      .status(400)
      .json({ erro: 'Campo "presente" deve ser um booleano.' });
  }
  if (
    observacao !== undefined &&
    (observacao === null || typeof observacao !== 'string')
  ) {
    return res
      .status(400)
      .json({ erro: 'Campo "observacao" deve ser um texto.' });
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
