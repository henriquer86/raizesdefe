/*
 * Validações para o módulo de Atendimento
 * Backend Raízes de Fé
 */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Valida o ID do atendimento nos parâmetros.
 */
function validateId(req, res, next) {
  const { id } = req.params;

  if (!id || !UUID_REGEX.test(id)) {
    return res.status(400).json({ mensagem: 'ID de atendimento inválido.' });
  }

  next();
}

/**
 * Valida entrada para criação de atendimento.
 */
function validateCreate(req, res, next) {
  const { entidade, consulente, observacoes, cadastradopor, alteradopor } =
    req.body;

  // Entidade obrigatória e UUID válido
  if (!entidade || !UUID_REGEX.test(entidade)) {
    return res
      .status(400)
      .json({ mensagem: 'Entidade é obrigatória e deve ser um UUID válido.' });
  }

  // Consulente obrigatório e UUID válido
  if (!consulente || !UUID_REGEX.test(consulente)) {
    return res
      .status(400)
      .json({
        mensagem: 'Consulente é obrigatório e deve ser um UUID válido.',
      });
  }

  // Observações opcional, string
  if (observacoes !== undefined && typeof observacoes !== 'string') {
    return res
      .status(400)
      .json({ mensagem: 'Observações deve ser uma string.' });
  }

  // Cadastrado por obrigatório e UUID válido
  if (!cadastradopor || !UUID_REGEX.test(cadastradopor)) {
    return res
      .status(400)
      .json({
        mensagem: 'Cadastrado por é obrigatório e deve ser um UUID válido.',
      });
  }

  // Alterado por opcional, UUID se informado
  if (alteradopor !== undefined && !UUID_REGEX.test(alteradopor)) {
    return res
      .status(400)
      .json({ mensagem: 'Alterado por deve ser um UUID válido.' });
  }

  next();
}

/**
 * Valida entrada para atualização de atendimento.
 */
function validateUpdate(req, res, next) {
  const { id } = req.params;
  const { entidade, consulente, observacoes, alteradopor } = req.body;

  // ID obrigatório e UUID válido
  if (!id || !UUID_REGEX.test(id)) {
    return res.status(400).json({ mensagem: 'ID de atendimento inválido.' });
  }

  // Pelo menos um campo editável
  const hasEditable =
    entidade !== undefined ||
    consulente !== undefined ||
    observacoes !== undefined;

  if (!hasEditable) {
    return res.status(400).json({
      mensagem:
        'Pelo menos um campo editável (entidade, consulente ou observações) deve ser informado.',
    });
  }

  // Alterado por obrigatório para atualizações
  if (!alteradopor || !UUID_REGEX.test(alteradopor)) {
    return res.status(400).json({
      mensagem:
        'Alterado por é obrigatório para atualizações e deve ser um UUID válido.',
    });
  }

  // Validar campos informados
  if (entidade !== undefined && !UUID_REGEX.test(entidade)) {
    return res
      .status(400)
      .json({ mensagem: 'Entidade deve ser um UUID válido.' });
  }

  if (consulente !== undefined && !UUID_REGEX.test(consulente)) {
    return res
      .status(400)
      .json({ mensagem: 'Consulente deve ser um UUID válido.' });
  }

  if (observacoes !== undefined && typeof observacoes !== 'string') {
    return res
      .status(400)
      .json({ mensagem: 'Observações deve ser uma string.' });
  }

  next();
}

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
