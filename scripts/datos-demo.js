/**
 * Inserta datos FICTICIOS para la demostración (no uses datos reales de clientes en clases ni en GitHub).
 * Uso:  npm run demo:datos     (con los servicios detenidos)
 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const rutas = require('./rutas-db');

function abrir(ruta, esquemas) {
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  const db = new Database(ruta);
  db.pragma('foreign_keys = ON');
  esquemas.forEach((s) => db.exec(s));
  return db;
}
const M = (svc, file) => require(path.join('..', svc, 'src', 'models', file));

const hoy = new Date();
const dia = (delta) => new Date(hoy.getTime() + delta * 86400000).toISOString().slice(0, 10);

const clientes = abrir(rutas.clientes, [
  M('ms-clientes', 'cliente.model').SCHEMA, M('ms-clientes', 'evaluacion.model').SCHEMA, M('ms-clientes', 'rutina.model').SCHEMA
]);
const membresias = abrir(rutas.membresias, [M('ms-membresias', 'pago.model').SCHEMA, M('ms-membresias', 'asistencia.model').SCHEMA]);

const ya = clientes.prepare("SELECT COUNT(*) c FROM clientes WHERE codigo IN ('CL0001','CL0002','CL0003')").get().c;
if (ya) { console.log('Los datos de demo ya existen. No se insertó nada.'); process.exit(0); }

const cli = clientes.prepare('INSERT INTO clientes (codigo, nombre, apellido, sexo, edad, telefono, correo, estatura_cm, peso_inicial_kg, objetivo, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
cli.run('CL0001', 'Laura', 'Gómez', 'F', 28, '3001112233', 'laura@ejemplo.com', 165, 68, 'Perder grasa', 'Activo');
cli.run('CL0002', 'Andrés', 'Ruiz', 'M', 35, '3004445566', 'andres@ejemplo.com', 178, 82, 'Ganar masa muscular', 'Activo');
cli.run('CL0003', 'Camila', 'Torres', 'F', 22, '3007778899', 'camila@ejemplo.com', 160, 55, 'Tonificar', 'Inactivo');

clientes.prepare('INSERT INTO evaluaciones (codigo, fecha, peso, imc, porcentaje_grasa, masa_muscular, observaciones) VALUES (?,?,?,?,?,?,?)')
  .run('CL0001', dia(-7), 66.5, 24.4, 27, 45, 'Buen progreso');
clientes.prepare('INSERT INTO rutinas (codigo, semana, dia, grupo_muscular, ejercicio, series, repeticiones, descanso) VALUES (?,?,?,?,?,?,?,?)')
  .run('CL0001', 1, 'Lunes', 'Pierna', 'Sentadilla', 4, '12', '60s');

const pago = membresias.prepare('INSERT INTO pagos (codigo, plan, valor, fecha_pago, proximo_pago, estado) VALUES (?,?,?,?,?,?)');
pago.run('CL0001', 'Mensual', 120000, dia(-25), dia(5), 'Pagado');
pago.run('CL0002', 'Mensual', 120000, dia(-40), dia(-10), 'Pendiente');
membresias.prepare('INSERT INTO asistencia (codigo, fecha, hora, asistio) VALUES (?,?,?,?)').run('CL0001', dia(0), '07:00', 1);

console.log('Datos de demo insertados: 3 clientes, 1 evaluación, 1 rutina, 2 pagos, 1 asistencia.');
