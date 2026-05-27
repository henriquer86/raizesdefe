const express = require('express');
const router = express.Router();

// Controlador e validadores
const controller = require('../controllers/item.controller');
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/item.validators');

// Rotas do módulo Item
router.get('/', controller.list); // Listar todos os itens

router.get('/:id', validateId, controller.getById); // Buscar item por ID

router.post('/', validateCreate, controller.create); // Criar novo item

router.put('/:id', validateId, validateUpdate, controller.update); // Atualizar item

router.delete('/:id', validateId, controller.remove); // Remover item

module.exports = router;
