// Cliente HTTP (Axios) para consultar a ms-clientes. Reenvía el JWT del usuario original,
// así ms-clientes también valida la sesión (los servicios no confían ciegamente entre sí).
const axios = require('axios');
const { CLIENTES_URL } = require('../config/env');
const AppError = require('../utils/AppError');

async function verificarClienteExiste(codigo, token) {
  try {
    await axios.get(`${CLIENTES_URL}/clientes/${encodeURIComponent(codigo)}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
  } catch (err) {
    if (err.response && err.response.status === 404) throw new AppError(400, 'El código de cliente no existe');
    if (err.response) throw new AppError(502, `ms-clientes respondió con error (HTTP ${err.response.status})`);
    throw new AppError(503, 'ms-clientes no está disponible; no se pudo verificar el cliente');
  }
}

module.exports = { verificarClienteExiste };
