const express = require('express');
const crudRoutes = require('./crud.routes');
const controller = require('../controllers/asistencia.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/estadisticas', controller.estadisticas);
router.use(crudRoutes(controller));

module.exports = router;
