import { ProductCard } from './ProductCard';
import type { Producto } from '@/types';

interface ProductGridProps {
  products: Producto[];
  loading: boolean;
  /**
   * Mensaje de error si la petición falló. Distinguirlo del caso "sin
   * resultados" importa: sin esto, una API caída mostraba "No encontramos
   * productos" y el cliente creía que la tienda estaba vacía.
   */
  error?: string | null;
  /** Reintenta la carga. Se muestra como acción en el estado de error. */
  onRetry?: () => void;
  /** Cantidad de celdas del esqueleto mientras carga. */
  skeletonCount?: number;
}

/*
  El esqueleto replica exactamente la forma de ProductCard (imagen 4/5 + dos
  líneas centradas). Si no coincide, la grilla "salta" al terminar de cargar.
*/
function SkeletonCard() {
  return (
    <div>
      <div className="aspect-[4/5] skeleton" />
      <div className="flex flex-col items-center gap-2 pt-4">
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-3 w-16" />
      </div>
    </div>
  );
}

const GRID_CLASSES =
  'grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4';

export function ProductGrid({
  products,
  loading,
  error = null,
  onRetry,
  skeletonCount = 8,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={GRID_CLASSES}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /*
    El error se evalúa antes del caso vacío: si la petición falló, no hay que
    afirmar que no existen productos. Son dos situaciones distintas y la
    salida del cliente también.
  */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-line py-28 text-center">
        <h3 className="text-product text-ink">No pudimos cargar el catálogo</h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
          Puede ser un problema momentáneo de conexión. Probá de nuevo en unos
          segundos.
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-solid mt-8 h-11 px-7"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-line py-28 text-center">
        <h3 className="text-product text-ink">No encontramos productos</h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
          Probá ajustando los filtros o buscando con otros términos. Sumamos
          productos nuevos cada semana.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID_CLASSES}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
