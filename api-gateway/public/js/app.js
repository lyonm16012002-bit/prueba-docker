api.requireLogin();

var clientsCache = [];
var currentSection = 'dashboard';
var currentRows = [];

var RESOURCES = {
  clientes: {
    label: 'Clientes', endpoint: '/api/clientes', pk: 'codigo',
    columns: [
      { key: 'codigo', label: 'Código' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellido', label: 'Apellido' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'correo', label: 'Correo' },
      { key: 'objetivo', label: 'Objetivo' },
      { key: 'estado', label: 'Estado' }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'apellido', label: 'Apellido', type: 'text', required: true },
      { name: 'sexo', label: 'Sexo', type: 'select', options: ['M', 'F', 'Otro'] },
      { name: 'edad', label: 'Edad', type: 'number' },
      { name: 'fecha_nacimiento', label: 'Fecha Nacimiento', type: 'date' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'correo', label: 'Correo', type: 'email' },
      { name: 'estatura_cm', label: 'Estatura (cm)', type: 'number' },
      { name: 'peso_inicial_kg', label: 'Peso Inicial (kg)', type: 'number' },
      { name: 'objetivo', label: 'Objetivo', type: 'text', full: true },
      { name: 'fecha_ingreso', label: 'Fecha Ingreso', type: 'date' },
      { name: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] }
    ],
    canDelete: function () { return api.role() === 'admin'; },
    canWrite: function () { return true; }
  },
  evaluaciones: {
    label: 'Evaluaciones', endpoint: '/api/evaluaciones', pk: 'id',
    columns: [
      { key: 'codigo', label: 'Cliente' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'peso', label: 'Peso' },
      { key: 'imc', label: 'IMC' },
      { key: 'porcentaje_grasa', label: '% Grasa' },
      { key: 'masa_muscular', label: 'Masa Musc.' }
    ],
    fields: [
      { name: 'codigo', label: 'Cliente', type: 'clientRef', required: true, full: true },
      { name: 'fecha', label: 'Fecha', type: 'date', required: true },
      { name: 'peso', label: 'Peso (kg)', type: 'number' },
      { name: 'imc', label: 'IMC', type: 'number' },
      { name: 'porcentaje_grasa', label: '% Grasa', type: 'number' },
      { name: 'masa_muscular', label: 'Masa Muscular', type: 'number' },
      { name: 'cintura', label: 'Cintura (cm)', type: 'number' },
      { name: 'cadera', label: 'Cadera (cm)', type: 'number' },
      { name: 'brazo', label: 'Brazo (cm)', type: 'number' },
      { name: 'muslo', label: 'Muslo (cm)', type: 'number' },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
    ],
    canDelete: function () { return true; },
    canWrite: function () { return true; }
  },
  rutinas: {
    label: 'Rutinas', endpoint: '/api/rutinas', pk: 'id',
    columns: [
      { key: 'codigo', label: 'Cliente' },
      { key: 'semana', label: 'Semana' },
      { key: 'dia', label: 'Día' },
      { key: 'grupo_muscular', label: 'Grupo Muscular' },
      { key: 'ejercicio', label: 'Ejercicio' },
      { key: 'series', label: 'Series' },
      { key: 'repeticiones', label: 'Reps' }
    ],
    fields: [
      { name: 'codigo', label: 'Cliente', type: 'clientRef', required: true, full: true },
      { name: 'semana', label: 'Semana', type: 'number' },
      { name: 'dia', label: 'Día', type: 'text' },
      { name: 'grupo_muscular', label: 'Grupo Muscular', type: 'text' },
      { name: 'ejercicio', label: 'Ejercicio', type: 'text', full: true },
      { name: 'series', label: 'Series', type: 'number' },
      { name: 'repeticiones', label: 'Repeticiones', type: 'text' },
      { name: 'peso', label: 'Peso', type: 'text' },
      { name: 'descanso', label: 'Descanso', type: 'text' },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
    ],
    canDelete: function () { return true; },
    canWrite: function () { return true; }
  },
  pagos: {
    label: 'Pagos', endpoint: '/api/pagos', pk: 'id',
    columns: [
      { key: 'codigo', label: 'Cliente' },
      { key: 'plan', label: 'Plan' },
      { key: 'valor', label: 'Valor' },
      { key: 'fecha_pago', label: 'Fecha Pago' },
      { key: 'proximo_pago', label: 'Próximo Pago' },
      { key: 'estado', label: 'Estado' }
    ],
    fields: [
      { name: 'codigo', label: 'Cliente', type: 'clientRef', required: true, full: true },
      { name: 'plan', label: 'Plan', type: 'text' },
      { name: 'valor', label: 'Valor', type: 'number' },
      { name: 'fecha_pago', label: 'Fecha Pago', type: 'date' },
      { name: 'proximo_pago', label: 'Próximo Pago', type: 'date' },
      { name: 'estado', label: 'Estado', type: 'select', options: ['Pagado', 'Pendiente', 'Vencido'] }
    ],
    canDelete: function () { return api.role() === 'admin'; },
    canWrite: function () { return api.role() === 'admin'; }
  },
  asistencia: {
    label: 'Asistencia', endpoint: '/api/asistencia', pk: 'id',
    columns: [
      { key: 'codigo', label: 'Cliente' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'hora', label: 'Hora' },
      { key: 'asistio', label: 'Asistió' }
    ],
    fields: [
      { name: 'codigo', label: 'Cliente', type: 'clientRef', required: true, full: true },
      { name: 'fecha', label: 'Fecha', type: 'date', required: true },
      { name: 'hora', label: 'Hora', type: 'time' },
      { name: 'asistio', label: 'Asistió', type: 'select', options: [{ value: 1, label: 'Sí' }, { value: 0, label: 'No' }] }
    ],
    canDelete: function () { return true; },
    canWrite: function () { return true; }
  }
};

