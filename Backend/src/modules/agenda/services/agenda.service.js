const repository = require('../repositories/agenda.repository');

module.exports = {
  async create(data) {
    const {
      atendimento,
      tratamento,
      data: dataAgenda,
      presente = false,
      observacao,
      cadastradopor,
      alteradopor,
    } = data;

    return await repository.create({
      atendimento,
      tratamento,
      data: dataAgenda,
      presente,
      observacao,
      cadastradopor,
      alteradopor,
    });
  },

  async list() {
    return await repository.findAll();
  },

  async getById(id) {
    const agenda = await repository.findById(id);
    if (!agenda) {
      const error = new Error('Agenda não encontrada');
      error.status = 404;
      throw error;
    }
    return agenda;
  },

  async update(id, data) {
    // Valida existência
    await this.getById(id);

    const { presente, observacao, alteradopor } = data;

    return await repository.update(id, {
      presente,
      observacao,
      alteradopor,
    });
  },

  async remove(id) {
    // Valida existência
    await this.getById(id);

    await repository.delete(id);
  },
};
