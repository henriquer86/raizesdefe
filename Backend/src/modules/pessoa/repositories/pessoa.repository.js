const pool = require('../../../config/database');

// Repositório para operações CRUD na tabela 'pessoa'
const pessoaRepository = {
  // Cria uma nova pessoa
  async create(data) {
    const { nome, telefone, datadenascimento, cadastradopor } = data;
    console.log('Dados recebidos em /api/pessoas:', data);
    const datacadastro = new Date();
    const query = `
      INSERT INTO pessoa (nome, telefone, datadenascimento, datacadastro, cadastradopor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const result = await pool.query(query, [
      nome,
      telefone,
      datadenascimento,
      new Date(datacadastro),
      cadastradopor,
    ]);
    return result.rows[0];
  },

  // Lista todas as pessoas, ordenadas por data de cadastro DESC
  async findAll() {
    const query = `
      SELECT * FROM pessoa
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Busca uma pessoa pelo ID
  async findById(id) {
    const query = `
      SELECT * FROM pessoa
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Atualiza uma pessoa pelo ID, preservando campos não informados
  async update(id, data) {
    const { nome, telefone, datadenascimento, alteradopor } = data;
    const query = `
      UPDATE pessoa
      SET
        nome = COALESCE($2, nome),
        telefone = COALESCE($3, telefone),
        datadenascimento = COALESCE($4, datadenascimento),
        alteradopor = COALESCE($5, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      nome,
      telefone,
      datadenascimento,
      alteradopor,
    ]);
    return result.rows[0] || null;
  },

  // Remove uma pessoa pelo ID
  async delete(id) {
    const query = `
      DELETE FROM pessoa
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },
};

module.exports = pessoaRepository;
