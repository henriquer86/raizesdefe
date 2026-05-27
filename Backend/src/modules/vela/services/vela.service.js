const velaRepository = require('../repositories/vela.repository');

const velaService = {
  async create(data) {
    const { guia, cor, cadastradopor, alteradopor } = data;
    return await velaRepository.create({
      guia,
      cor,
      cadastradopor,
      ...(alteradopor && { alteradopor }),
    });
  },

  async list() {
    return await velaRepository.findAll();
  },

  async getById(id) {
    const vela = await velaRepository.findById(id);
    if (!vela) {
      const error = new Error('Vela não encontrada');
      error.status = 404;
      throw error;
    }
    return vela;
  },

  async update(id, data) {
    const vela = await velaRepository.findById(id);
    if (!vela) {
      const error = new Error('Vela não encontrada');
      error.status = 404;
      throw error;
    }
    return await velaRepository.update(id, data);
  },

  async remove(id) {
    const vela = await velaRepository.findById(id);
    if (!vela) {
      const error = new Error('Vela não encontrada');
      error.status = 404;
      throw error;
    }
    await velaRepository.delete(id);
  },
};

module.exports = velaService;
