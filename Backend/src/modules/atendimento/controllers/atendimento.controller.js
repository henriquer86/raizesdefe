// Controller para o módulo Atendimento

const service = require('../services/atendimento.service');

// Cria um novo atendimento
const create = async (req, res) => {
  try {
    const atendimento = await service.create(req.body);
    res.status(201).json(atendimento);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Lista todos os atendimentos
const list = async (req, res) => {
  try {
    const atendimentos = await service.list();
    res.status(200).json(atendimentos);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Busca atendimento por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const atendimento = await service.getById(id);
    res.status(200).json(atendimento);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Atualiza atendimento por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const atendimento = await service.update(id, data);
    res.status(200).json(atendimento);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Remove atendimento por ID
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await service.remove(id);
    res.status(200).json({ message: 'Atendimento removido com sucesso.' });
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
