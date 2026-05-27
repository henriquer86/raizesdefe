const trabalhadorService = require('../services/trabalhador.service');

// Controlador para criar um novo trabalhador
async function create(req, res) {
  try {
    const data = req.body;
    const trabalhador = await trabalhadorService.create(data);
    return res.status(201).json(trabalhador);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
}

// Controlador para listar todos os trabalhadores
async function list(req, res) {
  try {
    const trabalhadores = await trabalhadorService.list();
    return res.status(200).json(trabalhadores);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
}

// Controlador para buscar trabalhador por ID
async function getById(req, res) {
  try {
    const { id } = req.params;
    const trabalhador = await trabalhadorService.getById(id);
    return res.status(200).json(trabalhador);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
}

// Controlador para atualizar trabalhador por ID
async function update(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const trabalhador = await trabalhadorService.update(id, data);
    return res.status(200).json(trabalhador);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
}

// Controlador para remover trabalhador por ID
async function remove(req, res) {
  try {
    const { id } = req.params;
    await trabalhadorService.remove(id);
    return res
      .status(200)
      .json({ message: 'Trabalhador removido com sucesso.' });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
