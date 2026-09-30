require('./env'); // carga .env antes de leer las URLs

// Directorio de microservicios: a dónde reenviar cada grupo de rutas.
module.exports = {
  usuarios:   { nombre: 'ms-usuarios',   url: process.env.USUARIOS_URL   || 'http://localhost:3001' },
  clientes:   { nombre: 'ms-clientes',   url: process.env.CLIENTES_URL   || 'http://localhost:3002' },
  membresias: { nombre: 'ms-membresias', url: process.env.MEMBRESIAS_URL || 'http://localhost:3003' }
};
