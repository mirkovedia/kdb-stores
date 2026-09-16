'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const customerSchema = z.object({
  cliente_nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cliente_email: z.string().email('Email inválido'),
  cliente_whatsapp: z.string().min(9, 'Número de WhatsApp inválido'),
  cliente_direccion: z.string().optional(),
  cliente_ciudad: z.string().optional(),
  notas: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

/* Estilos compartidos de formulario. */
const INPUT = 'h-12 w-full border border-line bg-surface px-4 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none';
const LABEL = 'text-eyebrow mb-2 block text-ink';
const ERROR = 'mt-2 text-xs text-danger';

export default function CarritoPage() {
  const {
    items,
    subtotal,
    totalItems,
    hydrated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    pedido_id: string;
    numero_pedido: string;
  } | null>(null);

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
      setSuccess({
        pedido_id: result.pedido_id,
        numero_pedido: result.numero_pedido,
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  // --- Pedido creado ---
  if (success) {
    return (
      <div className="container-kdb py-20 md:py-28">
        <div className="mx-auto max-w-md text-center">
          <p className="text-eyebrow text-ink-muted">Pedido recibido</p>
          <h1 className="text-section mt-5 text-ink">Gracias por tu compra</h1>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            Registramos tu pedido. Te contactamos en breve para confirmar el
            pago y la entrega.
          </p>

          <div className="mt-10 border-y border-line py-6">
            <p className="text-eyebrow text-ink-muted">Número de pedido</p>
            <p className="mt-3 text-lg tracking-[0.15em] text-ink">
              {success.numero_pedido}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <Button href={`/pedidos/${success.pedido_id}`} variant="primary" size="lg" fullWidth>
              Seguir mi pedido
            </Button>
            <Button
              href={getWhatsAppLink(
                `Hola, acabo de hacer el pedido ${success.numero_pedido}. Quiero confirmar mi orden.`,
              )}
              variant="outline"
              size="lg"
              external
              fullWidth
            >
              Confirmar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Esperando hidratación del carrito (localStorage) ---
  if (!hydrated) {
    return (
      <div className="container-kdb py-28 text-center text-sm text-ink-muted">
        Cargando carrito…
      </div>
    );
  }

  // --- Carrito vacío ---
  if (items.length === 0) {
    return (
      <div className="container-kdb py-20 text-center md:py-28">
        <h1 className="text-section text-ink">Tu carrito está vacío</h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
          Agregá productos del catálogo para empezar tu pedido.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/catalogo" variant="primary" size="md">
            Explorar catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-kdb py-12 md:py-16">
      <div className="text-center">
        <h1 className="text-section text-ink">
          {checkout ? 'Finalizar pedido' : 'Tu carrito'}
        </h1>
        <p className="mt-4 text-sm text-ink-muted">
          {totalItems} producto{totalItems !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
        {/* Ítems o formulario */}
        <div className="lg:col-span-2">
          {!checkout ? (
            <ul className="border-t border-line">
              {items.map((item) => (
                <li
                  key={`${item.producto_id}-${item.talla}`}
                  className="flex gap-5 border-b border-line py-6"
                >
                  <Link
                    href={`/producto/${item.slug}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden bg-surface-muted"
                  >
                    {item.imagen && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/producto/${item.slug}`}
                          className="text-product text-ink transition-opacity hover:opacity-60"
                        >
                          {item.nombre}
                        </Link>
                        <p className="mt-2 text-xs text-ink-muted">
                          {item.talla ? `Talla ${item.talla}` : 'Talla única'}
                          {item.es_pedido && ' · Por pedido'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.producto_id, item.talla)}
                        aria-label={`Eliminar ${item.nombre}`}
                        className="h-fit shrink-0 text-ink-subtle transition-colors hover:text-danger"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.producto_id, item.talla, item.cantidad - 1)
                          }
                          aria-label="Reducir cantidad"
                          className="p-2.5 text-ink-muted transition-colors hover:text-ink"
                        >
                          <Minus size={13} strokeWidth={1.5} />
                        </button>
                        <span className="w-9 text-center text-sm text-ink">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.producto_id, item.talla, item.cantidad + 1)
                          }
                          aria-label="Aumentar cantidad"
                          className="p-2.5 text-ink-muted transition-colors hover:text-ink"
                        >
                          <Plus size={13} strokeWidth={1.5} />
                        </button>
                      </div>

                      <span className="text-price text-ink">
                        {formatPrice(item.precio * item.cantidad)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {serverError && (
                <p role="alert" className="border-l-2 border-danger pl-4 text-sm text-danger">
                  {serverError}
                </p>
              )}

              <div>
                <label htmlFor="cliente_nombre" className={LABEL}>
                  Nombre completo *
                </label>
                <input
                  id="cliente_nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  className={INPUT}
                  aria-invalid={Boolean(errors.cliente_nombre)}
                  aria-describedby={errors.cliente_nombre ? 'error-nombre' : undefined}
                  {...register('cliente_nombre')}
                />
                {errors.cliente_nombre && (
                  <p id="error-nombre" className={ERROR}>
                    {errors.cliente_nombre.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="cliente_whatsapp" className={LABEL}>
                    WhatsApp *
                  </label>
                  <input
                    id="cliente_whatsapp"
                    type="tel"
                    placeholder="999888777"
                    className={INPUT}
                    aria-invalid={Boolean(errors.cliente_whatsapp)}
                    aria-describedby={errors.cliente_whatsapp ? 'error-whatsapp' : undefined}
                    {...register('cliente_whatsapp')}
                  />
                  {errors.cliente_whatsapp && (
                    <p id="error-whatsapp" className={ERROR}>
                      {errors.cliente_whatsapp.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cliente_email" className={LABEL}>
                    Email *
                  </label>
                  <input
                    id="cliente_email"
                    type="email"
                    placeholder="juan@gmail.com"
                    className={INPUT}
                    aria-invalid={Boolean(errors.cliente_email)}
                    aria-describedby={errors.cliente_email ? 'error-email' : undefined}
                    {...register('cliente_email')}
                  />
                  {errors.cliente_email && (
                    <p id="error-email" className={ERROR}>
                      {errors.cliente_email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="cliente_direccion" className={LABEL}>
                    Dirección de entrega
                  </label>
                  <input
                    id="cliente_direccion"
                    type="text"
                    placeholder="Dirección completa"
                    className={INPUT}
                    {...register('cliente_direccion')}
                  />
                </div>

                <div>
                  <label htmlFor="cliente_ciudad" className={LABEL}>
                    Ciudad
                  </label>
                  <input
                    id="cliente_ciudad"
                    type="text"
                    placeholder="Lima"
                    className={INPUT}
                    {...register('cliente_ciudad')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notas" className={LABEL}>
                  Notas adicionales
                </label>
                <textarea
                  id="notas"
                  rows={3}
                  placeholder="Horario de entrega, referencias, etc."
                  className="w-full resize-none border border-line bg-surface px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                  {...register('notas')}
                />
              </div>
            </form>
          )}

          <div className="mt-8">
            {!checkout ? (
              <Link
                href="/catalogo"
                className="text-nav link-underline text-ink-muted transition-colors hover:text-ink"
              >
                Seguir comprando
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setCheckout(false)}
                className="text-nav link-underline text-ink-muted transition-colors hover:text-ink"
              >
                Volver al carrito
              </button>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="border border-line p-7 lg:sticky lg:top-28">
            <h2 className="text-eyebrow border-b border-line pb-4 text-ink">
              Resumen
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Subtotal ({totalItems})</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Envío</span>
                <span className="text-ink-subtle">A coordinar</span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
              <span className="text-eyebrow text-ink">Total</span>
              <span className="text-lg text-ink">{formatPrice(subtotal)}</span>
            </div>

            <div className="mt-7">
              {!checkout ? (
                <Button
                  onClick={() => setCheckout(true)}
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  Proceder al pedido
                </Button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="btn-solid h-14 w-full"
                >
                  {isSubmitting ? 'Procesando…' : 'Confirmar pedido'}
                </button>
              )}
            </div>

            <p className="mt-5 text-center text-xs leading-relaxed text-ink-subtle">
              Sin pago en línea. Coordinamos el pago (Yape, Plin, transferencia)
              y la entrega por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
