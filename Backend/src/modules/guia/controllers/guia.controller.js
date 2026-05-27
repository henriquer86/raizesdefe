const GuiaService = require('../services/guia.service');

// Controlador do módulo Guia

async function create(req, res) {
  try {
    const guia = await GuiaService.create(req.body);
    res.status(201).json(guia);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

async function list(req, res) {
  try {
    const guias = await GuiaService.list();
    res.status(200).json(guias);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const guia = await GuiaService.getById(id);
    res.status(200).json(guia);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const guia = await GuiaService.update(id, req.body);
    res.status(200).json(guia);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    await GuiaService.remove(id);
    res.status(200).json({ message: 'Guia removido com sucesso.' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
