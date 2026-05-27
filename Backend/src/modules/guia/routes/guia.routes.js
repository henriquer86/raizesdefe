const express = require('express');
const router = express.Router();

// Controlador do módulo Guia
const guiaController = require('../controllers/guia.controller');

// Validadores do módulo Guia
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/guia.validators');

// Rotas do módulo Guia
router.get('/', guiaController.list); // Listar guias

router.get('/:id', validateId, guiaController.getById); // Buscar guia por ID

router.post('/', validateCreate, guiaController.create); // Criar guia

router.put('/:id', validateId, validateUpdate, guiaController.update); // Atualizar guia

router.delete('/:id', validateId, guiaController.remove); // Remover guia

module.exports = router;
