'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SizeSelector } from '@/components/producto/SizeSelector';
import { OrderForm } from '@/components/producto/OrderForm';
import { RestockNotify } from '@/components/producto/RestockNotify';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type { Producto } from '@/types';

interface ProductPurchasePanelProps {
  product: Producto;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addItem } = useCart();

  const needsSize = product.tallas_disponibles.length > 0;
  const agotado = !product.es_pedido && product.stock <= 0;
  const hasDiscount =
    product.precio_original !== null && product.precio_original > product.precio;

  // El aviso de "añadido" se limpia solo. Con setTimeout suelto, navegar antes
  // de los 2s dejaba un setState sobre un componente desmontado.
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [added]);

  function handleAddToCart() {
    if (needsSize && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem({
      producto_id: product.id,
      slug: product.slug,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagenes?.[0] ?? null,
      talla: selectedSize,
      cantidad: 1,
      es_pedido: product.es_pedido,
    });
    setAdded(true);
  }

  return (
    // sticky: la galería en desktop es una pila vertical alta, así el panel de
    // compra sigue visible mientras el cliente recorre las fotos.
    <div className="lg:sticky lg:top-28">
      {product.marca && (
        <Link
          href={`/catalogo?marca=${product.marca.slug || product.marca.nombre.toLowerCase()}`}
          className="text-eyebrow link-underline text-ink-muted transition-colors hover:text-ink"
        >
          {product.marca.nombre}
        </Link>
      )}

      <h1 className="text-section mt-4 text-ink">{product.nombre}</h1>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-lg text-ink">{formatPrice(product.precio)}</span>
        {hasDiscount && product.precio_original !== null && (
          <span className="text-sm text-ink-subtle line-through">
            {formatPrice(product.precio_original)}
          </span>
        )}
      </div>

      {product.descripcion && (
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          {product.descripcion}
        </p>
      )}

      {needsSize && (
        <div className="mt-8">
          <h2 className="text-eyebrow mb-4 text-ink">Talla</h2>
          <SizeSelector
            sizes={product.tallas_disponibles}
            selectedSize={selectedSize}
            onSelect={(size) => {
              setSelectedSize(size);
              setSizeError(false);
            }}
          />
        </div>
      )}

      {product.es_pedido && (
        <p className="mt-8 border-l-2 border-ink pl-4 text-sm leading-relaxed text-ink-muted">
          <span className="text-ink">Este producto se importa a pedido.</span>{' '}
          Entrega estimada: 2 a 3 semanas.
        </p>
      )}

      {agotado ? (
        <div className="mt-10">
          <RestockNotify
            productoId={product.id}
            talla={needsSize ? selectedSize : undefined}
          />
        </div>
      ) : (
        <>
          <div className="mt-10">
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-14 w-full border border-ink bg-ink text-xs font-medium uppercase tracking-[0.2em] text-ink-inverse transition-colors hover:bg-ink-muted hover:border-ink-muted"
            >
              {added ? 'Añadido al carrito' : 'Agregar al carrito'}
            </button>

            {sizeError && (
              <p role="alert" className="mt-3 text-xs text-danger">
                Elegí una talla para continuar.
              </p>
            )}

            {added && (
              <Link
                href="/carrito"
                className="text-nav link-underline mt-4 inline-block text-ink-muted transition-colors hover:text-ink"
              >
                Ir al carrito
              </Link>
            )}
          </div>

          {/* Compra directa de este producto, sin pasar por el carrito */}
          <div className="mt-12 border-t border-line pt-10">
            <h2 className="text-eyebrow mb-5 text-ink">
              O pedí solo este producto
            </h2>
            <OrderForm product={product} selectedSize={selectedSize} />
          </div>
        </>
      )}
    </div>
  );
}
