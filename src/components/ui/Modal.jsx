// Modal premium con fondo desenfocado (backdrop blur) y animacion de entrada
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ abierto, onClose, title, subtitle, children, footer, size = 'md' }) {
  useEffect(() => {
    function alEscape(e) { if (e.key === 'Escape') onClose?.(); }
    if (abierto) document.addEventListener('keydown', alEscape);
    return () => document.removeEventListener('keydown', alEscape);
  }, [abierto, onClose]);

  const anchos = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            className={`w-full ${anchos[size]} bg-white rounded-t-2xl sm:rounded-2xl shadow-popover max-h-[90vh] flex flex-col`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-line shrink-0">
              <div>
                <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
                {subtitle && <p className="text-[13px] text-ink-soft mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-ink-faint hover:bg-slate-100 hover:text-ink transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            <div className="px-5 sm:px-6 py-5 overflow-y-auto">{children}</div>

            {footer && (
              <div className="px-5 sm:px-6 py-4 border-t border-line flex items-center justify-end gap-2 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
