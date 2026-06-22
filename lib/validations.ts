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

export const productoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  precio: z.number().min(0, 'El precio debe ser positivo'),
  precio_original: z.number().min(0).optional().nullable(),
  categoria_id: z.string().uuid().optional().nullable(),
  marca_id: z.string().uuid().optional().nullable(),
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
