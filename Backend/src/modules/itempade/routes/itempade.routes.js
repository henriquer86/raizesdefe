const express = require('express');
const router = express.Router();

// Importa o controller do módulo ItemPade
const controller = require('../controllers/itempade.controller');

// Importa os validadores do módulo ItemPade
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/itempade.validators');

// Rota para listar todos os ItemPades
router.get('/', controller.list);

// Rota para buscar ItemPade por ID
router.get('/:id', validateId, controller.getById);

// Rota para criar um novo ItemPade
router.post('/', validateCreate, controller.create);

// Rota para atualizar um ItemPade por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Rota para remover um ItemPade por ID
router.delete('/:id', validateId, controller.remove);

module.exports = router;
