# ms-usuarios (puerto 3001)

**Responsabilidad:** autenticar al personal del gimnasio y **emitir el JWT**. Gestiona los usuarios del sistema. Base de datos propia: `data/usuarios.db`.

| Método | Ruta | JWT | Rol |
|---|---|:---:|---|
| POST | `/auth/login` | ❌ | — |
| GET | `/auth/me` | ✅ | cualquiera |
| GET / POST | `/usuarios` | ✅ | admin |
| DELETE | `/usuarios/:id` | ✅ | admin |

Capas: `routes/` → `controllers/` → `services/` (`auth.service.js` firma el JWT con bcrypt + jsonwebtoken) → `repositories/` (SQL) → `models/`.
Los usuarios iniciales (admin y asistente) se crean desde `.env` la primera vez (`config/seed.js`).

`npm start` desde la raíz levanta todos los servicios; solo este: `npm start -w ms-usuarios`.
