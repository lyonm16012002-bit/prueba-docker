// SERVICE: reglas de negocio de la gestión de usuarios (solo admin).
const bcrypt = require('bcryptjs');
const repo = require('../repositories/usuario.repository');
const AppError = require('../utils/AppError');
const { ROLES } = require('../models/usuario.model');

function listar() {
  return repo.findAll();
}

function crear({ username, password, role } = {}) {
  if (typeof username !== 'string' || username.trim().length < 3) {
    throw new AppError(400, 'El usuario debe tener al menos 3 caracteres');
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw new AppError(400, 'La contraseña debe tener al menos 6 caracteres');
  }
  if (!ROLES.includes(role)) {
    throw new AppError(400, `Rol inválido. Roles permitidos: ${ROLES.join(', ')}`);
  }
  if (repo.findByUsername(username.trim())) {
    throw new AppError(409, 'Ese nombre de usuario ya existe');
  }

  // La contraseña NUNCA se guarda en texto plano: solo su hash bcrypt.
  return repo.create({ username: username.trim(), passwordHash: bcrypt.hashSync(password, 10), role });
}

function eliminar(id, usuarioActual) {
  const user = repo.findById(id);
  if (!user) throw new AppError(404, 'Usuario no encontrado');
  if (String(user.id) === String(usuarioActual.sub)) {
    throw new AppError(400, 'No puedes eliminar tu propio usuario');
  }
  repo.remove(id);
}

module.exports = { listar, crear, eliminar };
