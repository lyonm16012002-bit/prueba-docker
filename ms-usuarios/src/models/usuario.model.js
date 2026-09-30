// MODEL: describe la tabla (nombre, roles válidos y esquema SQL). No tiene lógica.
const TABLE = 'users';
const ROLES = ['admin', 'asistente'];

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('admin','asistente'))
);`;

module.exports = { TABLE, ROLES, SCHEMA };
