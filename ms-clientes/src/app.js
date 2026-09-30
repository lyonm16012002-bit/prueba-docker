const express = require('express');
const { PORT } = require('./config/env');
require('./config/database');
const clienteRoutes = require('./routes/cliente.routes');
const evaluacionRoutes = require('./routes/evaluacion.routes');
const rutinaRoutes = require('./routes/rutina.routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true, servicio: 'ms-clientes' }));
app.use('/clientes', clienteRoutes);
app.use('/evaluaciones', evaluacionRoutes);
app.use('/rutinas', rutinaRoutes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log(`[ms-clientes] escuchando en http://localhost:${PORT}`));
}

module.exports = app;
