const consulenteRepository = require('../repositories/consulente.repository');

const consulenteService = {
  async create(data) {
    // Recebe: pessoa, cadastradopor, alteradopor
    return await consulenteRepository.create(data);
  },

  async list() {
    return await consulenteRepository.findAll();
  },

  async getById(id) {
    const consulente = await consulenteRepository.findById(id);
    if (!consulente) {
      const error = new Error('Consulente não encontrado');
      error.status = 404;
      throw error;
    }
    return consulente;
  },

  async update(id, data) {
    const exists = await consulenteRepository.findById(id);
    if (!exists) {
      const error = new Error('Consulente não encontrado');
      error.status = 404;
      throw error;
    }
    return await consulenteRepository.update(id, data);
  },

  async remove(id) {
    const exists = await consulenteRepository.findById(id);
    if (!exists) {
      const error = new Error('Consulente não encontrado');
      error.status = 404;
      throw error;
    }
    await consulenteRepository.delete(id);
  },
};

module.exports = consulenteService;
