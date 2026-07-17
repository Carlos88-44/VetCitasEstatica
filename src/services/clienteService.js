// Version estatica: usa datos locales (localStorage) en vez de una API real.
import { store } from '../data/store';
import { ok, fail } from '../data/fakeApi';

export const clienteService = {
  listar: () => ok(store.listarClientes()),
  obtener: (id) => {
    const c = store.listarClientes().find((x) => x.id_cliente === Number(id));
    return c ? ok(c) : fail('Cliente no encontrado.', 404);
  },
  crear: (data) => {
    if (!data.nombre) return fail('El nombre es obligatorio.');
    return ok(store.crearCliente(data));
  },
  actualizar: (id, data) => {
    const actualizado = store.actualizarCliente(id, data);
    return actualizado ? ok({ mensaje: 'Cliente actualizado correctamente.' }) : fail('Cliente no encontrado.', 404);
  },
  eliminar: (id) => {
    store.eliminarCliente(id);
    return ok({ mensaje: 'Cliente eliminado correctamente.' });
  }
};
