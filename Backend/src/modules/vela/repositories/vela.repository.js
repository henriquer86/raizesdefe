const pool = require('../../../config/database');

// Repositório para operações CRUD com a tabela 'vela'
const velaRepository = {
  // Cria uma nova vela
  async create(data) {
    const { guia, cor, cadastradopor, alteradopor } = data;
    const query = `
      INSERT INTO vela (guia, cor, cadastradopor, alteradopor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      guia,
      cor,
      cadastradopor,
      alteradopor,
    ]);
    return result.rows[0];
  },

  // Lista todas as velas ordenadas por data de cadastro DESC
  async findAll() {
    const query = `
      SELECT * FROM vela ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Busca uma vela pelo ID
  async findById(id) {
    const query = `
      SELECT * FROM vela WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  // Atualiza uma vela pelo ID, preservando campos não enviados com COALESCE
  async update(id, data) {
    const { guia, cor, alteradopor } = data;
    const query = `
      UPDATE vela 
      SET 
        guia = COALESCE($2, guia),
        cor = COALESCE($3, cor),
        alteradopor = COALESCE($4, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, guia, cor, alteradopor];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  // Remove uma vela pelo ID
  async delete(id) {
    const query = `
      DELETE FROM vela WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
};

module.exports = velaRepository;
