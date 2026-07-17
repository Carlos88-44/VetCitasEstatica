// Estado de carga reutilizable (spinner + esqueleto simple)
import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Cargando...', filas }) {
  if (filas) {
    return (
      <div className="animate-pulse divide-y divide-line">
        {Array.from({ length: filas }).map((_, i) => (
          <div key={i} className="h-12 flex items-center gap-4 px-4">
            <div className="h-3 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-200 rounded w-1/5" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-14 text-ink-soft gap-3">
      <Loader2 size={22} className="animate-spin text-brand" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
