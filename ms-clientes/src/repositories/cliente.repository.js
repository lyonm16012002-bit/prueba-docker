// REPOSITORY de clientes: solo SQL.
const db = require('../config/database');
const { FIELDS } = require('../models/cliente.model');

const limpiar = (v) => (v === '' || v === undefined ? null : typeof v === 'boolean' ? Number(v) : v);

module.exports = {
  findAll() {
    return db.prepare('SELECT * FROM clientes ORDER BY nombre, apellido').all();
  },

  findByCodigo(codigo) {
    return db.prepare('SELECT * FROM clientes WHERE codigo = ?').get(codigo);
  },

  // Último código con formato CLxxxx (para calcular el siguiente)
  ultimoCodigo() {
    const fila = db.prepare(
      "SELECT codigo FROM clientes WHERE codigo LIKE 'CL%' ORDER BY LENGTH(codigo) DESC, codigo DESC LIMIT 1"
    ).get();
    return fila ? fila.codigo : null;
  },

  create(codigo, data) {
    const cols = ['codigo', ...FIELDS].filter((c) => c === 'codigo' || limpiar(data[c]) !== null);
    const valores = cols.map((c) => (c === 'codigo' ? codigo : limpiar(data[c])));
    db.prepare(`INSERT INTO clientes (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`).run(...valores);
    return this.findByCodigo(codigo);
  },

  update(codigo, data) {
    const sets = FIELDS.map((f) => `${f} = ?`).join(', ');
    db.prepare(`UPDATE clientes SET ${sets} WHERE codigo = ?`).run(...FIELDS.map((f) => limpiar(data[f])), codigo);
    return this.findByCodigo(codigo);
  },

  // Borra el cliente; sus evaluaciones y rutinas se borran solas (ON DELETE CASCADE)
  remove(codigo) {
    return db.prepare('DELETE FROM clientes WHERE codigo = ?').run(codigo).changes;
  },

  contar() {
    return db.prepare('SELECT COUNT(*) AS c FROM clientes').get().c;
  },

  contarActivos() {
    return db.prepare("SELECT COUNT(*) AS c FROM clientes WHERE estado = 'Activo'").get().c;
  }
};
