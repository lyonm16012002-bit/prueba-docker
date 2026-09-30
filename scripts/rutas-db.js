// Rutas de las bases de datos de cada microservicio (las mismas que usan los servicios por defecto).
const path = require('path');
const raiz = path.join(__dirname, '..');

module.exports = {
  usuarios: path.join(raiz, 'ms-usuarios', 'data', 'usuarios.db'),
  clientes: path.join(raiz, 'ms-clientes', 'data', 'clientes.db'),
  membresias: path.join(raiz, 'ms-membresias', 'data', 'membresias.db')
};
