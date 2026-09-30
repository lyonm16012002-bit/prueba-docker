// REPOSITORY: única capa que habla SQL con la base de datos. No conoce HTTP ni reglas de negocio.
const db = require('../config/database');

const PUBLIC_COLUMNS = 'id, username, role'; // nunca se expone password_hash

module.exports = {
  count() {
    return db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  },

  findByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  findById(id) {
    return db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`).get(id);
  },

  findAll() {
    return db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY username`).all();
  },

  create({ username, passwordHash, role }) {
    const info = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, passwordHash, role);
    return this.findById(info.lastInsertRowid);
  },

  remove(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id).changes;
  }
};
