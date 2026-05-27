const pessoaService = require('../services/pessoa.service');

// Controlador para criar uma nova pessoa
async function create(req, res) {
  try {
    const pessoa = await pessoaService.create(req.body);
    res.status(201).json(pessoa);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Controlador para listar todas as pessoas
async function list(req, res) {
  try {
    const pessoas = await pessoaService.list();
    res.status(200).json(pessoas);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Controlador para buscar pessoa por ID
async function getById(req, res) {
  try {
    const { id } = req.params;
    const pessoa = await pessoaService.getById(id);
    res.status(200).json(pessoa);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Controlador para atualizar pessoa por ID
async function update(req, res) {
  try {
    const { id } = req.params;
    const pessoa = await pessoaService.update(id, req.body);
    res.status(200).json(pessoa);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Controlador para remover pessoa por ID
async function remove(req, res) {
  try {
    const { id } = req.params;
    await pessoaService.remove(id);
    res.status(200).json({ message: 'Pessoa removida com sucesso.' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
