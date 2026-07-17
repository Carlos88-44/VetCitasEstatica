// Version estatica: no hay login ni backend. Se mantiene un "usuario" fijo
// en el navegador (localStorage) unicamente para poder mostrar/ocultar
// secciones segun el rol, tal como hacia la app original. El selector de
// rol en la barra superior sustituye a la pantalla de inicio de sesion.
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

const CLAVE_ROL = 'vetcitas_rol_demo';

const USUARIOS_DEMO = {
  administrador: { nombre: 'Admin Demo', rol: 'administrador' },
  recepcionista: { nombre: 'Recepcion Demo', rol: 'recepcionista' },
  veterinario: { nombre: 'Veterinario Demo', rol: 'veterinario' },
};

function rolInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_ROL);
    if (guardado && USUARIOS_DEMO[guardado]) return guardado;
  } catch {
    // sin acceso a localStorage: se usa el rol por defecto
  }
  return 'administrador';
}

export function AuthProvider({ children }) {
  const [rol, setRol] = useState(rolInicial);

  function cambiarRol(nuevoRol) {
    if (!USUARIOS_DEMO[nuevoRol]) return;
    setRol(nuevoRol);
    try {
      localStorage.setItem(CLAVE_ROL, nuevoRol);
    } catch {
      // sin acceso a localStorage: el cambio dura solo la sesion actual
    }
  }

  const usuario = USUARIOS_DEMO[rol];

  return (
    <AuthContext.Provider value={{ usuario, cargando: false, rol, cambiarRol }}>
      {children}
    </AuthContext.Provider>
  );
}
