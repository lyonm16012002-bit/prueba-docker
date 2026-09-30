const TABLE = 'asistencia';
const FIELDS = ['fecha', 'hora', 'asistio'];
const REQUIRED = ['fecha'];
const ORDER_BY = 'fecha DESC, hora DESC';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS asistencia (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo  TEXT NOT NULL,
  fecha   TEXT NOT NULL,
  hora    TEXT,
  asistio INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_asistencia_codigo ON asistencia(codigo);`;

module.exports = { TABLE, FIELDS, REQUIRED, ORDER_BY, SCHEMA };
