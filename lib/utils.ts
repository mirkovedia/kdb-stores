import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
