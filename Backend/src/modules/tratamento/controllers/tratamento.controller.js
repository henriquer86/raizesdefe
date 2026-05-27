const tratamentoService = require('../services/tratamento.service');

const tratamentoController = {
  // Cria um novo tratamento
  async create(req, res) {
    try {
      const data = req.body;
      const tratamento = await tratamentoService.create(data);
      res.status(201).json(tratamento);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Lista todos os tratamentos
  async list(req, res) {
    try {
      const tratamentos = await tratamentoService.list();
      res.status(200).json(tratamentos);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Busca tratamento por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const tratamento = await tratamentoService.getById(id);
      res.status(200).json(tratamento);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Atualiza tratamento por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const tratamento = await tratamentoService.update(id, data);
      res.status(200).json(tratamento);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Remove tratamento por ID
  async remove(req, res) {
    try {
      const { id } = req.params;
      await tratamentoService.remove(id);
      res.status(200).json({ message: 'Tratamento excluído com sucesso.' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },
};

module.exports = tratamentoController;
