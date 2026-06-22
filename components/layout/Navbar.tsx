'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoldButton } from '@/components/ui/GoldButton';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Cómo Funciona', href: '/#como-funciona' },
  { label: 'Nosotros', href: '/nosotros' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timer = setTimeout(() => {
      handleScroll();
    }, 0);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) {
      const timer = setTimeout(() => {
        setMobileOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-kdb-border'
            : 'bg-transparent',
        )}
      >
        <nav className="container-kdb flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 md:w-9 h-9 overflow-hidden border border-gold/20 rounded-sm bg-black shrink-0">
              <Image
                src="/kdblogo.jpeg"
                alt="KDB Logo"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-bebas-neue)] text-2xl md:text-3xl text-gold tracking-wider group-hover:text-gold-light transition-colors">
                KDB
              </span>
              <span className="font-[family-name:var(--font-bebas-neue)] text-sm md:text-base text-text-secondary tracking-widest group-hover:text-text-primary transition-colors">
                STORES
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm uppercase tracking-widest font-medium transition-colors duration-200',
                    isActive
                      ? 'text-gold'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <GoldButton href="/pedidos" size="sm">
              Hacer Pedido
            </GoldButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-text-secondary hover:text-gold transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-kdb-card border-l border-kdb-border flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-kdb-border">
                <span className="font-[family-name:var(--font-bebas-neue)] text-2xl text-gold tracking-wider">
                  KDB
                </span>
                <button
                  type="button"
                  className="p-2 text-text-secondary hover:text-gold transition-colors"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-1 px-4 py-6 flex-1">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-sm text-sm uppercase tracking-widest font-medium transition-colors duration-200',
                        isActive
                          ? 'text-gold bg-gold/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-kdb-elevated',
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer CTA */}
              <div className="px-4 pb-8">
                <GoldButton
                  href="/pedidos"
                  size="lg"
                  className="w-full justify-center"
                >
                  Hacer Pedido
                </GoldButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      {pathname !== '/' && <div className="h-16 md:h-20" />}
    </>
  );
}
