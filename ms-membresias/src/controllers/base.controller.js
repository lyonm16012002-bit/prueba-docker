// CONTROLLER base: traduce HTTP <-> service. Sin reglas de negocio ni SQL.
const asyncHandler = require('../utils/asyncHandler');

class BaseController {
  constructor(service) {
    this.service = service;

    this.listar = asyncHandler(async (req, res) => {
      const codigo = typeof req.query.codigo === 'string' ? req.query.codigo : undefined;
      res.json(await this.service.listar(codigo));
    });

    this.obtener = asyncHandler(async (req, res) => {
      res.json(await this.service.obtener(req.params.id));
    });

    this.crear = asyncHandler(async (req, res) => {
      res.status(201).json(await this.service.crear(req.body || {}, req.token));
    });

    this.actualizar = asyncHandler(async (req, res) => {
      res.json(await this.service.actualizar(req.params.id, req.body || {}));
    });

    this.eliminar = asyncHandler(async (req, res) => {
      await this.service.eliminar(req.params.id);
      res.json({ ok: true });
    });
  }
}

module.exports = BaseController;
