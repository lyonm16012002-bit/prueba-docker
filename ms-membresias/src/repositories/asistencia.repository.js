const BaseRepository = require('./base.repository');
const db = require('../config/database');

class AsistenciaRepository extends BaseRepository {
  contarHoy() {
    return db.prepare("SELECT COUNT(*) AS c FROM asistencia WHERE date(fecha) = date('now') AND asistio = 1").get().c;
  }
}

module.exports = new AsistenciaRepository(require('../models/asistencia.model'));
