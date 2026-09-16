'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pedidoSchema, type PedidoFormData } from '@/lib/validations';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { CustomerFields } from '@/components/pedidos/CustomerFields';
import { OrderSuccess } from '@/components/pedidos/OrderSuccess';
import type { Producto } from '@/types';

interface OrderFormProps {
  product: Producto;
  selectedSize: string;
}

interface OrderSuccessData {
  pedido_id: string;
  numero_pedido: string;
}

export function OrderForm({ product, selectedSize }: OrderFormProps) {
  const [success, setSuccess] = useState<OrderSuccessData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      producto_id: product.id,
      talla: selectedSize || '',
      cantidad: 1,
    },
  });

  // La talla se elige fuera de este formulario (SizeSelector del panel).
  useEffect(() => {
    setValue('talla', selectedSize, { shouldValidate: Boolean(selectedSize) });
  }, [selectedSize, setValue]);

  useEffect(() => {
    setValue('producto_id', product.id);
  }, [product.id, setValue]);

  async function onSubmit(data: PedidoFormData) {
    setServerError(null);
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el pedido');
      }

      setSuccess({
        pedido_id: result.pedido_id,
        numero_pedido: result.numero_pedido,
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  if (success) {
    return (
      <OrderSuccess
        pedidoId={success.pedido_id}
        numeroPedido={success.numero_pedido}
        productoNombre={product.nombre}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <p role="alert" className="border-l-2 border-danger pl-4 text-sm text-danger">
          {serverError}
        </p>
      )}

      {!selectedSize && (
        <p className="border-l-2 border-ink pl-4 text-sm text-ink-muted">
          Elegí una talla arriba para poder completar el pedido.
        </p>
      )}

      <CustomerFields register={register} errors={errors} />

      {errors.talla && (
        <p role="alert" className="text-xs text-danger">
          {errors.talla.message}
        </p>
      )}

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !selectedSize}
          className="btn-solid h-14 w-full"
        >
          {isSubmitting
            ? 'Procesando…'
            : `Hacer pedido — ${formatPrice(product.precio)}`}
        </button>

        <a
          href={getWhatsAppLink(
            `Hola, me interesa ${product.nombre}${selectedSize ? ` en talla ${selectedSize}` : ''}. Quisiera más información.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center border border-ink text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-ink-inverse"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </form>
  );
}
