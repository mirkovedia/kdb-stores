'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  imagenes: string[];
  nombre: string;
}

/*
  Galería con dos comportamientos distintos según el ancho:

  - Desktop: las imágenes se apilan en vertical y se recorren con scroll.
    Es lo que hacen las tiendas de ropa del rubro, porque muestra todas las
    vistas sin un solo clic y cada foto se ve grande.
  - Móvil: una imagen principal con miniaturas, ya que ahí el scroll vertical
    largo sí estorba.
*/
export function ProductGallery({ imagenes, nombre }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = imagenes.length > 0 ? imagenes : [];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-surface-muted">
        <span className="text-eyebrow text-ink-subtle">Sin imagen</span>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: pila vertical */}
      <div className="hidden flex-col gap-4 md:flex">
        {images.map((img, index) => (
          <div key={img} className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
            <Image
              src={img}
              alt={`${nombre} — vista ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority={index === 0}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Móvil: principal + miniaturas */}
      <div className="md:hidden">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
          <Image
            src={images[selectedIndex]}
            alt={`${nombre} — vista ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>

        {images.length > 1 && (
          <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={selectedIndex === index}
                className={cn(
                  'relative aspect-square w-16 shrink-0 overflow-hidden border bg-surface-muted transition-colors',
                  selectedIndex === index ? 'border-ink' : 'border-transparent',
                )}
              >
                <Image
                  src={img}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
