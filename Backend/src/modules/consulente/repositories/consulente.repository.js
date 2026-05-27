const pool = require('../../../config/database');

/**
 * Repositório do módulo Consulente
 * Implementa operações CRUD na tabela `consulente` usando PostgreSQL.
 */

const create = async (data) => {
  // Cria um novo registro de consulente
  const { pessoa, cadastradopor, alteradopor } = data;
  const query = `
    INSERT INTO consulente (pessoa, cadastradopor, alteradopor)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [pessoa, cadastradopor, alteradopor]);
  return result.rows[0];
};

const findAll = async () => {
  // Lista todos os consulentes ordenados por data de cadastro DESC
  const query = `
    SELECT * FROM consulente
    ORDER BY datacadastro DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const findById = async (id) => {
  // Busca um consulente por ID
  const query = `
    SELECT * FROM consulente
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

const update = async (id, data) => {
  // Atualiza um consulente por ID (campos opcionais com COALESCE)
  const { pessoa, alteradopor } = data;
  const query = `
    UPDATE consulente
    SET
      pessoa = COALESCE($2, pessoa),
      alteradopor = COALESCE($3, alteradopor),
      dataultimaalteracao = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id, pessoa, alteradopor]);
  return result.rows[0] || null;
};

const deleteFunc = async (id) => {
  // Remove um consulente por ID
  const query = `
    DELETE FROM consulente
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deleteFunc,
};
