const consulenteService = require('../services/consulente.service');

// Cria um novo consulente
const create = async (req, res) => {
  try {
    const data = req.body;
    const consulente = await consulenteService.create(data);
    res.status(201).json(consulente);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Lista todos os consulentes
const list = async (req, res) => {
  try {
    const consulentes = await consulenteService.list();
    res.status(200).json(consulentes);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Busca consulente por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const consulente = await consulenteService.getById(id);
    res.status(200).json(consulente);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Atualiza consulente por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const consulente = await consulenteService.update(id, data);
    res.status(200).json(consulente);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Remove consulente por ID
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await consulenteService.remove(id);
    res.status(200).json({ message: 'Consulente removido com sucesso!' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
