// ROUTES del Gateway: tabla de enrutamiento URL pública -> microservicio.
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { proxyA } = require('../controllers/proxy.controller');
const dashboardController = require('../controllers/dashboard.controller');

const router = express.Router();

// ---- Única ruta PÚBLICA: el login (aquí ms-usuarios emite el JWT) ----
router.post('/auth/login', proxyA('usuarios'));

// ---- Desde aquí TODO exige un JWT válido; si no, el Gateway responde 401 ----
router.use(requireAuth);

router.get('/dashboard', dashboardController.resumen);

router.use('/auth', proxyA('usuarios'));          // /api/auth/me
router.use('/usuarios', proxyA('usuarios'));      // gestión de usuarios (solo admin, lo decide ms-usuarios)

router.use('/clientes', proxyA('clientes'));
router.use('/evaluaciones', proxyA('clientes'));
router.use('/rutinas', proxyA('clientes'));

router.use('/pagos', proxyA('membresias'));
router.use('/asistencia', proxyA('membresias'));

router.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = router;
