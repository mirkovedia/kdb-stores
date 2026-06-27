'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, AlertCircle } from 'lucide-react';
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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addItem } = useCart();

  const needsSize = product.tallas_disponibles.length > 0;
  const agotado = !product.es_pedido && product.stock <= 0;

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
    setTimeout(() => setAdded(false), 2000);
  }

  const hasDiscount =
    product.precio_original != null && product.precio_original > product.precio;

  return (
    <div className="flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          {/* Brand */}
          {product.marca && (
            <Link
              href={`/catalogo?marca=${product.marca.slug || product.marca.nombre.toLowerCase()}`}
              className="text-[#C9A84C] text-sm font-semibold tracking-wider hover:underline uppercase"
            >
              {product.marca.nombre}
            </Link>
          )}
          {/* Product Name */}
          <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl md:text-5xl text-[#F5F5F5] tracking-wide mt-1">
            {product.nombre}
          </h1>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-[family-name:var(--font-bebas-neue)] text-3xl md:text-4xl text-[#C9A84C]">
            {formatPrice(product.precio)}
          </span>
          {hasDiscount && (
            <span className="text-[#555555] line-through text-lg">
              {formatPrice(product.precio_original!)}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed">
          {product.descripcion}
        </p>

        {/* Size Selector */}
        {product.tallas_disponibles.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[#F5F5F5] uppercase tracking-wider mb-3">
              Tallas Disponibles
            </h3>
            <SizeSelector
              sizes={product.tallas_disponibles}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>
        )}

        {/* es_pedido warning */}
        {product.es_pedido && (
          <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 p-4 rounded-sm">
            <p className="text-xs md:text-sm text-[#E4C06A] leading-relaxed">
              📦 <strong>Este producto se importa a pedido.</strong> Tiempo
              estimado de entrega: 2 a 3 semanas. Ideal si buscas un modelo
              exclusivo.
            </p>
          </div>
        )}
      </div>

      {/* Producto agotado: aviso de restock en lugar del flujo de compra */}
      {agotado ? (
        <div className="mt-8">
          <RestockNotify productoId={product.id} talla={needsSize ? selectedSize : undefined} />
        </div>
      ) : (
        <>
      {/* Add to cart */}
      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 border border-gold text-gold font-semibold text-sm tracking-wide uppercase py-3.5 rounded-sm hover:bg-gold/10 transition-colors"
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Añadido al carrito
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Agregar al carrito
            </>
          )}
        </button>
        {sizeError && (
          <p className="text-xs text-danger flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Selecciona una talla para agregar al carrito.
          </p>
        )}
        {added && (
          <Link
            href="/carrito"
            className="block text-center text-xs text-text-secondary hover:text-gold transition-colors"
          >
            Ir al carrito →
          </Link>
        )}
      </div>

      {/* Direct order form (compra inmediata de este producto) */}
      <div className="mt-8 border-t border-[#222222] pt-8">
        <p className="text-xs text-text-muted uppercase tracking-widest mb-4">
          O compra solo este producto ahora
        </p>
        <OrderForm product={product} selectedSize={selectedSize} />
      </div>
        </>
      )}
    </div>
  );
}
