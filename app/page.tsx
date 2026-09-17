import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { TrustStrip } from '@/components/home/TrustStrip';
import { HowItWorks } from '@/components/home/HowItWorks';

export default function Home() {
  return (
    <>
      <Hero />

      {/* Novedades primero: lo nuevo es el motivo por el que alguien vuelve. */}
      <FeaturedProducts
        title="Novedades"
        subtitle="Lo último que llegó al catálogo."
        source="reciente"
        limit={8}
      />

      <CategoriesGrid />

      <FeaturedProducts
        title="Más vendidos"
        subtitle="Los modelos más pedidos por la comunidad."
        source="destacado"
        limit={4}
      />

      {/* Primero el cliente ve qué vendemos; después, por qué comprarnos. */}
      <TrustStrip />

      <HowItWorks />
    </>
  );
}
