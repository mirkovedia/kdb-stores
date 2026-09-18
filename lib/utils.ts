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

/**
 * Estilo de celda de encabezado de tabla del admin. Vive acá —y no en
 * SortableHeader, que es 'use client'— para que el dashboard (Server
 * Component) pueda usarlo sin arrastrar ese módulo al bundle del cliente.
 */
export const TH_CLASSES =
  'px-4 py-3 text-left text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-muted';

/**
 * Colores de estado. Fuente única para dashboard y gestión de pedidos.
 * Tonos 700 sobre fondos 50: legibles sobre el fondo blanco del sitio.
 */
export const ESTADO_COLORS: Record<EstadoPedido, { bg: string; text: string }> = {
  pendiente: { bg: 'bg-amber-50', text: 'text-amber-700' },
  confirmado: { bg: 'bg-blue-50', text: 'text-blue-700' },
  en_proceso: { bg: 'bg-purple-50', text: 'text-purple-700' },
  listo: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
  enviado: { bg: 'bg-orange-50', text: 'text-orange-700' },
  entregado: { bg: 'bg-green-50', text: 'text-green-700' },
  cancelado: { bg: 'bg-red-50', text: 'text-red-700' },
};

export const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800',
  'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800',
];

/**
 * URL pública del sitio. Estaba duplicada —con el mismo fallback— en layout,
 * robots, sitemap y el servicio de email: al cambiar de dominio había que
 * acordarse de los cuatro. Fuente única para metadata, JSON-LD y enlaces
 * absolutos de los correos.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://kdb-stores.vercel.app';
