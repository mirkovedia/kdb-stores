'use client';

import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GoldButton } from '@/components/ui/GoldButton';
import { ProductCard } from '@/components/catalogo/ProductCard';
import type { Producto } from '@/types';
import { useProducts } from '@/hooks/useProducts';



export function FeaturedProducts() {
  const { products, loading } = useProducts();

  const featured = products.filter((p) => p.destacado).slice(0, 4);
  // Si no hay productos destacados específicos en la BD, mostrar los primeros 4 disponibles
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 4);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-kdb-bg">
        <div className="container-kdb">
          <SectionTitle
            title="LO MÁS BUSCADO"
            subtitle="Los modelos más pedidos por la comunidad"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-kdb-card border border-kdb-border aspect-square w-full rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-kdb-bg">
      <div className="container-kdb">
        <SectionTitle
          title="LO MÁS BUSCADO"
          subtitle="Los modelos más pedidos por la comunidad"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-10 md:mt-14">
          <GoldButton href="/catalogo" variant="outline" size="md">
            Ver todo el catálogo
            <ArrowRight size={16} />
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
