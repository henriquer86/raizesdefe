const { Router } = require('express');

const router = Router();

// Importa controllers
const {
  create,
  list,
  getById,
  update,
  remove,
} = require('../controllers/agenda.controller');

// Importa validadores
const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/agenda.validators');

// GET / - Listar agendas
router.get('/', list);

// GET /:id - Buscar agenda por ID
router.get('/:id', validateId, getById);

// POST / - Criar agenda
router.post('/', validateCreate, create);

// PUT /:id - Atualizar agenda
router.put('/:id', validateId, validateUpdate, update);

// DELETE /:id - Remover agenda
router.delete('/:id', validateId, remove);

module.exports = router;
