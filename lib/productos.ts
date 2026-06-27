import type { Producto } from '@/types';
import { PLACEHOLDER_IMAGES } from '@/lib/utils';
import { createPublicClient } from '@/lib/supabase/public';

const UUID_RE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export interface ProductoQuery {
  slug?: string;
  categoria?: string;
  marca?: string;
  talla?: string;
  disponible?: boolean;
  ordenar?: string;
  busqueda?: string;
}

export const MOCK_PRODUCTS: Producto[] = [
  {
    id: '1a7b8c9d-e1f2-3456-abcd-111111111111',
    nombre: 'Nike Dunk Low Retro Panda',
    slug: 'nike-dunk-low-retro-panda',
    descripcion: 'El clásico colorway blanco y negro que domina las calles. Cuero premium con amortiguación Nike clásica.',
    precio: 450,
    precio_original: 550,
    categoria_id: 'sneakers',
    marca_id: 'nike',
    imagenes: [PLACEHOLDER_IMAGES[0]],
    tallas_disponibles: ['38', '39', '40', '41', '42', '43'],
    es_pedido: false,
    disponible: true,
    destacado: true,
    stock: 3,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
    categoria: { id: 'sneakers', nombre: 'Sneakers', slug: 'sneakers', descripcion: null, imagen_url: null, orden: 1, created_at: '' },
    marca: { id: 'nike', nombre: 'Nike', slug: 'nike', logo_url: null, created_at: '' },
  },
  {
    id: '2b7c8d9e-f2a3-4567-bcde-222222222222',
    nombre: 'Jordan 4 Retro Military Black',
    slug: 'jordan-4-retro-military-black',
    descripcion: 'Icónico Jordan 4 en colorway Military Black. Parte superior en cuero premium con detalles texturizados.',
    precio: 890,
    precio_original: null,
    categoria_id: 'sneakers',
    marca_id: 'jordan',
    imagenes: [PLACEHOLDER_IMAGES[1]],
    tallas_disponibles: ['40', '41', '42', '43', '44'],
    es_pedido: true,
    disponible: true,
    destacado: true,
    stock: 0,
    created_at: '2026-06-02T00:00:00Z',
    updated_at: '2026-06-02T00:00:00Z',
    categoria: { id: 'sneakers', nombre: 'Sneakers', slug: 'sneakers', descripcion: null, imagen_url: null, orden: 1, created_at: '' },
    marca: { id: 'jordan', nombre: 'Jordan', slug: 'jordan', logo_url: null, created_at: '' },
  },
  {
    id: '3c8d9e0f-a3b4-5678-cdef-333333333333',
    nombre: 'Supreme Box Logo Hoodie FW24',
    slug: 'supreme-box-logo-hoodie-fw24',
    descripcion: 'El hoodie más codiciado del streetwear. Box Logo bordado sobre algodón heavyweight 450 GSM.',
    precio: 1200,
    precio_original: null,
    categoria_id: 'supreme',
    marca_id: 'supreme',
    imagenes: [PLACEHOLDER_IMAGES[2]],
    tallas_disponibles: ['M', 'L', 'XL'],
    es_pedido: true,
    disponible: true,
    destacado: false,
    stock: 0,
    created_at: '2026-06-03T00:00:00Z',
    updated_at: '2026-06-03T00:00:00Z',
    categoria: { id: 'supreme', nombre: 'Supreme', slug: 'supreme', descripcion: null, imagen_url: null, orden: 2, created_at: '' },
    marca: { id: 'supreme', nombre: 'Supreme', slug: 'supreme', logo_url: null, created_at: '' },
  },
  {
    id: '4d8e9f0a-b4c5-6789-defa-444444444444',
    nombre: 'Bape Shark Full Zip Hoodie',
    slug: 'bape-shark-full-zip-hoodie',
    descripcion: 'Hoodie Bape con diseño Shark Face icónico. Camo print allover con cremallera WGM completa.',
    precio: 1650,
    precio_original: 1800,
    categoria_id: 'ropa-grafica',
    marca_id: 'bape',
    imagenes: [PLACEHOLDER_IMAGES[3]],
    tallas_disponibles: ['S', 'M', 'L'],
    es_pedido: false,
    disponible: true,
    destacado: true,
    stock: 2,
    created_at: '2026-06-04T00:00:00Z',
    updated_at: '2026-06-04T00:00:00Z',
    categoria: { id: 'ropa-grafica', nombre: 'Ropa Gráfica', slug: 'ropa-grafica', descripcion: null, imagen_url: null, orden: 3, created_at: '' },
    marca: { id: 'bape', nombre: 'Bape', slug: 'bape', logo_url: null, created_at: '' },
  },
  {
    id: '5e8f9a0b-c5d6-7890-efab-555555555555',
    nombre: 'New Balance 550 Green Cream',
    slug: 'new-balance-550-green-cream',
    descripcion: 'Silueta retro basketball con detalles en verde sobre base crema. Cuero premium y suela encapsulada.',
    precio: 520,
    precio_original: null,
    categoria_id: 'sneakers',
    marca_id: 'new-balance',
    imagenes: [PLACEHOLDER_IMAGES[4]],
    tallas_disponibles: ['39', '40', '41', '42', '43', '44'],
    es_pedido: false,
    disponible: true,
    destacado: false,
    stock: 5,
    created_at: '2026-06-05T00:00:00Z',
    updated_at: '2026-06-05T00:00:00Z',
    categoria: { id: 'sneakers', nombre: 'Sneakers', slug: 'sneakers', descripcion: null, imagen_url: null, orden: 1, created_at: '' },
    marca: { id: 'new-balance', nombre: 'New Balance', slug: 'new-balance', logo_url: null, created_at: '' },
  },
  {
    id: '6f9a0b1c-d6e7-8901-abcd-666666666666',
    nombre: 'Stüssy Basic Tee Black',
    slug: 'stussy-basic-tee-black',
    descripcion: 'Polo básico Stüssy con logo bordado en pecho. Algodón 100% premium, corte regular fit.',
    precio: 180,
    precio_original: null,
    categoria_id: 'ropa-grafica',
    marca_id: 'stussy',
    imagenes: [PLACEHOLDER_IMAGES[5]],
    tallas_disponibles: ['S', 'M', 'L', 'XL'],
    es_pedido: false,
    disponible: true,
    destacado: false,
    stock: 8,
    created_at: '2026-06-06T00:00:00Z',
    updated_at: '2026-06-06T00:00:00Z',
    categoria: { id: 'ropa-grafica', nombre: 'Ropa Gráfica', slug: 'ropa-grafica', descripcion: null, imagen_url: null, orden: 3, created_at: '' },
    marca: { id: 'stussy', nombre: 'Stüssy', slug: 'stussy', logo_url: null, created_at: '' },
  },
  {
    id: '7a0b1c2d-e7f8-9012-bcde-777777777777',
    nombre: 'Supreme Shoulder Bag SS24',
    slug: 'supreme-shoulder-bag-ss24',
    descripcion: 'Shoulder bag Supreme temporada SS24. Nylon Cordura con logo box estampado. Correa ajustable.',
    precio: 350,
    precio_original: 400,
    categoria_id: 'accesorios',
    marca_id: 'supreme',
    imagenes: [PLACEHOLDER_IMAGES[0]],
    tallas_disponibles: [],
    es_pedido: false,
    disponible: false,
    destacado: false,
    stock: 0,
    created_at: '2026-06-07T00:00:00Z',
    updated_at: '2026-06-07T00:00:00Z',
    categoria: { id: 'accesorios', nombre: 'Accesorios', slug: 'accesorios', descripcion: null, imagen_url: null, orden: 4, created_at: '' },
    marca: { id: 'supreme', nombre: 'Supreme', slug: 'supreme', logo_url: null, created_at: '' },
  },
  {
    id: '8b1c2d3e-f8a9-0123-cdef-888888888888',
    nombre: 'Jordan 1 Retro High OG Chicago',
    slug: 'jordan-1-retro-high-og-chicago',
    descripcion: 'El colorway que inició todo. Jordan 1 Chicago con cuero premium en rojo, blanco y negro. OG retro.',
    precio: 1100,
    precio_original: null,
    categoria_id: 'sneakers',
    marca_id: 'jordan',
    imagenes: [PLACEHOLDER_IMAGES[1]],
    tallas_disponibles: ['41', '42', '43', '44'],
    es_pedido: true,
    disponible: true,
    destacado: true,
    stock: 0,
    created_at: '2026-06-08T00:00:00Z',
    updated_at: '2026-06-08T00:00:00Z',
    categoria: { id: 'sneakers', nombre: 'Sneakers', slug: 'sneakers', descripcion: null, imagen_url: null, orden: 1, created_at: '' },
    marca: { id: 'jordan', nombre: 'Jordan', slug: 'jordan', logo_url: null, created_at: '' },
  },
  {
    id: '9c2d3e4f-a9b0-1234-defa-999999999999',
    nombre: 'Off-White Industrial Belt Yellow',
    slug: 'off-white-industrial-belt-yellow',
    descripcion: 'Cinturón industrial Off-White en amarillo icónico. Hebilla metálica con grabado Off-White™.',
    precio: 680,
    precio_original: null,
    categoria_id: 'accesorios',
    marca_id: 'off-white',
    imagenes: [PLACEHOLDER_IMAGES[3]],
    tallas_disponibles: [],
    es_pedido: false,
    disponible: true,
    destacado: false,
    stock: 4,
    created_at: '2026-06-09T00:00:00Z',
    updated_at: '2026-06-09T00:00:00Z',
    categoria: { id: 'accesorios', nombre: 'Accesorios', slug: 'accesorios', descripcion: null, imagen_url: null, orden: 4, created_at: '' },
    marca: { id: 'off-white', nombre: 'Off-White', slug: 'off-white', logo_url: null, created_at: '' },
  },
  {
    id: '0d3e4f5a-b0c1-2345-efab-000000000000',
    nombre: 'Adidas Samba OG White Green',
    slug: 'adidas-samba-og-white-green',
    descripcion: 'Clásico terrace style. Samba OG en cuero blanco con detalles verdes. Suela de goma transparente.',
    precio: 420,
    precio_original: 480,
    categoria_id: 'sneakers',
    marca_id: 'adidas',
    imagenes: [PLACEHOLDER_IMAGES[4]],
    tallas_disponibles: ['38', '39', '40', '41', '42', '43', '44', '45'],
    es_pedido: false,
    disponible: true,
    destacado: false,
    stock: 6,
    created_at: '2026-06-10T00:00:00Z',
    updated_at: '2026-06-10T00:00:00Z',
    categoria: { id: 'sneakers', nombre: 'Sneakers', slug: 'sneakers', descripcion: null, imagen_url: null, orden: 1, created_at: '' },
    marca: { id: 'adidas', nombre: 'Adidas', slug: 'adidas', logo_url: null, created_at: '' },
  },
];

