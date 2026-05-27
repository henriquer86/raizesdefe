const pessoaRepository = require('../repositories/pessoa.repository');

const pessoaService = {
  async create(data) {
    return await pessoaRepository.create(data);
  },

  async list() {
    return await pessoaRepository.findAll();
  },

  async getById(id) {
    const pessoa = await pessoaRepository.findById(id);
    if (!pessoa) {
      const error = new Error('Pessoa não encontrada');
      error.status = 404;
      throw error;
    }
    return pessoa;
  },

  async update(id, data) {
    const pessoa = await pessoaRepository.findById(id);
    if (!pessoa) {
      const error = new Error('Pessoa não encontrada');
      error.status = 404;
      throw error;
    }
    return await pessoaRepository.update(id, data);
  },

  async remove(id) {
    const pessoa = await pessoaRepository.findById(id);
    if (!pessoa) {
      const error = new Error('Pessoa não encontrada');
      error.status = 404;
      throw error;
    }
    await pessoaRepository.delete(id);
    return { message: 'Pessoa excluída com sucesso' };
  },
};

module.exports = pessoaService;
