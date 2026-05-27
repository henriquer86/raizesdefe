const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.post('/api/login', (req, res) => {
  const { nomeusuario, senha } = req.body;
  if (nomeusuario === 'admin' && senha === '123') {
    res.json({
      success: true,
      token: 'fake-jwt-token-' + Date.now(),
      user: { nome: 'Admin User', nomeusuario },
    });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
