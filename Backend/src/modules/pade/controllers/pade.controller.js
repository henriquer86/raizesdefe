const padeService = require('../services/pade.service');

const padeController = {
  // Cria um novo PADE
  async create(req, res) {
    try {
      const data = req.body;
      const pade = await padeService.create(data);
      res.status(201).json(pade);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ mensagem: error.message });
    }
  },

  // Lista todos os PADEs
  async list(req, res) {
    try {
      const pades = await padeService.list();
      res.status(200).json(pades);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ mensagem: error.message });
    }
  },

  // Busca PADE por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pade = await padeService.getById(id);
      res.status(200).json(pade);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ mensagem: error.message });
    }
  },

  // Atualiza PADE por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const pade = await padeService.update(id, data);
      res.status(200).json(pade);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ mensagem: error.message });
    }
  },

  // Remove PADE por ID
  async remove(req, res) {
    try {
      const { id } = req.params;
      await padeService.remove(id);
      res.status(200).json({ mensagem: 'PADE excluído com sucesso.' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ mensagem: error.message });
    }
  },
};

module.exports = padeController;
