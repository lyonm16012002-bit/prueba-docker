const BaseRepository = require('./base.repository');
const db = require('../config/database');

class PagoRepository extends BaseRepository {
  contarPendientes() {
    return db.prepare("SELECT COUNT(*) AS c FROM pagos WHERE estado != 'Pagado'").get().c;
  }

  contarProximosAVencer() {
    return db.prepare(
      "SELECT COUNT(*) AS c FROM pagos WHERE proximo_pago IS NOT NULL AND date(proximo_pago) <= date('now', '+7 days')"
    ).get().c;
  }
}

module.exports = new PagoRepository(require('../models/pago.model'));
