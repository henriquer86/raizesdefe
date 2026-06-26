/*
 * pessoa.validators.js
 * Arquivo de validadores para o módulo Pessoa.
 * Funções middleware para Express.js.
 */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidDate(dateString) {
  // Valida se a string está no formato YYYY-MM-DD e representa uma data válida
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const [year, month, day] = dateString.split('-').map(Number);
  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31)
    return false;

  const date = new Date(dateString + 'T00:00:00Z');
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !UUID_REGEX.test(id)) {
    return res.status(400).json({ erro: 'O ID deve ser um UUID válido.' });
  }

  next();
};

const validateCreate = (req, res, next) => {
  let { nome, telefone, datadenascimento, cadastradopor } = req.body;

  // Nome obrigatório
  if (typeof nome !== 'string') {
    return res.status(400).json({ erro: 'O nome deve ser uma string.' });
  }
  nome = nome.trim();
  if (nome.length < 1 || nome.length > 100) {
    return res
      .status(400)
      .json({ erro: 'O nome é obrigatório e deve ter de 1 a 100 caracteres.' });
  }

  // Telefone obrigatório
  if (typeof telefone !== 'string') {
    return res.status(400).json({ erro: 'O telefone deve ser uma string.' });
  }
  telefone = telefone.trim();
  if (telefone.length === 0) {
    return res
      .status(400)
      .json({ erro: 'O telefone é obrigatório e não pode ser vazio.' });
  }

  // Data de nascimento opcional
  if (datadenascimento !== undefined && datadenascimento !== null) {
    if (
      typeof datadenascimento !== 'string' ||
      !isValidDate(datadenascimento)
    ) {
      return res.status(400).json({
        erro: 'A data de nascimento deve estar no formato YYYY-MM-DD e ser uma data válida.',
      });
    }
  }

  // cadastradopor obrigatório e UUID válido
  if (!cadastradopor || !UUID_REGEX.test(cadastradopor)) {
    return res
      .status(400)
      .json({ erro: 'O cadastradopor deve ser um UUID válido.' });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { nome, telefone, datadenascimento, alteradopor } = req.body;

  // Pelo menos um campo editável deve ser informado
  if (
    nome === undefined &&
    telefone === undefined &&
    datadenascimento === undefined
  ) {
    return res.status(400).json({
      erro: 'Pelo menos um campo editável (nome, telefone ou datadenascimento) deve ser informado.',
    });
  }

  // Alterado por obrigatório
  if (!alteradopor || !UUID_REGEX.test(alteradopor)) {
    return res
      .status(400)
      .json({ erro: 'O alteradopor deve ser um UUID válido.' });
  }

  // Nome, se presente
  if (nome !== undefined) {
    const nomeTrimmed = typeof nome === 'string' ? nome.trim() : '';
    if (nomeTrimmed.length === 0 || nomeTrimmed.length > 100) {
      return res
        .status(400)
        .json({ erro: 'O nome deve ter de 1 a 100 caracteres.' });
    }
  }

  // Telefone, se presente
  if (telefone !== undefined) {
    const telefoneTrimmed = typeof telefone === 'string' ? telefone.trim() : '';
    if (telefoneTrimmed.length === 0) {
      return res.status(400).json({ erro: 'O telefone não pode ser vazio.' });
    }
  }

  // Data de nascimento, se presente
  if (datadenascimento !== undefined) {
    if (datadenascimento !== null) {
      if (
        typeof datadenascimento !== 'string' ||
        !isValidDate(datadenascimento)
      ) {
        return res.status(400).json({
          erro: 'A data de nascimento deve estar no formato YYYY-MM-DD e ser uma data válida.',
        });
      }
    }
    // null é permitido para limpar o campo
  }

  next();
};

module.exports = {
  validateCreate,
  validateUpdate,
  validateId,
};
