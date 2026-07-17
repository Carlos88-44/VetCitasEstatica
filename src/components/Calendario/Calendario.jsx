// Calendario de citas — vista tipo Google Calendar con dia/semana/mes/lista,
// que se adapta automaticamente al tamano de pantalla.
import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PawPrint, Plus, CalendarX2 } from 'lucide-react';
import { citaService } from '../../services/citaService';
import { veterinarioService } from '../../services/veterinarioService';
import { clienteService } from '../../services/clienteService';
import { mascotaService } from '../../services/mascotaService';
import { useToast } from '../ui';
import { Modal, Select, Textarea, Button, Badge, EmptyState } from '../ui';

const HORAS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8:00 a 18:00
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const COLOR_ESTADO = {
  disponible: { punto: 'bg-success', bloque: 'bg-success-bg border-success/30 text-success-text hover:bg-emerald-100' },
  pendiente:  { punto: 'bg-warning', bloque: 'bg-warning-bg border-warning/30 text-warning-text' },
  ocupado:    { punto: 'bg-danger',  bloque: 'bg-danger-bg border-danger/30 text-danger-text' },
};

function formatearFecha(fecha) { return fecha.toISOString().slice(0, 10); }
function inicioSemana(fecha) { const d = new Date(fecha); d.setDate(d.getDate() - d.getDay()); return d; }

function vistaSegunAncho(ancho) {
  if (ancho < 640) return 'lista';
  if (ancho < 1024) return 'semana';
  return 'semana';
}

