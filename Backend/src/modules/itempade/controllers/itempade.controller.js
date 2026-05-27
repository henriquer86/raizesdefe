const itempadeService = require('../services/itempade.service');

const itempadeController = {
  // Cria um novo ItemPade
  async create(req, res) {
    try {
      const data = req.body;
      const itemPade = await itempadeService.create(data);
      res.status(201).json(itemPade);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Lista todos os ItemPade
  async list(req, res) {
    try {
      const items = await itempadeService.list();
      res.status(200).json(items);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Busca ItemPade por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const itemPade = await itempadeService.getById(id);
      res.status(200).json(itemPade);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Atualiza ItemPade por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const itemPade = await itempadeService.update(id, data);
      res.status(200).json(itemPade);
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },

  // Remove ItemPade por ID
  async remove(req, res) {
    try {
      const { id } = req.params;
      await itempadeService.remove(id);
      res.status(200).json({ message: 'ItemPade excluído com sucesso.' });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: error.message });
    }
  },
};

module.exports = itempadeController;
