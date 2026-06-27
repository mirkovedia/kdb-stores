import { z } from 'zod';

export const pedidoSchema = z.object({
  cliente_nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cliente_email: z.string().email('Email inválido'),
  cliente_whatsapp: z.string().min(9, 'Número de WhatsApp inválido'),
  cliente_direccion: z.string().optional(),
  cliente_ciudad: z.string().optional(),
  producto_id: z.string().uuid('Producto inválido'),
  talla: z.string().min(1, 'Selecciona una talla'),
  cantidad: z.number().min(1).max(5),
  notas: z.string().optional(),
});

export type PedidoFormData = z.infer<typeof pedidoSchema>;

// Checkout del carrito (múltiples ítems en un solo pedido)
export const checkoutItemSchema = z.object({
  producto_id: z.string().uuid('Producto inválido'),
  talla: z.string().optional().default(''),
  cantidad: z.number().min(1).max(10),
});

export const checkoutSchema = z.object({
  cliente_nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cliente_email: z.string().email('Email inválido'),
  cliente_whatsapp: z.string().min(9, 'Número de WhatsApp inválido'),
  cliente_direccion: z.string().optional(),
  cliente_ciudad: z.string().optional(),
  notas: z.string().optional(),
  items: z.array(checkoutItemSchema).min(1, 'El carrito está vacío'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// "Avísame cuando llegue" — suscripción a restock
export const notifyStockSchema = z.object({
  producto_id: z.string().uuid('Producto inválido'),
  email: z.string().email('Email inválido'),
  talla: z.string().optional(),
});

export type NotifyStockFormData = z.infer<typeof notifyStockSchema>;

export const productoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  precio: z.number({ message: 'Ingresa un precio válido' }).min(0, 'El precio debe ser positivo'),
  // Los campos opcionales reciben null cuando el form está vacío (ver setValueAs en el formulario).
  precio_original: z.number().min(0).nullable().optional(),
  categoria_id: z.string().uuid().nullable().optional(),
  marca_id: z.string().uuid().nullable().optional(),
  imagenes: z.array(z.string()),
  tallas_disponibles: z.array(z.string()),
  es_pedido: z.boolean(),
  disponible: z.boolean(),
  destacado: z.boolean(),
  stock: z.number().min(0),
});

export type ProductoFormData = z.infer<typeof productoSchema>;

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
