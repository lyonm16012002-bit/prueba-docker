const express = require('express');
const controller = require('../controllers/membresias.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Uso interno (lo invoca ms-clientes al borrar un cliente). Exige JWT válido y rol admin.
router.delete('/cliente/:codigo', requireAuth, requireRole('admin'), controller.eliminarPorCliente);

module.exports = router;
