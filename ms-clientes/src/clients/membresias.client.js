// Cliente HTTP (Axios) para hablar con ms-membresias. Aquí se reenvía el JWT del usuario.
const axios = require('axios');
const { MEMBRESIAS_URL } = require('../config/env');
const AppError = require('../utils/AppError');

async function eliminarDatosDelCliente(codigo, token) {
  try {
    await axios.delete(`${MEMBRESIAS_URL}/membresias/cliente/${encodeURIComponent(codigo)}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
  } catch (err) {
    if (err.response) {
      throw new AppError(502, `ms-membresias rechazó la limpieza (HTTP ${err.response.status})`);
    }
    throw new AppError(503, 'ms-membresias no está disponible; no se eliminó el cliente para no dejar pagos/asistencias huérfanos');
  }
}

module.exports = { eliminarDatosDelCliente };
