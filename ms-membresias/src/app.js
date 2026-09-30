const express = require('express');
const { PORT } = require('./config/env');
require('./config/database');
const pagoRoutes = require('./routes/pago.routes');
const asistenciaRoutes = require('./routes/asistencia.routes');
const membresiasRoutes = require('./routes/membresias.routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true, servicio: 'ms-membresias' }));
app.use('/pagos', pagoRoutes);
app.use('/asistencia', asistenciaRoutes);
app.use('/membresias', membresiasRoutes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log(`[ms-membresias] escuchando en http://localhost:${PORT}`));
}

module.exports = app;
