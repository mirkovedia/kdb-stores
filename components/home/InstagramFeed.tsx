'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Instagram } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GoldButton } from '@/components/ui/GoldButton';
import { getInstagramUrl } from '@/lib/utils';

const feedImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
  'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600',
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function InstagramFeed() {
  const instagramUrl = getInstagramUrl();

  return (
    <section className="py-16 md:py-24">
      <div className="container-kdb">
        <SectionTitle
          title="SÍGUENOS @KDB.STORES"
          subtitle="Entérate de los últimos drops y restocks"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
        >
          {feedImages.map((src, index) => (
            <motion.a
              key={index}
              variants={imageVariants}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-sm"
            >
              <Image
                src={src}
                alt={`KDB Stores Instagram post ${index + 1}`}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram
                  size={32}
                  className="text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
                />
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className="flex justify-center mt-10 md:mt-14">
          <GoldButton
            href={instagramUrl}
            variant="outline"
            size="md"
            external
          >
            Ver más en Instagram
            <ArrowRight size={16} />
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
