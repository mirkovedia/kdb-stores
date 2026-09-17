interface TrustItem {
  title: string;
  desc: string;
}

/*
  Señales de confianza. Cada una tiene que ser literalmente cierta: son
  promesas públicas, no copy de relleno. Si alguna deja de aplicar, se saca
  de acá antes que reescribirla en algo vago.
*/
const ITEMS: TrustItem[] = [
  {
    title: 'Originales garantizados',
    desc: 'Compramos en tiendas oficiales y distribuidores autorizados de Nueva York y Lima. Sin reventa de por medio.',
  },
  {
    title: 'Pago contra entrega',
    desc: 'Pagás cuando recibís tu pedido. También coordinamos por Yape, Plin o transferencia.',
  },
  {
    title: 'Envíos a todo el Perú',
    desc: 'Coordinamos el envío a cualquier ciudad y te avisamos por WhatsApp en cada paso.',
  },
  {
    title: 'Showroom en Lima',
    desc: 'Podés ver los productos en persona antes de comprar. Visitas con cita previa.',
  },
];

/**
 * Franja de confianza. Va después de los productos: primero el cliente ve
 * qué vendemos, después por qué comprarnos a nosotros.
 *
 * Queda sobre blanco con un borde superior: la sección que sigue
 * (HowItWorks) ya usa fondo gris, así que pintarla gris también fundiría las
 * dos en un solo bloque sin separación.
 */
export function TrustStrip() {
  return (
    <section className="mt-6 border-t border-line md:mt-10">
      <div className="container-kdb section-y">
        <dl className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {ITEMS.map((item) => (
            <div key={item.title} className="border-t border-ink pt-5">
              <dt className="text-product text-ink">{item.title}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.desc}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
