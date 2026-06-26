const pool = require('../../../config/database');

/**
 * Repositório para a entidade Trabalhador
 */
const TrabalhadorRepository = {
  /**
   * Cria um novo trabalhador
   * @param {Object} data - Dados: pessoa, funcao, cadastradopor, alteradopor (opcional)
   */
  async create(data) {
    const { pessoa, funcao, cadastradopor } = data;
    const datacadastro = new Date();
    const query = `
      INSERT INTO trabalhador (pessoa, funcao, datacadastro, cadastradopor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      pessoa,
      funcao,
      new Date(datacadastro),
      cadastradopor,
    ]);
    return result.rows[0];
  },

  /**
   * Lista todos os trabalhadores, ordenados por data de cadastro DESC
   */
  async findAll() {
    const query = `
      SELECT * FROM trabalhador
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Busca trabalhador por ID
   * @param {string} id - UUID do trabalhador
   */
  async findById(id) {
    const query = `
      SELECT * FROM trabalhador WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Busca trabalhador por Funcao ID
   * @param {string} id - UUID da função
   */
  async findByFuncaoId(id) {
    const query = `
    SELECT * FROM trabalhador WHERE funcao = $1
  `;
    const result = await pool.query(query, [id]);
    return result.rows; // retorna lista completa
  },

  /**
   * Atualiza trabalhador
   * @param {string} id - UUID do trabalhador
   * @param {Object} data - Campos a atualizar: pessoa, funcao, alteradopor (opcionais)
   */
  async update(id, data) {
    const { pessoa, funcao, alteradopor } = data;
    const query = `
      UPDATE trabalhador
      SET
        pessoa = COALESCE($2::uuid, pessoa),
        funcao = COALESCE($3::uuid, funcao),
        alteradopor = COALESCE($4::uuid, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, pessoa, funcao, alteradopor]);
    return result.rows[0] || null;
  },

  /**
   * Remove trabalhador por ID
   * @param {string} id - UUID do trabalhador
   */
  async delete(id) {
    const query = `
      DELETE FROM trabalhador WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
};

module.exports = TrabalhadorRepository;
