// Genera las 5 rutas CRUD estándar para un controller. La autenticación (requireAuth) la aplica
// cada archivo *.routes.js ANTES de montar este router, para que se vea explícito quién está protegido.
const express = require('express');
const { requireRole } = require('../middleware/auth');

function crudRoutes(controller, { writeRoles, deleteRoles } = {}) {
  const router = express.Router();
  const escribir = writeRoles ? [requireRole(...writeRoles)] : [];
  const borrar = deleteRoles ? [requireRole(...deleteRoles)] : [];

  router.get('/', controller.listar);
  router.get('/:id', controller.obtener);
  router.post('/', ...escribir, controller.crear);
  router.put('/:id', ...escribir, controller.actualizar);
  router.delete('/:id', ...borrar, controller.eliminar);

  return router;
}

module.exports = crudRoutes;
