require('dotenv').config({ path: __dirname + '/../.env' });

const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = process.env.FRONTEND_URL.split(',');

// Middleware para parsing JSON
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições sem origin (ex.: curl) ou se o domínio está na lista
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Health check na raiz
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Raízes de Fé API' });
});

// Conexão com banco de dados
const pool = require('./config/database.js');

// Rotas com prefixo /api
// app.use('/api', require('./modules/pessoa/routes/pessoa.routes'));
// app.use('/api', require('./modules/usuario/routes/usuario.routes'));
app.use('/api/funcoes', require('./modules/funcao/routes/funcao.routes'));
app.use(
  '/api/atribuicoes',
  require('./modules/atribuicao/routes/atribuicao.routes'),
);
// app.use('/api', require('./modules/trabalhador/routes/trabalhador.routes'));
// app.use('/api', require('./modules/guia/routes/guia.routes.js'));
// app.use('/api', require('./modules/consulente/routes/consulente.routes'));
// app.use('/api', require('./modules/vela/routes/vela.routes'));
// app.use('/api', require('./modules/item/routes/item.routes'));
// app.use('/api', require('./modules/atendimento/routes/atendimento.routes'));
// app.use('/api', require('./modules/banho/routes/banho.routes'));
// app.use('/api', require('./modules/pade/routes/pade.routes'));
// app.use('/api', require('./modules/itempade/routes/itempade.routes'));
// app.use(
//   '/api',
//   require('./modules/velaatendimento/routes/velaatendimento.routes'),
// );
// app.use('/api', require('./modules/tratamento/routes/tratamento.routes'));
// app.use('/api', require('./modules/agenda/routes/agenda.routes'));
app.use('/api/login', require('./modules/auth/routes/auth.routes'));

// Middleware para rota não encontrada
app.use(require('./middlewares/notFound.middleware.js'));

// Middleware para tratamento de erros
app.use(require('./middlewares/errorHandler.middleware.js'));

const PORT = process.env.PORT || 3000;

// Função para iniciar servidor após teste de conexão
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Conexão com o banco de dados OK.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro na conexão com banco:', error.message);
    process.exit(1);
  }
})();
