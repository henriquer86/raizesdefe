const { Router } = require('express');

const router = Router();

const controller = require('../controllers/banho.controller');
const {
  validateId,
  validateCreate,
  validateUpdate,
} = require('../validators/banho.validators');

// Listar todos os banhos
router.get('/', controller.list);

// Buscar banho por ID
router.get('/:id', validateId, controller.getById);

// Criar novo banho
router.post('/', validateCreate, controller.create);

// Atualizar banho por ID
router.put('/:id', validateId, validateUpdate, controller.update);

// Remover banho por ID
router.delete('/:id', validateId, controller.remove);

module.exports = router;
