// Barra superior: busqueda global, notificaciones y perfil de usuario
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, UserCog } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';

const NOMBRES_ROL = { administrador: 'Administrador', recepcionista: 'Recepcionista', veterinario: 'Veterinario' };

export default function Topbar({ onAbrirMovil }) {
  const { usuario, rol, cambiarRol } = useAuth();
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState([]);
  const [notiAbierta, setNotiAbierta] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const notiRef = useRef(null);
  const perfilRef = useRef(null);

  useEffect(() => {
    dashboardService.resumen().then((r) => setAlertas(r.data.alertas || [])).catch(() => {});
  }, []);

  useEffect(() => {
    function alClickFuera(e) {
      if (notiRef.current && !notiRef.current.contains(e.target)) setNotiAbierta(false);
      if (perfilRef.current && !perfilRef.current.contains(e.target)) setPerfilAbierto(false);
    }
    document.addEventListener('mousedown', alClickFuera);
    return () => document.removeEventListener('mousedown', alClickFuera);
  }, []);

  function alBuscar(e) {
    e.preventDefault();
    if (busqueda.trim()) navigate(`/clientes?buscar=${encodeURIComponent(busqueda.trim())}`);
  }

  return (
    <header className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-line flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-30">
      <button onClick={onAbrirMovil} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-slate-100">
        <Menu size={19} />
      </button>

      <form onSubmit={alBuscar} className="relative flex-1 max-w-md hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar clientes, mascotas..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-100 text-sm outline-none border border-transparent focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-colors"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="relative" ref={notiRef}>
          <button
            onClick={() => setNotiAbierta((v) => !v)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-slate-100"
          >
            <Bell size={18} />
            {alertas.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-white" />
            )}
          </button>
          <AnimatePresence>
            {notiAbierta && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-popover border border-line overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-line font-semibold text-sm text-ink">Notificaciones</div>
                <div className="max-h-72 overflow-y-auto">
                  {alertas.length === 0 ? (
                    <p className="text-sm text-ink-soft px-4 py-6 text-center">No hay alertas pendientes.</p>
                  ) : (
                    alertas.map((a) => (
                      <div key={a.id_cita} className="px-4 py-3 border-b border-line last:border-0 hover:bg-slate-50">
                        <p className="text-[13px] text-ink font-medium">Cita pendiente de confirmar</p>
                        <p className="text-xs text-ink-soft mt-0.5">{a.nombre_cliente} con {a.nombre_veterinario} · {a.fecha} {a.hora?.slice(0,5)}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={perfilRef}>
          <button
            onClick={() => setPerfilAbierto((v) => !v)}
            className="flex items-center gap-2 pl-1.5 pr-2 h-9 rounded-lg hover:bg-slate-100"
          >
            <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
              {usuario?.nombre?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-[13px] font-medium text-ink hidden md:block">{usuario?.nombre}</span>
            <ChevronDown size={14} className="text-ink-faint hidden md:block" />
          </button>
          <AnimatePresence>
            {perfilAbierto && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-popover border border-line overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-line">
                  <p className="text-sm font-semibold text-ink truncate">{usuario?.nombre}</p>
                  <p className="text-xs text-ink-soft">{NOMBRES_ROL[usuario?.rol] || usuario?.rol}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft uppercase tracking-wide mb-2">
                    <UserCog size={13} /> Ver como (demo)
                  </p>
                  <div className="space-y-1">
                    {Object.entries(NOMBRES_ROL).map(([clave, etiqueta]) => (
                      <button
                        key={clave}
                        onClick={() => cambiarRol(clave)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                          rol === clave ? 'bg-brand-50 text-brand' : 'text-ink-soft hover:bg-slate-100'
                        }`}
                      >
                        {etiqueta}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
