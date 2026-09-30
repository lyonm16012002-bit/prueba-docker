/**
 * Migra los datos del proyecto anterior (monolito, un solo gym.db) a las 3 bases de los microservicios.
 *
 * Uso:  npm run migrar -- ruta/al/gym.db
 *
 * - users                                  -> ms-usuarios/data/usuarios.db
 * - clientes, evaluaciones, rutinas        -> ms-clientes/data/clientes.db
 * - pagos, asistencia                      -> ms-membresias/data/membresias.db
 * Es seguro ejecutarlo más de una vez (INSERT OR IGNORE, conserva los ids originales).
 * Detén los servicios antes de migrar.
 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const rutas = require('./rutas-db');

const origenPath = process.argv[2];
if (!origenPath || !fs.existsSync(origenPath)) {
  console.error('Indica la ruta del gym.db anterior:  npm run migrar -- ruta/al/gym.db');
  process.exit(1);
}

const origen = new Database(origenPath, { readonly: true });

function abrir(ruta, esquemas) {
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  const db = new Database(ruta);
  db.pragma('foreign_keys = ON');
  esquemas.forEach((s) => db.exec(s));
  return db;
}

function copiar(tabla, destino) {
  const filas = origen.prepare(`SELECT * FROM ${tabla}`).all();
  if (!filas.length) return console.log(`  ${tabla}: 0 filas`);
  const cols = Object.keys(filas[0]);
  const stmt = destino.prepare(`INSERT OR IGNORE INTO ${tabla} (${cols.join(', ')}) VALUES (${cols.map((c) => '@' + c).join(', ')})`);
  const insertar = destino.transaction((rows) => rows.forEach((r) => stmt.run(r)));
  insertar(filas);
  console.log(`  ${tabla}: ${filas.length} filas`);
}

const M = (svc, file) => require(path.join('..', svc, 'src', 'models', file));

console.log('Migrando desde', origenPath);

const dbUsuarios = abrir(rutas.usuarios, [M('ms-usuarios', 'usuario.model').SCHEMA]);
copiar('users', dbUsuarios);

const dbClientes = abrir(rutas.clientes, [
  M('ms-clientes', 'cliente.model').SCHEMA,
  M('ms-clientes', 'evaluacion.model').SCHEMA,
  M('ms-clientes', 'rutina.model').SCHEMA
]);
copiar('clientes', dbClientes);
copiar('evaluaciones', dbClientes);
copiar('rutinas', dbClientes);

const dbMembresias = abrir(rutas.membresias, [
  M('ms-membresias', 'pago.model').SCHEMA,
  M('ms-membresias', 'asistencia.model').SCHEMA
]);
copiar('pagos', dbMembresias);
copiar('asistencia', dbMembresias);

console.log('Listo. Ya puedes iniciar con: npm start');
