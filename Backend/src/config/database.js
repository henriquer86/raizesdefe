const dotenv = require('dotenv');
dotenv.config();
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Teste de conexão
pool.on('connect', () => {
  console.log('🟢 Pool conectado ao PostgreSQL para Raízes de Fé');
});

pool.on('error', (err) => {
  console.error('🔴 Erro no pool do PostgreSQL Raízes de Fé:', err.stack);
});

module.exports = pool;
