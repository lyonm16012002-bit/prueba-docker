const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { DB_PATH } = require('./env');
const cliente = require('../models/cliente.model');
const evaluacion = require('../models/evaluacion.model');
const rutina = require('../models/rutina.model');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// Base de datos PROPIA de ms-clientes. Aquí sí hay llaves foráneas reales entre sus tablas.
const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');
db.exec(cliente.SCHEMA);
db.exec(evaluacion.SCHEMA);
db.exec(rutina.SCHEMA);

module.exports = db;
