const pool = require('../../../config/database');

const velaAtendimentoRepository = {
  /**
   * Cria um novo registro de vela de atendimento
   * @param {Object} data - Dados: {atendimento, vela, cadastradopor, alteradopor?}
   * @returns {Object} Registro criado
   */
  async create(data) {
    const query = `
      INSERT INTO velaatendimento (atendimento, vela, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      data.atendimento,
      data.vela,
      data.cadastradopor,
      data.alteradopor || null,
    ]);
    return rows[0];
  },

  /**
   * Lista todos os registros ordenados por data de cadastro DESC
   * @returns {Array} Lista de registros
   */
  async findAll() {
    const query = `
      SELECT * FROM velaatendimento
      ORDER BY datacadastro DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  /**
   * Busca um registro pelo ID
   * @param {string} id - UUID do registro
   * @returns {Object|null} Registro ou null
   */
  async findById(id) {
    const query = `
      SELECT * FROM velaatendimento
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Atualiza um registro pelo ID
   * Atualiza apenas campos fornecidos e dataultimaalteracao
   * @param {string} id - UUID do registro
   * @param {Object} data - Dados: {atendimento?, vela?, alteradopor?}
   * @returns {Object|null} Registro atualizado ou null
   */
  async update(id, data) {
    const query = `
      UPDATE velaatendimento
      SET
        atendimento = COALESCE($1, atendimento),
        vela = COALESCE($2, vela),
        alteradopor = COALESCE($3, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      data.atendimento,
      data.vela,
      data.alteradopor,
      id,
    ]);
    return rows[0] || null;
  },

  /**
   * Remove um registro pelo ID
   * @param {string} id - UUID do registro
   * @returns {Object|null} Registro removido ou null
   */
  async delete(id) {
    const query = `
      DELETE FROM velaatendimento
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },
};

module.exports = velaAtendimentoRepository;
