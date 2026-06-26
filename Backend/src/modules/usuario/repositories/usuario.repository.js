const pool = require('../../../config/database');

module.exports = {
  // Cria um novo usuário
  async create(data) {
    const dataCadastro = new Date();
    const { nomeusuario, senhahash, nivelacesso, pessoa, cadastradopor } = data;
    const query = `
      INSERT INTO usuario (nomeusuario, senhahash, nivelacesso, pessoa, datacadastro, cadastradopor)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      nomeusuario,
      senhahash,
      nivelacesso,
      pessoa,
      dataCadastro,
      cadastradopor,
    ]);
    return result.rows[0];
  },

  // Lista todos os usuários ordenados por data de cadastro DESC
  async findAll() {
    const query = `
      SELECT * FROM usuario
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Busca usuário por ID
  async findById(id) {
    const query = `
      SELECT * FROM usuario WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Atualiza usuário por ID, preservando campos não informados
  async update(id, data) {
    const {
      nomeusuario,
      senhahash,
      nivelacesso,
      pessoa,
      alteradopor = null,
    } = data;
    const query = `
      UPDATE usuario SET
        nomeusuario = COALESCE($2, nomeusuario),
        senhahash = COALESCE($3, senhahash),
        nivelacesso = COALESCE($4, nivelacesso),
        pessoa = COALESCE($5, pessoa),
        alteradopor = COALESCE($6, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      nomeusuario,
      senhahash,
      nivelacesso,
      pessoa,
      alteradopor,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Remove usuário por ID
  async delete(id) {
    const query = `
      DELETE FROM usuario WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};
