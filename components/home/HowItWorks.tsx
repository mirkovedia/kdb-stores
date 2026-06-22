'use client';

import { motion, Variants } from 'framer-motion';
import { ShoppingBag, FileText, Truck } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getWhatsAppLink } from '@/lib/utils';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Elige tu producto',
    description: 'Navega el catálogo y selecciona tu modelo y talla',
    icon: <ShoppingBag size={28} className="text-gold" />,
  },
  {
    number: '02',
    title: 'Haz tu pedido',
    description: 'Llena el formulario con tus datos. Sin cuenta necesaria',
    icon: <FileText size={28} className="text-gold" />,
  },
  {
    number: '03',
    title: 'Lo traemos para ti',
    description: 'Importamos tu pedido y te avisamos por WhatsApp',
    icon: <Truck size={28} className="text-gold" />,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-kdb-card">
      <div className="container-kdb">
        <SectionTitle
          title="¿CÓMO FUNCIONA?"
          subtitle="En 3 simples pasos tienes tu pedido"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative bg-kdb-card/30 backdrop-blur-md border border-kdb-border p-8 rounded-sm hover:border-gold/30 hover:shadow-glow-gold hover:bg-kdb-card/50 transition-all duration-300 group flex flex-col items-center text-center overflow-hidden"
            >
              {/* Background watermark number */}
              <span className="absolute top-2 right-4 font-[family-name:var(--font-bebas-neue)] text-5xl md:text-6xl text-gold/10 select-none group-hover:text-gold/20 transition-colors duration-300">
                {step.number}
              </span>

              {/* Icon container with float animation */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.3,
                }}
                className="mb-5 p-4 rounded-full bg-gold/5 border border-gold/10 group-hover:bg-gold/10 group-hover:border-gold/20 transition-colors duration-300"
              >
                {step.icon}
              </motion.div>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl md:text-2xl text-text-primary tracking-wider mb-3 group-hover:text-gold transition-colors duration-300">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed max-w-[260px] group-hover:text-text-primary transition-colors duration-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* WhatsApp note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 md:mt-16 text-center"
        >
          <a
            href={getWhatsAppLink('Hola! Me interesa hacer un pedido 🔥')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors text-sm"
          >
            <span>También puedes escribirnos directo al WhatsApp 📱</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
