const itemRepository = require('../repositories/item.repository');

const itemService = {
  async create(data) {
    const { nome, cadastradopor, alteradopor } = data;
    return itemRepository.create({ nome, cadastradopor, alteradopor });
  },

  async list() {
    return itemRepository.findAll();
  },

  async getById(id) {
    const item = await itemRepository.findById(id);
    if (!item) {
      const error = new Error('Item não encontrado');
      error.status = 404;
      throw error;
    }
    return item;
  },

  async update(id, data) {
    const item = await itemRepository.findById(id);
    if (!item) {
      const error = new Error('Item não encontrado');
      error.status = 404;
      throw error;
    }
    return itemRepository.update(id, data);
  },

  async remove(id) {
    const item = await itemRepository.findById(id);
    if (!item) {
      const error = new Error('Item não encontrado');
      error.status = 404;
      throw error;
    }
    return itemRepository.delete(id);
  },
};

module.exports = itemService;
