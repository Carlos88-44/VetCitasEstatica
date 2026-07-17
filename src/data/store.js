// ============================================================
// "Base de datos" 100% local para la version estatica de VetCitas.
// No hay servidor, ni API, ni MySQL: todo vive en el navegador
// (localStorage), por lo que la app funciona abriendo el archivo
// generado sin necesitar conexion a internet ni backend.
// ============================================================

const CLAVE_ALMACENAMIENTO = 'vetcitas_static_db_v1';

function fechaISO(offsetDias = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDias);
  return d.toISOString().slice(0, 10);
}

function datosIniciales() {
  return {
    veterinarios: [
      { id_veterinario: 1, nombre: 'Dra. Ana Torres', especialidad: 'Medicina General', telefono: '5551234567', horario: 'Lunes a Viernes 8:00-16:00', activo: 1 },
      { id_veterinario: 2, nombre: 'Dr. Luis Ramirez', especialidad: 'Cirugia', telefono: '5557654321', horario: 'Lunes a Sabado 9:00-17:00', activo: 1 },
      { id_veterinario: 3, nombre: 'Dra. Paola Vidal', especialidad: 'Dermatologia', telefono: '5559876543', horario: 'Martes a Sabado 10:00-18:00', activo: 1 },
    ],
    clientes: [
      { id_cliente: 1, nombre: 'Maria Gomez', telefono: '5551112222', correo: 'maria.gomez@correo.com', direccion: 'Calle 10 #45-20' },
      { id_cliente: 2, nombre: 'Carlos Perez', telefono: '5553334444', correo: 'carlos.perez@correo.com', direccion: 'Av. Principal 123' },
      { id_cliente: 3, nombre: 'Lucia Fernandez', telefono: '5556667777', correo: 'lucia.fernandez@correo.com', direccion: 'Blvd. Reforma 88' },
    ],
    mascotas: [
      { id_mascota: 1, id_cliente: 1, nombre: 'Firulais', especie: 'Perro', raza: 'Labrador', edad: 3, peso: 28.5 },
      { id_mascota: 2, id_cliente: 2, nombre: 'Michi', especie: 'Gato', raza: 'Siames', edad: 2, peso: 4.2 },
      { id_mascota: 3, id_cliente: 3, nombre: 'Rocky', especie: 'Perro', raza: 'Bulldog', edad: 5, peso: 22 },
    ],
    expedientes: [
      { id_expediente: 1, id_mascota: 1, alergias: 'Ninguna conocida', vacunas: 'Rabia, Parvovirus', cirugias: '', diagnostico: 'Chequeo general sin anomalias', tratamiento: 'Ninguno', fecha: fechaISO(-30) },
    ],
    citas: [
      { id_cita: 1, id_cliente: 1, id_mascota: 1, id_veterinario: 1, fecha: fechaISO(0), hora: '09:00:00', motivo: 'Consulta de rutina', estado: 'pendiente' },
      { id_cita: 2, id_cliente: 2, id_mascota: 2, id_veterinario: 2, fecha: fechaISO(0), hora: '11:00:00', motivo: 'Vacunacion anual', estado: 'ocupado' },
      { id_cita: 3, id_cliente: 3, id_mascota: 3, id_veterinario: 1, fecha: fechaISO(1), hora: '10:00:00', motivo: 'Revision de piel', estado: 'pendiente' },
      { id_cita: 4, id_cliente: 1, id_mascota: 1, id_veterinario: 3, fecha: fechaISO(3), hora: '15:00:00', motivo: 'Seguimiento post-consulta', estado: 'ocupado' },
    ],
  };
}

let db;

function persistir(datos) {
  db = datos !== undefined ? datos : db;
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(db));
  } catch {
    // Si el navegador bloquea localStorage, la app sigue funcionando
    // en memoria durante la sesion actual.
  }
}

function cargar() {
  try {
    const crudo = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (crudo) return JSON.parse(crudo);
  } catch {
    // localStorage no disponible o datos corruptos: se reinicia
  }
  const inicial = datosIniciales();
  persistir(inicial);
  return inicial;
}

db = cargar();

function siguienteId(tabla, campo) {
  return db[tabla].length ? Math.max(...db[tabla].map((r) => r[campo])) + 1 : 1;
}

