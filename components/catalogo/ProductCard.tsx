'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { Producto } from '@/types';

interface ProductCardProps {
  product: Producto;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount = product.precio_original && product.precio_original > product.precio;
  const secondImage = product.imagenes[1];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/producto/${product.slug}`} className="block group">
        <div
          className={cn(
            'border border-kdb-border bg-kdb-card/50 backdrop-blur-sm rounded-sm overflow-hidden transition-all duration-300',
            isHovered && 'border-gold/50 shadow-glow-gold-lg bg-kdb-card/85'
          )}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-kdb-elevated">
            <Image
              src={product.imagenes[0] || '/placeholder.png'}
              alt={product.nombre}
              fill
              className={cn(
                'object-cover transition-all duration-700 ease-out group-hover:scale-108',
                secondImage && isHovered && 'opacity-0'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              unoptimized
            />

            {/* Segunda imagen: crossfade en hover */}
            {secondImage && (
              <Image
                src={secondImage}
                alt={`${product.nombre} — vista alternativa`}
                fill
                className={cn(
                  'object-cover transition-all duration-700 ease-out group-hover:scale-108',
                  isHovered ? 'opacity-100' : 'opacity-0'
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                unoptimized
              />
            )}

            {/* Destello al pasar el mouse */}
            <span className="shine-sweep" aria-hidden="true" />

            {/* PEDIDO badge */}
            {product.es_pedido && (
              <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md border border-gold/40 text-gold text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-sm select-none">
                Pedido
              </div>
            )}

            {/* AGOTADO badge */}
            {!product.disponible && (
              <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md border border-danger/40 text-danger text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-sm select-none">
                Agotado
              </div>
            )}

            {/* Hover overlay with CTA */}
            <div
              className={cn(
                'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 transition-all duration-300',
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <div className="flex items-center justify-center gap-1.5 bg-gold text-black text-xs uppercase tracking-wider font-bold py-2.5 rounded-sm transition-all duration-300 hover:bg-gold-light hover:shadow-glow-gold">
                <span>Pedir ahora</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 duration-300" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            {/* Brand */}
            {product.marca && (
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold">
                {product.marca.nombre}
              </p>
            )}

            {/* Name */}
            <h3 className="text-sm font-semibold text-text-primary leading-tight line-clamp-2 font-[family-name:var(--font-inter)] group-hover:text-gold transition-colors duration-200">
              {product.nombre}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xl text-gold font-[family-name:var(--font-bebas-neue)] tracking-wider">
                {formatPrice(product.precio)}
              </span>
              {hasDiscount && product.precio_original && (
                <span className="text-xs text-text-muted line-through">
                  {formatPrice(product.precio_original)}
                </span>
              )}
            </div>

            {/* Available sizes */}
            {product.tallas_disponibles.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1.5">
                {product.tallas_disponibles.slice(0, 5).map((talla) => (
                  <span
                    key={talla}
                    className="text-[9px] px-1.5 py-0.5 border border-kdb-border/80 text-text-secondary bg-kdb-bg/30 rounded-sm font-medium"
                  >
                    {talla}
                  </span>
                ))}
                {product.tallas_disponibles.length > 5 && (
                  <span className="text-[9px] px-1.5 py-0.5 text-text-muted font-medium">
                    +{product.tallas_disponibles.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
