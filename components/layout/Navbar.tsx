'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X, ChevronDown, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoldButton } from '@/components/ui/GoldButton';
import { useCart } from '@/context/CartContext';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Cómo Funciona', href: '/#como-funciona' },
  { label: 'Nosotros', href: '/nosotros' },
];

const CATEGORIES = [
  { name: 'Sneakers', slug: 'sneakers' },
  { name: 'Supreme', slug: 'supreme' },
  { name: 'Ropa Gráfica', slug: 'ropa-grafica' },
  { name: 'Accesorios', slug: 'accesorios' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

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

  // El panel de admin tiene su propio layout: ocultar el navbar público.
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500 ease-out flex justify-center w-full',
          scrolled
            ? 'top-4 px-4 md:px-0'
            : 'top-0 px-0'
        )}
      >
        <div
          className={cn(
            'transition-all duration-500 ease-out w-full',
            scrolled
              ? 'max-w-5xl bg-black/80 backdrop-blur-md border border-gold/20 rounded-full shadow-glow-gold px-6 md:px-8'
              : 'max-w-7xl bg-transparent border-b border-transparent px-4 md:px-8'
          )}
        >
          <nav className={cn(
            "flex items-center justify-between transition-all duration-500 w-full",
            scrolled ? "h-14 md:h-16" : "h-16 md:h-20"
          )}>
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

                if (link.label === 'Catálogo') {
                  return (
                    <div
                      key={link.href}
                      className="relative py-4"
                      onMouseEnter={() => setCatalogOpen(true)}
                      onMouseLeave={() => setCatalogOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm uppercase tracking-widest font-medium transition-colors duration-200 relative py-2 flex items-center gap-1 group',
                          isActive
                            ? 'text-gold'
                            : 'text-text-secondary hover:text-text-primary',
                        )}
                      >
                        <span className="relative">
                          {link.label}
                          <span className={cn(
                            "absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-gold/50 via-gold to-gold/50 transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100",
                            isActive && "scale-x-100"
                          )} />
                        </span>
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-250 text-text-muted group-hover:text-text-primary", catalogOpen && "rotate-180")} />
                      </Link>
                      
                      <AnimatePresence>
                        {catalogOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-black/95 backdrop-blur-xl border border-gold/20 rounded-sm shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(212,175,55,0.08)] py-2 z-50"
                          >
                            <div className="grid grid-cols-1 gap-1 p-1">
                              {CATEGORIES.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/catalogo?categoria=${cat.slug}`}
                                  className="flex items-center justify-between px-4 py-2.5 rounded-sm hover:bg-gold/10 text-text-secondary hover:text-gold transition-all duration-200 group/item"
                                >
                                  <span className="text-xs tracking-wider uppercase font-semibold">{cat.name}</span>
                                  <span className="text-[10px] text-text-muted group-hover/item:text-gold transition-colors">→</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-sm uppercase tracking-widest font-medium transition-colors duration-200 relative py-2 group',
                      isActive
                        ? 'text-gold'
                        : 'text-text-secondary hover:text-text-primary',
                    )}
                  >
                    <span className="relative">
                      {link.label}
                      <span className={cn(
                        "absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-gold/50 via-gold to-gold/50 transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100",
                        isActive && "scale-x-100"
                      )} />
                    </span>
                  </Link>
                );
              })}

              <Link
                href="/carrito"
                aria-label="Ver carrito"
                className="relative p-2 text-text-secondary hover:text-gold transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {hydrated && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gold text-black text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <GoldButton href="/pedidos" size="sm">
                Hacer Pedido
              </GoldButton>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-1 md:hidden">
              <Link
                href="/carrito"
                aria-label="Ver carrito"
                className="relative p-2 text-text-secondary hover:text-gold transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {hydrated && totalItems > 0 && (
                  <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gold text-black text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="p-2 text-text-secondary hover:text-gold transition-colors"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
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
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0A0A0A]/90 backdrop-blur-md border-l border-gold/20 flex flex-col md:hidden"
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
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-2 px-4 py-6 flex-1"
              >
                {NAV_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]));

                  if (link.label === 'Catálogo') {
                    return (
                      <motion.div key={link.href} variants={itemVariants} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setMobileCatalogOpen((prev) => !prev)}
                          className={cn(
                            'flex items-center justify-between px-4 py-3 rounded-sm text-sm uppercase tracking-widest font-medium transition-colors duration-200 w-full text-left',
                            isActive
                              ? 'text-gold bg-gold/10'
                              : 'text-text-secondary hover:text-text-primary hover:bg-kdb-elevated',
                          )}
                        >
                          <span>{link.label}</span>
                          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-text-muted", mobileCatalogOpen && "rotate-180")} />
                        </button>
                        
                        <AnimatePresence>
                          {mobileCatalogOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden pl-6 pr-4 flex flex-col gap-1 border-l border-gold/10 ml-4 mt-1"
                            >
                              <Link
                                href="/catalogo"
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-2 text-xs uppercase tracking-wider text-text-muted hover:text-gold transition-colors"
                              >
                                Ver Todo el Catálogo
                              </Link>
                              {CATEGORIES.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/catalogo?categoria=${cat.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="px-4 py-2 text-xs uppercase tracking-wider text-text-muted hover:text-gold transition-colors"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-sm text-sm uppercase tracking-widest font-medium transition-colors duration-200',
                          isActive
                            ? 'text-gold bg-gold/10'
                            : 'text-text-secondary hover:text-text-primary hover:bg-kdb-elevated',
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Drawer CTA */}
              <div className="px-4 pb-8">
                <GoldButton
                  href="/pedidos"
                  size="lg"
                  className="w-full justify-center"
                  onClick={() => setMobileOpen(false)}
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
