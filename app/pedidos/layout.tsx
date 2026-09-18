import type { Metadata } from 'next';

/*
  A diferencia del carrito, esta sí se indexa: es una página de servicio
  —el pedido por encargo— y es contenido que conviene que se encuentre.
  El seguimiento individual en /pedidos/[id] queda fuera del sitemap por
  llevar datos de un cliente concreto.
*/
export const metadata: Metadata = {
  title: 'Hacer un pedido',
  description:
    '¿No encontrás tu talla o buscás un modelo exclusivo? Importamos sneakers y streetwear originales desde Nueva York y Lima. Entrega en 2 a 3 semanas.',
  alternates: { canonical: '/pedidos' },
  openGraph: {
    title: 'Hacer un pedido | KDB Stores',
    description:
      'Importamos el modelo que buscás desde Nueva York y Lima. Sin crear cuenta.',
    url: '/pedidos',
    type: 'website',
  },
};

export default function PedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