/* ---------- Utilidades ---------- */
function clientLabel(codigo) {
  var c = clientsCache.find(function (x) { return x.codigo === codigo; });
  return c ? (codigo + ' — ' + c.nombre + ' ' + c.apellido) : codigo;
}

function fmtValue(v) {
  return v === null || v === undefined || v === '' ? '—' : v;
}

/* ---------- Sidebar / navegación ---------- */
document.getElementById('userLabel').textContent = api.username() || '-';
document.getElementById('roleBadge').textContent = api.role() === 'admin' ? 'Administrador' : 'Asistente';

document.getElementById('sideNav').addEventListener('click', function (e) {
  var btn = e.target.closest('button[data-section]');
  if (!btn) return;
  document.querySelectorAll('#sideNav button').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  currentSection = btn.getAttribute('data-section');
  renderSection(currentSection);
});

/* ---------- Render de secciones ---------- */
async function renderSection(section) {
  var main = document.getElementById('mainContent');

  if (section === 'dashboard') {
    main.innerHTML = '<h2>Resumen</h2><p class="section-sub">Vista general del negocio</p><div class="stats-grid" id="statsGrid"><p class="section-sub">Cargando…</p></div>';
    try {
      var stats = await api.get('/api/dashboard');
      document.getElementById('statsGrid').innerHTML =
        statCard(stats.totalClientes, 'Clientes totales') +
        statCard(stats.clientesActivos, 'Clientes activos') +
        statCard(stats.pagosPendientes, 'Pagos pendientes') +
        statCard(stats.proximosVencer, 'Vencen en 7 días') +
        statCard(stats.asistenciasHoy, 'Asistencias hoy');
    } catch (err) {
      document.getElementById('statsGrid').innerHTML = '<p class="error-msg">' + err.message + '</p>';
    }
    return;
  }

  var res = RESOURCES[section];
  main.innerHTML =
    '<h2>' + res.label + '</h2>' +
    '<p class="section-sub">Gestiona los registros de ' + res.label.toLowerCase() + '</p>' +
    '<div class="toolbar">' +
      '<input type="text" id="searchBox" placeholder="Buscar...">' +
      (res.canWrite() ? '<button class="btn-primary" style="width:auto;" id="newBtn">+ Nuevo registro</button>' : '') +
    '</div>' +
    '<div class="table-wrap"><table><thead><tr id="tableHead"></tr></thead><tbody id="tableBody"></tbody></table></div>';

  if (res.canWrite()) {
    document.getElementById('newBtn').addEventListener('click', function () { openModal(section, null); });
  }
  document.getElementById('searchBox').addEventListener('input', function (e) {
    renderRows(section, filterRows(currentRows, e.target.value));
  });

  var head = document.getElementById('tableHead');
  head.innerHTML = res.columns.map(function (c) { return '<th>' + c.label + '</th>'; }).join('') + '<th></th>';

  try {
    if (clientsCache.length === 0 || section === 'clientes') {
      clientsCache = await api.get('/api/clientes');
    }
    currentRows = await api.get(res.endpoint);
    renderRows(section, currentRows);
  } catch (err) {
    document.getElementById('tableBody').innerHTML = '<tr class="empty-row"><td colspan="' + (res.columns.length + 1) + '">' + err.message + '</td></tr>';
  }
}

function statCard(num, label) {
  return '<div class="stat-card"><div class="num">' + fmtValue(num) + '</div><div class="label">' + label + '</div></div>';
}

function filterRows(rows, query) {
  if (!query) return rows;
  query = query.toLowerCase();
  return rows.filter(function (row) {
    return Object.values(row).some(function (v) {
      return v !== null && String(v).toLowerCase().indexOf(query) !== -1;
    });
  });
}

