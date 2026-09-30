const express = require('express');
const crudRoutes = require('./crud.routes');
const controller = require('../controllers/pago.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/estadisticas', controller.estadisticas); // antes de '/:id'

// AUTORIZACIÓN: el asistente solo puede LEER pagos; crear, editar y borrar es solo del admin.
router.use(crudRoutes(controller, { writeRoles: ['admin'], deleteRoles: ['admin'] }));

module.exports = router;
