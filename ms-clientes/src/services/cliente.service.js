// SERVICE de clientes: reglas de negocio (código automático, validaciones, borrado coordinado).
const repo = require('../repositories/cliente.repository');
const membresiasClient = require('../clients/membresias.client');
const AppError = require('../utils/AppError');
const { FIELDS } = require('../models/cliente.model');

function siguienteCodigo() {
  const ultimo = repo.ultimoCodigo();
  const coincidencia = ultimo && ultimo.match(/(\d+)$/);
  const n = coincidencia ? parseInt(coincidencia[1], 10) + 1 : 1;
  return 'CL' + String(n).padStart(4, '0');
}

function listar() {
  return repo.findAll();
}

function obtener(codigo) {
  const cliente = repo.findByCodigo(codigo);
  if (!cliente) throw new AppError(404, 'Cliente no encontrado');
  return cliente;
}

function crear(body) {
  if (!body.nombre || !body.apellido) throw new AppError(400, 'Nombre y apellido son requeridos');
  return repo.create(siguienteCodigo(), body); // el código lo genera el sistema, no el usuario
}

function actualizar(codigo, body) {
  const existente = obtener(codigo);
  const datos = {};
  for (const f of FIELDS) datos[f] = body[f] ?? existente[f];
  return repo.update(codigo, datos);
}

// Borrado coordinado entre microservicios:
//  1) verifica que exista, 2) pide a ms-membresias borrar pagos/asistencia, 3) borra el cliente local.
async function eliminar(codigo, token) {
  obtener(codigo);
  await membresiasClient.eliminarDatosDelCliente(codigo, token);
  repo.remove(codigo);
}

function estadisticas() {
  return { totalClientes: repo.contar(), clientesActivos: repo.contarActivos() };
}

// Regla usada por evaluaciones y rutinas: el cliente debe existir.
async function verificarExiste(codigo) {
  if (!repo.findByCodigo(codigo)) throw new AppError(400, 'El código de cliente no existe');
}

module.exports = { listar, obtener, crear, actualizar, eliminar, estadisticas, verificarExiste };
