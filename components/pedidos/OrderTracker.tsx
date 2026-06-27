'use client';

import { motion } from 'framer-motion';
import { ESTADOS_PEDIDO, getEstadoIndex, getWhatsAppLink, formatPrice } from '@/lib/utils';
import type { Pedido, PedidoHistorial, PedidoItem } from '@/types';
import { Check, MessageCircle, AlertTriangle, Calendar, ShoppingBag, User, Ruler } from 'lucide-react';

interface OrderTrackerProps {
  pedido: Pedido;
  historial: PedidoHistorial[];
  items?: PedidoItem[];
}

export function OrderTracker({ pedido, historial, items = [] }: OrderTrackerProps) {
  const isMultiItem = items.length > 1;
  const currentStatusIndex = getEstadoIndex(pedido.estado);
  const isCancelled = pedido.estado === 'cancelado';

  // Filter out cancelado from the linear steps
  const steps = ESTADOS_PEDIDO.filter((e) => e.value !== 'cancelado');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  // Find date for each state in the history
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

  // Find note for each state in the history
  function getStatusNote(statusValue: string): string | null {
    const record = historial.find((h) => h.estado === statusValue);
    return record?.nota || null;
  }

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-kdb-card border border-kdb-border p-6 md:p-8 rounded-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-kdb-border pb-6">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-widest">Número de Pedido</span>
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-gold tracking-wider mt-1">
              {pedido.numero_pedido}
            </h2>
          </div>
          <div className="flex flex-col md:items-end">
            <span className="text-xs text-text-secondary uppercase tracking-widest">Fecha de Registro</span>
            <div className="flex items-center gap-2 text-text-primary mt-1 text-sm">
              <Calendar className="w-4 h-4 text-gold" />
              <span>
                {new Date(pedido.created_at).toLocaleDateString('es-PE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-sm bg-kdb-elevated flex items-center justify-center border border-kdb-border text-gold shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider block">Producto</span>
              <span className="text-sm font-semibold text-text-primary">{pedido.producto_nombre}</span>
              <span className="text-xs text-gold block mt-0.5">{formatPrice(pedido.producto_precio)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-sm bg-kdb-elevated flex items-center justify-center border border-kdb-border text-gold shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider block">Talla Seleccionada</span>
              <span className="text-sm font-semibold text-text-primary uppercase">{pedido.talla}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-sm bg-kdb-elevated flex items-center justify-center border border-kdb-border text-gold shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider block">Cliente</span>
              <span className="text-sm font-semibold text-text-primary">{pedido.cliente_nombre}</span>
              <span className="text-xs text-text-secondary block mt-0.5">{pedido.cliente_whatsapp}</span>
            </div>
          </div>
        </div>

        {/* Desglose de ítems (carrito multi-producto) */}
        {isMultiItem && (
          <div className="mt-6 border-t border-kdb-border pt-6">
            <span className="text-xs text-text-secondary uppercase tracking-wider block mb-3">
              Productos del pedido
            </span>
            <div className="divide-y divide-kdb-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-text-primary truncate">{item.producto_nombre}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {item.talla ? `Talla ${item.talla} · ` : ''}Cant. {item.cantidad}
                    </p>
                  </div>
                  <span className="text-sm text-gold font-medium shrink-0">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-kdb-border">
              <span className="text-sm font-semibold text-text-primary uppercase tracking-wider">Total</span>
              <span className="text-base font-semibold text-gold">{formatPrice(pedido.total || 0)}</span>
            </div>
          </div>
        )}

        {pedido.notas && (
          <div className="mt-6 p-4 bg-kdb-elevated border border-kdb-border rounded-sm">
            <span className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Notas del pedido:</span>
            <p className="text-sm text-text-primary italic">&quot;{pedido.notas}&quot;</p>
          </div>
        )}
      </div>

      {/* Cancelled Alert */}
      {isCancelled && (
        <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/20 text-[#E53E3E] p-6 flex gap-4 rounded-sm">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-semibold text-base uppercase tracking-wider">Pedido Cancelado</h3>
            <p className="text-sm opacity-90 mt-1">
              Este pedido ha sido cancelado. Si crees que esto es un error o deseas más información, contáctanos.
            </p>
            {getStatusNote('cancelado') && (
              <p className="text-sm font-medium mt-2">Motivo: &quot;{getStatusNote('cancelado')}&quot;</p>
            )}
          </div>
        </div>
      )}

      {/* Vertical Timeline */}
      {!isCancelled && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-kdb-card border border-kdb-border p-6 md:p-8 rounded-sm"
        >
          <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl text-text-primary tracking-widest uppercase mb-8 border-b border-kdb-border pb-4">
            Estado del Envío
          </h3>

          <div className="relative pl-8 md:pl-10 space-y-10">
            {/* Background Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-kdb-border" />

            {steps.map((step) => {
              const stepIndexInGlobal = getEstadoIndex(step.value);
              const isCompleted = stepIndexInGlobal < currentStatusIndex || (stepIndexInGlobal === currentStatusIndex && pedido.estado !== 'cancelado');
              const isCurrent = stepIndexInGlobal === currentStatusIndex;
              const date = getStatusDate(step.value);
              const note = getStatusNote(step.value);

              return (
                <motion.div key={step.value} variants={itemVariants} className="relative flex flex-col md:flex-row md:items-start gap-4">
                  {/* Indicator Dot */}
                  <div className="absolute -left-8 md:-left-10 top-0.5 flex items-center justify-center z-10">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-gold border-2 border-gold flex items-center justify-center text-black">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-kdb-bg border-2 border-gold flex items-center justify-center relative">
                        <div className="w-3 h-3 rounded-full bg-gold animate-ping absolute" />
                        <div className="w-3 h-3 rounded-full bg-gold relative" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-kdb-bg border-2 border-kdb-border flex items-center justify-center text-text-muted">
                        <div className="w-2.5 h-2.5 rounded-full bg-kdb-border" />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1">
                    <h4
                      className={`text-base font-semibold transition-colors duration-200 ${
                        isCurrent ? 'text-gold' : isCompleted ? 'text-text-primary' : 'text-text-muted'
                      }`}
                    >
                      {step.label}
                    </h4>

                    {note && <p className="text-sm text-text-secondary mt-1">{note}</p>}
                  </div>

                  {/* Timestamp */}
                  <div className="md:w-48 text-left md:text-right shrink-0 mt-1 md:mt-0">
                    {date ? (
                      <span className="text-xs text-text-secondary block font-medium">{date}</span>
                    ) : (
                      <span className="text-xs text-text-muted block italic">Pendiente</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* WhatsApp Help CTA */}
      <div className="text-center pt-4">
        <a
          href={getWhatsAppLink(`Hola! Quisiera consultar sobre el estado de mi pedido ${pedido.numero_pedido}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-[#0A0A0A] hover:bg-[#20ba56] transition-colors py-3.5 px-8 font-semibold tracking-wider text-sm rounded-sm"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          CONSULTAR ESTADO POR WHATSAPP
        </a>
      </div>
    </div>
  );
}
