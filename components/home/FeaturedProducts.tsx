'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { useProducts } from '@/hooks/useProducts';

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  /** 'destacado' usa los marcados en la BD; 'reciente', los últimos cargados. */
  source?: 'destacado' | 'reciente';
  limit?: number;
}

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

export function FeaturedProducts({
  title = 'Más vendidos',
  subtitle,
  source = 'destacado',
  limit = 4,
}: FeaturedProductsProps) {
  const { products, loading, error } = useProducts();

  const featured = products.filter((p) => p.destacado);
  // Si la BD no tiene destacados marcados, se cae a los primeros del listado.
  const pool =
    source === 'destacado' && featured.length > 0 ? featured : products;
  const displayProducts = pool.slice(0, limit);

  /*
    Degradación elegante: si esta sección falla o no tiene productos, se
    oculta en lugar de dejar un título con una grilla vacía debajo. A
    diferencia del catálogo —donde el error merece explicación y reintento
    porque es el motivo de la visita—, acá es un bloque secundario y no debe
    arruinar la portada.
  */
  if (!loading && (error || displayProducts.length === 0)) {
    return null;
  }

  // La cáscara (título + grilla) es la misma con datos o cargando: solo cambia
  // el contenido de las celdas.
  return (
    <section className="section-y">
      <div className="container-kdb">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          align="center"
          action={{ label: 'Ver todo', href: '/catalogo' }}
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
          {loading
            ? Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)
            : displayProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 4}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
