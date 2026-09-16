'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getWhatsAppLink, getInstagramUrl } from '@/lib/utils';

const SHOP_LINKS = [
  { label: 'Ver todo', href: '/catalogo' },
  { label: 'Sneakers', href: '/catalogo?categoria=sneakers' },
  { label: 'Supreme', href: '/catalogo?categoria=supreme' },
  { label: 'Ropa gráfica', href: '/catalogo?categoria=ropa-grafica' },
  { label: 'Accesorios', href: '/catalogo?categoria=accesorios' },
] as const;

const HELP_LINKS = [
  { label: 'Hacer un pedido', href: '/pedidos' },
  { label: 'Seguir mi pedido', href: '/pedidos' },
  { label: 'Nosotros', href: '/nosotros' },
] as const;

const PAYMENT_METHODS = ['Yape', 'Plin', 'Transferencia'] as const;

export function Footer() {
  const pathname = usePathname();

  // El panel de admin tiene su propio layout.
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-kdb py-16 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold uppercase leading-none tracking-[0.3em] text-ink">
                KDB
              </span>
            </Link>
            <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-ink-muted">
              Sneakers y streetwear originales, importados y entregados en todo el Perú.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-eyebrow text-ink">Tienda</h4>
            <ul className="mt-5 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-eyebrow text-ink">Ayuda</h4>
            <ul className="mt-5 space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:contacto@kdbstores.com"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  contacto@kdbstores.com
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-eyebrow text-ink">Síguenos</h4>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={getInstagramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@kdb.pee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-16 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} KicksD&apos;Barrio — Lima, Perú
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-subtle">Pagos:</span>
            {PAYMENT_METHODS.map((method) => (
              <span key={method} className="text-xs text-ink-muted">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
