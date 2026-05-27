const usuarioService = require('../services/usuario.service');

// Controlador para criar um novo usuário
module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    const usuario = await usuarioService.create(data);
    return res.status(201).json(usuario);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Controlador para listar todos os usuários
module.exports.list = async (req, res) => {
  try {
    const usuarios = await usuarioService.list();
    return res.status(200).json(usuarios);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Controlador para buscar usuário por ID
module.exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.getById(id);
    return res.status(200).json(usuario);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Controlador para atualizar usuário por ID
module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const usuario = await usuarioService.update(id, data);
    return res.status(200).json(usuario);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Controlador para remover usuário por ID
module.exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await usuarioService.remove(id);
    return res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};
