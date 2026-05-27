const pool = require('../../../config/database');

const guiaRepository = {
  /**
   * Cria um novo guia
   */
  async create(data) {
    const { nome, trabalhador, cadastradopor, alteradopor = null } = data;
    const query = `
      INSERT INTO guia (nome, trabalhador, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      nome,
      trabalhador,
      cadastradopor,
      alteradopor,
    ]);
    return result.rows[0];
  },

  /**
   * Busca todos os guias, ordenados por data de cadastro DESC
   */
  async findAll() {
    const query = `
      SELECT * FROM guia
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Busca um guia por ID
   */
  async findById(id) {
    const query = `
      SELECT * FROM guia WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Atualiza um guia por ID, preservando campos não enviados
   */
  async update(id, data) {
    const { nome, trabalhador, alteradopor = null } = data;
    const query = `
      UPDATE guia SET
        nome = COALESCE($2, nome),
        trabalhador = COALESCE($3, trabalhador),
        alteradopor = COALESCE($4, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      nome,
      trabalhador,
      alteradopor,
    ]);
    return result.rows[0];
  },

  /**
   * Remove um guia por ID
   */
  async delete(id) {
    const query = `
      DELETE FROM guia WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = guiaRepository;