function renderRows(section, rows) {
  var res = RESOURCES[section];
  var body = document.getElementById('tableBody');
  if (!rows.length) {
    body.innerHTML = '<tr class="empty-row"><td colspan="' + (res.columns.length + 1) + '">No hay registros todavía</td></tr>';
    return;
  }

  body.innerHTML = rows.map(function (row) {
    var cells = res.columns.map(function (col) {
      var val = row[col.key];
      if (col.key === 'codigo' && section !== 'clientes') val = clientLabel(val);
      if (col.key === 'asistio') val = (val === 1 || val === '1') ? '<span class="badge badge-ok">Sí</span>' : '<span class="badge badge-warn">No</span>';
      if (col.key === 'estado') {
        var ok = val === 'Activo' || val === 'Pagado';
        val = '<span class="badge ' + (ok ? 'badge-ok' : 'badge-warn') + '">' + fmtValue(val) + '</span>';
      }
      return '<td>' + fmtValue(val) + '</td>';
    }).join('');

    var pk = row[res.pk];
    var actions = '<div class="actions-cell">';
    actions += '<button class="btn-outline btn-sm" onclick="openModal(\'' + section + '\', ' + JSON.stringify(pk) + ')">Editar</button>';
    if (res.canDelete()) {
      actions += '<button class="btn-danger btn-sm" onclick="deleteRow(\'' + section + '\', ' + JSON.stringify(pk) + ')">Eliminar</button>';
    }
    actions += '</div>';

    return '<tr>' + cells + '<td>' + actions + '</td></tr>';
  }).join('');
}

/* ---------- Modal (crear / editar) ---------- */
var modalOverlay = document.getElementById('modalOverlay');
var modalForm = document.getElementById('modalForm');
var editingSection = null;
var editingPk = null;

function buildFieldHTML(field, value) {
  var id = 'f_' + field.name;
  var full = field.full ? ' full' : '';
  var label = '<label for="' + id + '">' + field.label + (field.required ? ' *' : '') + '</label>';
  var input;

  if (field.type === 'select') {
    var opts = field.options.map(function (o) {
      var v = typeof o === 'object' ? o.value : o;
      var l = typeof o === 'object' ? o.label : o;
      var selected = (value !== undefined && String(value) === String(v)) ? ' selected' : '';
      return '<option value="' + v + '"' + selected + '>' + l + '</option>';
    }).join('');
    input = '<select id="' + id + '" name="' + field.name + '"><option value="">-</option>' + opts + '</select>';
  } else if (field.type === 'clientRef') {
    var copts = clientsCache.map(function (c) {
      var selected = (value !== undefined && value === c.codigo) ? ' selected' : '';
      return '<option value="' + c.codigo + '"' + selected + '>' + c.codigo + ' — ' + c.nombre + ' ' + c.apellido + '</option>';
    }).join('');
    input = '<select id="' + id + '" name="' + field.name + '"><option value="">Selecciona un cliente</option>' + copts + '</select>';
  } else if (field.type === 'textarea') {
    input = '<textarea id="' + id + '" name="' + field.name + '" rows="3">' + (fmtValue(value) === '—' ? '' : value) + '</textarea>';
  } else {
    var val = (value === null || value === undefined) ? '' : value;
    input = '<input type="' + field.type + '" id="' + id + '" name="' + field.name + '" value="' + String(val).replace(/"/g, '&quot;') + '">';
  }

  return '<div class="' + full.trim() + '">' + label + input + '</div>';
}

async function openModal(section, pk) {
  var res = RESOURCES[section];
  editingSection = section;
  editingPk = pk;

  document.getElementById('modalTitle').textContent = (pk ? 'Editar' : 'Nuevo') + ' — ' + res.label;
  document.getElementById('modalError').textContent = '';

  var record = {};
  if (pk) {
    try {
      record = await api.get(res.endpoint + '/' + encodeURIComponent(pk));
    } catch (err) {
      document.getElementById('modalError').textContent = err.message;
    }
  }

  document.getElementById('modalFields').innerHTML = res.fields.map(function (f) {
    return buildFieldHTML(f, record[f.name]);
  }).join('');

  modalOverlay.classList.add('open');
}

document.getElementById('modalCancel').addEventListener('click', function () {
  modalOverlay.classList.remove('open');
});
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});

modalForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  var res = RESOURCES[editingSection];
  var body = {};
  res.fields.forEach(function (f) {
    var el = document.getElementById('f_' + f.name);
    var v = el.value;
    if (f.type === 'number' && v !== '') v = Number(v);
    body[f.name] = v === '' ? null : v;
  });

  var missing = res.fields.filter(function (f) { return f.required && !body[f.name]; });
  if (missing.length) {
    document.getElementById('modalError').textContent = 'Completa: ' + missing.map(function (f) { return f.label; }).join(', ');
    return;
  }

  try {
    if (editingPk) {
      await api.put(res.endpoint + '/' + encodeURIComponent(editingPk), body);
    } else {
      await api.post(res.endpoint, body);
    }
    modalOverlay.classList.remove('open');
    renderSection(currentSection);
  } catch (err) {
    document.getElementById('modalError').textContent = err.message;
  }
});

async function deleteRow(section, pk) {
  if (!confirm('¿Seguro que quieres eliminar este registro? Esta acción no se puede deshacer.')) return;
  var res = RESOURCES[section];
  try {
    await api.del(res.endpoint + '/' + encodeURIComponent(pk));
    renderSection(currentSection);
  } catch (err) {
    alert(err.message);
  }
}

/* ---------- Inicio ---------- */
renderSection('dashboard');
