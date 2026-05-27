const padeRepository = require('../repositories/pade.repository');

const padeService = {
  async create(data) {
    const { atendimento, guia, cadastradopor, alteradopor } = data;
    return padeRepository.create({
      atendimento,
      guia,
      cadastradopor,
      alteradopor,
    });
  },

  async list() {
    return padeRepository.findAll();
  },

  async getById(id) {
    const pade = await padeRepository.findById(id);
    if (!pade) {
      const error = new Error('PADE não encontrado');
      error.status = 404;
      throw error;
    }
    return pade;
  },

  async update(id, data) {
    const pade = await padeRepository.findById(id);
    if (!pade) {
      const error = new Error('PADE não encontrado');
      error.status = 404;
      throw error;
    }
    return padeRepository.update(id, data);
  },

  async remove(id) {
    const pade = await padeRepository.findById(id);
    if (!pade) {
      const error = new Error('PADE não encontrado');
      error.status = 404;
      throw error;
    }
    return padeRepository.delete(id);
  },
};

module.exports = padeService;
