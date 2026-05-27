// Importa o serviço do módulo Banho
const banhoService = require('../services/banho.service');

// Controlador para criar um novo banho
const create = async (req, res) => {
  try {
    const data = req.body;
    const banho = await banhoService.create(data);
    return res.status(201).json(banho);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Lista todos os banhos
const list = async (req, res) => {
  try {
    const banhos = await banhoService.list();
    return res.status(200).json(banhos);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Busca banho por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const banho = await banhoService.getById(id);
    return res.status(200).json(banho);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Atualiza banho por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const banho = await banhoService.update(id, data);
    return res.status(200).json(banho);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Remove banho por ID
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await banhoService.remove(id);
    return res.status(200).json({ message: 'Banho removido com sucesso.' });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
