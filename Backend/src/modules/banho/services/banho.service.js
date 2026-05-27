const banhoRepository = require('../repositories/banho.repository');

const banhoService = {
  async create(data) {
    const {
      atendimento,
      descricao,
      quantidade,
      dia,
      cadastradopor,
      alteradopor,
    } = data;
    return banhoRepository.create({
      atendimento,
      descricao,
      quantidade,
      dia,
      cadastradopor,
      alteradopor,
    });
  },

  async list() {
    return banhoRepository.findAll();
  },

  async getById(id) {
    const banho = await banhoRepository.findById(id);
    if (!banho) {
      const error = new Error('Banho não encontrado');
      error.status = 404;
      throw error;
    }
    return banho;
  },

  async update(id, data) {
    const banho = await banhoRepository.findById(id);
    if (!banho) {
      const error = new Error('Banho não encontrado');
      error.status = 404;
      throw error;
    }
    const { atendimento, descricao, quantidade, dia, alteradopor } = data;
    return banhoRepository.update(id, {
      atendimento,
      descricao,
      quantidade,
      dia,
      alteradopor,
    });
  },

  async remove(id) {
    const banho = await banhoRepository.findById(id);
    if (!banho) {
      const error = new Error('Banho não encontrado');
      error.status = 404;
      throw error;
    }
    return banhoRepository.delete(id);
  },
};

module.exports = banhoService;
