const repository = require('../repositories/itempade.repository');

const service = {
  async create(data) {
    // Recebe pade, item, cadastradopor e alteradopor opcional
    return repository.create(data);
  },

  async list() {
    return repository.findAll();
  },

  async getById(id) {
    const itemPade = await repository.findById(id);
    if (!itemPade) {
      const error = new Error('ItemPade não encontrado');
      error.status = 404;
      throw error;
    }
    return itemPade;
  },

  async update(id, data) {
    // Valida existência antes de atualizar
    const exists = await repository.findById(id);
    if (!exists) {
      const error = new Error('ItemPade não encontrado');
      error.status = 404;
      throw error;
    }
    return repository.update(id, data);
  },

  async remove(id) {
    // Valida existência antes de remover
    const exists = await repository.findById(id);
    if (!exists) {
      const error = new Error('ItemPade não encontrado');
      error.status = 404;
      throw error;
    }
    return repository.delete(id);
  },
};

module.exports = service;
