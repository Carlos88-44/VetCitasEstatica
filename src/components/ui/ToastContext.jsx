// Sistema de notificaciones tipo toast, accesible desde cualquier componente
import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONOS = { exito: CheckCircle2, error: XCircle, aviso: AlertTriangle, info: Info };
const ESTILOS = {
  exito: 'border-l-4 border-success',
  error: 'border-l-4 border-danger',
  aviso: 'border-l-4 border-warning',
  info: 'border-l-4 border-brand'
};
const COLOR_ICONO = { exito: 'text-success', error: 'text-danger', aviso: 'text-warning', info: 'text-brand' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const quitar = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notificar = useCallback((mensaje, tipo = 'info', duracion = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, mensaje, tipo }]);
    if (duracion) setTimeout(() => quitar(id), duracion);
  }, [quitar]);

  return (
    <ToastContext.Provider value={{ notificar }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icono = ICONOS[t.tipo] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`bg-white rounded-xl shadow-popover px-4 py-3 flex items-start gap-3 ${ESTILOS[t.tipo]}`}
              >
                <Icono size={18} className={`shrink-0 mt-0.5 ${COLOR_ICONO[t.tipo]}`} />
                <p className="text-[13px] text-ink font-medium leading-snug flex-1">{t.mensaje}</p>
                <button onClick={() => quitar(t.id)} className="text-ink-faint hover:text-ink shrink-0">
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}
