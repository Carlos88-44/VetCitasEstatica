# VetCitas — Version estatica

Esta es una version 100% **frontend** de VetCitas: no hay backend, no hay
base de datos (MySQL) ni servidor Node.js, y no existe pantalla de login.
Todo lo que antes viajaba por la API ahora vive directamente en el
navegador (localStorage), asi que la app funciona sola, sin ninguna
conexion externa.

## Que cambio respecto a la version original

- **Sin login**: se elimino la pantalla y las rutas protegidas por sesion.
  En la barra superior, dentro del menu de perfil, hay un selector
  **"Ver como (demo)"** para alternar entre Administrador, Recepcionista y
  Veterinario y ver como cambian los permisos por rol.
- **Sin base de datos ni API**: los archivos en `src/services/` ya no usan
  `axios` para hablar con un backend; ahora leen y escriben en
  `src/data/store.js`, que guarda todo en `localStorage`. Los datos de
  ejemplo (clientes, mascotas, veterinarios, citas, expedientes) se cargan
  la primera vez que se abre la app.
- **Persistencia local**: como se usa `localStorage`, los cambios que hagas
  (crear una cita, un cliente, etc.) se conservan al recargar la pagina en
  el mismo navegador. Si quieres reiniciar los datos de ejemplo, borra la
  clave `vetcitas_static_db_v1` del localStorage del navegador (o abre la
  app en una ventana de incognito).
- Se conservo la regla de negocio original de citas: **un mismo
  veterinario no puede tener dos citas en la misma fecha y hora**.
- Se elimino la carpeta `backend/` por completo; ya no es necesaria.

## Como usarla

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

## Como generar el sitio estatico final

```bash
npm run build
```

Esto genera la carpeta `dist/` con HTML, CSS y JS puros: puedes subir esa
carpeta tal cual a cualquier hosting estatico (Netlify, Vercel, GitHub
Pages, cPanel, un bucket S3, etc.). No necesita Node.js ni ninguna base de
datos en el servidor.

> Nota: la app usa rutas del lado del cliente (React Router). Si la
> despliegas en un hosting estatico, configura una regla de "SPA fallback"
> (redirigir cualquier ruta desconocida a `index.html`) para que al
> recargar la pagina en, por ejemplo, `/calendario`, no de error 404.
