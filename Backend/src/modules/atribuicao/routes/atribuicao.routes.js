const express = require('express');
const router = express.Router();

const controller = require('../controllers/atribuicao.controller');
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/atribuicao.validators');

// Rotas do módulo Atribuição

// Listar todas as atribuições
router.get('/', controller.list);

// Buscar atribuição por Função
router.get('/:funcao', controller.getByFuncao);

// Criar nova atribuição
router.post('/', validateCreate, controller.create);

// Atualizar atribuição por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Remover atribuição por ID
router.delete('/:id', validateId, controller.remove);

// Remover atribuições por Função
router.delete('/funcao/:funcao', controller.removeByFuncao);

module.exports = router;
