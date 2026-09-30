const path = require('path');
const dotenv = require('dotenv');

// Primero el .env propio del servicio (si existe) y luego el .env de la raíz del proyecto.
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

if (!process.env.JWT_SECRET) {
  console.error('[ms-usuarios] Falta JWT_SECRET. Copia .env.example a .env y defínelo.');
  process.exit(1);
}

module.exports = {
  PORT: Number(process.env.USUARIOS_PORT) || 3001,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '12h',
  DB_PATH: process.env.USUARIOS_DB_PATH || path.join(__dirname, '..', '..', 'data', 'usuarios.db'),
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  ASSISTANT_USERNAME: process.env.ASSISTANT_USERNAME || 'asistente',
  ASSISTANT_PASSWORD: process.env.ASSISTANT_PASSWORD || 'asistente123'
};
