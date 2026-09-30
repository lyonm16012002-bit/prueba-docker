// SERVICE base: reglas de negocio comunes del CRUD.
// "verificarCliente" se inyecta: en ms-clientes consulta la base local; en ms-membresias llama por HTTP a ms-clientes.
const AppError = require('../utils/AppError');

class BaseService {
  constructor({ repository, model, verificarCliente }) {
    this.repository = repository;
    this.model = model;
    this.verificarCliente = verificarCliente;
  }

  listar(codigo) {
    return this.repository.findAll(codigo);
  }

  obtener(id) {
    const registro = this.repository.findById(id);
    if (!registro) throw new AppError(404, 'Registro no encontrado');
    return registro;
  }

  async crear(body, token) {
    if (!body.codigo) throw new AppError(400, 'El campo codigo (cliente) es requerido');
    for (const campo of this.model.REQUIRED || []) {
      if (body[campo] === undefined || body[campo] === null || body[campo] === '') {
        throw new AppError(400, `El campo ${campo} es requerido`);
      }
    }
    await this.verificarCliente(body.codigo, token); // regla: el cliente debe existir
    return this.repository.create(body);
  }

  actualizar(id, body) {
    const existente = this.obtener(id);
    const datos = {};
    for (const f of this.model.FIELDS) datos[f] = body[f] ?? existente[f];
    return this.repository.update(id, datos);
  }

  eliminar(id) {
    this.obtener(id);
    this.repository.remove(id);
  }
}

module.exports = BaseService;
