// CONTROLLER de clientes: solo HTTP.
const clienteService = require('../services/cliente.service');
const asyncHandler = require('../utils/asyncHandler');

const listar = asyncHandler(async (req, res) => res.json(clienteService.listar()));
const obtener = asyncHandler(async (req, res) => res.json(clienteService.obtener(req.params.codigo)));
const crear = asyncHandler(async (req, res) => res.status(201).json(clienteService.crear(req.body || {})));
const actualizar = asyncHandler(async (req, res) => res.json(clienteService.actualizar(req.params.codigo, req.body || {})));
const estadisticas = asyncHandler(async (req, res) => res.json(clienteService.estadisticas()));

const eliminar = asyncHandler(async (req, res) => {
  await clienteService.eliminar(req.params.codigo, req.token);
  res.json({ ok: true });
});

module.exports = { listar, obtener, crear, actualizar, eliminar, estadisticas };
