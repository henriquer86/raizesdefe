const pool = require('../../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função auxiliar para criar erro padronizado
function createError(code, message, details = null) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  return error;
}

async function login(nomeusuario, senha) {
  // Busca o usuário por nome de usuário
  const query =
    'SELECT id, nomeusuario, senhahash, nivelacesso, pessoa FROM usuario WHERE nomeusuario = $1';
  const result = await pool.query(query, [nomeusuario]);

  if (result.rows.length === 0) {
    throw createError(401, 'Credenciais inválidas', 'Usuário não encontrado');
  }

  const user = result.rows[0];

  // Compara a senha informada com o hash armazenado
  const senhaValida = await bcrypt.compare(senha, user.senhahash);
  if (!senhaValida) {
    throw createError(401, 'Credenciais inválidas', 'Senha incorreta');
  }

  // Verifica se JWT_SECRET está configurado
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError(
      500,
      'Erro interno do servidor',
      'Configuração JWT ausente',
    );
  }

  // Gera o token JWT com dados seguros do usuário
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  const payload = {
    id: user.id,
    nomeusuario: user.nomeusuario,
    nivelacesso: user.nivelacesso,
    pessoa: user.pessoa,
  };

  const token = jwt.sign(payload, secret, { expiresIn });

  // Retorna dados seguros do usuário (sem senhahash)
  const usuarioSeguro = {
    id: user.id,
    nomeusuario: user.nomeusuario,
    nivelacesso: user.nivelacesso,
    pessoa: user.pessoa,
  };

  return {
    token,
    user: usuarioSeguro,
  };
}

module.exports = { login };
