'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface CategoryItem {
  name: string;
  slug: string;
  image: string;
}

const categories: CategoryItem[] = [
  {
    name: 'Sneakers',
    slug: 'sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    name: 'Supreme',
    slug: 'supreme',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600',
  },
  {
    name: 'Ropa Gráfica',
    slug: 'ropa-grafica',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600',
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function CategoriesGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-kdb">
        <SectionTitle title="CATEGORÍAS" subtitle="Explora nuestra colección" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={cardVariants}>
              <Link href={`/catalogo?categoria=${category.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-[4/3] overflow-hidden border border-kdb-border hover:border-gold/50 transition-colors duration-300 rounded-sm"
                >
                  {/* Background image */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-300" />

                  {/* Category Name & Action - Glassmorphism card */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-sm flex flex-col items-center justify-center transition-all duration-300 group-hover:border-gold/30 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] max-w-[85%]">
                      <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl md:text-3xl text-white tracking-wider transition-colors duration-300 group-hover:text-gold text-center">
                        {category.name}
                      </h3>
                      
                      {/* Reveal details on hover */}
                      <div className="h-0 opacity-0 group-hover:h-5 group-hover:opacity-100 group-hover:mt-1 transition-all duration-300 overflow-hidden flex items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
                          Explorar
                        </span>
                        <span className="text-[10px] text-gold font-bold transition-transform group-hover:translate-x-0.5 duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom gold accent on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
