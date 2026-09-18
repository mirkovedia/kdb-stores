import type { Producto } from '@/types';

interface ProductDetailsProps {
  product: Producto;
}

interface Section {
  title: string;
  /** Párrafos del cuerpo. Se renderizan como <p> separados. */
  body: string[];
  /** Pares dato/valor, para tablas simples como el tallaje. */
  rows?: { label: string; value: string }[];
}

/*
  Textos compartidos por todos los productos: envíos, autenticidad y tallaje
  son iguales para todo el catálogo, así que viven acá en lugar de duplicarse
  por producto en la base de datos.

  Si más adelante hace falta material o composición por producto, el lugar
  correcto es agregar columnas a `productos` y leerlas desde `product`.
*/
const SHIPPING: Section = {
  title: 'Envíos y entrega',
  body: [
    'Coordinamos el envío a cualquier ciudad del Perú y te avisamos por WhatsApp en cada paso del camino.',
    'Podés pagar contra entrega, o por Yape, Plin y transferencia. También podés retirar tu pedido en nuestro showroom de Lima, con cita previa.',
  ],
};

const AUTHENTICITY: Section = {
  title: 'Autenticidad',
  body: [
    'Compramos en tiendas oficiales y distribuidores autorizados de Nueva York y Lima. No trabajamos con mercados de reventa, así que no hay intermediarios entre la marca y vos.',
    'Si tenés dudas sobre un producto antes de comprar, escribinos y te mostramos el detalle que necesites.',
  ],
};

const SIZING: Section = {
  title: 'Guía de tallas',
  body: [
    'Las tallas de calzado están en escala US. Si no estás seguro de la tuya, escribinos con tu talla habitual y te confirmamos la equivalencia antes de hacer el pedido.',
  ],
  rows: [
    { label: 'Calzado', value: 'Escala US — del 35 al 46' },
    { label: 'Ropa', value: 'S, M, L y XL según el modelo' },
    { label: 'Cambios', value: 'Coordinamos el cambio de talla por WhatsApp' },
  ],
};

/**
 * Detalles del producto en secciones plegables.
 *
 * Usa <details>/<summary> nativos en lugar de estado de React: funciona sin
 * JavaScript, el navegador ya resuelve teclado y lectores de pantalla, y el
 * componente se mantiene como Server Component.
 */
export function ProductDetails({ product }: ProductDetailsProps) {
  // "Detalles" se arma con lo que ya se carga desde el admin.
  const description: Section | null = product.descripcion
    ? {
        title: 'Detalles del producto',
        body: [product.descripcion],
        rows: [
          ...(product.marca ? [{ label: 'Marca', value: product.marca.nombre }] : []),
          ...(product.categoria
            ? [{ label: 'Categoría', value: product.categoria.nombre }]
            : []),
          ...(product.tallas_disponibles.length > 0
            ? [
                {
                  label: 'Tallas',
                  value: product.tallas_disponibles.join(' · '),
                },
              ]
            : []),
          {
            label: 'Disponibilidad',
            value: product.es_pedido
              ? 'Por pedido — 2 a 3 semanas'
              : product.stock > 0
                ? 'Stock inmediato'
                : 'Agotado',
          },
        ],
      }
    : null;

  const sections = [description, SIZING, SHIPPING, AUTHENTICITY].filter(
    (s): s is Section => s !== null,
  );

  return (
    <section className="mt-14 border-t border-line">
      <h2 className="sr-only">Información del producto</h2>

      {sections.map((section) => (
        <details key={section.title} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-product text-ink [&::-webkit-details-marker]:hidden">
            {section.title}

            {/*
              Cruz que rota 45° al abrir, en lugar de dos iconos. Un solo
              elemento evita el salto que se ve al intercambiar + por −.
            */}
            <span
              aria-hidden="true"
              className="relative ml-4 h-3 w-3 shrink-0 transition-transform duration-200 group-open:rotate-45"
            >
              <span className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-ink" />
              <span className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-ink" />
            </span>
          </summary>

          <div className="pb-7">
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-prose text-sm leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}

            {section.rows && (
              <dl className="mt-6 border-t border-line">
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:gap-4"
                  >
                    <dt className="text-eyebrow shrink-0 pt-0.5 text-ink-subtle sm:w-36">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </details>
      ))}
    </section>
  );
}
