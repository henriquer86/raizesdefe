const express = require('express');

const router = express.Router();

const {
  create,
  list,
  getById,
  update,
  remove,
} = require('../controllers/usuario.controller');

const {
  validateCreate,
  validateUpdate,
  validateId,
} = require('../validators/usuario.validators');

// Rota para listar todos os usuários
router.get('/', list);

// Rota para buscar usuário por ID
router.get('/:id', validateId, getById);

// Rota para criar um novo usuário
router.post('/', validateCreate, create);

// Rota para atualizar usuário por ID
router.put('/:id', validateId, validateUpdate, update);

// Rota para remover usuário por ID
router.delete('/:id', validateId, remove);

module.exports = router;
