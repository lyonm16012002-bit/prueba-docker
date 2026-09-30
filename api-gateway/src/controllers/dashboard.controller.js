const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const resumen = asyncHandler(async (req, res) => {
  res.locals.destino = 'ms-clientes + ms-membresias';
  res.json(await dashboardService.resumen(req.token));
});

module.exports = { resumen };
