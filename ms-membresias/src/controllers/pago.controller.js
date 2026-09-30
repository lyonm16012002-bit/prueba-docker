const BaseController = require('./base.controller');
const service = require('../services/pago.service');
const asyncHandler = require('../utils/asyncHandler');

class PagoController extends BaseController {
  constructor() {
    super(service);
    this.estadisticas = asyncHandler(async (req, res) => res.json(service.estadisticas()));
  }
}

module.exports = new PagoController();
