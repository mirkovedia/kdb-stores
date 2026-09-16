'use client';

import { useState, useMemo, Fragment } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  Save,
  Loader2,
} from 'lucide-react';
import {
  cn,
  formatPrice,
  ESTADOS_PEDIDO,
  ESTADO_COLORS,
  ESTADO_LABELS,
  TH_CLASSES,
} from '@/lib/utils';
import type { EstadoPedido, Pedido, PedidoItem } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAdminFeedback } from '@/components/admin/AdminFeedback';
import { Pagination } from '@/components/admin/Pagination';
import {
  SortableHeader,
  nextSort,
  type SortState,
} from '@/components/admin/SortableHeader';

const PAGE_SIZE = 10;

type FilterTab = 'todos' | EstadoPedido;

const filterTabs: { value: FilterTab; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...ESTADOS_PEDIDO.map((e) => ({
    value: e.value as FilterTab,
    label: ESTADO_LABELS[e.value],
  })),
];

export function PedidosManager({
  initialPedidos,
}: {
  initialPedidos: Pedido[];
}) {
  const { toast } = useAdminFeedback();
  const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('todos');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updateState, setUpdateState] = useState<Record<string, EstadoPedido>>({});
  const [updateNotes, setUpdateNotes] = useState<Record<string, string>>({});
  const [itemsMap, setItemsMap] = useState<Record<string, PedidoItem[]>>({});
  const [sort, setSort] = useState<SortState | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredPedidos = useMemo(() => {
    if (activeFilter === 'todos') return pedidos;
    return pedidos.filter((p) => p.estado === activeFilter);
  }, [activeFilter, pedidos]);

  const sortedPedidos = useMemo(() => {
    if (!sort) return filteredPedidos;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filteredPedidos].sort((a, b) => {
      switch (sort.key) {
        case 'numero':
          return a.numero_pedido.localeCompare(b.numero_pedido) * dir;
        case 'total':
          return (Number(a.total || 0) - Number(b.total || 0)) * dir;
        case 'fecha':
          return a.created_at.localeCompare(b.created_at) * dir;
        default:
          return 0;
      }
    });
  }, [filteredPedidos, sort]);

  function handleFilterChange(value: FilterTab) {
    setActiveFilter(value);
    setPage(1); // Volver a la primera página al cambiar de filtro.
  }

  function handleSort(key: string) {
    setSort((prev) => nextSort(prev, key));
    setPage(1);
  }

  const pagedPedidos = useMemo(
    () => sortedPedidos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedPedidos, page]
  );

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    // Carga perezosa de los ítems del pedido la primera vez que se expande
    if (!itemsMap[id]) {
      const supabase = createClient();
      supabase
        .from('pedido_items')
        .select('*')
        .eq('pedido_id', id)
        .order('created_at', { ascending: true })
        .then(({ data }) => {
          setItemsMap((prev) => ({ ...prev, [id]: data || [] }));
        });
    }
  }

  async function handleStateUpdate(pedidoId: string) {
    const newState = updateState[pedidoId];
    const note = updateNotes[pedidoId];

    if (!newState || updatingId) return;

    setUpdatingId(pedidoId);
    try {
      const supabase = createClient();

      // Update estado in pedidos table
      const { error: orderError } = await supabase
        .from('pedidos')
        .update({ estado: newState })
        .eq('id', pedidoId);

      if (orderError) throw orderError;

      // Register history log in pedido_historial table
      const { error: historyError } = await supabase
        .from('pedido_historial')
        .insert({
          pedido_id: pedidoId,
          estado: newState,
          nota: note || `Estado del pedido actualizado a ${ESTADO_LABELS[newState]}`
        });

      if (historyError) throw historyError;

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estado: newState } : p
        )
      );

      toast(`Pedido actualizado a: ${ESTADO_LABELS[newState]}`, 'success');

      // Clear update inputs
      setUpdateState((prev) => {
        const next = { ...prev };
        delete next[pedidoId];
        return next;
      });
      setUpdateNotes((prev) => {
        const next = { ...prev };
        delete next[pedidoId];
        return next;
      });
    } catch (err) {
      toast('Error al actualizar el estado del pedido', 'error');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  function getWhatsAppUrl(whatsapp: string, pedido: Pedido) {
    const clean = whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Hola ${pedido.cliente_nombre}, te escribimos de KDB Stores sobre tu pedido ${pedido.numero_pedido}.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold uppercase tracking-[0.15em] text-ink">
          Gestión de Pedidos
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {filteredPedidos.length} pedido{filteredPedidos.length !== 1 ? 's' : ''}
          {activeFilter !== 'todos' && ` — ${ESTADO_LABELS[activeFilter as EstadoPedido]}`}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => {
          const count =
            tab.value === 'todos'
              ? pedidos.length
              : pedidos.filter((p) => p.estado === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeFilter === tab.value
                  ? 'border border-ink bg-ink text-ink-inverse'
                  : 'border border-line bg-surface text-ink-muted hover:border-ink hover:text-ink'
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-md border border-line bg-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-surface-muted">
              <th className={cn(TH_CLASSES, "w-8")}>
                <span className="sr-only">Expandir</span>
              </th>
              <SortableHeader label="Número" sortKey="numero" sort={sort} onSort={handleSort} />
              <th className={TH_CLASSES}>
                Cliente
              </th>
              <th className={cn(TH_CLASSES, "hidden sm:table-cell")}>
                WhatsApp
              </th>
              <th className={cn(TH_CLASSES, "hidden md:table-cell")}>
                Producto
              </th>
              <th className={cn(TH_CLASSES, "hidden lg:table-cell")}>
                Talla
              </th>
              <th className={TH_CLASSES}>
                Estado
              </th>
              <SortableHeader
                label="Total"
                sortKey="total"
                sort={sort}
                onSort={handleSort}
                className="hidden sm:table-cell"
              />
              <SortableHeader
                label="Fecha"
                sortKey="fecha"
                sort={sort}
                onSort={handleSort}
                className="hidden lg:table-cell"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pagedPedidos.map((pedido) => {
              const color = ESTADO_COLORS[pedido.estado];
              const isExpanded = expandedId === pedido.id;

              return (
                <Fragment key={pedido.id}>
                  {/* Main row */}
                  <tr
                    className="cursor-pointer transition-colors hover:bg-surface-muted"
                    onClick={() => toggleExpand(pedido.id)}
                  >
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(pedido.id);
                        }}
                        aria-expanded={isExpanded}
                        aria-controls={`pedido-detalle-${pedido.id}`}
                        aria-label={`${isExpanded ? 'Contraer' : 'Expandir'} pedido ${pedido.numero_pedido}`}
                        className="rounded-sm text-ink-subtle transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-ink">
                      {pedido.numero_pedido}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-ink-muted">
                      {pedido.cliente_nombre}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-ink-muted sm:table-cell">
                      <a
                        href={getWhatsAppUrl(pedido.cliente_whatsapp, pedido)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {pedido.cliente_whatsapp}
                      </a>
                    </td>
                    <td className="hidden max-w-[180px] truncate whitespace-nowrap px-4 py-4 text-sm text-ink-muted md:table-cell">
                      {pedido.producto_nombre}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-ink-muted lg:table-cell">
                      {pedido.talla}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          color.bg,
                          color.text
                        )}
                      >
                        {ESTADO_LABELS[pedido.estado]}
                      </span>
                    </td>
                     <td className="hidden whitespace-nowrap px-4 py-4 text-sm font-medium text-ink sm:table-cell">
                      {formatPrice(pedido.total || 0)}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-ink-muted lg:table-cell">
                      {pedido.created_at.substring(0, 10)}
                    </td>
                  </tr>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <tr id={`pedido-detalle-${pedido.id}`} className="bg-surface-muted">
                      <td colSpan={9} className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order details */}
                          <div className="space-y-3">
                            <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-muted">
                              Detalle del Pedido
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-ink-subtle">Producto:</span>
                                <span className="max-w-[250px] truncate text-right text-ink">
                                  {pedido.producto_nombre}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-ink-subtle">Talla:</span>
                                <span className="text-ink">{pedido.talla}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-ink-subtle">Total:</span>
                                <span className="font-medium text-ink">
                                  {formatPrice(pedido.total || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-ink-subtle">Email:</span>
                                <span className="text-ink">{pedido.cliente_email}</span>
                              </div>
                              {pedido.notas && (
                                <div className="border-t border-line pt-2">
                                  <span className="text-ink-subtle">Notas:</span>
                                  <p className="mt-1 text-ink-muted">{pedido.notas}</p>
                                </div>
                              )}
                            </div>

                            {/* Ítems del pedido (multi-producto) */}
                            {itemsMap[pedido.id] && itemsMap[pedido.id].length > 1 && (
                              <div className="border-t border-line pt-2">
                                <span className="text-sm text-ink-subtle">Productos:</span>
                                <ul className="mt-1 space-y-1">
                                  {itemsMap[pedido.id].map((it) => (
                                    <li key={it.id} className="flex justify-between text-sm">
                                      <span className="truncate pr-2 text-ink-muted">
                                        {it.cantidad}× {it.producto_nombre}
                                        {it.talla ? ` (${it.talla})` : ''}
                                      </span>
                                      <span className="shrink-0 text-ink">{formatPrice(it.subtotal)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* WhatsApp link */}
                            <a
                              href={getWhatsAppUrl(pedido.cliente_whatsapp, pedido)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-md text-sm hover:bg-green-600/30 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Contactar por WhatsApp
                            </a>
                          </div>

                          {/* State update */}
                          <div className="space-y-3">
                            <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-muted">
                              Actualizar Estado
                            </h3>
                            <div className="space-y-3">
                              <select
                                value={updateState[pedido.id] || pedido.estado}
                                onChange={(e) =>
                                  setUpdateState((prev) => ({
                                    ...prev,
                                    [pedido.id]: e.target.value as EstadoPedido,
                                  }))
                                }
                                className="w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
                              >
                                {ESTADOS_PEDIDO.map((estado) => (
                                  <option key={estado.value} value={estado.value}>
                                    {estado.icon} {estado.label}
                                  </option>
                                ))}
                              </select>

                              <textarea
                                placeholder="Nota sobre el cambio de estado..."
                                rows={2}
                                value={updateNotes[pedido.id] || ''}
                                onChange={(e) =>
                                  setUpdateNotes((prev) => ({
                                    ...prev,
                                    [pedido.id]: e.target.value,
                                  }))
                                }
                                className="w-full resize-none rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                              />

                              <button
                                type="button"
                                disabled={updatingId === pedido.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStateUpdate(pedido.id);
                                }}
                                className="btn-solid h-11 rounded-md px-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                              >
                                {updatingId === pedido.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                                {updatingId === pedido.id ? 'Guardando...' : 'Actualizar'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {filteredPedidos.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-ink-muted">
              No hay pedidos con este estado.
            </p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalItems={filteredPedidos.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="pedido"
      />
    </div>
  );
}
