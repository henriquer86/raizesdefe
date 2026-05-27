const express = require('express');
const router = express.Router();

// Importações dos controllers e validadores
const pessoaController = require('../controllers/pessoa.controller');
const {
  validateId,
  validateCreate,
  validateUpdate,
} = require('../validators/pessoa.validators');

// Rota para listar todas as pessoas
router.get('/', pessoaController.list);

// Rota para buscar pessoa por ID, com validação
router.get('/:id', validateId, pessoaController.getById);

// Rota para criar uma nova pessoa, com validação
router.post('/', validateCreate, pessoaController.create);

// Rota para atualizar pessoa por ID, com validações
router.put('/:id', validateId, validateUpdate, pessoaController.update);

// Rota para remover pessoa por ID, com validação
router.delete('/:id', validateId, pessoaController.remove);

// Exporta o router para uso no app principal
module.exports = router;
