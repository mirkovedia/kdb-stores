import Image from 'next/image';
import Link from 'next/link';

/*
  Hero editorial: una imagen a sangre, un título y dos acciones.

  No es h-screen a propósito — deja que la primera fila de productos asome
  por debajo del pliegue, que es lo que comunica "tienda" en vez de "campaña".
  Server Component: no hay parallax, partículas ni estado.

  La altura usa h-[min(78vh,860px)] en lugar de min-h + max-h porque en CSS
  min-height siempre gana sobre max-height: con ese par, el tope de 860px
  nunca se aplicaría en pantallas altas. min() resuelve el límite antes.
*/
export function Hero() {
  return (
    <section className="relative flex h-[min(78vh,860px)] min-h-[30rem] items-end overflow-hidden bg-surface-muted">
      <Image
        src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=2000&q=85"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized
      />

      {/*
        Degradado solo desde abajo: la foto queda limpia arriba y el texto
        conserva contraste donde se apoya.
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="container-kdb relative z-10 pb-14 md:pb-20">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-eyebrow text-white/80">Nueva temporada</p>

          <h1 className="text-display mt-5 text-white">
            Kicks
            <br />
            D&apos;Barrio
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/90">
            Sneakers y streetwear originales, seleccionados uno por uno y
            entregados en todo el Perú.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex h-14 items-center justify-center border border-white bg-white px-10 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-white"
            >
              Ver catálogo
            </Link>
            <Link
              href="/pedidos"
              className="inline-flex h-14 items-center justify-center border border-white/70 px-10 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink"
            >
              Hacer un pedido
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
