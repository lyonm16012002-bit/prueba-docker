const TABLE = 'rutinas';
const FIELDS = ['semana', 'dia', 'grupo_muscular', 'ejercicio', 'series', 'repeticiones', 'peso', 'descanso', 'observaciones'];
const REQUIRED = [];
const ORDER_BY = 'semana, dia';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS rutinas (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo            TEXT NOT NULL REFERENCES clientes(codigo) ON DELETE CASCADE,
  semana            INTEGER,
  dia               TEXT,
  grupo_muscular    TEXT,
  ejercicio         TEXT,
  series            INTEGER,
  repeticiones      TEXT,
  peso              TEXT,
  descanso          TEXT,
  observaciones     TEXT
);
CREATE INDEX IF NOT EXISTS idx_rutinas_codigo ON rutinas(codigo);`;

module.exports = { TABLE, FIELDS, REQUIRED, ORDER_BY, SCHEMA };
