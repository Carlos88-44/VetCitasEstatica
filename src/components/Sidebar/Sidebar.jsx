// Sidebar fija con iconos, colapsable en escritorio y tipo drawer en movil
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CalendarDays, Users, PawPrint, Stethoscope, FileText, PanelLeftClose, PanelLeftOpen, X, PlusCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ITEMS = [
  { ruta: '/dashboard', etiqueta: 'Dashboard', icono: LayoutDashboard, roles: null },
  { ruta: '/calendario', etiqueta: 'Calendario', icono: CalendarDays, roles: null },
  { ruta: '/clientes', etiqueta: 'Clientes', icono: Users, roles: ['administrador', 'recepcionista'] },
  { ruta: '/mascotas', etiqueta: 'Mascotas', icono: PawPrint, roles: null },
  { ruta: '/veterinarios', etiqueta: 'Veterinarios', icono: Stethoscope, roles: ['administrador'] },
  { ruta: '/expedientes', etiqueta: 'Expedientes', icono: FileText, roles: null },
];

export default function Sidebar({ colapsado, onToggleColapsar, movilAbierto, onCerrarMovil }) {
  const { usuario } = useAuth();
  const itemsVisibles = ITEMS.filter((item) => !item.roles || item.roles.includes(usuario?.rol));

  const contenido = (
    <>
      <div className={`flex items-center gap-2.5 h-16 shrink-0 ${colapsado ? 'justify-center px-2' : 'px-5'}`}>
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white text-base shrink-0">🐾</div>
        {!colapsado && <span className="font-bold text-[15px] tracking-tight text-white">VetCitas</span>}
        <button onClick={onCerrarMovil} className="ml-auto lg:hidden text-white/70 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-2.5 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">
        {itemsVisibles.map((item) => {
          const Icono = item.icono;
          return (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              onClick={onCerrarMovil}
              title={colapsado ? item.etiqueta : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-150
                 ${colapsado ? 'justify-center' : ''}
                 ${isActive ? 'bg-white/10 text-white' : 'text-indigo-100/70 hover:bg-white/5 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="sidebar-activo" className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-white" />}
                  <Icono size={18} strokeWidth={1.9} className="shrink-0" />
                  {!colapsado && <span>{item.etiqueta}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {!colapsado && (
        <div className="mx-2.5 mb-3 rounded-xl bg-white/5 p-3.5">
          <div className="flex items-center gap-2 text-white text-[13px] font-semibold mb-1">
            <PlusCircle size={15} /> Nueva cita
          </div>
          <p className="text-[12px] text-indigo-100/60 leading-snug">Agenda desde el calendario en segundos.</p>
        </div>
      )}

      <button
        onClick={onToggleColapsar}
        className="hidden lg:flex items-center gap-2 mx-2.5 mb-3 rounded-lg px-3 py-2 text-indigo-100/60 hover:text-white hover:bg-white/5 text-[13px] font-medium"
      >
        {colapsado ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        {!colapsado && <span>Colapsar</span>}
      </button>
    </>
  );

  return (
    <>
      {/* Escritorio */}
      <aside className={`hidden lg:flex flex-col shrink-0 bg-brand-dark h-screen sticky top-0 transition-all duration-200 ${colapsado ? 'w-[76px]' : 'w-64'}`}>
        {contenido}
      </aside>

      {/* Movil: drawer */}
      <AnimatePresence>
        {movilAbierto && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onCerrarMovil}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 w-72 bg-brand-dark z-50 flex flex-col lg:hidden"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {contenido}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