function nombreCliente(id) {
  return db.clientes.find((c) => c.id_cliente === Number(id))?.nombre || '';
}
function nombreMascota(id) {
  return db.mascotas.find((m) => m.id_mascota === Number(id))?.nombre || '';
}
function nombreVeterinario(id) {
  return db.veterinarios.find((v) => v.id_veterinario === Number(id))?.nombre || '';
}

function unirCita(c) {
  return {
    ...c,
    nombre_cliente: nombreCliente(c.id_cliente),
    nombre_mascota: nombreMascota(c.id_mascota),
    nombre_veterinario: nombreVeterinario(c.id_veterinario),
  };
}

function ordenarCitas(a, b) {
  if (a.fecha !== b.fecha) return a.fecha < b.fecha ? -1 : 1;
  return String(a.hora).localeCompare(String(b.hora));
}

export const store = {
  // ---------- Veterinarios ----------
  listarVeterinarios() {
    return [...db.veterinarios];
  },
  crearVeterinario(data) {
    const nuevo = { id_veterinario: siguienteId('veterinarios', 'id_veterinario'), activo: 1, ...data };
    db.veterinarios.push(nuevo);
    persistir();
    return nuevo;
  },
  actualizarVeterinario(id, data) {
    const idx = db.veterinarios.findIndex((v) => v.id_veterinario === Number(id));
    if (idx === -1) return null;
    db.veterinarios[idx] = { ...db.veterinarios[idx], ...data };
    persistir();
    return db.veterinarios[idx];
  },
  eliminarVeterinario(id) {
    const antes = db.veterinarios.length;
    db.veterinarios = db.veterinarios.filter((v) => v.id_veterinario !== Number(id));
    persistir();
    return db.veterinarios.length < antes;
  },

  // ---------- Clientes ----------
  listarClientes() {
    return [...db.clientes];
  },
  crearCliente(data) {
    const nuevo = { id_cliente: siguienteId('clientes', 'id_cliente'), ...data };
    db.clientes.push(nuevo);
    persistir();
    return nuevo;
  },
  actualizarCliente(id, data) {
    const idx = db.clientes.findIndex((c) => c.id_cliente === Number(id));
    if (idx === -1) return null;
    db.clientes[idx] = { ...db.clientes[idx], ...data };
    persistir();
    return db.clientes[idx];
  },
  eliminarCliente(id) {
    const idNum = Number(id);
    const idsMascotas = db.mascotas.filter((m) => m.id_cliente === idNum).map((m) => m.id_mascota);
    db.clientes = db.clientes.filter((c) => c.id_cliente !== idNum);
    db.mascotas = db.mascotas.filter((m) => m.id_cliente !== idNum);
    db.expedientes = db.expedientes.filter((e) => !idsMascotas.includes(e.id_mascota));
    db.citas = db.citas.filter((c) => c.id_cliente !== idNum);
    persistir();
    return true;
  },

  // ---------- Mascotas ----------
  listarMascotas(idCliente) {
    let items = db.mascotas;
    if (idCliente) items = items.filter((m) => m.id_cliente === Number(idCliente));
    return items.map((m) => ({ ...m, nombre_cliente: nombreCliente(m.id_cliente) }));
  },
  crearMascota(data) {
    const nuevo = {
      id_mascota: siguienteId('mascotas', 'id_mascota'),
      ...data,
      id_cliente: Number(data.id_cliente),
      edad: data.edad !== '' && data.edad != null ? Number(data.edad) : null,
      peso: data.peso !== '' && data.peso != null ? Number(data.peso) : null,
    };
    db.mascotas.push(nuevo);
    persistir();
    return nuevo;
  },
  actualizarMascota(id, data) {
    const idx = db.mascotas.findIndex((m) => m.id_mascota === Number(id));
    if (idx === -1) return null;
    const actual = db.mascotas[idx];
    db.mascotas[idx] = {
      ...actual,
      ...data,
      id_cliente: data.id_cliente !== undefined ? Number(data.id_cliente) : actual.id_cliente,
      edad: data.edad !== undefined && data.edad !== '' ? Number(data.edad) : (data.edad === '' ? null : actual.edad),
      peso: data.peso !== undefined && data.peso !== '' ? Number(data.peso) : (data.peso === '' ? null : actual.peso),
    };
    persistir();
    return db.mascotas[idx];
  },
  eliminarMascota(id) {
    const idNum = Number(id);
    db.mascotas = db.mascotas.filter((m) => m.id_mascota !== idNum);
    db.expedientes = db.expedientes.filter((e) => e.id_mascota !== idNum);
    db.citas = db.citas.filter((c) => c.id_mascota !== idNum);
    persistir();
    return true;
  },

  // ---------- Expedientes ----------
  listarExpedientes(idMascota) {
    let items = db.expedientes;
    if (idMascota) items = items.filter((e) => e.id_mascota === Number(idMascota));
    return [...items].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  },
  crearExpediente(data) {
    const nuevo = { id_expediente: siguienteId('expedientes', 'id_expediente'), ...data, id_mascota: Number(data.id_mascota) };
    db.expedientes.push(nuevo);
    persistir();
    return nuevo;
  },
  actualizarExpediente(id, data) {
    const idx = db.expedientes.findIndex((e) => e.id_expediente === Number(id));
    if (idx === -1) return null;
    db.expedientes[idx] = { ...db.expedientes[idx], ...data };
    persistir();
    return db.expedientes[idx];
  },
  eliminarExpediente(id) {
    db.expedientes = db.expedientes.filter((e) => e.id_expediente !== Number(id));
    persistir();
    return true;
  },

  // ---------- Citas ----------
  listarCitas(filtros = {}) {
    let items = db.citas;
    if (filtros.desde) items = items.filter((c) => c.fecha >= filtros.desde);
    if (filtros.hasta) items = items.filter((c) => c.fecha <= filtros.hasta);
    if (filtros.id_veterinario) items = items.filter((c) => c.id_veterinario === Number(filtros.id_veterinario));
    return items.map(unirCita).sort(ordenarCitas);
  },
  verificarDisponibilidad(idVeterinario, fecha, hora, idCitaExcluir = null) {
    return !db.citas.some(
      (c) =>
        c.id_veterinario === Number(idVeterinario) &&
        c.fecha === fecha &&
        String(c.hora).slice(0, 5) === String(hora).slice(0, 5) &&
        c.estado !== 'cancelada' &&
        (!idCitaExcluir || c.id_cita !== Number(idCitaExcluir))
    );
  },
  crearCita(data) {
    const disponible = this.verificarDisponibilidad(data.id_veterinario, data.fecha, data.hora);
    if (!disponible) {
      const err = new Error('ocupado');
      err.esConflicto = true;
      throw err;
    }
    const nuevo = {
      id_cita: siguienteId('citas', 'id_cita'),
      id_cliente: Number(data.id_cliente),
      id_mascota: Number(data.id_mascota),
      id_veterinario: Number(data.id_veterinario),
      fecha: data.fecha,
      hora: data.hora,
      motivo: data.motivo || '',
      estado: data.estado || 'pendiente',
    };
    db.citas.push(nuevo);
    persistir();
    return nuevo;
  },
  actualizarCita(id, data) {
    if (data.id_veterinario && data.fecha && data.hora) {
      const disponible = this.verificarDisponibilidad(data.id_veterinario, data.fecha, data.hora, id);
      if (!disponible) {
        const err = new Error('ocupado');
        err.esConflicto = true;
        throw err;
      }
    }
    const idx = db.citas.findIndex((c) => c.id_cita === Number(id));
    if (idx === -1) return null;
    db.citas[idx] = { ...db.citas[idx], ...data };
    persistir();
    return db.citas[idx];
  },
  eliminarCita(id) {
    db.citas = db.citas.filter((c) => c.id_cita !== Number(id));
    persistir();
    return true;
  },

  // ---------- Dashboard ----------
  resumenDashboard() {
    const hoy = fechaISO(0);
    const manana = fechaISO(1);
    const total_citas = db.citas.length;
    const veterinarios_activos = db.veterinarios.filter((v) => v.activo).length;
    const citas_hoy = db.citas.filter((c) => c.fecha === hoy && c.estado !== 'cancelada').length;
    const proximas_consultas = db.citas
      .filter((c) => c.fecha >= hoy && c.estado !== 'cancelada')
      .sort(ordenarCitas)
      .slice(0, 5)
      .map(unirCita);
    const alertas = db.citas
      .filter((c) => c.estado === 'pendiente' && c.fecha >= hoy && c.fecha <= manana)
      .map(unirCita);
    return { total_citas, veterinarios_activos, citas_hoy, proximas_consultas, alertas };
  },
};
