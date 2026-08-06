import { Sparkle } from 'lucide-react';

const ITEMS = [
  '100% Originales',
  'Drops Semanales Supreme',
  'Envíos a todo el Perú',
  'Importado desde NYC',
  'Sneakers & Streetwear',
  'Pagos con Yape / Plin',
];

function TickerContent({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12 shrink-0"
    >
      {ITEMS.map((item) => (
        <span
          key={item}
          className="flex items-center gap-8 md:gap-12 font-[family-name:var(--font-bebas-neue)] text-xl md:text-2xl uppercase tracking-[0.2em] text-gold/90 whitespace-nowrap select-none"
        >
          {item}
          <Sparkle size={14} className="text-gold/40 shrink-0" />
        </span>
      ))}
    </div>
  );
}

export function TickerMarquee() {
  return (
    <section
      aria-label="Beneficios KDB Stores"
      className="marquee-group relative overflow-hidden border-y border-gold/15 bg-kdb-card py-3.5 md:py-4"
    >
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-kdb-card to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-kdb-card to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee">
        <TickerContent />
        <TickerContent ariaHidden />
      </div>
    </section>
  );
}
