const pool = require('../../../config/database');

// Repositório para operações CRUD na tabela 'funcao'
module.exports = {
  // Cria uma nova função
  async create(data) {
    const { nome, descricao, cadastradopor, datacadastro } = data;

    const query = `
    INSERT INTO funcao (nome, descricao, cadastradopor, datacadastro)
    VALUES ($1, $2, $3::uuid, $4::timestamptz)
    RETURNING *
  `;

    try {
      const result = await pool.query(query, [
        nome,
        descricao,
        cadastradopor,
        datacadastro,
      ]);
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao inserir função:', err);
      throw err; // repropaga o erro para ser tratado em nível superior
    }
  },

  // Lista todas as funções ordenadas por data de cadastro DESC
  async findAll() {
    const query = `
      SELECT * FROM funcao
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Busca uma função pelo ID
  async findById(id) {
    const query = `
      SELECT * FROM funcao WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Atualiza uma função pelo ID (campos opcionais com COALESCE)
  async update(id, data) {
    const { nome, descricao, alteradopor, dataultimaalteracao } = data;
    const query = `
      UPDATE funcao
      SET
        nome = $2,
        descricao = $3,
        alteradopor = $4,
        dataultimaalteracao = $5
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, nome, descricao, alteradopor, dataultimaalteracao];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Remove uma função pelo ID
  async delete(id) {
    const query = `
      DELETE FROM funcao
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};
