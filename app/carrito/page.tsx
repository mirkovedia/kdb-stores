'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';

const customerSchema = z.object({
  cliente_nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cliente_email: z.string().email('Email inválido'),
  cliente_whatsapp: z.string().min(9, 'Número de WhatsApp inválido'),
  cliente_direccion: z.string().optional(),
  cliente_ciudad: z.string().optional(),
  notas: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CarritoPage() {
  const { items, subtotal, totalItems, hydrated, updateQuantity, removeItem, clearCart } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ pedido_id: string; numero_pedido: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({ resolver: zodResolver(customerSchema) });

  async function onSubmit(data: CustomerFormData) {
    setServerError(null);
    try {
      const payload = {
        ...data,
        items: items.map((i) => ({
          producto_id: i.producto_id,
          talla: i.talla,
          cantidad: i.cantidad,
        })),
      };
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al crear el pedido');
      clearCart();
      setSuccess({ pedido_id: result.pedido_id, numero_pedido: result.numero_pedido });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  const inputClasses =
    'w-full bg-[#121212] border border-kdb-border text-text-primary px-4 py-3 pl-11 ' +
    'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300 placeholder:text-text-muted rounded-sm';
  const labelClasses = 'block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2';
  const errorClasses = 'mt-1.5 text-xs text-danger flex items-center gap-1 font-medium';

  // --- Estado de éxito ---
  if (success) {
    return (
      <div className="container-kdb py-16 md:py-24 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-kdb-card border border-kdb-border p-8 md:p-12 text-center rounded-sm"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25">
            <CheckCircle2 className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-gold-gradient mb-2 tracking-wider">
            ¡PEDIDO RECIBIDO!
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Tu pedido fue registrado exitosamente. En breve te contactamos para confirmar.
          </p>
          <div className="bg-[#121212] border border-kdb-border p-4 mb-6 inline-block rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1 font-bold">Número de pedido</p>
            <p className="font-[family-name:var(--font-bebas-neue)] text-2xl text-gold tracking-widest">
              {success.numero_pedido}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={`/pedidos/${success.pedido_id}`}
              className="inline-flex items-center justify-center gap-2 bg-gold text-black px-6 py-3 font-semibold text-sm tracking-wide hover:bg-gold-light transition-colors rounded-sm"
            >
              <Package className="w-4 h-4" /> SEGUIR MI PEDIDO
            </Link>
            <a
              href={getWhatsAppLink(`Hola! Acabo de hacer el pedido ${success.numero_pedido}. Quiero confirmar mi orden.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gold text-gold px-6 py-3 font-semibold text-sm tracking-wide hover:bg-gold/10 transition-colors rounded-sm"
            >
              CONFIRMAR POR WHATSAPP 📱
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Carrito vacío ---
  if (hydrated && items.length === 0) {
    return (
      <div className="container-kdb py-20 md:py-28 text-center">
        <ShoppingBag className="w-14 h-14 text-text-muted mx-auto mb-6" />
        <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-text-primary tracking-wide mb-2">
          TU CARRITO ESTÁ VACÍO
        </h1>
        <p className="text-text-secondary mb-8 text-sm">
          Agrega productos del catálogo para empezar tu pedido.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 bg-gold text-black px-6 py-3 font-semibold text-sm tracking-wide hover:bg-gold-light transition-colors rounded-sm"
        >
          EXPLORAR CATÁLOGO <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="container-kdb py-32 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
      </div>
    );
  }

  return (
    <div className="container-kdb py-10 md:py-14">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl md:text-5xl text-text-primary tracking-wide mb-2">
        {checkout ? 'FINALIZAR PEDIDO' : 'TU CARRITO'}
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        {totalItems} producto{totalItems !== 1 ? 's' : ''} en el carrito
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda: ítems o formulario */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {!checkout
              ? items.map((item) => (
                  <motion.div
                    key={`${item.producto_id}-${item.talla}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-kdb-card border border-kdb-border rounded-sm p-3 md:p-4"
                  >
                    <Link
                      href={`/producto/${item.slug}`}
                      className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-kdb-elevated rounded-sm overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/producto/${item.slug}`}
                            className="text-sm md:text-base font-semibold text-text-primary hover:text-gold transition-colors line-clamp-2"
                          >
                            {item.nombre}
                          </Link>
                          <p className="text-xs text-text-secondary mt-1">
                            {item.talla ? `Talla: ${item.talla}` : 'Talla única'}
                            {item.es_pedido && <span className="text-gold"> · Por pedido</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.producto_id, item.talla)}
                          aria-label="Eliminar"
                          className="text-text-muted hover:text-danger transition-colors shrink-0 h-fit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-kdb-border rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.producto_id, item.talla, item.cantidad - 1)}
                            className="p-1.5 text-text-secondary hover:text-gold transition-colors"
                            aria-label="Reducir"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm text-text-primary">{item.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(item.producto_id, item.talla, item.cantidad + 1)}
                            className="p-1.5 text-text-secondary hover:text-gold transition-colors"
                            aria-label="Aumentar"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm md:text-base font-[family-name:var(--font-bebas-neue)] text-gold tracking-wide">
                          {formatPrice(item.precio * item.cantidad)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              : null}
          </AnimatePresence>

          {/* Formulario de checkout */}
          {checkout && (
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="bg-danger/10 border border-danger/20 text-danger p-4 text-sm flex items-start gap-2 rounded-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <div>
                <label className={labelClasses}>Nombre Completo *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted"><User className="w-5 h-5" /></span>
                  <input type="text" placeholder="Ej: Juan Pérez" className={inputClasses} {...register('cliente_nombre')} />
                </div>
                {errors.cliente_nombre && <p className={errorClasses}><AlertCircle className="w-3.5 h-3.5" />{errors.cliente_nombre.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>WhatsApp *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted"><Phone className="w-5 h-5" /></span>
                    <input type="tel" placeholder="999888777" className={inputClasses} {...register('cliente_whatsapp')} />
                  </div>
                  {errors.cliente_whatsapp && <p className={errorClasses}><AlertCircle className="w-3.5 h-3.5" />{errors.cliente_whatsapp.message}</p>}
                </div>
                <div>
                  <label className={labelClasses}>Email *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted"><Mail className="w-5 h-5" /></span>
                    <input type="email" placeholder="juan@gmail.com" className={inputClasses} {...register('cliente_email')} />
                  </div>
                  {errors.cliente_email && <p className={errorClasses}><AlertCircle className="w-3.5 h-3.5" />{errors.cliente_email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Dirección de entrega (Opcional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted"><MapPin className="w-5 h-5" /></span>
                    <input type="text" placeholder="Dirección completa" className={inputClasses} {...register('cliente_direccion')} />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Ciudad (Opcional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted"><Building2 className="w-5 h-5" /></span>
                    <input type="text" placeholder="Ej: Lima" className={inputClasses} {...register('cliente_ciudad')} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Notas adicionales (Opcional)</label>
                <div className="relative">
                  <span className="absolute top-3 left-3.5 text-text-muted"><FileText className="w-5 h-5" /></span>
                  <textarea rows={2} placeholder="Horario de entrega, referencias, etc." className={`${inputClasses} resize-none`} {...register('notas')} />
                </div>
              </div>
            </form>
          )}

          {/* Navegación */}
          <div className="pt-2">
            {!checkout ? (
              <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors">
                <ArrowLeft className="w-4 h-4" /> Seguir comprando
              </Link>
            ) : (
              <button
                onClick={() => setCheckout(false)}
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al carrito
              </button>
            )}
          </div>
        </div>

        {/* Columna derecha: resumen */}
        <div className="lg:col-span-1">
          <div className="bg-kdb-card border border-kdb-border rounded-sm p-6 lg:sticky lg:top-24 space-y-4">
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl text-text-primary tracking-wider uppercase border-b border-kdb-border pb-3">
              Resumen
            </h2>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal ({totalItems})</span>
              <span className="text-text-primary">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Envío</span>
              <span className="text-text-muted">Coordinado por WhatsApp</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-kdb-border pt-4">
              <span className="text-sm font-semibold text-text-primary uppercase tracking-wider">Total</span>
              <span className="font-[family-name:var(--font-bebas-neue)] text-2xl text-gold">{formatPrice(subtotal)}</span>
            </div>

            {!checkout ? (
              <button
                onClick={() => setCheckout(true)}
                className="w-full flex items-center justify-center gap-2 bg-gold text-black font-semibold text-sm tracking-wide uppercase py-3.5 rounded-sm hover:bg-gold-light transition-colors"
              >
                Proceder al pedido <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gold text-black font-semibold text-sm tracking-wide uppercase py-3.5 rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                ) : (
                  <>Confirmar pedido</>
                )}
              </button>
            )}

            <p className="text-[11px] text-text-muted text-center leading-relaxed">
              Sin pago en línea. Coordinamos el pago (Yape, Plin, transferencia) y la entrega por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
