# Guía de cambios y sustentación

Documento de apoyo para explicar **qué se transformó** respecto al proyecto anterior (`gym-database`, un monolito) y para preparar la presentación.

---

## 1. De monolito a microservicios: mapa de cambios

| Proyecto anterior | Ahora | Por qué |
|---|---|---|
| `server.js` (todo en un proceso) | `api-gateway/src/app.js` + 3 microservicios | Cada parte se despliega, escala y falla por separado |
| `routes/auth.js`, `middleware/auth.js` | `ms-usuarios` (emite el JWT) · `middleware/auth.js` en Gateway y en cada servicio | El Gateway valida; cada servicio también (defensa en profundidad) |
| `routes/clientes.js` | `ms-clientes` → `cliente.routes / controller / service / repository / model` | Rutas, HTTP, negocio y SQL estaban mezclados en un archivo |
| `routes/crudFactory.js` (evaluaciones, rutinas, pagos, asistencia) | Clases base `base.repository / base.service / base.controller` + `crud.routes.js`, una copia por servicio | El CRUD repetido se conserva, pero ahora separado en capas |
| `routes/pagos.js`, `routes/asistencia.js` | `ms-membresias` | Pagos y asistencia forman el dominio de "membresía" |
| `routes/dashboard.js` (SQL sobre 3 tablas) | `GET /api/dashboard` en el Gateway, que llama por HTTP a `/clientes/estadisticas`, `/pagos/estadisticas`, `/asistencia/estadisticas` | Al haber bases separadas, ya no se puede hacer un solo SQL |
| `db/schema.sql` + `db/database.js` (una BD) | `models/*.model.js` + `config/database.js` en cada servicio (3 BD) | Patrón "una base de datos por microservicio" |
| `public/` | `api-gateway/public/` **sin cambios** | El panel sigue usando `/api/...`, el Gateway mantiene las mismas rutas |

### Consecuencias de separar las bases de datos (buenos puntos para explicar)

1. **Ya no hay `FOREIGN KEY` entre servicios.** `pagos.codigo` y `asistencia.codigo` apuntan a un cliente que vive en otra base. Ahora `ms-membresias` verifica por HTTP (Axios) que el cliente exista antes de guardar.
2. **El borrado en cascada se coordina.** Antes lo hacía SQLite. Ahora `ms-clientes` pide a `ms-membresias` borrar pagos y asistencias y, solo si eso funciona, borra el cliente (sus evaluaciones y rutinas siguen cayendo por `ON DELETE CASCADE`, porque están en la misma base).
3. **El dashboard es una composición.** El Gateway consulta 3 endpoints en paralelo (`Promise.all`) y une los resultados.

## 2. Mejoras y correcciones incluidas

- **Valores por defecto:** el código anterior insertaba `NULL` explícito cuando un campo llegaba vacío, así que los `DEFAULT` de la base (`estado = 'Activo'`, `fecha_ingreso = hoy`, `asistio = 1`, pago `'Pagado'`) nunca se aplicaban. Ahora los campos vacíos se omiten en el `INSERT` y la base aplica su valor por defecto.
- **Campos obligatorios:** una evaluación o asistencia sin `fecha` provocaba un error genérico 500 de SQLite; ahora responde **400** con un mensaje claro.
- **JWT:**
  - El servicio no arranca si falta `JWT_SECRET`.
  - Se fija el algoritmo (`HS256`) al verificar.
  - Se distingue "Token expirado" de "Token inválido".
  - La duración se configura con `JWT_EXPIRES_IN`.
  - El payload incluye `sub` (id de usuario).
- **Roles:** `requireAdmin` pasó a `requireRole('admin')`, que admite varios roles.
- **Gestión de usuarios (nueva):** el admin puede crear y eliminar usuarios (`/api/usuarios`). Antes solo existían los dos usuarios del `.env`.
- **Manejo de errores centralizado:** JSON malformado → 400, conflictos de base de datos → 409, servicio caído → 503, timeout → 504.
- **Todo probado:** el README anterior advertía que el proyecto nunca se había ejecutado; esta versión se levantó completa y se verificaron 16 pruebas de JWT y un recorrido funcional de 40+ casos (CRUD, roles, borrado coordinado, caída de un microservicio).

## 3. Migrar los datos del proyecto anterior

Con los servicios detenidos:

```bash
npm install
npm run migrar -- ruta/al/gym-database/data/gym.db
npm start
```

Copia `users` → `ms-usuarios`, `clientes/evaluaciones/rutinas` → `ms-clientes`, `pagos/asistencia` → `ms-membresias`, conservando ids y contraseñas (hash). Es idempotente. Las contraseñas de los usuarios migrados **siguen siendo las de antes**; las del `.env` solo se usan cuando la base de usuarios está vacía.

