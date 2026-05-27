const pool = require('../../../config/database');

/**
 * Repositório para operações CRUD na tabela 'atendimento'
 */
const atendimentoRepository = {
  /**
   * Cria um novo atendimento
   * @param {Object} data - Dados: entidade, consulente, observacoes, cadastradopor, alteradopor (opcional)
   * @returns {Object} Atendimento criado
   */
  async create(data) {
    const { entidade, consulente, observacoes, cadastradopor, alteradopor } =
      data;
    const query = `
      INSERT INTO atendimento (entidade, consulente, observacoes, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      entidade,
      consulente,
      observacoes,
      cadastradopor,
      alteradopor,
    ]);
    return result.rows[0];
  },

  /**
   * Lista todos os atendimentos, ordenados por data de cadastro DESC
   * @returns {Array} Lista de atendimentos
   */
  async findAll() {
    const query = `
      SELECT * FROM atendimento
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Busca atendimento por ID
   * @param {string} id - UUID do atendimento
   * @returns {Object|null} Atendimento ou null se não encontrado
   */
  async findById(id) {
    const query = `
      SELECT * FROM atendimento WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Atualiza atendimento por ID
   * Usa COALESCE para preservar campos não enviados e atualiza dataultimaalteracao
   * @param {string} id - UUID do atendimento
   * @param {Object} data - Dados: entidade, consulente, observacoes, alteradopor (parciais)
   * @returns {Object|null} Atendimento atualizado ou null se não encontrado
   */
  async update(id, data) {
    const { entidade, consulente, observacoes, alteradopor } = data;
    const query = `
      UPDATE atendimento SET
        entidade = COALESCE($2, entidade),
        consulente = COALESCE($3, consulente),
        observacoes = COALESCE($4, observacoes),
        alteradopor = COALESCE($5, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, entidade, consulente, observacoes, alteradopor];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  /**
   * Remove atendimento por ID
   * @param {string} id - UUID do atendimento
   * @returns {Object|null} Atendimento removido ou null se não encontrado
   */
  async delete(id) {
    const query = `
      DELETE FROM atendimento WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
};

module.exports = atendimentoRepository;
