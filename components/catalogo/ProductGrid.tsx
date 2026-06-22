'use client';

import { PackageSearch } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Producto } from '@/types';

interface ProductGridProps {
  products: Producto[];
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="border border-kdb-border bg-kdb-card rounded-sm overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-3">
        <div className="h-2 w-16 skeleton rounded-sm" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full skeleton rounded-sm" />
          <div className="h-3.5 w-3/4 skeleton rounded-sm" />
        </div>
        <div className="h-5 w-24 skeleton rounded-sm" />
        <div className="flex gap-1">
          <div className="h-4 w-8 skeleton rounded-sm" />
          <div className="h-4 w-8 skeleton rounded-sm" />
          <div className="h-4 w-8 skeleton rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-text-muted mb-4" strokeWidth={1} />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No se encontraron productos
        </h3>
        <p className="text-sm text-text-secondary max-w-sm">
          Intenta ajustar los filtros o buscar con otros términos. Nuevos drops llegan cada semana.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
