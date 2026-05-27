const pool = require('../../../config/database');

/**
 * Repositório para operações no banco de dados da tabela 'item'.
 */
const itemRepository = {
  /**
   * Cria um novo item.
   * @param {Object} data - {nome, cadastradopor, alteradopor?}
   * @returns {Promise<Object>} Item criado.
   */
  async create(data) {
    const query = `
      INSERT INTO item (nome, cadastradopor, alteradopor)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [
      data.nome,
      data.cadastradopor,
      data.alteradopor,
    ]);
    return result.rows[0];
  },

  /**
   * Lista todos os itens, ordenados por datacadastro DESC.
   * @returns {Promise<Array>} Lista de itens.
   */
  async findAll() {
    const query = `
      SELECT * FROM item
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Busca um item por ID.
   * @param {string} id - UUID do item.
   * @returns {Promise<Object|null>} Item encontrado ou null.
   */
  async findById(id) {
    const query = `
      SELECT * FROM item
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Atualiza um item.
   * @param {string} id - UUID do item.
   * @param {Object} data - {nome?, alteradopor?}
   * @returns {Promise<Object|null>} Item atualizado ou null.
   */
  async update(id, data) {
    const query = `
      UPDATE item
      SET nome = COALESCE($2, nome),
          alteradopor = COALESCE($3, alteradopor),
          dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, data.nome, data.alteradopor];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Remove um item por ID.
   * @param {string} id - UUID do item.
   * @returns {Promise<Object|null>} Item removido ou null.
   */
  async delete(id) {
    const query = `
      DELETE FROM item
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = itemRepository;
