'use client';

import { motion, Variants } from 'framer-motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GoldButton } from '@/components/ui/GoldButton';
import { getWhatsAppLink } from '@/lib/utils';
import { ShieldCheck, Compass, HelpCircle, Heart, DollarSign, ArrowRight } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const STATS = [
  { value: '3,486', label: 'Seguidores en Instagram', suffix: '🔥' },
  { value: '35+', label: 'Drops Exclusivos', suffix: '⚡' },
  { value: '100%', label: 'Envíos Asegurados a todo el Perú', suffix: '🇵🇪' },
];

const GUARANTEES = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-gold" />,
    title: 'Originales 100%',
    desc: 'Cero imitaciones. Todos nuestros productos provienen de tiendas oficiales y distribuidores autorizados en Nueva York y Lima.',
  },
  {
    icon: <Compass className="w-8 h-8 text-gold" />,
    title: 'Seguimiento en tiempo real',
    desc: 'Mantente al tanto de la importación y entrega de tu pedido a través de nuestro tracker online interactivo.',
  },
  {
    icon: <HelpCircle className="w-8 h-8 text-gold" />,
    title: 'Soporte por WhatsApp',
    desc: 'Coordinación directa y personalizada para asegurar que tu talla y modelo sean los perfectos.',
  },
];

const PAYMENTS = [
  { name: 'Yape / Plin', desc: 'Pago inmediato sin comisiones' },
  { name: 'Transferencias', desc: 'BCP, BBVA, Interbank y Scotiabank' },
  { name: 'Efectivo', desc: 'Disponible previa coordinación para Lima' },
];

export default function NosotrosPage() {
  const whatsappUrl = getWhatsAppLink('Hola KDB! Me gustaría recibir asesoría sobre sus drops e importaciones.');

  return (
    <div className="bg-kdb-bg text-text-primary py-12 md:py-24">
      <div className="container-kdb max-w-5xl mx-auto space-y-20 md:space-y-32">
        
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <motion.span variants={itemVariants} className="text-xs font-semibold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-sm">
            Nuestra Conexión
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="font-[family-name:var(--font-bebas-neue)] text-6xl md:text-8xl tracking-wider text-text-primary uppercase leading-none"
          >
            SOMOS <span className="text-gold-gradient">KDB</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-text-secondary leading-relaxed font-light">
            Importamos desde Nueva York y Lima lo que no consigues en Perú. Somos la conexión directa con el streetwear más exclusivo y los sneakers más limitados de la cultura.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-kdb-card border border-kdb-border p-8 rounded-sm text-center relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="font-[family-name:var(--font-bebas-neue)] text-5xl md:text-6xl text-gold tracking-wide">
                {stat.value} <span className="text-2xl">{stat.suffix}</span>
              </div>
              <p className="text-sm text-text-secondary uppercase tracking-widest mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* History Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <SectionTitle title="Nuestra Historia" subtitle="" />
            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
              KicksD&apos;Barrio nació del amor por la cultura urbana y la frustración de no encontrar lanzamientos exclusivos en el mercado local. Lo que comenzó como una cuenta de Instagram compartiendo drops limitados, se convirtió rápidamente en un hub confiable de importación directa.
            </p>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
              Trabajamos con personal shoppers en Nueva York para rastrear y adquirir lanzamientos de marcas como Supreme, Nike SB, Jordan, Off-White, y Essentials, asegurando autenticidad total en cada producto que viaja a nuestro país.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-kdb-card border border-kdb-border p-8 rounded-sm space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-kdb-border pb-4">
              <Heart className="text-gold w-6 h-6" />
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl text-text-primary uppercase tracking-wider">
                Nuestros Valores
              </h3>
            </div>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li className="flex gap-2">
                <span className="text-gold font-bold">1.</span>
                <span><strong>Autenticidad Absoluta:</strong> Todo es verificado meticulosamente. Cero réplicas.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold font-bold">2.</span>
                <span><strong>Trasparencia:</strong> Te informamos cada movimiento de tu pedido desde NYC a Lima.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold font-bold">3.</span>
                <span><strong>Trato Personal:</strong> No somos una corporación fría; te atendemos de coleccionista a coleccionista.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Guarantees Section */}
        <div className="space-y-12">
          <div className="text-center">
            <SectionTitle title="Nuestras Garantías" subtitle="Compra con total tranquilidad y respaldo" />
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {GUARANTEES.map((g, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-kdb-card border border-kdb-border p-6 rounded-sm space-y-4 hover:border-gold/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-gold/5 border border-gold/15 flex items-center justify-center rounded-sm">
                  {g.icon}
                </div>
                <h4 className="text-lg font-semibold text-text-primary">{g.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{g.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Payment Methods */}
        <div className="bg-kdb-card border border-kdb-border p-8 md:p-12 rounded-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 text-kdb-border pointer-events-none">
            <DollarSign className="w-64 h-64 opacity-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-gold tracking-wide uppercase">
                Medios de Pago
              </h3>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                Facilitamos tus transacciones locales de manera rápida y segura.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PAYMENTS.map((p, idx) => (
                <div key={idx} className="bg-kdb-elevated border border-kdb-border p-4 rounded-sm">
                  <span className="text-xs text-gold font-bold uppercase tracking-widest">{p.name}</span>
                  <p className="text-xs text-text-secondary mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 bg-gradient-to-t from-gold/5 to-transparent border border-gold/10 p-12 rounded-sm"
        >
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl md:text-5xl text-text-primary tracking-wider uppercase">
            ¿Listo para elevar tu estilo?
          </h2>
          <p className="text-text-secondary max-w-md mx-auto text-sm md:text-base">
            Explora nuestro catálogo actual o escríbenos directamente para cotizar ese par que tanto buscas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <GoldButton href="/catalogo" variant="filled" size="lg" className="w-full sm:w-auto rounded-sm">
              EXPLORAR CATÁLOGO <ArrowRight className="w-4 h-4 ml-1" />
            </GoldButton>
            <GoldButton href={whatsappUrl} variant="outline" size="lg" className="w-full sm:w-auto rounded-sm" external>
              PEDIR POR WHATSAPP 📱
            </GoldButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
