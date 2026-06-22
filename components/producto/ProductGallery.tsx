'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  imagenes: string[];
  nombre: string;
}

export function ProductGallery({ imagenes, nombre }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = imagenes.length > 0 ? imagenes : ['/placeholder.png'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-kdb-elevated border border-kdb-border rounded-sm overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[selectedIndex]}
              alt={`${nombre} - Imagen ${selectedIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
              priority={selectedIndex === 0}
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-text-secondary text-xs px-2 py-1 rounded-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 md:grid md:grid-cols-5 md:overflow-visible">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative aspect-square min-w-[64px] w-16 md:w-full border rounded-sm overflow-hidden transition-all duration-200 flex-shrink-0',
                selectedIndex === index
                  ? 'border-gold shadow-gold'
                  : 'border-kdb-border hover:border-gold/50 opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={img}
                alt={`${nombre} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
