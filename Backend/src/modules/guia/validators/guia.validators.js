/**
 * Validadores para o módulo Guia
 * Backend Raízes de Fé
 */

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUUID(value) {
  return typeof value === 'string' && uuidRegex.test(value);
}

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!isUUID(id)) {
    return res
      .status(400)
      .json({ mensagem: 'O ID da guia deve ser um UUID válido.' });
  }

  next();
};

const validateCreate = (req, res, next) => {
  const { nome, trabalhador, cadastradopor, alteradopor } = req.body;

  // Valida nome
  if (!nome || typeof nome !== 'string') {
    return res
      .status(400)
      .json({ mensagem: 'O campo nome é obrigatório e deve ser uma string.' });
  }
  const trimmedNome = nome.trim();
  if (trimmedNome.length === 0 || trimmedNome.length > 150) {
    return res
      .status(400)
      .json({ mensagem: 'O nome deve ter entre 1 e 150 caracteres.' });
  }

  // Valida trabalhador
  if (!trabalhador || !isUUID(trabalhador)) {
    return res
      .status(400)
      .json({
        mensagem:
          'O campo trabalhador é obrigatório e deve ser um UUID válido.',
      });
  }

  // Valida cadastradopor
  if (!cadastradopor || !isUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        mensagem:
          'O campo cadastradopor é obrigatório e deve ser um UUID válido.',
      });
  }

  // Valida alteradopor se informado
  if (alteradopor && !isUUID(alteradopor)) {
    return res
      .status(400)
      .json({ mensagem: 'O campo alteradopor deve ser um UUID válido.' });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { nome, trabalhador, alteradopor } = req.body;

  // Verifica se há pelo menos um campo editável informado
  if (!nome && !trabalhador) {
    return res
      .status(400)
      .json({
        mensagem:
          'Pelo menos um dos campos nome ou trabalhador deve ser informado para atualização.',
      });
  }

  // Valida alteradopor (obrigatório na atualização)
  if (!alteradopor || !isUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        mensagem:
          'O campo alteradopor é obrigatório para atualizações e deve ser um UUID válido.',
      });
  }

  // Valida nome se informado
  if (nome && typeof nome !== 'string') {
    return res
      .status(400)
      .json({ mensagem: 'O campo nome deve ser uma string.' });
  }
  if (nome) {
    const trimmedNome = nome.trim();
    if (trimmedNome.length === 0 || trimmedNome.length > 150) {
      return res
        .status(400)
        .json({ mensagem: 'O nome deve ter entre 1 e 150 caracteres.' });
    }
  }

  // Valida trabalhador se informado
  if (trabalhador && !isUUID(trabalhador)) {
    return res
      .status(400)
      .json({ mensagem: 'O campo trabalhador deve ser um UUID válido.' });
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
