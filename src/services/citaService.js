// Version estatica: usa datos locales (localStorage) en vez de una API real.
// Conserva la regla de negocio original: un veterinario no puede tener dos
// citas a la misma fecha y hora (no se permiten empalmes de horario).
import { store } from '../data/store';
import { ok, fail } from '../data/fakeApi';

export const citaService = {
  listar: (filtros = {}) => ok(store.listarCitas(filtros)),
  obtener: (id) => {
    const c = store.listarCitas().find((x) => x.id_cita === Number(id));
    return c ? ok(c) : fail('Cita no encontrada.', 404);
  },
  crear: (data) => {
    if (!data.id_cliente || !data.id_mascota || !data.id_veterinario || !data.fecha || !data.hora) {
      return fail('Cliente, mascota, veterinario, fecha y hora son obligatorios.');
    }
    try {
      return ok(store.crearCita(data));
    } catch (err) {
      if (err.esConflicto) return fail('Este horario ya esta ocupado.', 409);
      return fail('No se pudo registrar la cita.');
    }
  },
  actualizar: (id, data) => {
    try {
      const actualizado = store.actualizarCita(id, data);
      return actualizado ? ok({ mensaje: 'Cita actualizada correctamente.' }) : fail('Cita no encontrada.', 404);
    } catch (err) {
      if (err.esConflicto) return fail('Este horario ya esta ocupado.', 409);
      return fail('No se pudo actualizar la cita.');
    }
  },
  eliminar: (id) => {
    store.eliminarCita(id);
    return ok({ mensaje: 'Cita eliminada correctamente.' });
  }
};
