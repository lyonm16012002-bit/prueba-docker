const express = require('express');
const crudRoutes = require('./crud.routes');
const controller = require('../controllers/evaluacion.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);
router.use(crudRoutes(controller)); // cualquier usuario autenticado puede leer y escribir

module.exports = router;
