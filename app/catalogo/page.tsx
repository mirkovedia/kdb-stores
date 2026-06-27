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
    <div className="min-h-screen bg-kdb-bg">
      {/* Header */}
      <div className="container-kdb pt-8 pb-6">
        <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
          CATÁLOGO
        </h1>
        <p className="text-text-secondary mt-2 text-sm">
          {filters.busqueda ? (
            <>
              {products.length} resultado{products.length !== 1 ? 's' : ''} para{' '}
              <span className="text-gold">&quot;{filters.busqueda}&quot;</span>
            </>
          ) : (
            <>
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </>
          )}
        </p>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onChange={handleChange} />

      {/* Product Grid */}
      <div className="container-kdb py-8">
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="container-kdb py-20 text-text-secondary">Cargando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
