# ms-clientes (puerto 3002)

**Responsabilidad:** datos de los clientes, sus evaluaciones físicas y sus rutinas. Base de datos propia: `data/clientes.db` (aquí sí hay llaves foráneas reales entre `clientes`, `evaluaciones` y `rutinas`).

| Método | Ruta | JWT | Rol |
|---|---|:---:|---|
| GET | `/clientes`, `/clientes/:codigo`, `/clientes/estadisticas` | ✅ | cualquiera |
| POST / PUT | `/clientes` , `/clientes/:codigo` | ✅ | cualquiera |
| DELETE | `/clientes/:codigo` | ✅ | admin |
| GET / POST / PUT / DELETE | `/evaluaciones`, `/rutinas` (filtro `?codigo=`) | ✅ | cualquiera |

**Reglas de negocio (capa service):** el código `CLxxxx` lo genera el sistema; nombre y apellido obligatorios; evaluaciones y rutinas exigen que el cliente exista.
**Comunicación con otro servicio:** al eliminar un cliente, `clients/membresias.client.js` (Axios) pide a `ms-membresias` borrar sus pagos y asistencias **antes** de borrar el cliente; si `ms-membresias` no responde, se cancela la operación.

`npm start -w ms-clientes`
