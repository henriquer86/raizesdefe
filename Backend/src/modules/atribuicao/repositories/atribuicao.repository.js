const pool = require('../../../config/database');

// Repositório para operações CRUD na tabela 'atribuicao'
const atribuicaoRepository = {
  // Cria uma nova atribuição
  async create(data) {
    const { nome, descricao, funcao, cadastradopor } = data;
    const datacadastro = new Date();
    const query = `
      INSERT INTO atribuicao (nome, descricao, funcao, datacadastro, cadastradopor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      nome,
      descricao,
      funcao,
      new Date(datacadastro),
      cadastradopor,
    ]);
    return result.rows[0];
  },

  // Lista todas as atribuições ordenadas por data de cadastro DESC
  async findAll() {
    const query = `
      SELECT * FROM atribuicao
      ORDER BY datacadastro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Busca atribuição por função
  async findByFuncao(funcao) {
    const query = `
      SELECT * FROM atribuicao WHERE funcao = $1
    `;
    const result = await pool.query(query, [funcao]);
    return result.rows;
  },

  // Busca atribuição por ID
  async findById(id) {
    const query = `
      SELECT * FROM atribuicao WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  // Atualiza atribuição por ID (parcial com COALESCE)
  async update(id, data) {
    const { nome, descricao, funcao, alteradopor } = data;
    const query = `
      UPDATE atribuicao
      SET
        nome = COALESCE($2, nome),
        descricao = COALESCE($3, descricao),
        funcao = COALESCE($4, funcao),
        alteradopor = COALESCE($5, alteradopor),
        dataultimaalteracao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [
      id,
      nome,
      descricao,
      funcao,
      alteradopor,
    ]);
    return result.rows[0] || null;
  },

  // Remove atribuição por ID
  async delete(id) {
    const query = `
      DELETE FROM atribuicao WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  // Remove atribuições por Função
  async deleteByFuncao(funcao) {
    const query = `
      DELETE FROM atribuicao WHERE funcao = $1 RETURNING *
    `;
    const result = await pool.query(query, [funcao]);
    return result.rows;
  },
};

module.exports = atribuicaoRepository;
