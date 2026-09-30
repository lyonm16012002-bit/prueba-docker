const BaseService = require('./base.service');
const clienteService = require('./cliente.service');

module.exports = new BaseService({
  repository: require('../repositories/evaluacion.repository'),
  model: require('../models/evaluacion.model'),
  verificarCliente: clienteService.verificarExiste
});
