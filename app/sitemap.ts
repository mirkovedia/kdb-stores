import type { MetadataRoute } from 'next';
import { getProductos } from '@/lib/productos';
import { SITE_URL } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/pedidos`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productos = await getProductos();
    productRoutes = productos.map((p) => ({
      url: `${SITE_URL}/producto/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('sitemap product fetch error:', err);
  }

  return [...staticRoutes, ...productRoutes];
}
