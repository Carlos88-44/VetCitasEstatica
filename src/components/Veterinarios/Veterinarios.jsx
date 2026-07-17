import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react';
import { veterinarioService } from '../../services/veterinarioService';
import { Button, Input, Modal, DataTable, useToast } from '../ui';

const VACIO = { nombre: '', especialidad: '', telefono: '', horario: '' };

export default function Veterinarios() {
  const { notificar } = useToast();
  const [veterinarios, setVeterinarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, []);

  function cargar() {
    setCargando(true);
    veterinarioService.listar()
      .then((r) => setVeterinarios(r.data))
      .catch(() => notificar('No se pudieron cargar los veterinarios.', 'error'))
      .finally(() => setCargando(false));
  }

  function abrirNuevo() { setEditando(null); setForm(VACIO); setError(''); setModalAbierto(true); }
  function abrirEditar(v) {
    setEditando(v.id_veterinario);
    setForm({ nombre: v.nombre, especialidad: v.especialidad || '', telefono: v.telefono || '', horario: v.horario || '' });
    setError('');
    setModalAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      if (editando) await veterinarioService.actualizar(editando, { ...form, activo: 1 });
      else await veterinarioService.crear(form);
      setModalAbierto(false);
      cargar();
      notificar(editando ? 'Veterinario actualizado.' : 'Veterinario registrado.', 'exito');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo guardar el veterinario.';
      setError(msg);
      notificar(msg, 'error');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(v) {
    if (!window.confirm(`¿Eliminar a ${v.nombre}?`)) return;
    try {
      await veterinarioService.eliminar(v.id_veterinario);
      cargar();
      notificar('Veterinario eliminado.', 'exito');
    } catch (err) {
      notificar(err.response?.data?.mensaje || 'No se pudo eliminar el veterinario.', 'error');
    }
  }

  const columnas = [
    { key: 'nombre', header: 'Nombre', render: (v) => <span className="font-semibold text-ink">{v.nombre}</span> },
    { key: 'especialidad', header: 'Especialidad' },
    { key: 'telefono', header: 'Telefono' },
    { key: 'horario', header: 'Horario' },
  ];

  const acciones = (v) => (
    <div className="flex justify-end gap-1.5">
      <Button size="sm" variant="secondary" icon={Pencil} onClick={() => abrirEditar(v)}>Editar</Button>
      <Button size="sm" variant="danger" icon={Trash2} onClick={() => eliminar(v)}>Eliminar</Button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Veterinarios</h1>
          <p className="text-ink-soft text-sm mt-1">Equipo medico disponible para agendar citas.</p>
        </div>
        <Button icon={Plus} onClick={abrirNuevo}>Nuevo veterinario</Button>
      </div>

      <DataTable
        columns={columnas}
        data={veterinarios}
        cargando={cargando}
        buscarPor={['nombre', 'especialidad']}
        placeholderBusqueda="Buscar veterinario..."
        vacioTitulo="Aun no hay veterinarios"
        vacioDescripcion="Registra al equipo medico de tu clinica."
        acciones={acciones}
        renderTarjetaMovil={(v, acciones) => (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0"><Stethoscope size={16} /></div>
              <div>
                <span className="font-semibold text-ink text-sm block">{v.nombre}</span>
                <span className="text-xs text-ink-soft">{v.especialidad}</span>
              </div>
            </div>
            <div className="ml-11 text-xs text-ink-soft space-y-0.5">
              {v.telefono && <div>{v.telefono}</div>}
              {v.horario && <div>{v.horario}</div>}
            </div>
            <div className="flex justify-end gap-2 mt-3">{acciones(v)}</div>
          </div>
        )}
      />

      <Modal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={editando ? 'Editar veterinario' : 'Nuevo veterinario'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button form="form-veterinario" type="submit" loading={guardando}>Guardar</Button>
          </>
        }
      >
        {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg text-danger-text text-[13px] font-medium">{error}</div>}
        <form id="form-veterinario" onSubmit={guardar} className="space-y-4">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <Input label="Especialidad" value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} />
          <Input label="Telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <Input label="Horario" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} placeholder="Lunes a Viernes 8:00-16:00" />
        </form>
      </Modal>
    </div>
  );
}
