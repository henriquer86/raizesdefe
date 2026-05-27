const express = require('express');
const router = express.Router();

// Importa funções do controller
const {
  create,
  list,
  getById,
  update,
  remove,
} = require('../controllers/tratamento.controller');

// Importa validadores
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/tratamento.validators');

// Rotas do módulo Tratamento

// Listar todos os tratamentos
router.get('/', list);

// Buscar tratamento por ID
router.get('/:id', validateId, getById);

// Criar novo tratamento
router.post('/', validateCreate, create);

// Atualizar tratamento por ID
router.put('/:id', validateId, validateUpdate, update);

// Remover tratamento por ID
router.delete('/:id', validateId, remove);

module.exports = router;
