const membresiasService = require('../services/membresias.service');
const asyncHandler = require('../utils/asyncHandler');

const eliminarPorCliente = asyncHandler(async (req, res) => {
  res.json({ ok: true, ...membresiasService.eliminarPorCliente(req.params.codigo) });
});

module.exports = { eliminarPorCliente };
