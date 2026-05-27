const pool = require('../../../config/database');

// Repositório para operações CRUD na tabela agenda
module.exports = {
  /**
   * Cria um novo registro na agenda
   */
  async create(data) {
    const query = `
      INSERT INTO agenda (atendimento, tratamento, data, presente, observacao, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.atendimento,
      data.tratamento,
      data.data,
      data.presente ?? false,
      data.observacao ?? null,
      data.cadastradopor,
      data.alteradopor ?? null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  /**
   * Lista todos os registros da agenda, ordenados por datacadastro DESC
   */
  async findAll() {
    const query = `
      SELECT * FROM agenda
      ORDER BY datacadastro DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  /**
   * Busca um registro por ID
   */
  async findById(id) {
    const query = `
      SELECT * FROM agenda
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Atualiza um registro da agenda
   */
  async update(id, data) {
    const query = `
      UPDATE agenda
      SET
        atendimento = COALESCE($2, atendimento),
        tratamento = COALESCE($3, tratamento),
        data = COALESCE($4, data),
        presente = COALESCE($5, presente),
        observacao = COALESCE($6, observacao),
        alteradopor = COALESCE($7, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      data.atendimento ?? null,
      data.tratamento ?? null,
      data.data ?? null,
      data.presente ?? null,
      data.observacao ?? null,
      data.alteradopor ?? null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  /**
   * Remove um registro por ID
   */
  async delete(id) {
    const query = `
      DELETE FROM agenda
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },
};
