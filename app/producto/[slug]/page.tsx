import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { ProductGallery } from '@/components/producto/ProductGallery';
import { ProductPurchasePanel } from '@/components/producto/ProductPurchasePanel';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { formatPrice } from '@/lib/utils';
import { getProductoBySlug, getProductosRelacionados } from '@/lib/productos';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductoBySlug(slug);

  if (!product) {
    return {
      title: { absolute: 'Producto no encontrado | KDB Stores' },
      description: 'El producto que buscas no existe o fue retirado del catálogo.',
    };
  }

  const title = product.nombre;
  const description =
    product.descripcion ??
    `${product.nombre} disponible en KDB Stores. ${formatPrice(product.precio)}. Originales. Exclusivos. A tu puerta.`;
  const image = product.imagenes?.[0];

  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/producto/${product.slug}`,
      images: image ? [{ url: image, alt: product.nombre }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductoBySlug(slug);

  if (!product) {
    return (
      <div className="container-kdb py-24 text-center">
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-[#F5F5F5] mb-4">
          PRODUCTO NO ENCONTRADO
        </h2>
        <p className="text-text-secondary mb-8">
          El producto que buscas no existe o fue retirado del catálogo.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-3 font-semibold text-sm tracking-wide hover:bg-[#E4C06A] transition-colors rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          VOLVER AL CATÁLOGO
        </Link>
      </div>
    );
  }

  const relatedProducts = await getProductosRelacionados(product);

  // JSON-LD structured data (Schema.org Product) para rich results en Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion ?? undefined,
    image: product.imagenes,
    brand: product.marca
      ? { '@type': 'Brand', name: product.marca.nombre }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: product.precio,
      availability: product.disponible
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-kdb">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-[#A0A0A0] mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4 text-[#555555]" />
          <Link href="/catalogo" className="hover:text-[#C9A84C] transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="w-4 h-4 text-[#555555]" />
          <span className="text-[#F5F5F5] truncate">{product.nombre}</span>
        </nav>

        {/* 2-Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-24">
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery imagenes={product.imagenes} nombre={product.nombre} />
          </div>

          {/* Right: Info + purchase (client) */}
          <div className="lg:col-span-5">
            <ProductPurchasePanel product={product} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#222222] pt-16">
            <SectionTitle
              title="También te puede interesar"
              subtitle="Completa tu outfit con estos recomendados"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
