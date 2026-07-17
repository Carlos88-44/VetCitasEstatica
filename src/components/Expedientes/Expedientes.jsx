import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { expedienteService } from '../../services/expedienteService';
import { mascotaService } from '../../services/mascotaService';
import { Button, Input, Select, Textarea, Modal, DataTable, useToast } from '../ui';

const VACIO = { id_mascota: '', alergias: '', vacunas: '', cirugias: '', diagnostico: '', tratamiento: '', fecha: '' };

export default function Expedientes() {
  const { notificar } = useToast();
  const [expedientes, setExpedientes] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [mascotaFiltro, setMascotaFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    mascotaService.listar().then((r) => setMascotas(r.data)).catch(() => {});
  }, []);

  useEffect(() => { cargar(); }, [mascotaFiltro]);

  function cargar() {
    setCargando(true);
    expedienteService.listar(mascotaFiltro || undefined)
      .then((r) => setExpedientes(r.data))
      .catch(() => notificar('No se pudieron cargar los expedientes.', 'error'))
      .finally(() => setCargando(false));
  }

  function nombreMascota(id) {
    return mascotas.find((m) => m.id_mascota === id || m.id_mascota === Number(id))?.nombre || '—';
  }

  function abrirNuevo() { setEditando(null); setForm({ ...VACIO, id_mascota: mascotaFiltro || '' }); setError(''); setModalAbierto(true); }
  function abrirEditar(exp) {
    setEditando(exp.id_expediente);
    setForm({
      id_mascota: exp.id_mascota,
      alergias: exp.alergias || '', vacunas: exp.vacunas || '', cirugias: exp.cirugias || '',
      diagnostico: exp.diagnostico || '', tratamiento: exp.tratamiento || '',
      fecha: exp.fecha ? exp.fecha.slice(0, 10) : ''
    });
    setError('');
    setModalAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      if (editando) await expedienteService.actualizar(editando, form);
      else await expedienteService.crear(form);
      setModalAbierto(false);
      cargar();
      notificar(editando ? 'Expediente actualizado.' : 'Expediente registrado.', 'exito');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo guardar el expediente.';
      setError(msg);
      notificar(msg, 'error');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(exp) {
    if (!window.confirm('¿Eliminar este expediente?')) return;
    try {
      await expedienteService.eliminar(exp.id_expediente);
      cargar();
      notificar('Expediente eliminado.', 'exito');
    } catch (err) {
      notificar(err.response?.data?.mensaje || 'No se pudo eliminar el expediente.', 'error');
    }
  }

  const columnas = [
    { key: 'fecha', header: 'Fecha', render: (e) => e.fecha?.slice(0, 10) },
    { key: 'id_mascota', header: 'Mascota', render: (e) => nombreMascota(e.id_mascota) },
    { key: 'diagnostico', header: 'Diagnostico' },
    { key: 'tratamiento', header: 'Tratamiento' },
  ];

  const acciones = (exp) => (
    <div className="flex justify-end gap-1.5">
      <Button size="sm" variant="secondary" icon={Pencil} onClick={() => abrirEditar(exp)}>Editar</Button>
      <Button size="sm" variant="danger" icon={Trash2} onClick={() => eliminar(exp)}>Eliminar</Button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Expedientes medicos</h1>
          <p className="text-ink-soft text-sm mt-1">Historial clinico por mascota: alergias, vacunas, cirugias y tratamientos.</p>
        </div>
        <Button icon={Plus} onClick={abrirNuevo}>Nuevo registro</Button>
      </div>

      <div className="mb-4 max-w-xs">
        <Select value={mascotaFiltro} onChange={(e) => setMascotaFiltro(e.target.value)}>
          <option value="">Todas las mascotas</option>
          {mascotas.map((m) => <option key={m.id_mascota} value={m.id_mascota}>{m.nombre}</option>)}
        </Select>
      </div>

      <DataTable
        columns={columnas}
        data={expedientes}
        cargando={cargando}
        vacioTitulo="Sin expedientes"
        vacioDescripcion="Aun no hay registros medicos para mostrar."
        acciones={acciones}
        renderTarjetaMovil={(exp, acciones) => (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0"><FileText size={16} /></div>
              <div>
                <span className="font-semibold text-ink text-sm block">{nombreMascota(exp.id_mascota)}</span>
                <span className="text-xs text-ink-soft">{exp.fecha?.slice(0, 10)}</span>
              </div>
            </div>
            <div className="ml-11 text-xs text-ink-soft space-y-0.5">
              {exp.diagnostico && <div>Dx: {exp.diagnostico}</div>}
              {exp.tratamiento && <div>Tto: {exp.tratamiento}</div>}
            </div>
            <div className="flex justify-end gap-2 mt-3">{acciones(exp)}</div>
          </div>
        )}
      />

      <Modal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={editando ? 'Editar expediente' : 'Nuevo expediente'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button form="form-expediente" type="submit" loading={guardando}>Guardar</Button>
          </>
        }
      >
        {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg text-danger-text text-[13px] font-medium">{error}</div>}
        <form id="form-expediente" onSubmit={guardar} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Mascota" value={form.id_mascota} onChange={(e) => setForm({ ...form, id_mascota: e.target.value })} required disabled={!!editando}>
              <option value="">Selecciona una mascota</option>
              {mascotas.map((m) => <option key={m.id_mascota} value={m.id_mascota}>{m.nombre}</option>)}
            </Select>
            <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Textarea label="Alergias" rows="2" value={form.alergias} onChange={(e) => setForm({ ...form, alergias: e.target.value })} />
            <Textarea label="Vacunas" rows="2" value={form.vacunas} onChange={(e) => setForm({ ...form, vacunas: e.target.value })} />
          </div>
          <Textarea label="Cirugias" rows="2" value={form.cirugias} onChange={(e) => setForm({ ...form, cirugias: e.target.value })} />
          <Textarea label="Diagnostico" rows="2" value={form.diagnostico} onChange={(e) => setForm({ ...form, diagnostico: e.target.value })} />
          <Textarea label="Tratamiento" rows="2" value={form.tratamiento} onChange={(e) => setForm({ ...form, tratamiento: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
