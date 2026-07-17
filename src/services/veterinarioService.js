// Version estatica: usa datos locales (localStorage) en vez de una API real.
import { store } from '../data/store';
import { ok, fail } from '../data/fakeApi';

export const veterinarioService = {
  listar: () => ok(store.listarVeterinarios()),
  obtener: (id) => {
    const v = store.listarVeterinarios().find((x) => x.id_veterinario === Number(id));
    return v ? ok(v) : fail('Veterinario no encontrado.', 404);
  },
  crear: (data) => {
    if (!data.nombre) return fail('El nombre es obligatorio.');
    return ok(store.crearVeterinario(data));
  },
  actualizar: (id, data) => {
    const actualizado = store.actualizarVeterinario(id, data);
    return actualizado ? ok({ mensaje: 'Veterinario actualizado correctamente.' }) : fail('Veterinario no encontrado.', 404);
  },
  eliminar: (id) => {
    store.eliminarVeterinario(id);
    return ok({ mensaje: 'Veterinario eliminado correctamente.' });
  }
};
