'use client';

import {
  ESTADOS_PEDIDO,
  getEstadoIndex,
  getWhatsAppLink,
  formatPrice,
} from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Pedido, PedidoHistorial, PedidoItem } from '@/types';

interface OrderTrackerProps {
  pedido: Pedido;
  historial: PedidoHistorial[];
  items?: PedidoItem[];
}

export function OrderTracker({ pedido, historial, items = [] }: OrderTrackerProps) {
  const isMultiItem = items.length > 1;
  const currentStatusIndex = getEstadoIndex(pedido.estado);
  const isCancelled = pedido.estado === 'cancelado';

  // "cancelado" no es un paso de la secuencia: se muestra como aviso aparte.
  const steps = ESTADOS_PEDIDO.filter((e) => e.value !== 'cancelado');

  function getStatusDate(statusValue: string): string | null {
    const record = historial.find((h) => h.estado === statusValue);
    if (!record) return null;
    return new Date(record.created_at).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusNote(statusValue: string): string | null {
    const record = historial.find((h) => h.estado === statusValue);
    return record?.nota || null;
  }

  return (
    <div className="space-y-14">
      {/* Resumen */}
      <div className="border border-line">
        <div className="flex flex-col gap-5 border-b border-line p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-eyebrow text-ink-muted">Número de pedido</p>
            <p className="mt-2 text-lg tracking-[0.15em] text-ink">
              {pedido.numero_pedido}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-eyebrow text-ink-muted">Fecha de registro</p>
            <p className="mt-2 text-sm text-ink">
              {new Date(pedido.created_at).toLocaleDateString('es-PE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3 md:p-8">
          <div>
            <dt className="text-eyebrow text-ink-muted">Producto</dt>
            <dd className="mt-2 text-sm text-ink">{pedido.producto_nombre}</dd>
            <dd className="mt-1 text-sm text-ink-muted">
              {formatPrice(pedido.producto_precio)}
            </dd>
          </div>

          <div>
            <dt className="text-eyebrow text-ink-muted">Talla</dt>
            <dd className="mt-2 text-sm uppercase text-ink">{pedido.talla}</dd>
          </div>

          <div>
            <dt className="text-eyebrow text-ink-muted">Cliente</dt>
            <dd className="mt-2 text-sm text-ink">{pedido.cliente_nombre}</dd>
            <dd className="mt-1 text-sm text-ink-muted">
              {pedido.cliente_whatsapp}
            </dd>
          </div>
        </dl>

        {/* Desglose de un pedido con varios ítems */}
        {isMultiItem && (
          <div className="border-t border-line p-6 md:p-8">
            <p className="text-eyebrow text-ink-muted">Productos del pedido</p>

            <ul className="mt-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">
                      {item.producto_nombre}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {item.talla ? `Talla ${item.talla} · ` : ''}
                      Cantidad {item.cantidad}
                    </p>
                  </div>
                  <span className="text-price shrink-0 text-ink">
                    {formatPrice(item.subtotal)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-baseline justify-between pt-4">
              <span className="text-eyebrow text-ink">Total</span>
              <span className="text-base text-ink">
                {formatPrice(pedido.total || 0)}
              </span>
            </div>
          </div>
        )}

        {pedido.notas && (
          <div className="border-t border-line bg-surface-muted p-6 md:p-8">
            <p className="text-eyebrow text-ink-muted">Notas del pedido</p>
            <p className="mt-3 text-sm leading-relaxed text-ink">{pedido.notas}</p>
          </div>
        )}
      </div>

      {/* Pedido cancelado */}
      {isCancelled ? (
        <div className="border-l-2 border-danger pl-5">
          <h3 className="text-product text-danger">Pedido cancelado</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Este pedido fue cancelado. Si creés que es un error, escribinos y lo
            revisamos.
          </p>
          {getStatusNote('cancelado') && (
            <p className="mt-3 text-sm text-ink">
              Motivo: {getStatusNote('cancelado')}
            </p>
          )}
        </div>
      ) : (
        /* Secuencia de estados */
        <div>
          <h3 className="text-eyebrow border-b border-line pb-4 text-ink">
            Estado del envío
          </h3>

          <ol className="mt-2">
            {steps.map((step) => {
              const stepIndex = getEstadoIndex(step.value);
              const isDone = stepIndex <= currentStatusIndex;
              const isCurrent = stepIndex === currentStatusIndex;
              const date = getStatusDate(step.value);
              const note = getStatusNote(step.value);

              return (
                <li
                  key={step.value}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'flex flex-col gap-2 border-b border-line py-5 md:flex-row md:items-baseline md:justify-between',
                    // El estado actual se marca con borde y peso, no solo con
                    // color: la información no debe depender del color.
                    isCurrent && 'border-l-2 border-l-ink pl-4',
                  )}
                >
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-sm',
                        isCurrent
                          ? 'font-semibold text-ink'
                          : isDone
                            ? 'text-ink'
                            : 'text-ink-subtle',
                      )}
                    >
                      {step.label}
                    </p>
                    {note && (
                      <p className="mt-1.5 text-xs text-ink-muted">{note}</p>
                    )}
                  </div>

                  <p className="shrink-0 text-xs text-ink-muted md:text-right">
                    {date ?? 'Pendiente'}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Consulta */}
      <div className="text-center">
        <a
          href={getWhatsAppLink(
            `Hola, quisiera consultar sobre el estado de mi pedido ${pedido.numero_pedido}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center justify-center border border-ink px-10 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-ink-inverse"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
