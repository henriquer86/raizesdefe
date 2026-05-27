const agendaService = require('../services/agenda.service');

const agendaController = {
  // Cria um novo registro na agenda
  async create(req, res) {
    try {
      const data = req.body;
      const agenda = await agendaService.create(data);
      res.status(201).json(agenda);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Lista todos os registros da agenda
  async list(req, res) {
    try {
      const agendas = await agendaService.list();
      res.status(200).json(agendas);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Busca um registro por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const agenda = await agendaService.getById(id);
      res.status(200).json(agenda);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Atualiza um registro por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const agenda = await agendaService.update(id, data);
      res.status(200).json(agenda);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Remove um registro por ID
  async remove(req, res) {
    try {
      const { id } = req.params;
      await agendaService.remove(id);
      res
        .status(200)
        .json({ message: 'Registro da agenda removido com sucesso.' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },
};

module.exports = agendaController;