> ⚠️ **Privacidad:** no subas a GitHub ni muestres en clase datos reales de clientes. Para la demostración usa `npm run demo:datos` (datos ficticios). Tampoco subas el `.env`.

## 4. Las 7 preguntas del profesor, respondidas para este proyecto

**1. ¿Qué problema solucionan?**
El control de clientes, evaluaciones, rutinas, pagos y asistencia de un entrenador personal, que se llevaba en Excel: datos duplicados, sin permisos y sin acceso simultáneo desde distintos lugares.

**2. ¿Quiénes son los usuarios?**
- **Administrador (entrenador):** acceso total, incluidos pagos, eliminación de clientes y gestión de usuarios.
- **Asistente (recepcionista):** registra y consulta datos, pero no toca pagos ni elimina clientes.

**3. ¿Qué información necesitan almacenar?**

| Microservicio | Entidad | Campos principales |
|---|---|---|
| ms-usuarios | users | username, password_hash (bcrypt), role |
| ms-clientes | clientes | código `CLxxxx`, nombre, apellido, sexo, edad, teléfono, correo, estatura, peso inicial, objetivo, estado |
| ms-clientes | evaluaciones | fecha, peso, IMC, % grasa, masa muscular, medidas (cintura, cadera, brazo, muslo) |
| ms-clientes | rutinas | semana, día, grupo muscular, ejercicio, series, repeticiones, descanso |
| ms-membresias | pagos | plan, valor, fecha de pago, próximo pago, estado |
| ms-membresias | asistencia | fecha, hora, asistió |

**4. ¿Qué microservicios van a desarrollar?**
`ms-usuarios`, `ms-clientes` y `ms-membresias`, más el `api-gateway` como punto de entrada (uno por integrante).

**5. ¿Qué endpoints tendrá?**
Ver la tabla del README raíz, sección 7.

**6. ¿Qué es JWT?**
Un token firmado (`header.payload.signature`) que el servidor entrega tras el login. Contiene la identidad y el rol del usuario y una fecha de expiración. La firma, hecha con un secreto que solo conocen los servicios, permite detectar cualquier alteración. Se envía en cada petición como `Authorization: Bearer <token>`, y los servicios lo validan sin consultar la base de datos.
*Demostración:* `npm run probar:jwt` muestra el header y payload reales y prueba token ausente, alterado, expirado y válido.

**7. ¿Diferencia entre autenticación y autorización?**
Autenticación = *verificar quién eres* (login y validación del JWT → falla con 401). Autorización = *verificar qué puedes hacer* según tu rol (falla con 403).
*Ejemplo del proyecto:* el asistente tiene un token perfectamente válido (autenticado), pero `POST /api/pagos` le devuelve 403 porque no está autorizado.

## 5. Preguntas que el profesor podría hacer

- **¿Por qué el Gateway y los servicios validan el JWT?** Porque si alguien llama directo al puerto de un servicio, se saltaría el Gateway. Cada servicio no debe confiar ciegamente en quien lo llama (probado con `probar:jwt`).
- **¿Qué hace cada capa y qué pasa si una hace el trabajo de otra?** Ver tabla de capas del README, sección 5.2. Ejemplo: si el controller escribiera SQL, cambiar de SQLite a PostgreSQL obligaría a tocar todos los controllers.
- **¿Por qué una base de datos por servicio?** Independencia: se puede cambiar, escalar o desplegar uno sin afectar a los demás. El costo es perder las llaves foráneas y los JOINs entre servicios.
- **¿Qué pasa si `ms-membresias` se cae?** El resto del sistema sigue funcionando; el Gateway responde 503 en las rutas afectadas y eliminar un cliente se cancela para no dejar datos huérfanos.
- **¿Dónde se guarda la contraseña?** Solo como hash bcrypt, nunca en texto plano.
- **¿Por qué modificaron la estructura de carpetas del ejemplo?** Se respetó la estructura pedida y se añadieron `config/`, `middleware/`, `utils/` y `clients/`, con la justificación en el README (sección 5.3).
- **¿Cuáles son las debilidades?** Ver README, sección 11.

## 6. Checklist de entrega

- [ ] Nombres reales de los integrantes en el README (sección 3)
- [ ] `.env` creado localmente (**no** subido al repositorio)
- [ ] Repositorio en GitHub con una rama por integrante y todo unido en `main`
- [ ] `npm install && npm start` funciona desde cero en otro computador
- [ ] `npm run probar:jwt` muestra 16/16 (capturas para el PowerPoint)
- [ ] PowerPoint con las 7 preguntas + pruebas del JWT
- [ ] Demo ensayada, con capturas o video de respaldo
- [ ] Cada integrante puede explicar **todas** las capas, no solo su servicio
