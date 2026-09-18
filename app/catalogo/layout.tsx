import type { Metadata } from 'next';

/*
  La metadata vive acá y no en page.tsx porque esa página es Client Component
  (usa searchParams para los filtros) y Next resuelve la metadata en el
  servidor. Un layout de ruta es el lugar idiomático para esto.
*/
export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Sneakers y streetwear originales: Jordan, Nike, Supreme, Bape y más. Filtrá por marca, categoría y talla. Envíos a todo el Perú.',
  alternates: { canonical: '/catalogo' },
  openGraph: {
    title: 'Catálogo | KDB Stores',
    description:
      'Sneakers y streetwear originales, importados y entregados en todo el Perú.',
    url: '/catalogo',
    type: 'website',
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
