const BaseService = require('./base.service');
const repository = require('../repositories/pago.repository');
const clientesClient = require('../clients/clientes.client');

class PagoService extends BaseService {
  estadisticas() {
    return {
      pagosPendientes: this.repository.contarPendientes(),
      proximosVencer: this.repository.contarProximosAVencer()
    };
  }
}

module.exports = new PagoService({
  repository,
  model: require('../models/pago.model'),
  verificarCliente: clientesClient.verificarClienteExiste
});
