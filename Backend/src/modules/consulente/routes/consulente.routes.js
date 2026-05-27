const express = require('express');
const router = express.Router();

// Importa o controller do módulo Consulente
const consulenteController = require('../controllers/consulente.controller');

// Importa os validadores do módulo Consulente
const {
  validateId,
  validateCreate,
  validateUpdate,
} = require('../validators/consulente.validators');

// Rota para listar todos os consulentes
router.get('/', consulenteController.list);

// Rota para buscar consulente por ID
router.get('/:id', validateId, consulenteController.getById);

// Rota para criar um novo consulente
router.post('/', validateCreate, consulenteController.create);

// Rota para atualizar um consulente por ID
router.put('/:id', validateId, validateUpdate, consulenteController.update);

// Rota para remover um consulente por ID
router.delete('/:id', validateId, consulenteController.remove);

module.exports = router;
