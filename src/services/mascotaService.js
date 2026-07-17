// Version estatica: usa datos locales (localStorage) en vez de una API real.
import { store } from '../data/store';
import { ok, fail } from '../data/fakeApi';

export const mascotaService = {
  listar: (idCliente) => ok(store.listarMascotas(idCliente)),
  obtener: (id) => {
    const m = store.listarMascotas().find((x) => x.id_mascota === Number(id));
    return m ? ok(m) : fail('Mascota no encontrada.', 404);
  },
  crear: (data) => {
    if (!data.id_cliente || !data.nombre || !data.especie) {
      return fail('Cliente, nombre y especie son obligatorios.');
    }
    return ok(store.crearMascota(data));
  },
  actualizar: (id, data) => {
    const actualizado = store.actualizarMascota(id, data);
    return actualizado ? ok({ mensaje: 'Mascota actualizada correctamente.' }) : fail('Mascota no encontrada.', 404);
  },
  eliminar: (id) => {
    store.eliminarMascota(id);
    return ok({ mensaje: 'Mascota eliminada correctamente.' });
  }
};
