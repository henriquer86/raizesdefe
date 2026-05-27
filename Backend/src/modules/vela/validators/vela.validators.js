const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Função auxiliar para validar UUID
function isValidUUID(str) {
  return typeof str === 'string' && uuidRegex.test(str);
}

// Middleware para validar criação de vela
function validateCreate(req, res, next) {
  const { guia, cor, cadastradopor, alteradopor } = req.body;

  // Valida guia
  if (
    !guia ||
    typeof guia !== 'string' ||
    guia.length < 1 ||
    guia.length > 250
  ) {
    return res
      .status(400)
      .json({
        erro: 'Guia é obrigatória e deve ter entre 1 e 250 caracteres.',
      });
  }

  // Valida cor
  if (!cor || typeof cor !== 'string' || cor.length < 1 || cor.length > 150) {
    return res
      .status(400)
      .json({ erro: 'Cor é obrigatória e deve ter entre 1 e 150 caracteres.' });
  }

  // Valida cadastradopor
  if (!cadastradopor || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        erro: 'Cadastrado por é obrigatório e deve ser um UUID válido.',
      });
  }

  // Valida alteradopor se informado
  if (alteradopor && !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({ erro: 'Alterado por deve ser um UUID válido.' });
  }

  next();
}

// Middleware para validar atualização de vela
function validateUpdate(req, res, next) {
  const { guia, cor, alteradopor } = req.body;

  // Exige pelo menos um campo editável
  if (!guia && !cor) {
    return res
      .status(400)
      .json({
        erro: 'Pelo menos um campo editável (guia ou cor) deve ser informado para atualização.',
      });
  }

  // Valida alteradopor obrigatório
  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        erro: 'Alterado por é obrigatório e deve ser um UUID válido para atualização.',
      });
  }

  // Valida guia se informado
  if (
    guia !== undefined &&
    (typeof guia !== 'string' || guia.length < 1 || guia.length > 250)
  ) {
    return res
      .status(400)
      .json({ erro: 'Guia deve ter entre 1 e 250 caracteres.' });
  }

  // Valida cor se informado
  if (
    cor !== undefined &&
    (typeof cor !== 'string' || cor.length < 1 || cor.length > 150)
  ) {
    return res
      .status(400)
      .json({ erro: 'Cor deve ter entre 1 e 150 caracteres.' });
  }

  next();
}

// Middleware para validar ID nos parâmetros
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
