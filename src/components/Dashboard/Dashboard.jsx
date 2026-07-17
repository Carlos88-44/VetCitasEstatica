import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Stethoscope, Clock3, AlertTriangle, ArrowUpRight, Inbox } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { Card, CardHeader, Badge, EmptyState, LoadingState } from '../ui';

const STATS = [
  { key: 'total_citas', label: 'Total de citas', icon: CalendarDays, tono: 'bg-brand-50 text-brand' },
  { key: 'veterinarios_activos', label: 'Veterinarios activos', icon: Stethoscope, tono: 'bg-success-bg text-success' },
  { key: 'citas_hoy', label: 'Citas del dia', icon: Clock3, tono: 'bg-warning-bg text-warning' },
  { key: 'alertas', label: 'Alertas', icon: AlertTriangle, tono: 'bg-danger-bg text-danger', esLista: true },
];

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.resumen()
      .then((r) => setResumen(r.data))
      .catch(() => setError('No se pudo cargar el resumen del dashboard.'));
  }, []);

  if (error) return <EmptyState icon={Inbox} title="No se pudo cargar" description={error} />;
  if (!resumen) return <LoadingState label="Cargando dashboard..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink-soft text-sm mt-1">Resumen general de la actividad de tu clinica.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((stat, i) => {
          const Icono = stat.icon;
          const valor = stat.esLista ? resumen[stat.key].length : resumen[stat.key];
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <Card hover className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.tono}`}>
                  <Icono size={20} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-ink leading-tight">{valor}</div>
                  <div className="text-xs text-ink-soft truncate">{stat.label}</div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2" padded={false}>
          <div className="p-5 sm:p-6 pb-0">
            <CardHeader
              title="Proximas consultas"
              subtitle="Citas confirmadas y pendientes mas cercanas"
              action={<a href="/calendario" className="text-xs font-semibold text-brand flex items-center gap-1 hover:underline">Ver calendario <ArrowUpRight size={13} /></a>}
            />
          </div>
          {resumen.proximas_consultas.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Sin consultas proximas" description="Aun no hay citas agendadas en los proximos dias." />
          ) : (
            <div className="divide-y divide-line">
              {resumen.proximas_consultas.map((c) => (
                <div key={c.id_cita} className="flex items-center gap-4 px-5 sm:px-6 py-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0 text-ink leading-none">
                    <span className="text-[10px] font-semibold text-ink-soft uppercase">{c.fecha.slice(5,7)}/{c.fecha.slice(8,10)}</span>
                    <span className="text-xs font-bold mt-0.5">{c.hora.slice(0,5)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-ink truncate">{c.nombre_mascota} · {c.nombre_cliente}</p>
                    <p className="text-xs text-ink-soft truncate">Con {c.nombre_veterinario}</p>
                  </div>
                  <Badge tono={c.estado}>{c.estado}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padded={false}>
          <div className="p-5 sm:p-6 pb-0">
            <CardHeader title="Alertas" subtitle="Requieren confirmacion pronto" />
          </div>
          {resumen.alertas.length === 0 ? (
            <EmptyState icon={AlertTriangle} title="Sin alertas" description="No hay citas pendientes de confirmar." />
          ) : (
            <div className="divide-y divide-line">
              {resumen.alertas.map((a) => (
                <div key={a.id_cita} className="px-5 sm:px-6 py-3.5">
                  <p className="text-[13px] font-semibold text-ink">{a.nombre_cliente}</p>
                  <p className="text-xs text-ink-soft mt-0.5">Con {a.nombre_veterinario} · {a.fecha} a las {a.hora?.slice(0,5)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
