// src/modules/pade/routes/pade.routes.js

const express = require('express');
const controller = require('../controllers/pade.controller');
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/pade.validators');

const router = express.Router();

// Lista todos os PADEs
router.get('/', controller.list);

// Busca PADE por ID
router.get('/:id', validateId, controller.getById);

// Cria um novo PADE
router.post('/', validateCreate, controller.create);

// Atualiza PADE por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Remove PADE por ID
router.delete('/:id', validateId, controller.remove);

module.exports = router;
