'use client';

import { useState, useMemo, useEffect, useCallback, Fragment } from 'react';
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
} from '@/lib/utils';
import type { EstadoPedido, Pedido, PedidoItem } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAdminFeedback } from '@/components/admin/AdminFeedback';

type FilterTab = 'todos' | EstadoPedido;

const filterTabs: { value: FilterTab; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...ESTADOS_PEDIDO.map((e) => ({
    value: e.value as FilterTab,
    label: ESTADO_LABELS[e.value],
  })),
];

export default function AdminPedidosPage() {
  const { toast } = useAdminFeedback();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updateState, setUpdateState] = useState<Record<string, EstadoPedido>>({});
  const [updateNotes, setUpdateNotes] = useState<Record<string, string>>({});
  const [itemsMap, setItemsMap] = useState<Record<string, PedidoItem[]>>({});

  const loadPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (err) {
      console.error('Error loading orders for admin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPedidos();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPedidos]);

  const filteredPedidos = useMemo(() => {
    if (activeFilter === 'todos') return pedidos;
    return pedidos.filter((p) => p.estado === activeFilter);
  }, [activeFilter, pedidos]);

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

    if (!newState) return;

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
    }
  }

  function getWhatsAppUrl(whatsapp: string, pedido: Pedido) {
    const clean = whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Hola ${pedido.cliente_nombre}, te escribimos de KDB Stores sobre tu pedido ${pedido.numero_pedido}.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
          Gestión de Pedidos
        </h1>
        <p className="text-sm text-text-secondary mt-1">
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
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeFilter === tab.value
                  ? 'bg-gold text-kdb-bg'
                  : 'bg-kdb-card border border-kdb-border text-text-secondary hover:text-text-primary hover:border-gold/50'
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-kdb-card border border-kdb-border rounded-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-kdb-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider w-8" />
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                Número
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                Cliente
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden sm:table-cell">
                WhatsApp
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden md:table-cell">
                Producto
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden lg:table-cell">
                Talla
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                Estado
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden sm:table-cell">
                Total
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden lg:table-cell">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-kdb-border">
            {filteredPedidos.map((pedido) => {
              const color = ESTADO_COLORS[pedido.estado];
              const isExpanded = expandedId === pedido.id;

              return (
                <Fragment key={pedido.id}>
                  {/* Main row */}
                  <tr
                    className="hover:bg-kdb-elevated transition-colors cursor-pointer"
                    onClick={() => toggleExpand(pedido.id)}
                  >
                    <td className="px-4 py-4">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-text-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-text-muted" />
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-text-primary whitespace-nowrap">
                      {pedido.numero_pedido}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap">
                      {pedido.cliente_nombre}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap hidden sm:table-cell">
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
                    <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap hidden md:table-cell max-w-[180px] truncate">
                      {pedido.producto_nombre}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap hidden lg:table-cell">
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
                     <td className="px-4 py-4 text-sm text-text-primary font-medium whitespace-nowrap hidden sm:table-cell">
                      {formatPrice(pedido.total || 0)}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap hidden lg:table-cell">
                      {pedido.created_at.substring(0, 10)}
                    </td>
                  </tr>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <tr className="bg-kdb-elevated/50">
                      <td colSpan={9} className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order details */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">
                              Detalle del Pedido
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-text-muted">Producto:</span>
                                <span className="text-text-primary text-right max-w-[250px] truncate">
                                  {pedido.producto_nombre}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Talla:</span>
                                <span className="text-text-primary">{pedido.talla}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Total:</span>
                                <span className="text-text-primary font-medium">
                                  {formatPrice(pedido.total || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Email:</span>
                                <span className="text-text-primary">{pedido.cliente_email}</span>
                              </div>
                              {pedido.notas && (
                                <div className="pt-2 border-t border-kdb-border">
                                  <span className="text-text-muted">Notas:</span>
                                  <p className="text-text-secondary mt-1">{pedido.notas}</p>
                                </div>
                              )}
                            </div>

                            {/* Ítems del pedido (multi-producto) */}
                            {itemsMap[pedido.id] && itemsMap[pedido.id].length > 1 && (
                              <div className="pt-2 border-t border-kdb-border">
                                <span className="text-text-muted text-sm">Productos:</span>
                                <ul className="mt-1 space-y-1">
                                  {itemsMap[pedido.id].map((it) => (
                                    <li key={it.id} className="flex justify-between text-sm">
                                      <span className="text-text-secondary truncate pr-2">
                                        {it.cantidad}× {it.producto_nombre}
                                        {it.talla ? ` (${it.talla})` : ''}
                                      </span>
                                      <span className="text-text-primary shrink-0">{formatPrice(it.subtotal)}</span>
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
                            <h3 className="text-sm font-semibold text-gold uppercase tracking-wider">
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
                                className="w-full px-4 py-3 bg-kdb-elevated border border-kdb-border rounded-md text-text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
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
                                className="w-full px-4 py-3 bg-kdb-elevated border border-kdb-border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                              />

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStateUpdate(pedido.id);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-kdb-bg font-semibold rounded-md hover:bg-gold-light transition-colors text-sm"
                              >
                                <Save className="w-4 h-4" />
                                Actualizar
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
            <p className="text-text-muted text-sm">
              No hay pedidos con este estado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
