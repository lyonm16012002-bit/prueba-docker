// MODEL: tabla "pagos". "codigo" referencia al cliente de OTRO microservicio (otra base de datos),
// por eso no hay FOREIGN KEY: la existencia del cliente se valida por HTTP en el service.
const TABLE = 'pagos';
const FIELDS = ['plan', 'valor', 'fecha_pago', 'proximo_pago', 'estado'];
const REQUIRED = [];
const ORDER_BY = 'fecha_pago DESC';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS pagos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo        TEXT NOT NULL,
  plan          TEXT,
  valor         REAL,
  fecha_pago    TEXT,
  proximo_pago  TEXT,
  estado        TEXT DEFAULT 'Pagado'
);
CREATE INDEX IF NOT EXISTS idx_pagos_codigo ON pagos(codigo);`;

module.exports = { TABLE, FIELDS, REQUIRED, ORDER_BY, SCHEMA };
