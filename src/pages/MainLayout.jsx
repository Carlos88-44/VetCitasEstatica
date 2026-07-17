// Estructura principal de la app: Sidebar + Topbar + contenido
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';

export default function MainLayout() {
  const [colapsado, setColapsado] = useState(false);
  const [movilAbierto, setMovilAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar
        colapsado={colapsado}
        onToggleColapsar={() => setColapsado((v) => !v)}
        movilAbierto={movilAbierto}
        onCerrarMovil={() => setMovilAbierto(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onAbrirMovil={() => setMovilAbierto(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
