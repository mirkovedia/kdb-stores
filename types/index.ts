// Tipos globales para KDB Stores

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  orden: number;
  created_at: string;
}

export interface Marca {
  id: string;
  nombre: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
}

export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  precio_original: number | null;
  categoria_id: string | null;
  marca_id: string | null;
  imagenes: string[];
  tallas_disponibles: string[];
  es_pedido: boolean;
  disponible: boolean;
  destacado: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  categoria?: Categoria;
  marca?: Marca;
}

export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'en_proceso'
  | 'listo'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface Pedido {
  id: string;
  numero_pedido: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_whatsapp: string;
  cliente_direccion: string | null;
  cliente_ciudad: string | null;
  producto_id: string | null;
  producto_nombre: string;
  producto_precio: number;
  talla: string;
  cantidad: number;
  notas: string | null;
  estado: EstadoPedido;
  metodo_pago: string | null;
  total: number | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  producto?: Producto;
}

export interface PedidoHistorial {
  id: string;
  pedido_id: string;
  estado: string;
  nota: string | null;
  created_at: string;
}

export interface ProductFilters {
  categoria?: string;
  marca?: string;
  talla?: string;
  soloDisponibles?: boolean;
  ordenar?: 'reciente' | 'precio_asc' | 'precio_desc';
  busqueda?: string;
}
