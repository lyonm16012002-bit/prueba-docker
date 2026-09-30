const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { DB_PATH } = require('./env');
const pago = require('../models/pago.model');
const asistencia = require('../models/asistencia.model');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// Base de datos PROPIA de ms-membresias.
const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');
db.exec(pago.SCHEMA);
db.exec(asistencia.SCHEMA);

module.exports = db;
