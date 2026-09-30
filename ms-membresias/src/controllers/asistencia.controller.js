const BaseController = require('./base.controller');
const service = require('../services/asistencia.service');
const asyncHandler = require('../utils/asyncHandler');

class AsistenciaController extends BaseController {
  constructor() {
    super(service);
    this.estadisticas = asyncHandler(async (req, res) => res.json(service.estadisticas()));
  }
}

module.exports = new AsistenciaController();
