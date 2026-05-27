// src/modules/velaatendimento/validators/velaatendimento.validators.js

/**
 * Validadores para módulo VelaAtendimento
 */

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(uuid) {
  return uuidRegex.test(uuid);
}

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ mensagem: 'ID de vela atendimento inválido.' });
  }

  next();
};

const validateCreate = (req, res, next) => {
  const { atendimento, vela, cadastradopor, alteradopor } = req.body;

  if (!atendimento || !isValidUUID(atendimento)) {
    return res
      .status(400)
      .json({
        mensagem: 'Atendimento é obrigatório e deve ser um UUID válido.',
      });
  }

  if (!vela || !isValidUUID(vela)) {
    return res
      .status(400)
      .json({ mensagem: 'Vela é obrigatória e deve ser um UUID válido.' });
  }

  if (!cadastradopor || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({
        mensagem: 'Cadastrado por é obrigatório e deve ser um UUID válido.',
      });
  }

  if (alteradopor && !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({ mensagem: 'Alterado por deve ser um UUID válido.' });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { atendimento, vela, alteradopor } = req.body;

  // Verifica se há pelo menos um campo editável
  const hasEditable = atendimento !== undefined || vela !== undefined;
  if (!hasEditable) {
    return res
      .status(400)
      .json({
        mensagem:
          'Pelo menos um campo editável (atendimento ou vela) deve ser informado.',
      });
  }

  // Alterado por obrigatório em atualizações
  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res
      .status(400)
      .json({
        mensagem:
          'Alterado por é obrigatório e deve ser um UUID válido para atualizações.',
      });
  }

  // Valida campos informados
  if (atendimento !== undefined && !isValidUUID(atendimento)) {
    return res
      .status(400)
      .json({ mensagem: 'Atendimento deve ser um UUID válido.' });
  }

  if (vela !== undefined && !isValidUUID(vela)) {
    return res.status(400).json({ mensagem: 'Vela deve ser um UUID válido.' });
  }

  next();
};

module.exports = {
  validateId,
  validateCreate,
  validateUpdate,
};
