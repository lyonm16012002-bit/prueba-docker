const BaseService = require('./base.service');
const clienteService = require('./cliente.service');

module.exports = new BaseService({
  repository: require('../repositories/rutina.repository'),
  model: require('../models/rutina.model'),
  verificarCliente: clienteService.verificarExiste
});
