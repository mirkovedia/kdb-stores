'use client';

import { motion, Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GoldButton } from '@/components/ui/GoldButton';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background image with Ken Burns effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-100 animate-kenburns"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&q=80')",
        }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90" />

      {/* Ambient radial glow in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gold/10 blur-[100px] md:blur-[180px] rounded-full pointer-events-none z-0" />

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

      {/* Drops badge - top right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute top-24 md:top-28 right-4 md:right-8 z-20"
      >
        <div className="animate-pulse-gold bg-kdb-card/90 backdrop-blur-md border border-gold/30 px-4 py-2 rounded-sm shadow-glow-gold">
          <span className="text-xs md:text-sm text-gold tracking-wider font-semibold">
            🔥 Drops semanales Supreme
          </span>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        {/* Small tagline above title */}
        <motion.p
          variants={itemVariants}
          className="text-text-secondary text-xs md:text-sm uppercase tracking-[0.35em] mb-4 font-semibold"
        >
          Sneakers &amp; Streetwear Premium
        </motion.p>

        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="font-[family-name:var(--font-bebas-neue)] text-7xl md:text-[140px] lg:text-[160px] text-gold-gradient leading-none tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] select-none"
        >
          KICKS D&apos;BARRIO
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-white/95 text-lg md:text-xl tracking-[0.15em] mt-4 md:mt-6 font-medium max-w-lg"
        >
          Originales. Exclusivos. <span className="text-gold font-semibold">A tu puerta.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10"
        >
          <GoldButton
            href="/catalogo"
            variant="filled"
            size="lg"
            className="hover:shadow-[0_0_25px_rgba(201,168,76,0.35)] transition-all duration-300"
          >
            Ver Catálogo
          </GoldButton>
          <GoldButton
            href="/pedidos"
            variant="outline"
            size="lg"
            className="hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300"
          >
            Hacer un Pedido
          </GoldButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-text-muted text-[10px] uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
