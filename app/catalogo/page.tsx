'use client';

import { useState, useMemo } from 'react';
import { FilterBar } from '@/components/catalogo/FilterBar';
import { ProductGrid } from '@/components/catalogo/ProductGrid';
import type { Producto, ProductFilters } from '@/types';
import { PLACEHOLDER_IMAGES } from '@/lib/utils';

import { useProducts } from '@/hooks/useProducts';

export default function CatalogoPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { products, loading } = useProducts(filters);

  return (
    <div className="min-h-screen bg-kdb-bg">
      {/* Header */}
      <div className="container-kdb pt-8 pb-6">
        <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
          CATÁLOGO
        </h1>
        <p className="text-text-secondary mt-2 text-sm">
          {products.length} producto{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Product Grid */}
      <div className="container-kdb py-8">
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
