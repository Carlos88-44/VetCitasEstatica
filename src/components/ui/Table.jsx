// Tabla de datos reutilizable: busqueda, paginacion, encabezado fijo,
// hover por fila y vista de tarjetas en pantallas pequenas.
import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export default function DataTable({
  columns,
  data,
  cargando,
  buscarPor = [],
  placeholderBusqueda = 'Buscar...',
  filasPorPagina = 8,
  vacioTitulo = 'Sin resultados',
  vacioDescripcion = 'No se encontraron registros para mostrar.',
  renderTarjetaMovil,
  acciones
}) {
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    if (!busqueda || buscarPor.length === 0) return data;
    const q = busqueda.toLowerCase();
    return data.filter((fila) => buscarPor.some((campo) => String(fila[campo] ?? '').toLowerCase().includes(q)));
  }, [data, busqueda, buscarPor]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / filasPorPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice((paginaActual - 1) * filasPorPagina, paginaActual * filasPorPagina);

  return (
    <div className="bg-surface border border-line rounded-2xl shadow-card overflow-hidden">
      {buscarPor.length > 0 && (
        <div className="p-4 border-b border-line flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              placeholder={placeholderBusqueda}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-line text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
          <span className="text-xs text-ink-faint ml-auto hidden sm:block">{filtrados.length} registro{filtrados.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {cargando ? (
        <LoadingState filas={4} />
      ) : filtrados.length === 0 ? (
        <EmptyState icon={Inbox} title={vacioTitulo} description={vacioDescripcion} />
      ) : (
        <>
          {/* Vista de tabla — escritorio y tablet */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="text-left font-semibold text-ink-soft text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                      {col.header}
                    </th>
                  ))}
                  {acciones && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paginados.map((fila, i) => (
                  <tr key={fila.id ?? i} className="hover:bg-slate-50/80 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-ink align-middle">
                        {col.render ? col.render(fila) : fila[col.key]}
                      </td>
                    ))}
                    {acciones && <td className="px-4 py-3 text-right whitespace-nowrap">{acciones(fila)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas — movil */}
          <div className="md:hidden divide-y divide-line">
            {paginados.map((fila, i) => (
              <div key={fila.id ?? i} className="p-4">
                {renderTarjetaMovil ? renderTarjetaMovil(fila, acciones) : (
                  <div className="space-y-1">
                    {columns.map((col) => (
                      <div key={col.key} className="flex justify-between gap-3 text-sm">
                        <span className="text-ink-soft">{col.header}</span>
                        <span className="text-ink text-right">{col.render ? col.render(fila) : fila[col.key]}</span>
                      </div>
                    ))}
                    {acciones && <div className="flex justify-end gap-2 pt-2">{acciones(fila)}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-line">
              <span className="text-xs text-ink-faint">Pagina {paginaActual} de {totalPaginas}</span>
              <div className="flex gap-1.5">
                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPagina((p) => p - 1)}
                  className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-soft disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPagina((p) => p + 1)}
                  className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-soft disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
