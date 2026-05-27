const pool = require('../../../config/database');

const banhoRepository = {
  // Cria um novo registro de banho
  async create(data) {
    const query = `
      INSERT INTO banho (atendimento, descricao, quantidade, dia, cadastradopor, datacadastro)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [
      data.atendimento,
      data.descricao,
      data.quantidade,
      data.dia,
      data.cadastradopor,
    ]);
    return result.rows[0];
  },

  // Lista todos os registros ordenados por datacadastro DESC
  async findAll() {
    const query = `
      SELECT * FROM banho
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Busca registro por ID
  async findById(id) {
    const query = `
      SELECT * FROM banho
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Atualiza registro com COALESCE para campos opcionais
  async update(id, data) {
    const query = `
      UPDATE banho
      SET
        atendimento = COALESCE($2, atendimento),
        descricao = COALESCE($3, descricao),
        quantidade = COALESCE($4, quantidade),
        dia = COALESCE($5, dia),
        alteradopor = $6,
        dataultimaalteracao = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      data.atendimento,
      data.descricao,
      data.quantidade,
      data.dia,
      data.alteradopor,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Deleta registro por ID
  async delete(id) {
    const query = `
      DELETE FROM banho
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = banhoRepository;
