const funcaoRepository = require('../repositories/funcao.repository');

const funcaoService = {
  async create(data) {
    // Recebe nome, descricao, cadastradopor (alteradopor opcional)
    return funcaoRepository.create(data);
  },

  async list() {
    return funcaoRepository.findAll();
  },

  async getById(id) {
    const funcao = await funcaoRepository.findById(id);
    if (!funcao) {
      const error = new Error('Função não encontrada');
      error.status = 404;
      throw error;
    }
    return funcao;
  },

  async update(id, data) {
    const funcao = await funcaoRepository.findById(id);
    if (!funcao) {
      const error = new Error('Função não encontrada');
      error.status = 404;
      throw error;
    }
    return funcaoRepository.update(id, data);
  },

  async remove(id) {
    const funcao = await funcaoRepository.findById(id);
    if (!funcao) {
      const error = new Error('Função não encontrada');
      error.status = 404;
      throw error;
    }
    return funcaoRepository.delete(id);
  },
};

module.exports = funcaoService;
