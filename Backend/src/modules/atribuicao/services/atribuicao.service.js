const repository = require('../repositories/atribuicao.repository');

const atribuicaoService = {
  async create(data) {
    const { nome, descricao, funcao, cadastradopor, alteradopor } = data;
    return await repository.create({
      nome,
      descricao,
      funcao,
      cadastradopor,
      alteradopor,
    });
  },

  async list() {
    return await repository.findAll();
  },

  async getByFuncao(Funcao) {
    const atribuicoes = await repository.findByFuncao(Funcao);
    if (!atribuicoes || atribuicoes.length === 0) {
      const error = new Error('Atribuições não encontradas');
      error.status = 404;
    }
    return atribuicoes;
  },

  async update(id, data) {
    const atribuicao = await repository.findById(id);
    if (!atribuicao) {
      const error = new Error('Atribuição não encontrada');
      error.status = 404;
      throw error;
    }
    const { nome, descricao, funcao, alteradopor } = data;
    return await repository.update(id, {
      nome,
      descricao,
      funcao,
      alteradopor,
    });
  },

  async remove(id) {
    const atribuicao = await repository.findById(id);
    if (!atribuicao) {
      const error = new Error('Atribuição não encontrada');
      error.status = 404;
      throw error;
    }
    await repository.delete(id);
  },

  async removeByFuncao(funcao) {
    const atribuicoes = await repository.findByFuncao(funcao);
    if (!atribuicoes || atribuicoes.length === 0) {
      const error = new Error(
        'Atribuições não encontradas para a função especificada',
      );
      error.status = 404;
      throw error;
    }
    await repository.deleteByFuncao(funcao);
  },
};

module.exports = atribuicaoService;
