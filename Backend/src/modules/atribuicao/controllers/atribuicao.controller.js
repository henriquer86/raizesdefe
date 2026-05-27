const atribuicaoService = require('../services/atribuicao.service');

// Cria uma nova atribuição
async function create(req, res) {
  try {
    console.log(
      'datacadastro recebido:',
      req.body.datacadastro,
      typeof req.body.datacadastro,
    );
    const atribuicao = await atribuicaoService.create(req.body);
    res.status(201).json(atribuicao);
  } catch (error) {
    const status = error.status || 500;
    console.error('Erro detalhado:', error);
    res.status(status).json({ message: error.message });
  }
}

// Lista todas as atribuições
async function list(req, res) {
  try {
    const atribuicoes = await atribuicaoService.list();
    res.json(atribuicoes);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Busca atribuição por função
async function getByFuncao(req, res) {
  try {
    const atribuicoes = await atribuicaoService.getByFuncao(req.params.funcao);
    res.json(atribuicoes);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Atualiza atribuição por ID
async function update(req, res) {
  try {
    const atribuicao = await atribuicaoService.update(req.params.id, req.body);
    res.json(atribuicao);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Remove atribuição por ID
async function remove(req, res) {
  try {
    await atribuicaoService.remove(req.params.id);
    res.json({ message: 'Atribuição removida com sucesso.' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

// Remove atribuição por Função
async function removeByFuncao(req, res) {
  try {
    await atribuicaoService.removeByFuncao(req.params.funcao);
    res.json({ message: 'Atribuições removidas com sucesso.' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

module.exports = {
  create,
  list,
  getByFuncao,
  update,
  remove,
  removeByFuncao,
};
