const usuarioService = require('../services/usuario.service');
const asyncHandler = require('../utils/asyncHandler');

const listar = asyncHandler(async (req, res) => {
  res.json(usuarioService.listar());
});

const crear = asyncHandler(async (req, res) => {
  res.status(201).json(usuarioService.crear(req.body || {}));
});

const eliminar = asyncHandler(async (req, res) => {
  usuarioService.eliminar(req.params.id, req.user);
  res.json({ ok: true });
});

module.exports = { listar, crear, eliminar };
