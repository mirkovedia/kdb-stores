import type { Metadata } from 'next';

/*
  El carrito no debe indexarse: su contenido es el estado personal de cada
  visitante, así que en un buscador aparecería siempre vacío y sin valor.
  De ahí el robots: index false.
*/
export const metadata: Metadata = {
  title: 'Tu carrito',
  description: 'Revisá los productos de tu pedido antes de confirmarlo.',
  robots: { index: false, follow: true },
};

export default function CarritoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
