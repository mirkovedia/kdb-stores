import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductGallery } from '@/components/producto/ProductGallery';
import { ProductPurchasePanel } from '@/components/producto/ProductPurchasePanel';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
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
      <div className="container-kdb py-28 text-center">
        <h2 className="text-section text-ink">Producto no encontrado</h2>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
          El producto que buscás no existe o fue retirado del catálogo.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/catalogo" variant="primary" size="md">
            Volver al catálogo
          </Button>
        </div>
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
        {/* Ruta de navegación */}
        <nav
          aria-label="Ruta de navegación"
          className="scrollbar-none mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-ink-subtle"
        >
          <Link href="/" className="transition-colors hover:text-ink">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/catalogo" className="transition-colors hover:text-ink">
            Catálogo
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink-muted">{product.nombre}</span>
        </nav>

        {/* Galería + compra */}
        <div className="mb-24 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery imagenes={product.imagenes} nombre={product.nombre} />
          </div>

          <div className="lg:col-span-5">
            <ProductPurchasePanel product={product} />
          </div>
        </div>

        {/* Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-line pt-16 md:pt-20">
            <SectionTitle title="También te puede interesar" align="center" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
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
