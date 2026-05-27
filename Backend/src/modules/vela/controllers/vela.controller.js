const velaService = require('../services/vela.service');

// Cria uma nova vela
const create = async (req, res) => {
  try {
    const vela = await velaService.create(req.body);
    return res.status(201).json(vela);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Lista todas as velas
const list = async (req, res) => {
  try {
    const velas = await velaService.list();
    return res.status(200).json(velas);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Busca vela por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const vela = await velaService.getById(id);
    return res.status(200).json(vela);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Atualiza vela por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const vela = await velaService.update(id, req.body);
    return res.status(200).json(vela);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
};

// Remove vela por ID
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await velaService.remove(id);
    return res.status(200).json({ message: 'Vela excluída com sucesso.' });
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
