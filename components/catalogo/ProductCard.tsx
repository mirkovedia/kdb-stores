import Image from 'next/image';
import Link from 'next/link';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { cn, formatPrice } from '@/lib/utils';
import type { Producto } from '@/types';

interface ProductCardProps {
  product: Producto;
  /** Prioriza la carga de imagen en las primeras celdas visibles. */
  priority?: boolean;
}

/*
  Tarjeta de producto: imagen sobre gris claro + nombre + precio.

  No lleva borde, fondo de tarjeta ni sombra a propósito. El rectángulo gris
  de la imagen es lo que alinea visualmente la grilla, así que dibujar además
  un borde duplica el límite y ensucia. Es el patrón de Kraniet y Balboni.

  Sin 'use client': el crossfade de la segunda imagen es CSS (group-hover),
  así la grilla completa se sirve como Server Components.
*/
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasDiscount =
    product.precio_original !== null && product.precio_original > product.precio;
  const [primaryImage, secondImage] = product.imagenes;
  const isSoldOut = !product.disponible;

  // Prioridad del badge: agotado > oferta > por pedido. Nunca más de uno.
  const badge: BadgeVariant | null = isSoldOut
    ? 'agotado'
    : hasDiscount
      ? 'oferta'
      : product.es_pedido
        ? 'pedido'
        : null;

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
        {/*
          Las imágenes van en escala de grises y recuperan el color en hover.

          El filtro envuelve solo las imágenes —no el contenedor entero— para
          que el badge conserve su color: el rojo de "Agotado" es una señal, y
          en grises dejaría de leerse como advertencia.

          Y va en un div padre en lugar de en cada <Image> porque la card
          superpone dos para el crossfade: así el navegador resuelve una sola
          capa en vez de dos.
        */}
        {primaryImage ? (
          <div className="absolute inset-0 grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0">
            <Image
              src={primaryImage}
              alt={product.nombre}
              fill
              priority={priority}
              className={cn(
                'object-cover transition-opacity duration-300 ease-out',
                secondImage && 'group-hover:opacity-0',
                isSoldOut && 'opacity-60',
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />

            {secondImage && (
              <Image
                src={secondImage}
                alt=""
                aria-hidden="true"
                fill
                className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
              />
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-eyebrow text-ink-subtle">Sin imagen</span>
          </div>
        )}

        {/* Un solo badge por card: agotado manda sobre los demás. */}
        {badge && <Badge variant={badge} className="absolute left-3 top-3" />}
      </div>

      {/* Información: solo nombre y precio. Las tallas viven en la ficha. */}
      <div className="flex flex-col items-center gap-1.5 px-2 pb-2 pt-4 text-center">
        <h3 className="text-product text-ink">{product.nombre}</h3>

        <div className="flex items-baseline justify-center gap-2">
          <span className="text-price text-ink">{formatPrice(product.precio)}</span>
          {hasDiscount && product.precio_original !== null && (
            <span className="text-price text-ink-subtle line-through">
              {formatPrice(product.precio_original)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
