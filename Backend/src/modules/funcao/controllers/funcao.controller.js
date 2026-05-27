const funcaoService = require('../services/funcao.service');

/**
 * Cria uma nova função
 */
const create = async (req, res) => {
  try {
    const data = req.body;
    const funcao = await funcaoService.create(data);
    return res.status(201).json(funcao);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Lista todas as funções
 */
const list = async (req, res) => {
  try {
    const funcoes = await funcaoService.list();
    return res.status(200).json(funcoes);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Busca uma função por ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const funcao = await funcaoService.getById(id);
    return res.status(200).json(funcao);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Atualiza uma função por ID
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const funcao = await funcaoService.update(id, data);
    return res.status(200).json(funcao);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Remove uma função por ID
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await funcaoService.remove(id);
    return res.status(200).json({ message: 'Função removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover função:', error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
