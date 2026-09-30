const BaseService = require('./base.service');
const repository = require('../repositories/asistencia.repository');
const clientesClient = require('../clients/clientes.client');

class AsistenciaService extends BaseService {
  estadisticas() {
    return { asistenciasHoy: this.repository.contarHoy() };
  }
}

module.exports = new AsistenciaService({
  repository,
  model: require('../models/asistencia.model'),
  verificarCliente: clientesClient.verificarClienteExiste
});
