const express = require('express');
const router = express.Router();

// Importa o controller e validadores
const controller = require('../controllers/atendimento.controller');
const {
  validateId,
  validateCreate,
  validateUpdate,
} = require('../validators/atendimento.validators');

// Rotas do módulo Atendimento
router.get('/', controller.list); // Listar atendimentos

router.get('/:id', validateId, controller.getById); // Buscar atendimento por ID

router.post('/', validateCreate, controller.create); // Criar novo atendimento

router.put('/:id', validateId, validateUpdate, controller.update); // Atualizar atendimento

router.delete('/:id', validateId, controller.remove); // Remover atendimento

module.exports = router;
