const pool = require('../../../config/database');

const tratamentoRepository = {
  /**
   * Cria um novo registro de tratamento
   */
  async create(data) {
    const query = `
      INSERT INTO tratamento (atendimento, tratamento, trabalhador, guia, quantidade, inicio, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      data.atendimento,
      data.tratamento,
      data.trabalhador,
      data.guia || null,
      data.quantidade,
      data.inicio,
      data.cadastradopor,
      data.alteradopor || null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Lista todos os tratamentos ordenados por data de cadastro DESC
   */
  async findAll() {
    const query = `
      SELECT * FROM tratamento ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Busca um tratamento pelo ID
   */
  async findById(id) {
    const query = `
      SELECT * FROM tratamento WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Atualiza um tratamento pelo ID, preservando campos não informados
   */
  async update(id, data) {
    const query = `
      UPDATE tratamento SET
        atendimento = COALESCE($2, atendimento),
        tratamento = COALESCE($3, tratamento),
        trabalhador = COALESCE($4, trabalhador),
        guia = COALESCE($5, guia),
        quantidade = COALESCE($6, quantidade),
        inicio = COALESCE($7, inicio),
        alteradopor = COALESCE($8, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      data.atendimento || null,
      data.tratamento || null,
      data.trabalhador || null,
      data.guia || null,
      data.quantidade || null,
      data.inicio || null,
      data.alteradopor || null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  /**
   * Remove um tratamento pelo ID
   */
  async delete(id) {
    const query = `
      DELETE FROM tratamento WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
};

module.exports = tratamentoRepository;
