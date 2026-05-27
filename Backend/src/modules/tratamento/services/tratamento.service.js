const tratamentoRepository = require('../repositories/tratamento.repository');

const tratamentoService = {
  async create(data) {
    // Cria um novo tratamento com os dados fornecidos
    return await tratamentoRepository.create(data);
  },

  async list() {
    // Lista todos os tratamentos
    return await tratamentoRepository.findAll();
  },

  async getById(id) {
    const tratamento = await tratamentoRepository.findById(id);
    if (!tratamento) {
      const error = new Error('Tratamento não encontrado');
      error.status = 404;
      throw error;
    }
    return tratamento;
  },

  async update(id, data) {
    // Verifica existência antes de atualizar
    const tratamento = await tratamentoRepository.findById(id);
    if (!tratamento) {
      const error = new Error('Tratamento não encontrado');
      error.status = 404;
      throw error;
    }
    return await tratamentoRepository.update(id, data);
  },

  async remove(id) {
    // Verifica existência antes de remover
    const tratamento = await tratamentoRepository.findById(id);
    if (!tratamento) {
      const error = new Error('Tratamento não encontrado');
      error.status = 404;
      throw error;
    }
    return await tratamentoRepository.delete(id);
  },
};

module.exports = tratamentoService;
