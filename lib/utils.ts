import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { EstadoPedido } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `S/ ${price.toFixed(2)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getWhatsAppLink(message?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';
  const base = `https://wa.me/${number}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export function getInstagramUrl(): string {
  return process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/kdb.stores';
}

export const ESTADOS_PEDIDO = [
  { value: 'pendiente', label: 'Pedido recibido', icon: '📦' },
  { value: 'confirmado', label: 'Pedido confirmado', icon: '✅' },
  { value: 'en_proceso', label: 'En proceso', icon: '🔄' },
  { value: 'listo', label: 'Listo para envío', icon: '📋' },
  { value: 'enviado', label: 'Enviado', icon: '🚚' },
  { value: 'entregado', label: 'Entregado', icon: '🎉' },
  { value: 'cancelado', label: 'Cancelado', icon: '❌' },
] as const;

export function getEstadoIndex(estado: string): number {
  return ESTADOS_PEDIDO.findIndex((e) => e.value === estado);
}

/**
 * Etiquetas cortas para badges/tablas del admin (distintas de las descripciones
 * largas de ESTADOS_PEDIDO usadas en el seguimiento del cliente).
 */
export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_proceso: 'En Proceso',
  listo: 'Listo',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

/** Colores de estado. Fuente única para dashboard y gestión de pedidos. */
export const ESTADO_COLORS: Record<EstadoPedido, { bg: string; text: string }> = {
  pendiente: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  confirmado: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  en_proceso: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  listo: { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  enviado: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  entregado: { bg: 'bg-green-500/15', text: 'text-green-400' },
  cancelado: { bg: 'bg-red-500/15', text: 'text-red-400' },
};

export const PLACEHOLDER_SNEAKER =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

export const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
  'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800',
];
