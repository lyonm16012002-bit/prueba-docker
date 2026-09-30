// Operación interna: cuando ms-clientes elimina un cliente, aquí se borran sus datos asociados.
const pagoRepository = require('../repositories/pago.repository');
const asistenciaRepository = require('../repositories/asistencia.repository');

function eliminarPorCliente(codigo) {
  return {
    pagosEliminados: pagoRepository.removeByCodigo(codigo),
    asistenciasEliminadas: asistenciaRepository.removeByCodigo(codigo)
  };
}

module.exports = { eliminarPorCliente };
