const express = require('express');
const router = express.Router();

// Importa controller e validadores
const controller = require('../controllers/vela.controller');
const {
  validateId,
  validateCreate,
  validateUpdate,
} = require('../validators/vela.validators');

// Rota para listar todas as velas
router.get('/', controller.list);

// Rota para buscar vela por ID
router.get('/:id', validateId, controller.getById);

// Rota para criar uma nova vela
router.post('/', validateCreate, controller.create);

// Rota para atualizar vela por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Rota para remover vela por ID
router.delete('/:id', validateId, controller.remove);

module.exports = router;
