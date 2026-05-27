const repository = require('../repositories/velaatendimento.repository');

module.exports = {
  async create(data) {
    // Cria novo registro de VelaAtendimento
    const { atendimento, vela, cadastradopor, alteradopor } = data;
    return await repository.create({
      atendimento,
      vela,
      cadastradopor,
      alteradopor: alteradopor || null,
    });
  },

  async list() {
    // Retorna todos os registros
    return await repository.findAll();
  },

  async getById(id) {
    // Busca por ID, valida existência
    const velaAtendimento = await repository.findById(id);
    if (!velaAtendimento) {
      const error = new Error('VelaAtendimento não encontrado');
      error.status = 404;
      throw error;
    }
    return velaAtendimento;
  },

  async update(id, data) {
    // Atualiza, valida existência
    const existing = await repository.findById(id);
    if (!existing) {
      const error = new Error('VelaAtendimento não encontrado');
      error.status = 404;
      throw error;
    }
    return await repository.update(id, data);
  },

  async remove(id) {
    // Remove, valida existência
    const existing = await repository.findById(id);
    if (!existing) {
      const error = new Error('VelaAtendimento não encontrado');
      error.status = 404;
      throw error;
    }
    await repository.delete(id);
  },
};
