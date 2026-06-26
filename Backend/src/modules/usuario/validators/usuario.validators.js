// src/modules/usuario/validators/usuario.validators.js
// Validadores para o módulo Usuário - Backend Raízes de Fé
// Validações simples sem bibliotecas externas

// Regex robusta para UUID (versão 4)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(str) {
  return typeof str === 'string' && UUID_REGEX.test(str);
}

function validateId(req, res, next) {
  const { id } = req.params;

  if (!id || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ erro: 'ID do usuário deve ser um UUID válido.' });
  }

  next();
}

function validateCreate(req, res, next) {
  const { nomeusuario, senhahash, nivelacesso, pessoa, cadastradopor } =
    req.body;

  // Validação nomeusuario: obrigatório, string, 1-20 chars
  if (
    !nomeusuario ||
    typeof nomeusuario !== 'string' ||
    nomeusuario.trim().length < 1 ||
    nomeusuario.trim().length > 20
  ) {
    return res.status(400).json({
      erro: 'Nome de usuário obrigatório, string de 1 a 20 caracteres.',
    });
  }

  // Validação senhahash: obrigatória, string min 6 chars (hash tratado no service)
  if (!senhahash || typeof senhahash !== 'string' || senhahash.length < 6) {
    return res
      .status(400)
      .json({ erro: 'Senha obrigatória, string com no mínimo 6 caracteres.' });
  }

  // Validação nivelacesso: obrigatório, string, 1-20 chars
  if (
    !nivelacesso ||
    typeof nivelacesso !== 'string' ||
    nivelacesso.trim().length < 1 ||
    nivelacesso.trim().length > 20
  ) {
    return res.status(400).json({
      erro: 'Nível de acesso obrigatório, string de 1 a 20 caracteres.',
    });
  }

  // Validação pessoa: obrigatório UUID
  if (!pessoa || !isValidUUID(pessoa)) {
    return res
      .status(400)
      .json({ erro: 'Pessoa obrigatória, deve ser um UUID válido.' });
  }

  // Validação cadastradopor: obrigatório UUID
  if (!cadastradopor || !isValidUUID(cadastradopor)) {
    return res
      .status(400)
      .json({ erro: 'Cadastrado por obrigatório, deve ser um UUID válido.' });
  }

  // Sanitização simples
  req.body.nomeusuario = nomeusuario.trim();
  req.body.nivelacesso = nivelacesso.trim();

  next();
}

function validateUpdate(req, res, next) {
  const { id } = req.params;
  const { nomeusuario, senha, nivelacesso, alteradopor } = req.body;

  // Validação ID param
  if (!id || !isValidUUID(id)) {
    return res
      .status(400)
      .json({ erro: 'ID do usuário deve ser um UUID válido.' });
  }

  // Verificar se há pelo menos um campo editável
  const hasEditable =
    nomeusuario !== undefined ||
    senha !== undefined ||
    nivelacesso !== undefined;
  if (!hasEditable) {
    return res.status(400).json({
      erro: 'Pelo menos um campo editável deve ser informado (nomeusuario, senha ou nivelacesso).',
    });
  }

  // Validação nomeusuario se presente
  if (nomeusuario !== undefined) {
    if (
      typeof nomeusuario !== 'string' ||
      nomeusuario.trim().length < 1 ||
      nomeusuario.trim().length > 20
    ) {
      return res.status(400).json({
        erro: 'Nome de usuário deve ser string de 1 a 20 caracteres.',
      });
    }
    req.body.nomeusuario = nomeusuario.trim();
  }

  // Validação senha se presente (hash tratado no service)
  if (senha !== undefined) {
    if (typeof senha !== 'string' || senha.length < 6) {
      return res
        .status(400)
        .json({ erro: 'Senha deve ser string com no mínimo 6 caracteres.' });
    }
  }

  // Validação nivelacesso se presente
  if (nivelacesso !== undefined) {
    if (
      typeof nivelacesso !== 'string' ||
      nivelacesso.trim().length < 1 ||
      nivelacesso.trim().length > 20
    ) {
      return res.status(400).json({
        erro: 'Nível de acesso deve ser string de 1 a 20 caracteres.',
      });
    }
    req.body.nivelacesso = nivelacesso.trim();
  }

  // Validação alteradopor: obrigatório na atualização
  if (!alteradopor || !isValidUUID(alteradopor)) {
    return res.status(400).json({
      erro: 'Alterado por obrigatório na atualização, deve ser um UUID válido.',
    });
  }

  next();
}

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
