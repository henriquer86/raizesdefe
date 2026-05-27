const velaAtendimentoService = require('../services/velaatendimento.service');

// Controlador para criar nova VelaAtendimento
module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    const result = await velaAtendimentoService.create(data);
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Controlador para listar todas as VelaAtendimentos
module.exports.list = async (req, res) => {
  try {
    const result = await velaAtendimentoService.list();
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Controlador para buscar VelaAtendimento por ID
module.exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await velaAtendimentoService.getById(id);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Controlador para atualizar VelaAtendimento
module.exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await velaAtendimentoService.update(id, data);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

// Controlador para remover VelaAtendimento
module.exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    await velaAtendimentoService.remove(id);
    res.status(200).json({ message: 'VelaAtendimento removida com sucesso.' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};
