const itemService = require('../services/item.service');

// Controlador para criar um novo item
const create = async (req, res) => {
  try {
    const data = req.body;
    const item = await itemService.create(data);
    return res.status(201).json(item);
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json({ message: error.message || 'Erro interno do servidor' });
  }
};

// Controlador para listar todos os itens
const list = async (req, res) => {
  try {
    const items = await itemService.list();
    return res.status(200).json(items);
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json({ message: error.message || 'Erro interno do servidor' });
  }
};

// Controlador para buscar item por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await itemService.getById(id);
    return res.status(200).json(item);
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json({ message: error.message || 'Erro interno do servidor' });
  }
};

// Controlador para atualizar item por ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const item = await itemService.update(id, data);
    return res.status(200).json(item);
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json({ message: error.message || 'Erro interno do servidor' });
  }
};

// Controlador para remover item por ID
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await itemService.remove(id);
    return res.status(200).json({ message: 'Item removido com sucesso' });
  } catch (error) {
    const status = error.status || 500;
    return res
      .status(status)
      .json({ message: error.message || 'Erro interno do servidor' });
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
