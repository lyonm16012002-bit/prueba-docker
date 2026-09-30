// MODEL: estructura de la tabla "clientes". Sin lógica.
const TABLE = 'clientes';

const FIELDS = [
  'nombre', 'apellido', 'sexo', 'edad', 'fecha_nacimiento', 'telefono',
  'correo', 'estatura_cm', 'peso_inicial_kg', 'objetivo', 'fecha_ingreso', 'estado'
];

const SCHEMA = `
CREATE TABLE IF NOT EXISTS clientes (
  codigo            TEXT PRIMARY KEY,
  nombre            TEXT NOT NULL,
  apellido          TEXT NOT NULL,
  sexo              TEXT,
  edad              INTEGER,
  fecha_nacimiento  TEXT,
  telefono          TEXT,
  correo            TEXT,
  estatura_cm       REAL,
  peso_inicial_kg   REAL,
  objetivo          TEXT,
  fecha_ingreso     TEXT DEFAULT (date('now')),
  estado            TEXT DEFAULT 'Activo'
);`;

module.exports = { TABLE, FIELDS, SCHEMA };
