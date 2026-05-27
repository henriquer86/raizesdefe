const repository = require('../repositories/trabalhador.repository');

module.exports = {
  async create(data) {
    const { pessoa, funcao, cadastradopor, alteradopor } = data;
    return repository.create({ pessoa, funcao, cadastradopor, alteradopor });
  },

  async list() {
    return repository.findAll();
  },

  async getById(id) {
    const trabalhador = await repository.findById(id);
    if (!trabalhador) {
      throw new Error('Trabalhador não encontrado.');
    }
    return trabalhador;
  },

  async update(id, data) {
    await this.getById(id);
    return repository.update(id, data);
  },

  async remove(id) {
    await this.getById(id);
    await repository.delete(id);
  },
};
