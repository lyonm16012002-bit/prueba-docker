# ms-membresias (puerto 3003)

**Responsabilidad:** pagos de planes y asistencia al gimnasio. Base de datos propia: `data/membresias.db`.
El campo `codigo` referencia al cliente de **otro** microservicio, por eso no hay `FOREIGN KEY`: la existencia del cliente se valida por HTTP (`clients/clientes.client.js`, Axios) reenviando el JWT del usuario.

| Método | Ruta | JWT | Rol |
|---|---|:---:|---|
| GET | `/pagos`, `/pagos/:id`, `/pagos/estadisticas` | ✅ | cualquiera |
| POST / PUT / DELETE | `/pagos` | ✅ | **admin** |
| GET / POST / PUT / DELETE | `/asistencia` (filtro `?codigo=`), `/asistencia/estadisticas` | ✅ | cualquiera |
| DELETE | `/membresias/cliente/:codigo` (uso interno) | ✅ | admin |

`npm start -w ms-membresias`
