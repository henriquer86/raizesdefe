const pool = require('../../../config/database');

/**
 * Repositório para operações CRUD na tabela `pade`.
 */
const padeRepository = {
  /**
   * Cria um novo registro de PADE.
   * @param {Object} data - Dados: atendimento, guia, cadastradopor, alteradopor (opcional)
   * @returns {Object} Registro criado.
   */
  async create(data) {
    const { atendimento, guia, cadastradopor, alteradopor } = data;
    const query = `
      INSERT INTO pade (atendimento, guia, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      atendimento,
      guia,
      cadastradopor,
      alteradopor,
    ]);
    return result.rows[0];
  },

  /**
   * Lista todos os registros de PADE, ordenados por datacadastro DESC.
   * @returns {Array} Lista de registros.
   */
  async findAll() {
    const query = `
      SELECT * FROM pade
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Busca um registro de PADE por ID.
   * @param {string} id - UUID do registro.
   * @returns {Object|null} Registro encontrado.
   */
  async findById(id) {
    const query = `
      SELECT * FROM pade
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Atualiza um registro de PADE.
   * Atualiza apenas campos fornecidos, sempre atualizando dataultimaalteracao.
   * @param {string} id - UUID do registro.
   * @param {Object} data - Dados: atendimento, guia, alteradopor (opcionais)
   * @returns {Object|null} Registro atualizado.
   */
  async update(id, data) {
    const { atendimento, guia, alteradopor } = data;
    const query = `
      UPDATE pade
      SET
        atendimento = COALESCE($2, atendimento),
        guia = COALESCE($3, guia),
        alteradopor = COALESCE($4, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      atendimento,
      guia,
      alteradopor,
    ]);
    return result.rows[0];
  },

  /**
   * Remove um registro de PADE por ID.
   * @param {string} id - UUID do registro.
   * @returns {Object|null} Registro removido.
   */
  async delete(id) {
    const query = `
      DELETE FROM pade
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = padeRepository;
