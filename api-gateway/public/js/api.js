var api = (function () {
  var BASE = ''; // mismo origen (el backend sirve también el front-end)

  function getToken() {
    return localStorage.getItem('gymdb_token');
  }

  function logout() {
    localStorage.removeItem('gymdb_token');
    localStorage.removeItem('gymdb_username');
    localStorage.removeItem('gymdb_role');
    window.location.href = 'index.html';
  }

  async function request(method, path, body) {
    var headers = { 'Content-Type': 'application/json' };
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    var res = await fetch(BASE + path, {
      method: method,
      headers: headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (res.status === 401) {
      logout();
      throw new Error('Sesión expirada, vuelve a iniciar sesión.');
    }

    var data = null;
    try { data = await res.json(); } catch (e) { /* respuesta vacía */ }

    if (!res.ok) {
      throw new Error((data && data.error) || 'Ocurrió un error inesperado');
    }
    return data;
  }

  return {
    login: function (username, password) {
      return request('POST', '/api/auth/login', { username: username, password: password });
    },
    get: function (path) { return request('GET', path); },
    post: function (path, body) { return request('POST', path, body); },
    put: function (path, body) { return request('PUT', path, body); },
    del: function (path) { return request('DELETE', path); },
    logout: logout,
    role: function () { return localStorage.getItem('gymdb_role'); },
    username: function () { return localStorage.getItem('gymdb_username'); },
    requireLogin: function () {
      if (!getToken()) window.location.href = 'index.html';
    }
  };
})();