function filterMock(query: ProductoQuery): Producto[] {
  let filtered = [...MOCK_PRODUCTS];

  if (query.slug) {
    filtered = filtered.filter((p) => p.slug === query.slug);
  }
  if (query.categoria) {
    filtered = filtered.filter(
      (p) => p.categoria_id === query.categoria || p.categoria?.slug === query.categoria
    );
  }
  if (query.marca) {
    const brands = query.marca.toLowerCase().split(',');
    filtered = filtered.filter(
      (p) => p.marca && (brands.includes(p.marca.nombre.toLowerCase()) || brands.includes(p.marca.slug))
    );
  }
  if (query.talla) {
    filtered = filtered.filter((p) => p.tallas_disponibles.includes(query.talla!));
  }
  if (query.disponible) {
    filtered = filtered.filter((p) => p.disponible && !p.es_pedido);
  }
  if (query.busqueda) {
    const q = query.busqueda.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
        (p.marca && p.marca.nombre.toLowerCase().includes(q))
    );
  }

  if (query.ordenar === 'precio_asc') {
    filtered.sort((a, b) => a.precio - b.precio);
  } else if (query.ordenar === 'precio_desc') {
    filtered.sort((a, b) => b.precio - a.precio);
  } else {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return filtered;
}

/**
 * Obtiene productos desde Supabase aplicando filtros. Si la base de datos está
 * vacía o no responde, cae a los datos de demostración (MOCK_PRODUCTS) para que
 * el sitio siempre tenga contenido que mostrar.
 */
