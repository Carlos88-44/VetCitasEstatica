import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Phone, Mail, MapPin, User } from 'lucide-react';
import { clienteService } from '../../services/clienteService';
import { Button, Input, Modal, DataTable, useToast } from '../ui';

const VACIO = { nombre: '', telefono: '', correo: '', direccion: '' };

export default function Clientes() {
  const { notificar } = useToast();
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, []);

  function cargar() {
    setCargando(true);
    clienteService.listar()
      .then((r) => setClientes(r.data))
      .catch(() => notificar('No se pudieron cargar los clientes.', 'error'))
      .finally(() => setCargando(false));
  }

  function abrirNuevo() { setEditando(null); setForm(VACIO); setError(''); setModalAbierto(true); }
  function abrirEditar(c) {
    setEditando(c.id_cliente);
    setForm({ nombre: c.nombre, telefono: c.telefono || '', correo: c.correo || '', direccion: c.direccion || '' });
    setError('');
    setModalAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      if (editando) await clienteService.actualizar(editando, form);
      else await clienteService.crear(form);
      setModalAbierto(false);
      cargar();
      notificar(editando ? 'Cliente actualizado.' : 'Cliente creado.', 'exito');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo guardar el cliente.';
      setError(msg);
      notificar(msg, 'error');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(c) {
    if (!window.confirm(`¿Eliminar a ${c.nombre}? Tambien se eliminaran sus mascotas.`)) return;
    try {
      await clienteService.eliminar(c.id_cliente);
      cargar();
      notificar('Cliente eliminado.', 'exito');
    } catch (err) {
      notificar(err.response?.data?.mensaje || 'No se pudo eliminar el cliente.', 'error');
    }
  }

  const columnas = [
    { key: 'nombre', header: 'Nombre', render: (c) => <span className="font-semibold text-ink">{c.nombre}</span> },
    { key: 'telefono', header: 'Telefono' },
    { key: 'correo', header: 'Correo' },
    { key: 'direccion', header: 'Direccion' },
  ];

  const acciones = (c) => (
    <div className="flex justify-end gap-1.5">
      <Button size="sm" variant="secondary" icon={Pencil} onClick={() => abrirEditar(c)}>Editar</Button>
      <Button size="sm" variant="danger" icon={Trash2} onClick={() => eliminar(c)}>Eliminar</Button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Clientes</h1>
          <p className="text-ink-soft text-sm mt-1">Administra los duenos registrados en tu clinica.</p>
        </div>
        <Button icon={Plus} onClick={abrirNuevo}>Nuevo cliente</Button>
      </div>

      <DataTable
        columns={columnas}
        data={clientes}
        cargando={cargando}
        buscarPor={['nombre', 'correo', 'telefono']}
        placeholderBusqueda="Buscar cliente..."
        vacioTitulo="Aun no hay clientes"
        vacioDescripcion="Registra tu primer cliente para comenzar a agendar citas."
        acciones={acciones}
        renderTarjetaMovil={(c, acciones) => (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0"><User size={16} /></div>
              <span className="font-semibold text-ink text-sm">{c.nombre}</span>
            </div>
            <div className="space-y-1 text-xs text-ink-soft ml-11">
              {c.telefono && <div className="flex items-center gap-1.5"><Phone size={12} /> {c.telefono}</div>}
              {c.correo && <div className="flex items-center gap-1.5"><Mail size={12} /> {c.correo}</div>}
              {c.direccion && <div className="flex items-center gap-1.5"><MapPin size={12} /> {c.direccion}</div>}
            </div>
            <div className="flex justify-end gap-2 mt-3">{acciones(c)}</div>
          </div>
        )}
      />

      <Modal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={editando ? 'Editar cliente' : 'Nuevo cliente'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button form="form-cliente" type="submit" loading={guardando}>Guardar</Button>
          </>
        }
      >
        {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg text-danger-text text-[13px] font-medium">{error}</div>}
        <form id="form-cliente" onSubmit={guardar} className="space-y-4">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <Input label="Telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <Input label="Correo" type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
          <Input label="Direccion" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
