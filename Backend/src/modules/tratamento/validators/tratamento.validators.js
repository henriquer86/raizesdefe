// src/modules/tratamento/validators/tratamento.validators.js

// Regex robusta para validar UUID v4
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateUUID = (uuid) => uuid && UUID_REGEX.test(uuid);

// Verifica se a data é válida
const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

// Verifica se quantidade é inteiro positivo
const validateQuantidade = (q) => {
  const num = parseInt(q, 10);
  return !isNaN(num) && num > 0;
};

const validateCreate = (req, res, next) => {
  const {
    atendimento,
    tratamento,
    trabalhador,
    guia,
    quantidade,
    inicio,
    cadastradopor,
    alteradopor,
  } = req.body;

  // Validações de campos obrigatórios
  if (!atendimento || !validateUUID(atendimento)) {
    return res
      .status(400)
      .json({ error: 'Atendimento é obrigatório e deve ser um UUID válido.' });
  }

  if (
    !tratamento ||
    typeof tratamento !== 'string' ||
    tratamento.trim().length === 0 ||
    tratamento.length > 150
  ) {
    return res
      .status(400)
      .json({
        error:
          'Tratamento é obrigatório, deve ser uma string não vazia com no máximo 150 caracteres.',
      });
  }

  if (!trabalhador || !validateUUID(trabalhador)) {
    return res
      .status(400)
      .json({ error: 'Trabalhador é obrigatório e deve ser um UUID válido.' });
  }

  if (guia !== undefined && guia !== null && !validateUUID(guia)) {
    return res
      .status(400)
      .json({ error: 'Guia, quando informado, deve ser um UUID válido.' });
  }

  if (!quantidade || !validateQuantidade(quantidade)) {
    return res
      .status(400)
      .json({
        error: 'Quantidade é obrigatória e deve ser um inteiro positivo.',
      });
  }

  if (!inicio || !isValidDate(inicio)) {
    return res
      .status(400)
      .json({ error: 'Início é obrigatório e deve ser uma data/hora válida.' });
  }

  if (!cadastradopor || !validateUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        error: 'Cadastradopor é obrigatório e deve ser um UUID válido.',
      });
  }

  if (alteradopor && !validateUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        error: 'Alteradopor, quando informado, deve ser um UUID válido.',
      });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const {
    atendimento,
    tratamento,
    trabalhador,
    guia,
    quantidade,
    inicio,
    alteradopor,
  } = req.body;

  // Verifica se pelo menos um campo editável foi informado
  const editableFields = [
    'atendimento',
    'tratamento',
    'trabalhador',
    'guia',
    'quantidade',
    'inicio',
  ];
  const hasEditable = editableFields.some(
    (field) => req.body[field] !== undefined,
  );
  if (!hasEditable) {
    return res
      .status(400)
      .json({
        error:
          'Pelo menos um campo editável deve ser informado (atendimento, tratamento, trabalhador, guia, quantidade ou inicio).',
      });
  }

  // Alteradopor obrigatório na atualização
  if (!alteradopor || !validateUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        error:
          'Alteradopor é obrigatório na atualização e deve ser um UUID válido.',
      });
  }

  // Valida campos informados
  if (atendimento !== undefined && !validateUUID(atendimento)) {
    return res
      .status(400)
      .json({ error: 'Atendimento deve ser um UUID válido.' });
  }

  if (
    tratamento !== undefined &&
    (typeof tratamento !== 'string' ||
      tratamento.trim().length === 0 ||
      tratamento.length > 150)
  ) {
    return res
      .status(400)
      .json({
        error:
          'Tratamento deve ser uma string não vazia com no máximo 150 caracteres.',
      });
  }

  if (trabalhador !== undefined && !validateUUID(trabalhador)) {
    return res
      .status(400)
      .json({ error: 'Trabalhador deve ser um UUID válido.' });
  }

  if (guia !== undefined && guia !== null && !validateUUID(guia)) {
    return res
      .status(400)
      .json({ error: 'Guia, quando informado, deve ser um UUID válido.' });
  }

  if (quantidade !== undefined && !validateQuantidade(quantidade)) {
    return res
      .status(400)
      .json({ error: 'Quantidade deve ser um inteiro positivo.' });
  }

  if (inicio !== undefined && !isValidDate(inicio)) {
    return res
      .status(400)
      .json({ error: 'Início deve ser uma data/hora válida.' });
  }

  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !validateUUID(id)) {
    return res.status(400).json({ error: 'ID deve ser um UUID válido.' });
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
