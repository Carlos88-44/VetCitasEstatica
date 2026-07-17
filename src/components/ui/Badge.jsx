// Etiqueta de estado reutilizable (citas, roles, etc.)
const ESTILOS = {
  disponible: 'bg-success-bg text-success-text',
  ocupado: 'bg-danger-bg text-danger-text',
  pendiente: 'bg-warning-bg text-warning-text',
  cancelada: 'bg-slate-100 text-slate-500',
  completada: 'bg-brand-50 text-brand-dark',
  neutro: 'bg-slate-100 text-ink-soft'
};

export default function Badge({ tono = 'neutro', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ESTILOS[tono] || ESTILOS.neutro} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}