export async function getProductos(query: ProductoQuery = {}): Promise<Producto[]> {
  try {
    const supabase = createPublicClient();

    let selectString = '*, categoria:categorias(*), marca:marcas(*)';
    if (query.categoria && !UUID_RE.test(query.categoria)) {
      selectString = selectString.replace('categoria:categorias(*)', 'categoria:categorias!inner(*)');
    }
    if (query.marca) {
      selectString = selectString.replace('marca:marcas(*)', 'marca:marcas!inner(*)');
    }

    let q = supabase.from('productos').select(selectString);

    if (query.slug) q = q.eq('slug', query.slug);
    if (query.categoria) {
      if (UUID_RE.test(query.categoria)) {
        q = q.eq('categoria_id', query.categoria);
      } else {
        q = q.eq('categoria.slug', query.categoria);
      }
    }
    if (query.marca) {
      q = q.in('marca.slug', query.marca.toLowerCase().split(','));
    }
    if (query.talla) q = q.contains('tallas_disponibles', [query.talla]);
    if (query.disponible) q = q.eq('disponible', true).eq('es_pedido', false);
    if (query.busqueda) q = q.ilike('nombre', `%${query.busqueda}%`);

    if (query.ordenar === 'precio_asc') {
      q = q.order('precio', { ascending: true });
    } else if (query.ordenar === 'precio_desc') {
      q = q.order('precio', { ascending: false });
    } else {
      q = q.order('created_at', { ascending: false });
    }

    const { data, error } = await q;
    if (error) {
      console.error('getProductos supabase error:', error.message);
      return filterMock(query);
    }
    if (!data || data.length === 0) {
      return filterMock(query);
    }
    return data as unknown as Producto[];
  } catch (err) {
    console.error('getProductos error:', err);
    return filterMock(query);
  }
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  const productos = await getProductos({ slug });
  return productos[0] ?? null;
}

export async function getProductosRelacionados(
  producto: Producto,
  limit = 4
): Promise<Producto[]> {
  if (!producto.categoria_id) return [];
  const productos = await getProductos({ categoria: producto.categoria_id });
  return productos.filter((p) => p.id !== producto.id).slice(0, limit);
}
