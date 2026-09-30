const TABLE = 'evaluaciones';
const FIELDS = ['fecha', 'peso', 'imc', 'porcentaje_grasa', 'masa_muscular', 'cintura', 'cadera', 'brazo', 'muslo', 'observaciones'];
const REQUIRED = ['fecha'];
const ORDER_BY = 'fecha DESC';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS evaluaciones (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo            TEXT NOT NULL REFERENCES clientes(codigo) ON DELETE CASCADE,
  fecha             TEXT NOT NULL,
  peso              REAL,
  imc               REAL,
  porcentaje_grasa  REAL,
  masa_muscular     REAL,
  cintura           REAL,
  cadera            REAL,
  brazo             REAL,
  muslo             REAL,
  observaciones     TEXT
);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_codigo ON evaluaciones(codigo);`;

module.exports = { TABLE, FIELDS, REQUIRED, ORDER_BY, SCHEMA };
