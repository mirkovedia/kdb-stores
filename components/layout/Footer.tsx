'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, MessageCircle, Music2, Mail, MapPin, Users } from 'lucide-react';
import { getWhatsAppLink, getInstagramUrl } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Hacer Pedido', href: '/pedidos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Admin', href: '/admin' },
] as const;

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: getInstagramUrl(),
    icon: Instagram,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@kdb.pee',
    icon: Music2,
  },
  {
    label: 'Grupo WhatsApp',
    href: 'https://chat.whatsapp.com/G3VxVwnX4VoBX4NSCD3fxp?mode=gi_t',
    icon: Users,
  },
  {
    label: 'WhatsApp Directo',
    href: getWhatsAppLink(),
    icon: MessageCircle,
  },
] as const;

const PAYMENT_METHODS = ['Yape', 'Plin', 'Transferencia'] as const;

export function Footer() {
  const pathname = usePathname();

  // El panel de admin tiene su propio layout: ocultar el footer público.
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-gold/20 bg-kdb-card">
      <div className="container-kdb py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative w-8 h-8 overflow-hidden border border-gold/20 rounded-sm bg-black shrink-0">
                <Image
                  src="/kdblogo.jpeg"
                  alt="KDB Logo"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-bebas-neue)] text-2xl text-gold tracking-wider group-hover:text-gold-light transition-colors">
                  KDB
                </span>
                <span className="font-[family-name:var(--font-bebas-neue)] text-sm text-text-secondary tracking-widest group-hover:text-text-primary transition-colors">
                  STORES
                </span>
              </div>
            </Link>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-xs">
              Originales. Exclusivos. A tu puerta.
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Sneakers &amp; Streetwear Premium — Lima, Perú 🇵🇪
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-[family-name:var(--font-bebas-neue)] text-lg uppercase tracking-widest text-text-primary mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-[family-name:var(--font-bebas-neue)] text-lg uppercase tracking-widest text-text-primary mb-4">
              Contacto
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors duration-200"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@kdbstores.com"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors duration-200"
                >
                  <Mail size={14} />
                  contacto@kdbstores.com
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={14} />
                  Lima, Perú 🇵🇪
                </span>
              </li>
            </ul>
          </div>

          {/* Síguenos */}
          <div>
            <h4 className="font-[family-name:var(--font-bebas-neue)] text-lg uppercase tracking-widest text-text-primary mb-4">
              Síguenos
            </h4>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors duration-200"
                  >
                    <social.icon size={14} />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                Métodos de pago
              </p>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <span
                    key={method}
                    className="inline-block rounded-sm border border-kdb-border bg-kdb-elevated px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-kdb-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © 2024 KicksD&apos;Barrio. Todos los derechos reservados.
          </p>
          <p className="text-xs text-text-muted">
            Hecho con 🔥 en Lima, Perú
          </p>
        </div>
      </div>
    </footer>
  );
}
