'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pedidoSchema, type PedidoFormData } from '@/lib/validations';
import { formatPrice } from '@/lib/utils';
import {
  CustomerFields,
  INPUT_CLASSES,
  LABEL_CLASSES,
  ERROR_CLASSES,
} from '@/components/pedidos/CustomerFields';
import { OrderSuccess } from '@/components/pedidos/OrderSuccess';
import type { Producto } from '@/types';

interface OrderSuccessData {
  pedido_id: string;
  numero_pedido: string;
}

export function OrderForm() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [success, setSuccess] = useState<OrderSuccessData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const response = await fetch('/api/productos');
        if (response.ok) {
          const data = await response.json();
          // Solo productos comprables.
          setProducts(data.filter((p: Producto) => p.disponible) || []);
        }
      } catch (err) {
        console.error('Error loading products for order form:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: { cantidad: 1 },
  });

  const watchedProductId = watch('producto_id');

  function handleProductChange(productId: string) {
    const product = products.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
    setValue('producto_id', productId, { shouldValidate: true });
    setValue('talla', '', { shouldValidate: false });
  }

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
        productoNombre={selectedProduct?.nombre}
      />
    );
  }

  const selectClasses = `${INPUT_CLASSES} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8" fill="none" stroke="%236B6B6B" stroke-width="1.5"><path d="M1 1l5 5 5-5"/></svg>')] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat pr-10`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Producto */}
      <fieldset className="space-y-6">
        <legend className="text-eyebrow w-full border-b border-line pb-4 text-ink">
          Producto
        </legend>

        <div>
          <label htmlFor="producto_id" className={LABEL_CLASSES}>
            Producto *
          </label>
          <select
            id="producto_id"
            className={selectClasses}
            onChange={(e) => handleProductChange(e.target.value)}
            value={watchedProductId || ''}
            aria-invalid={Boolean(errors.producto_id)}
            aria-describedby={errors.producto_id ? 'err-producto' : undefined}
          >
            <option value="" disabled>
              {loadingProducts ? 'Cargando productos…' : 'Elegí un producto'}
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nombre} — {formatPrice(product.precio)}
              </option>
            ))}
          </select>
          {errors.producto_id && (
            <p id="err-producto" className={ERROR_CLASSES}>
              {errors.producto_id.message}
            </p>
          )}
        </div>

        {selectedProduct && (
          <div className="flex items-baseline justify-between border-y border-line py-4">
            <div className="min-w-0 pr-4">
              <p className="text-product text-ink">{selectedProduct.nombre}</p>
              {selectedProduct.tallas_disponibles.length > 0 && (
                <p className="mt-2 text-xs text-ink-muted">
                  Tallas: {selectedProduct.tallas_disponibles.join(' · ')}
                </p>
              )}
            </div>
            <p className="text-price shrink-0 text-ink">
              {formatPrice(selectedProduct.precio)}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="talla" className={LABEL_CLASSES}>
            Talla *
          </label>
          <select
            id="talla"
            className={selectClasses}
            disabled={!selectedProduct}
            aria-invalid={Boolean(errors.talla)}
            aria-describedby={errors.talla ? 'err-talla' : undefined}
            {...register('talla')}
          >
            <option value="" disabled>
              {selectedProduct ? 'Elegí tu talla' : 'Primero elegí un producto'}
            </option>
            {selectedProduct?.tallas_disponibles.map((talla) => (
              <option key={talla} value={talla}>
                {talla}
              </option>
            ))}
          </select>
          {errors.talla && (
            <p id="err-talla" className={ERROR_CLASSES}>
              {errors.talla.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Cliente */}
      <fieldset className="space-y-6">
        <legend className="text-eyebrow w-full border-b border-line pb-4 text-ink">
          Tus datos
        </legend>
        <CustomerFields register={register} errors={errors} />
      </fieldset>

      <input type="hidden" {...register('cantidad', { valueAsNumber: true })} />

      {serverError && (
        <p role="alert" className="border-l-2 border-danger pl-4 text-sm text-danger">
          {serverError}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-solid h-14 w-full"
        >
          {isSubmitting ? 'Procesando…' : 'Enviar pedido'}
        </button>

        <p className="mt-5 text-center text-xs leading-relaxed text-ink-subtle">
          Al enviar, aceptás que te contactemos por WhatsApp para confirmar tu
          pedido.
        </p>
      </div>
    </form>
  );
}
