const bcrypt = require('bcryptjs');
const repo = require('../repositories/usuario.repository');
const env = require('./env');

// Crea el admin y el asistente definidos en .env, solo si la tabla está vacía.
function seedUsers() {
  if (repo.count() > 0) return;

  if (!process.env.ADMIN_PASSWORD || !process.env.ASSISTANT_PASSWORD) {
    console.warn('[ms-usuarios] AVISO: usando contraseñas por defecto. Defínelas en .env antes de publicar.');
  }

  repo.create({ username: env.ADMIN_USERNAME, passwordHash: bcrypt.hashSync(env.ADMIN_PASSWORD, 10), role: 'admin' });
  repo.create({ username: env.ASSISTANT_USERNAME, passwordHash: bcrypt.hashSync(env.ASSISTANT_PASSWORD, 10), role: 'asistente' });

  console.log('[ms-usuarios] Usuarios iniciales creados:');
  console.log('   admin     ->', env.ADMIN_USERNAME);
  console.log('   asistente ->', env.ASSISTANT_USERNAME);
}

module.exports = seedUsers;
