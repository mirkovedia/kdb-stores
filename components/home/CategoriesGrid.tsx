import Image from 'next/image';
import Link from 'next/link';

interface CategoryBanner {
  name: string;
  slug: string;
  image: string;
  caption: string;
}

/*
  Dos banners anchos en lugar de cuatro tiles pequeños: a este tamaño la
  fotografía manda y el bloque lee como editorial de temporada, sin competir
  con la grilla de productos que va debajo.
*/
/*
  Las fotos van en blanco y negro (&sat=-100) para mantener la coherencia con
  el hero: si la portada es monocroma y estos banners son a color, el sistema
  se rompe y el hero parece un accidente.
*/
const BANNERS: CategoryBanner[] = [
  {
    name: 'Sneakers',
    slug: 'sneakers',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=85&sat=-100',
    caption: 'Jordan, Nike y ediciones limitadas',
  },
  {
    name: 'Streetwear',
    slug: 'supreme',
    image:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1400&q=85&sat=-100',
    caption: 'Supreme, hoodies y ropa gráfica',
  },
];

export function CategoriesGrid() {
  return (
    <section className="py-4 md:py-8">
      <div className="container-kdb">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {BANNERS.map((banner) => (
            <Link
              key={banner.slug}
              href={`/catalogo?categoria=${banner.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                <Image
                  src={banner.image}
                  alt={banner.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h3 className="text-section text-white">{banner.name}</h3>
                  <p className="mt-2 text-sm text-white/85">{banner.caption}</p>
                  <span className="text-nav mt-4 inline-block border-b border-white pb-1 text-white">
                    Comprar
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
