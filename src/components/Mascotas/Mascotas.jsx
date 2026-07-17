import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, PawPrint } from 'lucide-react';
import { mascotaService } from '../../services/mascotaService';
import { clienteService } from '../../services/clienteService';
import { Button, Input, Select, Modal, DataTable, useToast } from '../ui';

const VACIO = { id_cliente: '', nombre: '', especie: '', raza: '', edad: '', peso: '' };

export default function Mascotas() {
  const { notificar } = useToast();
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargar();
    clienteService.listar().then((r) => setClientes(r.data)).catch(() => {});
  }, []);

  function cargar() {
    setCargando(true);
    mascotaService.listar()
      .then((r) => setMascotas(r.data))
      .catch(() => notificar('No se pudieron cargar las mascotas.', 'error'))
      .finally(() => setCargando(false));
  }

  function abrirNuevo() { setEditando(null); setForm(VACIO); setError(''); setModalAbierto(true); }
  function abrirEditar(m) {
    setEditando(m.id_mascota);
    setForm({ id_cliente: m.id_cliente, nombre: m.nombre, especie: m.especie, raza: m.raza || '', edad: m.edad || '', peso: m.peso || '' });
    setError('');
    setModalAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      if (editando) await mascotaService.actualizar(editando, form);
      else await mascotaService.crear(form);
      setModalAbierto(false);
      cargar();
      notificar(editando ? 'Mascota actualizada.' : 'Mascota registrada.', 'exito');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo guardar la mascota.';
      setError(msg);
      notificar(msg, 'error');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(m) {
    if (!window.confirm(`¿Eliminar a ${m.nombre}? Tambien se eliminara su expediente.`)) return;
    try {
      await mascotaService.eliminar(m.id_mascota);
      cargar();
      notificar('Mascota eliminada.', 'exito');
    } catch (err) {
      notificar(err.response?.data?.mensaje || 'No se pudo eliminar la mascota.', 'error');
    }
  }

  const columnas = [
    { key: 'nombre', header: 'Nombre', render: (m) => <span className="font-semibold text-ink">{m.nombre}</span> },
    { key: 'especie', header: 'Especie' },
    { key: 'raza', header: 'Raza' },
    { key: 'edad', header: 'Edad', render: (m) => m.edad ? `${m.edad} anos` : '—' },
    { key: 'peso', header: 'Peso', render: (m) => m.peso ? `${m.peso} kg` : '—' },
    { key: 'nombre_cliente', header: 'Cliente' },
  ];

  const acciones = (m) => (
    <div className="flex justify-end gap-1.5">
      <Button size="sm" variant="secondary" icon={Pencil} onClick={() => abrirEditar(m)}>Editar</Button>
      <Button size="sm" variant="danger" icon={Trash2} onClick={() => eliminar(m)}>Eliminar</Button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Mascotas</h1>
          <p className="text-ink-soft text-sm mt-1">Pacientes registrados, vinculados a cada cliente.</p>
        </div>
        <Button icon={Plus} onClick={abrirNuevo}>Nueva mascota</Button>
      </div>

      <DataTable
        columns={columnas}
        data={mascotas}
        cargando={cargando}
        buscarPor={['nombre', 'especie', 'nombre_cliente']}
        placeholderBusqueda="Buscar mascota..."
        vacioTitulo="Aun no hay mascotas"
        vacioDescripcion="Registra una mascota para asociarla a un cliente."
        acciones={acciones}
        renderTarjetaMovil={(m, acciones) => (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0"><PawPrint size={16} /></div>
              <div>
                <span className="font-semibold text-ink text-sm block">{m.nombre}</span>
                <span className="text-xs text-ink-soft">{m.especie}{m.raza ? ` · ${m.raza}` : ''}</span>
              </div>
            </div>
            <div className="ml-11 text-xs text-ink-soft space-y-0.5">
              <div>Cliente: {m.nombre_cliente}</div>
              {(m.edad || m.peso) && <div>{m.edad ? `${m.edad} anos` : ''}{m.edad && m.peso ? ' · ' : ''}{m.peso ? `${m.peso} kg` : ''}</div>}
            </div>
            <div className="flex justify-end gap-2 mt-3">{acciones(m)}</div>
          </div>
        )}
      />

      <Modal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={editando ? 'Editar mascota' : 'Nueva mascota'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button form="form-mascota" type="submit" loading={guardando}>Guardar</Button>
          </>
        }
      >
        {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg text-danger-text text-[13px] font-medium">{error}</div>}
        <form id="form-mascota" onSubmit={guardar} className="space-y-4">
          <Select label="Cliente" value={form.id_cliente} onChange={(e) => setForm({ ...form, id_cliente: e.target.value })} required disabled={!!editando}>
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
          </Select>
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Especie" value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })} placeholder="Perro, gato..." required />
            <Input label="Raza" value={form.raza} onChange={(e) => setForm({ ...form, raza: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Edad (anos)" type="number" min="0" value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} />
            <Input label="Peso (kg)" type="number" step="0.1" min="0" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
          </div>
        </form>
      </Modal>
    </div>
  );
}
