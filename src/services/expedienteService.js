// Version estatica: usa datos locales (localStorage) en vez de una API real.
import { store } from '../data/store';
import { ok, fail } from '../data/fakeApi';

export const expedienteService = {
  listar: (idMascota) => ok(store.listarExpedientes(idMascota)),
  obtener: (id) => {
    const e = store.listarExpedientes().find((x) => x.id_expediente === Number(id));
    return e ? ok(e) : fail('Expediente no encontrado.', 404);
  },
  crear: (data) => {
    if (!data.id_mascota || !data.fecha) return fail('La mascota y la fecha son obligatorias.');
    return ok(store.crearExpediente(data));
  },
  actualizar: (id, data) => {
    const actualizado = store.actualizarExpediente(id, data);
    return actualizado ? ok({ mensaje: 'Expediente actualizado correctamente.' }) : fail('Expediente no encontrado.', 404);
  },
  eliminar: (id) => {
    store.eliminarExpediente(id);
    return ok({ mensaje: 'Expediente eliminado correctamente.' });
  }
};
