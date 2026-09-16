'use client';

import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FilterBar } from '@/components/catalogo/FilterBar';
import { ProductGrid } from '@/components/catalogo/ProductGrid';
import type { ProductFilters } from '@/types';
import { useProducts } from '@/hooks/useProducts';

function CatalogoContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // La URL es la única fuente de verdad de los filtros (compartible / SEO)
  const filters: ProductFilters = {
    categoria: searchParams.get('categoria') || undefined,
    marca: searchParams.get('marca') || undefined,
    talla: searchParams.get('talla') || undefined,
    busqueda: searchParams.get('q') || undefined,
    soloDisponibles: searchParams.get('disponibles') === '1' || undefined,
    ordenar: (searchParams.get('ordenar') as ProductFilters['ordenar']) || undefined,
  };

  const { products, loading } = useProducts(filters);

  const handleChange = useCallback(
    (next: ProductFilters) => {
      const params = new URLSearchParams();
      if (next.categoria) params.set('categoria', next.categoria);
      if (next.marca) params.set('marca', next.marca);
      if (next.talla) params.set('talla', next.talla);
      if (next.busqueda) params.set('q', next.busqueda);
      if (next.soloDisponibles) params.set('disponibles', '1');
      if (next.ordenar && next.ordenar !== 'reciente') params.set('ordenar', next.ordenar);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  return (
    <div className="bg-surface">
      {/* Encabezado */}
      <div className="container-kdb py-12 text-center md:py-16">
        <h1 className="text-section text-ink">Catálogo</h1>
        <p className="mt-4 text-sm text-ink-muted">
          {loading ? (
            'Cargando productos'
          ) : filters.busqueda ? (
            <>
              {products.length} resultado{products.length !== 1 ? 's' : ''} para{' '}
              <span className="text-ink">&quot;{filters.busqueda}&quot;</span>
            </>
          ) : (
            <>
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </>
          )}
        </p>
      </div>

      {/* Filtros */}
      <FilterBar filters={filters} onChange={handleChange} />

      {/* Grilla */}
      <div className="container-kdb py-12 md:py-16">
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="container-kdb py-24 text-center text-sm text-ink-muted">
          Cargando catálogo…
        </div>
      }
    >
      <CatalogoContent />
    </Suspense>
  );
}
