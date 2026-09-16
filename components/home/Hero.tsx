import Image from 'next/image';
import Link from 'next/link';

/**
 * Imagen de portada. Cambiarla es cambiar esta constante: el resto del hero
 * (encuadre, degradados y posición del texto) funciona con cualquier foto que
 * tenga el sujeto en la mitad superior y una zona más oscura abajo.
 */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1760302318631-a8d342cd4951?w=2400&q=85';

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
    <section className="relative flex h-[min(78vh,860px)] min-h-[30rem] items-end overflow-hidden bg-ink">
      {/*
        El encuadre cambia por breakpoint: la foto es vertical y el hero es
        panorámico, así que con un object-center plano en desktop se vería
        solo la franja media y se perderían las estanterías, que son las que
        dan profundidad a la escena.
      */}
      <Image
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_45%] md:object-[center_38%]"
      />

      {/*
        Dos degradados en vez de un velo plano: uno vertical que ancla el
        bloque de texto y otro horizontal que le da base al título aunque la
        foto sea clara justo ahí. La imagen se mantiene limpia en la parte
        superior, que es donde se ve el producto.
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      <div className="container-kdb relative z-10 pb-16 md:pb-24">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-eyebrow text-white/75">Nueva temporada</p>

          <h1 className="text-display mt-5 text-white">
            Kicks
            <br />
            D&apos;Barrio
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/85">
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
              className="inline-flex h-14 items-center justify-center border border-white/60 px-10 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-[2px] transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink"
            >
              Hacer un pedido
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
