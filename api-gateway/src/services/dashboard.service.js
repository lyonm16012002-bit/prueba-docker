// SERVICE del Gateway: el dashboard mezcla datos de varios microservicios, así que el Gateway
// los consulta en paralelo y arma una sola respuesta (patrón "API composition").
const axios = require('axios');
const servicios = require('../config/services');
const AppError = require('../utils/AppError');

async function consultar(clave, ruta, token) {
  const { nombre, url } = servicios[clave];
  try {
    const r = await axios.get(url + ruta, { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 });
    return r.data;
  } catch (err) {
    throw new AppError(503, `No se pudo armar el dashboard: falló ${nombre}`);
  }
}

async function resumen(token) {
  const [clientes, pagos, asistencia] = await Promise.all([
    consultar('clientes', '/clientes/estadisticas', token),
    consultar('membresias', '/pagos/estadisticas', token),
    consultar('membresias', '/asistencia/estadisticas', token)
  ]);
  return { ...clientes, ...pagos, ...asistencia };
}

module.exports = { resumen };
