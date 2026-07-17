// Simula respuestas de una API real (con pequena demora) usando datos locales.
// Permite que los componentes existentes (que esperan promesas con { data }
// y errores con err.response.data.mensaje) sigan funcionando sin cambios.

export function ok(data, ms = 200) {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), ms));
}

export function fail(mensaje, status = 400, ms = 200) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      const err = new Error(mensaje);
      err.response = { status, data: { mensaje } };
      reject(err);
    }, ms)
  );
}
