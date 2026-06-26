const repository = require('../repositories/usuario.repository');
const bcrypt = require('bcryptjs');

const UsuarioService = {
  async create(data) {
    // Gera hash da senha com salt 10
    const senhahash = bcrypt.hashSync(data.senhahash, 10);

    const createData = {
      nomeusuario: data.nomeusuario,
      senhahash,
      nivelacesso: data.nivelacesso,
      pessoa: data.pessoa,
      cadastradopor: data.cadastradopor,
    };

    // alteradopor é opcional
    if (data.alteradopor) {
      createData.alteradopor = data.alteradopor;
    }

    return repository.create(createData);
  },

  async list() {
    // Retorna todos os usuários
    return repository.findAll();
  },

  async getById(id) {
    const usuario = await repository.findById(id);
    if (!usuario) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }
    return usuario;
  },

  async update(id, data) {
    // Valida existência antes de atualizar
    const usuarioExistente = await repository.findById(id);
    if (!usuarioExistente) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }

    const updateData = { ...data };

    // Se senha for enviada, gera novo hash
    if (updateData.senha) {
      updateData.senhahash = bcrypt.hashSync(updateData.senha, 10);
      delete updateData.senha;
    }

    return repository.update(id, updateData);
  },

  async remove(id) {
    // Valida existência antes de remover
    const usuarioExistente = await repository.findById(id);
    if (!usuarioExistente) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }

    return repository.delete(id);
  },
};

module.exports = UsuarioService;
