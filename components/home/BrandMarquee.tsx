import Link from 'next/link';

const BRANDS = [
  { name: 'Nike', slug: 'nike' },
  { name: 'Jordan', slug: 'jordan' },
  { name: 'Supreme', slug: 'supreme' },
  { name: 'Bape', slug: 'bape' },
  { name: 'Off-White', slug: 'off-white' },
  { name: 'Adidas', slug: 'adidas' },
];

function BrandsRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex items-center gap-10 md:gap-16 pr-10 md:pr-16 shrink-0"
    >
      {BRANDS.map((brand) => (
        <Link
          key={brand.slug}
          href={`/catalogo?marca=${brand.slug}`}
          tabIndex={ariaHidden ? -1 : undefined}
          className="group/brand flex items-center gap-10 md:gap-16 shrink-0"
        >
          <span className="font-[family-name:var(--font-bebas-neue)] text-6xl md:text-8xl uppercase tracking-wide whitespace-nowrap select-none text-outline-gold transition-all duration-300 group-hover/brand:text-gold group-hover/brand:[-webkit-text-stroke:0px] leading-none">
            {brand.name}
          </span>
          <span className="w-2 h-2 rotate-45 bg-gold/25 shrink-0" />
        </Link>
      ))}
    </div>
  );
}

export function BrandMarquee() {
  return (
    <section
      aria-label="Marcas disponibles"
      className="marquee-group relative overflow-hidden py-10 md:py-14 bg-kdb-bg"
    >
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-kdb-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-kdb-bg to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee-reverse">
        <BrandsRow />
        <BrandsRow ariaHidden />
      </div>
    </section>
  );
}
