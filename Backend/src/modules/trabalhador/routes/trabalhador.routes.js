const express = require('express');
const controller = require('../controllers/trabalhador.controller');
const {
  validateId,
  validateCreate,
  validateUpdate,
} = require('../validators/trabalhador.validators');

// Cria o router para o módulo Trabalhador
const router = express.Router();

// Rota para listar todos os trabalhadores
router.get('/', controller.list);

// Rota para buscar trabalhador por ID
router.get('/:id', validateId, controller.getById);

// Rota para criar um novo trabalhador
router.post('/', validateCreate, controller.create);

// Rota para atualizar trabalhador por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Rota para remover trabalhador por ID
router.delete('/:id', validateId, controller.remove);

// Exporta o router para uso em app.js
module.exports = router;
