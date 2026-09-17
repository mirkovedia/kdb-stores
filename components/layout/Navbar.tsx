'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { AnnouncementBar } from './AnnouncementBar';

const CATEGORIES = [
  { name: 'Sneakers', slug: 'sneakers' },
  { name: 'Supreme', slug: 'supreme' },
  { name: 'Ropa Gráfica', slug: 'ropa-grafica' },
  { name: 'Accesorios', slug: 'accesorios' },
] as const;

/*
  Mismas marcas que el filtro del catálogo: así cualquier enlace de acá
  siempre cae en resultados válidos. Buscar por marca es como la gente busca
  sneakers, y hasta ahora solo se podía desde los filtros.
*/
const BRANDS = [
  { name: 'Jordan', slug: 'jordan' },
  { name: 'Nike', slug: 'nike' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'New Balance', slug: 'new-balance' },
  { name: 'Bape', slug: 'bape' },
  { name: 'Off-White', slug: 'off-white' },
] as const;

const NAV_LINKS = [
  { label: 'Catálogo', href: '/catalogo', categories: true },
  { label: 'Pedidos', href: '/pedidos', categories: false },
  { label: 'Nosotros', href: '/nosotros', categories: false },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, hydrated } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  /*
    El menú se cierra durante el render cuando cambia la ruta, no en un efecto.
    Cada link ya lo cierra al hacer clic; esto cubre además la navegación con
    el botón atrás del navegador, y evita el render en cascada que provoca
    llamar a setState dentro de un useEffect.
  */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  // Bloquea el scroll del body mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // El panel de admin tiene su propio layout.
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      <AnnouncementBar />

      {/*
        sticky en lugar de fixed: el navbar ocupa su lugar en el flujo, así
        ninguna página necesita un espaciador para no quedar tapada.
      */}
      <header className="sticky top-0 z-50 border-b border-line bg-surface">
        {/*
          Grilla de tres columnas (1fr auto 1fr) para que el logo quede en el
          centro real del viewport, sin depender del ancho de los laterales.
        */}
        <nav className="container-kdb grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
          {/* Izquierda: links en desktop, botón de menú en móvil */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              className="-ml-2 p-2 text-ink md:hidden"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) =>
                link.categories ? (
                  <div key={link.href} className="group relative">
                    <Link
                      href={link.href}
                      data-active={isActive(link.href)}
                      className="text-nav link-underline text-ink"
                    >
                      {link.label}
                    </Link>

                    {/*
                      Desplegable en dos columnas: categorías y marcas. En una
                      sola columna serían once ítems seguidos, demasiado para
                      escanear. Anclado a la izquierda para no desbordar la
                      ventana en pantallas chicas.
                    */}
                    <div className="invisible absolute left-0 top-full z-50 flex gap-10 border border-line bg-surface px-6 py-5 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                      <div className="min-w-[8rem]">
                        <p className="text-eyebrow mb-4 text-ink-subtle">
                          Categorías
                        </p>
                        <div className="flex flex-col gap-3">
                          {CATEGORIES.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/catalogo?categoria=${cat.slug}`}
                              className="text-nav whitespace-nowrap text-ink-muted transition-colors hover:text-ink"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="min-w-[8rem]">
                        <p className="text-eyebrow mb-4 text-ink-subtle">
                          Marcas
                        </p>
                        <div className="flex flex-col gap-3">
                          {BRANDS.map((brand) => (
                            <Link
                              key={brand.slug}
                              href={`/catalogo?marca=${brand.slug}`}
                              className="text-nav whitespace-nowrap text-ink-muted transition-colors hover:text-ink"
                            >
                              {brand.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-active={isActive(link.href)}
                    className="text-nav link-underline text-ink"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Centro: logotipo */}
          <Link href="/" className="flex items-center justify-center" aria-label="KDB Stores — inicio">
            <span className="text-xl font-bold uppercase leading-none tracking-[0.3em] text-ink md:text-2xl">
              KDB
            </span>
          </Link>

          {/* Derecha: acciones */}
          <div className="flex items-center justify-end gap-1 md:gap-2">
            <Link
              href="/catalogo"
              aria-label="Buscar productos"
              className="p-2 text-ink transition-opacity hover:opacity-60"
            >
              <Search size={19} strokeWidth={1.5} />
            </Link>

            <Link
              href="/carrito"
              aria-label={
                hydrated && totalItems > 0
                  ? `Ver carrito, ${totalItems} artículos`
                  : 'Ver carrito'
              }
              className="relative p-2 text-ink transition-opacity hover:opacity-60"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {hydrated && totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[0.5625rem] font-semibold leading-none text-ink-inverse">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Menú móvil: panel completo, sin animaciones de resorte */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-surface md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <span className="text-nav text-ink-muted">Menú</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              className="-mr-2 p-2 text-ink"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {NAV_LINKS.map((link) =>
              link.categories ? (
                <div key={link.href} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setMobileCatalogOpen((prev) => !prev)}
                    aria-expanded={mobileCatalogOpen}
                    className="flex w-full items-center justify-between px-4 py-5 text-left"
                  >
                    <span className="text-product text-ink">{link.label}</span>
                    {mobileCatalogOpen ? (
                      <Minus size={16} strokeWidth={1.5} className="text-ink-muted" />
                    ) : (
                      <Plus size={16} strokeWidth={1.5} className="text-ink-muted" />
                    )}
                  </button>

                  {mobileCatalogOpen && (
                    <div className="bg-surface-muted py-2">
                      <Link
                        href="/catalogo"
                        onClick={() => setMobileOpen(false)}
                        className="block px-8 py-3.5 text-nav text-ink"
                      >
                        Ver todo
                      </Link>

                      <p className="text-eyebrow px-8 pb-2 pt-4 text-ink-subtle">
                        Categorías
                      </p>
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/catalogo?categoria=${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-8 py-3.5 text-nav text-ink-muted"
                        >
                          {cat.name}
                        </Link>
                      ))}

                      <p className="text-eyebrow px-8 pb-2 pt-4 text-ink-subtle">
                        Marcas
                      </p>
                      {BRANDS.map((brand) => (
                        <Link
                          key={brand.slug}
                          href={`/catalogo?marca=${brand.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-8 py-3.5 text-nav text-ink-muted"
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block border-b border-line px-4 py-5 text-product',
                    isActive(link.href) ? 'text-ink' : 'text-ink',
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </>
  );
}
