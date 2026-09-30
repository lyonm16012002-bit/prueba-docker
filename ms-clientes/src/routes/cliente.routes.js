const express = require('express');
const controller = require('../controllers/cliente.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth); // todo requiere JWT válido

router.get('/estadisticas', controller.estadisticas); // debe ir antes de '/:codigo'
router.get('/', controller.listar);
router.get('/:codigo', controller.obtener);
router.post('/', controller.crear);
router.put('/:codigo', controller.actualizar);
router.delete('/:codigo', requireRole('admin'), controller.eliminar); // solo admin

module.exports = router;
