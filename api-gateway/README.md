# api-gateway (puerto 3000)

**Responsabilidad:** ser la **única puerta de entrada**.

1. Sirve el panel web (`public/`).
2. `POST /api/auth/login` es la única ruta pública.
3. Todo lo demás pasa por `middleware/auth.js`, que valida el JWT (firma y expiración). Sin token válido responde **401** y la petición nunca llega a los microservicios.
4. Enruta con Axios (`services/proxy.service.js`): `/api/clientes|evaluaciones|rutinas` → ms-clientes, `/api/pagos|asistencia` → ms-membresias, `/api/auth|usuarios` → ms-usuarios.
5. `GET /api/dashboard` consolida datos de varios servicios en paralelo (`services/dashboard.service.js`).
6. Si un microservicio no responde, devuelve **503/504** con un mensaje claro.

El Gateway solo **autentica**; la **autorización por rol** la aplica cada microservicio, que es el dueño de sus reglas.

`npm start -w api-gateway`
