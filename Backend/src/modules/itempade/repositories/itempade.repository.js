const pool = require('../../../config/database');

module.exports = {
  // Cria um novo registro de itempade
  async create(data) {
    const { pade, item, cadastradopor, alteradopor } = data;
    const query = `
      INSERT INTO itempade (pade, item, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      pade,
      item,
      cadastradopor,
      alteradopor || null,
    ]);
    return result.rows[0];
  },

  // Lista todos os registros de itempade ordenados por datacadastro DESC
  async findAll() {
    const query = `
      SELECT * FROM itempade
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Busca um registro de itempade por ID
  async findById(id) {
    const query = `
      SELECT * FROM itempade WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Atualiza um registro de itempade por ID
  async update(id, data) {
    const { pade, item, alteradopor } = data;
    const query = `
      UPDATE itempade
      SET
        pade = COALESCE($2, pade),
        item = COALESCE($3, item),
        alteradopor = COALESCE($4, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      pade || null,
      item || null,
      alteradopor || null,
    ]);
    return result.rows[0];
  },

  // Remove um registro de itempade por ID
  async delete(id) {
    const query = `
      DELETE FROM itempade WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};
