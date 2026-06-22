'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductGallery } from '@/components/producto/ProductGallery';
import { SizeSelector } from '@/components/producto/SizeSelector';
import { OrderForm } from '@/components/producto/OrderForm';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { formatPrice, getWhatsAppLink, PLACEHOLDER_IMAGES } from '@/lib/utils';
import type { Producto } from '@/types';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [product, setProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Producto[]>([]);

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/productos?slug=${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        
        // El endpoint devuelve una lista filtrada, por lo que tomamos el primer elemento
        const foundProduct = Array.isArray(data) ? data[0] : data;
        
        if (active) {
          if (foundProduct) {
            setProduct(foundProduct);
            setSelectedSize('');

            // Cargar productos relacionados (misma categoría)
            if (foundProduct.categoria_id) {
              const relRes = await fetch(`/api/productos?categoria=${foundProduct.categoria_id}`);
              if (relRes.ok) {
                const relData = await relRes.json();
                const related = relData
                  .filter((p: Producto) => p.id !== foundProduct.id)
                  .slice(0, 4);
                setRelatedProducts(related);
              }
            }
          } else {
            setProduct(null);
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
        if (active) {
          setProduct(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadProduct();
    }
    
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-kdb py-32 text-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary text-sm">Cargando detalles del producto...</p>
      </div>
    );
  }

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

  const hasDiscount = product.precio_original && product.precio_original > product.precio;

  return (
    <div className="py-8 md:py-12">
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

          {/* Right: Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                {/* Brand */}
                {product.marca && (
                  <Link
                    href={`/catalogo?marca=${product.marca.nombre.toLowerCase()}`}
                    className="text-[#C9A84C] text-sm font-semibold tracking-wider hover:underline uppercase"
                  >
                    {product.marca.nombre}
                  </Link>
                )}
                {/* Product Name */}
                <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl md:text-5xl text-[#F5F5F5] tracking-wide mt-1">
                  {product.nombre}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-bebas-neue)] text-3xl md:text-4xl text-[#C9A84C]">
                  {formatPrice(product.precio)}
                </span>
                {hasDiscount && (
                  <span className="text-[#555555] line-through text-lg">
                    {formatPrice(product.precio_original!)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed">
                {product.descripcion}
              </p>

              {/* Size Selector */}
              <div>
                <h3 className="text-sm font-medium text-[#F5F5F5] uppercase tracking-wider mb-3">
                  Tallas Disponibles
                </h3>
                <SizeSelector
                  sizes={product.tallas_disponibles}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
              </div>

              {/* es_pedido warning */}
              {product.es_pedido && (
                <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 p-4 rounded-sm">
                  <p className="text-xs md:text-sm text-[#E4C06A] leading-relaxed">
                    📦 <strong>Este producto se importa a pedido.</strong> Tiempo estimado de entrega: 2 a 3 semanas. Ideal si buscas un modelo exclusivo.
                  </p>
                </div>
              )}
            </div>

            {/* Order Form */}
            <div className="mt-8 border-t border-[#222222] pt-8">
              <OrderForm product={product} selectedSize={selectedSize} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#222222] pt-16">
            <SectionTitle title="También te puede interesar" subtitle="Completa tu outfit con estos recomendados" />
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
