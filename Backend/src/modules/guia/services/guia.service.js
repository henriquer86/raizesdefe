const guiaRepository = require('../repositories/guia.repository');

const guiaService = {
  async create(data) {
    const { nome, trabalhador, cadastradopor, alteradopor } = data;
    return guiaRepository.create({
      nome,
      trabalhador,
      cadastradopor,
      alteradopor,
    });
  },

  async list() {
    return guiaRepository.findAll();
  },

  async getById(id) {
    const guia = await guiaRepository.findById(id);
    if (!guia) {
      const error = new Error('Guia não encontrado');
      error.status = 404;
      throw error;
    }
    return guia;
  },

  async update(id, data) {
    const guiaExistente = await guiaRepository.findById(id);
    if (!guiaExistente) {
      const error = new Error('Guia não encontrado');
      error.status = 404;
      throw error;
    }
    const { nome, trabalhador, alteradopor } = data;
    return guiaRepository.update(id, { nome, trabalhador, alteradopor });
  },

  async remove(id) {
    const guiaExistente = await guiaRepository.findById(id);
    if (!guiaExistente) {
      const error = new Error('Guia não encontrado');
      error.status = 404;
      throw error;
    }
    return guiaRepository.delete(id);
  },
};

module.exports = guiaService;
