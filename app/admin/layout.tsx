'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ArrowLeft,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { AdminFeedbackProvider } from '@/components/admin/AdminFeedback';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const navItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    exact: true,
  },
  {
    href: '/admin/productos',
    label: 'Productos',
    icon: <Package className="w-5 h-5" />,
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // El login no usa el shell con sidebar (la protección la hace el proxy server-side).
  const isLoginRoute = pathname === '/admin/login';

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }

  if (isLoginRoute) {
    return <AdminFeedbackProvider>{children}</AdminFeedbackProvider>;
  }

  function isActive(item: NavItem): boolean {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  }

  return (
    <AdminFeedbackProvider>
    <div className="min-h-screen bg-kdb-bg flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-kdb-card border-r border-kdb-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-kdb-border">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7 overflow-hidden border border-gold/20 rounded-sm bg-black shrink-0">
              <Image
                src="/kdblogo.jpeg"
                alt="KDB Logo"
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
            <span className="text-xl font-[family-name:var(--font-bebas-neue)] text-gold tracking-wider group-hover:text-gold-light transition-colors">
              KDB ADMIN
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive(item)
                  ? 'bg-gold/10 text-gold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-kdb-elevated'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Back to site */}
        <div className="px-3 py-4 border-t border-kdb-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-kdb-elevated transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al sitio
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-danger hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="h-16 bg-kdb-card border-b border-kdb-border flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="relative w-7 h-7 overflow-hidden border border-gold/20 rounded-sm bg-black shrink-0">
              <Image
                src="/kdblogo.jpeg"
                alt="KDB Logo"
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
            <span className="text-lg font-[family-name:var(--font-bebas-neue)] text-gold tracking-wider">
              KDB ADMIN
            </span>
          </div>
          <div className="hidden lg:block" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
    </AdminFeedbackProvider>
  );
}
