// REPOSITORY base para tablas con "id" autoincremental y columna "codigo" (cliente).
// Todo el SQL vive aquí; los nombres de tabla/columnas salen del MODEL (constantes), nunca del usuario.
const db = require('../config/database');

// '' -> null (así la base aplica sus valores DEFAULT cuando el campo no se envió)
const limpiar = (v) => (v === '' || v === undefined ? null : typeof v === 'boolean' ? Number(v) : v);

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  findAll(codigo) {
    const { TABLE, ORDER_BY } = this.model;
    if (codigo) return db.prepare(`SELECT * FROM ${TABLE} WHERE codigo = ? ORDER BY ${ORDER_BY}`).all(codigo);
    return db.prepare(`SELECT * FROM ${TABLE} ORDER BY ${ORDER_BY}`).all();
  }

  findById(id) {
    return db.prepare(`SELECT * FROM ${this.model.TABLE} WHERE id = ?`).get(id);
  }

  create(data) {
    const { TABLE, FIELDS } = this.model;
    // Solo se insertan las columnas con valor; las demás toman el DEFAULT definido en el esquema.
    const cols = ['codigo', ...FIELDS].filter((c) => limpiar(data[c]) !== null);
    const sql = `INSERT INTO ${TABLE} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`;
    const info = db.prepare(sql).run(...cols.map((c) => limpiar(data[c])));
    return this.findById(info.lastInsertRowid);
  }

  update(id, data) {
    const { TABLE, FIELDS } = this.model;
    const sets = FIELDS.map((f) => `${f} = ?`).join(', ');
    db.prepare(`UPDATE ${TABLE} SET ${sets} WHERE id = ?`).run(...FIELDS.map((f) => limpiar(data[f])), id);
    return this.findById(id);
  }

  remove(id) {
    return db.prepare(`DELETE FROM ${this.model.TABLE} WHERE id = ?`).run(id).changes;
  }

  removeByCodigo(codigo) {
    return db.prepare(`DELETE FROM ${this.model.TABLE} WHERE codigo = ?`).run(codigo).changes;
  }
}

module.exports = BaseRepository;
