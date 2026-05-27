const repository = require('../repositories/atendimento.repository');

const service = {
  async create(data) {
    return await repository.create({
      entidade: data.entidade,
      consulente: data.consulente,
      observacoes: data.observacoes,
      cadastradopor: data.cadastradopor,
      alteradopor: data.alteradopor,
    });
  },

  async list() {
    return await repository.findAll();
  },

  async getById(id) {
    const atendimento = await repository.findById(id);
    if (!atendimento) {
      const error = new Error('Atendimento não encontrado');
      error.status = 404;
      throw error;
    }
    return atendimento;
  },

  async update(id, data) {
    const atendimento = await repository.findById(id);
    if (!atendimento) {
      const error = new Error('Atendimento não encontrado');
      error.status = 404;
      throw error;
    }
    return await repository.update(id, data);
  },

  async remove(id) {
    const atendimento = await repository.findById(id);
    if (!atendimento) {
      const error = new Error('Atendimento não encontrado');
      error.status = 404;
      throw error;
    }
    await repository.delete(id);
  },
};

module.exports = service;
