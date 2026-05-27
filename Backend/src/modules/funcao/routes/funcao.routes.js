const express = require('express');
const router = express.Router();

const controller = require('../controllers/funcao.controller');
const {
  validateId,
  validateCreate,
  validateUpdate,
} = require('../validators/funcao.validators');

// Rota para listar todas as funções
router.get('/', controller.list);

// Rota para buscar função por ID
router.get('/:id', validateId, controller.getById);

// Rota para criar uma nova função
router.post('/', controller.create);

// Rota para atualizar função por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Rota para remover função por ID
router.delete('/:id', validateId, controller.remove);

module.exports = router;
