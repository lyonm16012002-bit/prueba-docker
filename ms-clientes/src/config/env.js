const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

if (!process.env.JWT_SECRET) {
  console.error('[ms-clientes] Falta JWT_SECRET. Copia .env.example a .env y defínelo.');
  process.exit(1);
}

module.exports = {
  PORT: Number(process.env.CLIENTES_PORT) || 3002,
  JWT_SECRET: process.env.JWT_SECRET,
  MEMBRESIAS_URL: process.env.MEMBRESIAS_URL || 'http://localhost:3003',
  DB_PATH: process.env.CLIENTES_DB_PATH || path.join(__dirname, '..', '..', 'data', 'clientes.db')
};
