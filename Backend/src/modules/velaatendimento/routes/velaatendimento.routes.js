const express = require('express');
const router = express.Router();

// Importa o controller do módulo VelaAtendimento
const controller = require('../controllers/velaatendimento.controller');

// Importa os validadores
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/velaatendimento.validators');

// Listar todos os VelaAtendimentos
router.get('/', controller.list);

// Buscar VelaAtendimento por ID
router.get('/:id', validateId, controller.getById);

// Criar novo VelaAtendimento
router.post('/', validateCreate, controller.create);

// Atualizar VelaAtendimento por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Remover VelaAtendimento por ID
router.delete('/:id', validateId, controller.remove);

module.exports = router;