export default function Calendario() {
  const { notificar } = useToast();
  const [vista, setVista] = useState(() => vistaSegunAncho(window.innerWidth));
  const [vistaManual, setVistaManual] = useState(false);
  const [fechaBase, setFechaBase] = useState(new Date());
  const [citas, setCitas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [filtroVeterinario, setFiltroVeterinario] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ id_cliente: '', id_mascota: '', motivo: '' });
  const [errorModal, setErrorModal] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    function alRedimensionar() {
      if (!vistaManual) setVista(vistaSegunAncho(window.innerWidth));
    }
    window.addEventListener('resize', alRedimensionar);
    return () => window.removeEventListener('resize', alRedimensionar);
  }, [vistaManual]);

  const { desde, hasta } = useMemo(() => calcularRango(vista, fechaBase), [vista, fechaBase]);

  useEffect(() => {
    veterinarioService.listar().then((r) => setVeterinarios(r.data)).catch(() => {});
    clienteService.listar().then((r) => setClientes(r.data)).catch(() => {});
  }, []);

  const cargarCitas = useCallback(() => {
    const filtros = { desde, hasta };
    if (filtroVeterinario) filtros.id_veterinario = filtroVeterinario;
    citaService.listar(filtros).then((r) => setCitas(r.data)).catch(() => {});
  }, [desde, hasta, filtroVeterinario]);

  useEffect(() => { cargarCitas(); }, [cargarCitas]);

  function calcularRango(vista, fechaBase) {
    if (vista === 'dia') { const f = formatearFecha(fechaBase); return { desde: f, hasta: f }; }
    if (vista === 'lista') { const f = formatearFecha(fechaBase); const fin = new Date(fechaBase); fin.setDate(fin.getDate() + 14); return { desde: f, hasta: formatearFecha(fin) }; }
    if (vista === 'semana') {
      const inicio = inicioSemana(fechaBase);
      const fin = new Date(inicio); fin.setDate(fin.getDate() + 6);
      return { desde: formatearFecha(inicio), hasta: formatearFecha(fin) };
    }
    const inicio = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), 1);
    const fin = new Date(fechaBase.getFullYear(), fechaBase.getMonth() + 1, 0);
    return { desde: formatearFecha(inicio), hasta: formatearFecha(fin) };
  }

  function diasDeVista() {
    if (vista === 'dia') return [new Date(fechaBase)];
    if (vista === 'semana') {
      const inicio = inicioSemana(fechaBase);
      return Array.from({ length: 7 }, (_, i) => { const d = new Date(inicio); d.setDate(d.getDate() + i); return d; });
    }
    if (vista === 'mes') {
      const inicio = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), 1);
      const fin = new Date(fechaBase.getFullYear(), fechaBase.getMonth() + 1, 0);
      return Array.from({ length: fin.getDate() }, (_, i) => new Date(inicio.getFullYear(), inicio.getMonth(), i + 1));
    }
    return [];
  }

  function citaEnSlot(fechaStr, hora) {
    const horaStr = `${String(hora).padStart(2, '0')}:00`;
    return citas.find((c) => c.fecha.slice(0, 10) === fechaStr && c.hora.slice(0, 5) === horaStr);
  }

  function estadoDeSlot(cita) {
    if (!cita) return 'disponible';
    if (cita.estado === 'cancelada') return 'disponible';
    if (cita.estado === 'pendiente') return 'pendiente';
    return 'ocupado';
  }

  function abrirModal(fechaStr, hora, idVeterinario) {
    const cita = citaEnSlot(fechaStr, hora);
    if (cita) return;
    setSlot({ fecha: fechaStr, hora: `${String(hora).padStart(2, '0')}:00`, id_veterinario: idVeterinario || filtroVeterinario || veterinarios[0]?.id_veterinario });
    setForm({ id_cliente: '', id_mascota: '', motivo: '' });
    setErrorModal('');
    setModalAbierto(true);
  }

  function alCambiarCliente(idCliente) {
    setForm((f) => ({ ...f, id_cliente: idCliente, id_mascota: '' }));
    if (idCliente) mascotaService.listar(idCliente).then((r) => setMascotas(r.data)).catch(() => {});
    else setMascotas([]);
  }

  async function guardarCita(e) {
    e.preventDefault();
    setErrorModal('');
    if (!form.id_cliente || !form.id_mascota) { setErrorModal('Selecciona un cliente y una mascota.'); return; }
    setGuardando(true);
    try {
      await citaService.crear({
        id_cliente: form.id_cliente,
        id_mascota: form.id_mascota,
        id_veterinario: slot.id_veterinario,
        fecha: slot.fecha,
        hora: slot.hora,
        motivo: form.motivo,
        estado: 'pendiente'
      });
      setModalAbierto(false);
      cargarCitas();
      notificar('Cita registrada correctamente.', 'exito');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Este horario ya esta ocupado.';
      setErrorModal(msg);
      notificar(msg, 'error');
    } finally {
      setGuardando(false);
    }
  }

  function moverFecha(delta) {
    const nueva = new Date(fechaBase);
    if (vista === 'dia') nueva.setDate(nueva.getDate() + delta);
    else if (vista === 'semana' || vista === 'lista') nueva.setDate(nueva.getDate() + delta * 7);
    else nueva.setMonth(nueva.getMonth() + delta);
    setFechaBase(nueva);
  }

  function cambiarVista(v) { setVista(v); setVistaManual(true); }

  const dias = diasDeVista();
  const tituloRango = vista === 'mes'
    ? `${MESES[fechaBase.getMonth()]} ${fechaBase.getFullYear()}`
    : vista === 'lista'
      ? 'Proximas citas'
      : fechaBase.toLocaleDateString('es-MX', { day: vista === 'dia' ? 'numeric' : undefined, month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-ink">Calendario</h1>
          <p className="text-ink-soft text-sm mt-1">Gestiona las citas de tu clinica en tiempo real.</p>
        </div>
        <Button icon={Plus} className="sm:ml-auto" onClick={() => abrirModal(formatearFecha(new Date()), new Date().getHours() < 18 ? Math.max(8, new Date().getHours()+1) : 8, filtroVeterinario)}>
          Nueva cita
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex bg-slate-100 rounded-lg p-1 gap-0.5">
          {['lista', 'dia', 'semana', 'mes'].map((v) => (
            <button
              key={v}
              onClick={() => cambiarVista(v)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold capitalize transition-colors ${vista === v ? 'bg-white text-brand shadow-sm' : 'text-ink-soft hover:text-ink'}`}
            >
              {v}
            </button>
          ))}
        </div>

        {vista !== 'lista' && (
          <div className="flex items-center gap-1">
            <button onClick={() => moverFecha(-1)} className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-soft hover:bg-slate-50"><ChevronLeft size={15} /></button>
            <span className="text-sm font-semibold text-ink capitalize min-w-[140px] text-center">{tituloRango}</span>
            <button onClick={() => moverFecha(1)} className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-soft hover:bg-slate-50"><ChevronRight size={15} /></button>
          </div>
        )}

        <Select value={filtroVeterinario} onChange={(e) => setFiltroVeterinario(e.target.value)} className="!h-9 ml-auto max-w-[220px]">
          <option value="">Todos los veterinarios</option>
          {veterinarios.map((v) => <option key={v.id_veterinario} value={v.id_veterinario}>{v.nombre}</option>)}
        </Select>
      </div>

      <div className="flex items-center gap-4 text-xs text-ink-soft mb-4">
        {Object.entries({ disponible: 'Disponible', pendiente: 'Pendiente', ocupado: 'Ocupado' }).map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${COLOR_ESTADO[k].punto}`} /> {label}</span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {vista === 'lista' ? (
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-surface border border-line rounded-2xl shadow-card overflow-hidden">
            {citas.length === 0 ? (
              <EmptyState icon={CalendarX2} title="Sin citas proximas" description="No hay citas registradas en los proximos 14 dias." />
            ) : (
              <div className="divide-y divide-line">
                {citas.map((c) => (
                  <div key={c.id_cita} className="flex items-center gap-4 px-4 sm:px-6 py-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-semibold text-ink-soft uppercase">{c.fecha.slice(5,7)}/{c.fecha.slice(8,10)}</span>
                      <span className="text-xs font-bold text-ink">{c.hora.slice(0,5)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold text-ink flex items-center gap-1.5"><PawPrint size={13} className="text-ink-faint" /> {c.nombre_mascota} · {c.nombre_cliente}</p>
                      <p className="text-xs text-ink-soft mt-0.5">Con {c.nombre_veterinario}{c.motivo ? ` — ${c.motivo}` : ''}</p>
                    </div>
                    <Badge tono={estadoDeSlot(c)}>{c.estado}</Badge>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : vista === 'mes' ? (
          <motion.div key="mes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-surface border border-line rounded-2xl shadow-card p-4">
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {DIAS_SEMANA.map((d) => <div key={d} className="text-center text-xs font-semibold text-ink-soft py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: dias[0].getDay() }).map((_, i) => <div key={'v' + i} />)}
              {dias.map((d) => {
                const fechaStr = formatearFecha(d);
                const citasDia = citas.filter((c) => c.fecha.slice(0, 10) === fechaStr);
                const esHoy = fechaStr === formatearFecha(new Date());
                return (
                  <button
                    key={fechaStr}
                    onClick={() => { setFechaBase(d); cambiarVista('dia'); }}
                    className={`min-h-[76px] rounded-xl border p-2 text-left hover:border-brand/40 hover:bg-brand-50/40 transition-colors ${esHoy ? 'border-brand bg-brand-50/60' : 'border-line'}`}
                  >
                    <span className={`text-xs font-semibold ${esHoy ? 'text-brand' : 'text-ink'}`}>{d.getDate()}</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {citasDia.slice(0, 3).map((c) => (
                        <span key={c.id_cita} className={`w-1.5 h-1.5 rounded-full ${COLOR_ESTADO[estadoDeSlot(c)].punto}`} />
                      ))}
                      {citasDia.length > 3 && <span className="text-[10px] text-ink-faint">+{citasDia.length - 3}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-surface border border-line rounded-2xl shadow-card overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr>
                  <th className="w-16 sticky left-0 bg-surface z-10" />
                  {dias.map((d) => {
                    const esHoy = formatearFecha(d) === formatearFecha(new Date());
                    return (
                      <th key={formatearFecha(d)} className="py-3 px-2 text-center border-b border-line">
                        <div className="text-[11px] text-ink-soft font-semibold uppercase">{DIAS_SEMANA[d.getDay()]}</div>
                        <div className={`text-sm font-bold mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full ${esHoy ? 'bg-brand text-white' : 'text-ink'}`}>{d.getDate()}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {HORAS.map((hora) => (
                  <tr key={hora}>
                    <td className="w-16 text-xs text-ink-faint text-right pr-2 align-top pt-2 border-r border-line sticky left-0 bg-surface">
                      {String(hora).padStart(2, '0')}:00
                    </td>
                    {dias.map((d) => {
                      const fechaStr = formatearFecha(d);
                      const cita = citaEnSlot(fechaStr, hora);
                      const estado = estadoDeSlot(cita);
                      const estilos = COLOR_ESTADO[estado];
                      return (
                        <td key={fechaStr + hora} className="p-1 border-t border-line align-top">
                          <button
                            onClick={() => abrirModal(fechaStr, hora, cita?.id_veterinario)}
                            disabled={!!cita}
                            className={`w-full min-h-[46px] rounded-lg border text-left px-2 py-1.5 text-[11.5px] font-medium transition-colors
                              ${estilos.bloque} ${!cita ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            {cita ? (
                              <>
                                <div className="font-semibold truncate">{cita.nombre_mascota}</div>
                                <div className="truncate opacity-80">{cita.nombre_veterinario}</div>
                              </>
                            ) : null}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Registrar cita"
        subtitle={slot ? `${slot.fecha} · ${slot.hora}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button form="form-cita" type="submit" loading={guardando}>Registrar cita</Button>
          </>
        }
      >
        {errorModal && <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg text-danger-text text-[13px] font-medium">{errorModal}</div>}
        <form id="form-cita" onSubmit={guardarCita} className="space-y-4">
          <Select label="Cliente" value={form.id_cliente} onChange={(e) => alCambiarCliente(e.target.value)} required>
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
          </Select>
          <Select label="Mascota" value={form.id_mascota} onChange={(e) => setForm({ ...form, id_mascota: e.target.value })} required disabled={!form.id_cliente}>
            <option value="">Selecciona una mascota</option>
            {mascotas.map((m) => <option key={m.id_mascota} value={m.id_mascota}>{m.nombre}</option>)}
          </Select>
          <Select label="Veterinario" value={slot?.id_veterinario || ''} onChange={(e) => setSlot({ ...slot, id_veterinario: e.target.value })} required>
            {veterinarios.map((v) => <option key={v.id_veterinario} value={v.id_veterinario}>{v.nombre}</option>)}
          </Select>
          <Textarea label="Motivo" rows="2" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
