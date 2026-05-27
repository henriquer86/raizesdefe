const authService = require('../services/auth.service');

// Controlador para login de usuário
async function login(req, res) {
  try {
    const { nomeusuario, senha } = req.body;

    if (!nomeusuario || !senha) {
      return res.status(400).json({
        code: 400,
        message: 'Nome de usuário e senha são obrigatórios',
        details: null,
      });
    }

    const result = await authService.login(nomeusuario, senha);
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        code: error.status,
        message: error.message,
        details: error.details || null,
      });
    }
    console.error('Erro no login:', error);
    res.status(500).json({
      code: 500,
      message: 'Erro interno do servidor',
      details: error.message,
    });
  }
}

// Controlador para obter dados do usuário autenticado
async function me(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: 'Não autorizado. Token inválido ou ausente.',
        details: null,
      });
    }

    // Campos seguros do usuário
    const { id, nomeusuario, nivelacesso, pessoa } = req.user;

    res.status(200).json({
      user: {
        id,
        nomeusuario,
        nivelacesso,
        pessoa,
      },
    });
  } catch (error) {
    console.error('Erro no me:', error);
    res.status(500).json({
      code: 500,
      message: 'Erro interno do servidor',
      details: error.message,
    });
  }
}

// Controlador para logout (simples, pois JWT é stateless)
async function logout(req, res) {
  try {
    // Logout no front-end: limpar token local
    res.status(200).json({
      message: 'Logout realizado com sucesso. Token invalidado no cliente.',
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      code: 500,
      message: 'Erro interno do servidor',
      details: error.message,
    });
  }
}

module.exports = {
  login,
  me,
  logout,
};
