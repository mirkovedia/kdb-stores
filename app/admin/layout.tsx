'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

const NAV_ITEMS: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
    exact: true,
  },
  {
    href: '/admin/productos',
    label: 'Productos',
    icon: <Package size={18} strokeWidth={1.5} />,
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: <ShoppingBag size={18} strokeWidth={1.5} />,
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

  // El login no usa el shell con sidebar (la protección la hace el proxy).
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
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <AdminFeedbackProvider>
      <div className="flex min-h-screen bg-surface">
        {/* Fondo del menú en móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Menú lateral */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-line bg-surface transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="text-base font-bold uppercase tracking-[0.25em] text-ink">
                KDB
              </span>
              <span className="text-[0.625rem] uppercase tracking-[0.15em] text-ink-muted">
                Admin
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
              className="-mr-2 p-2 text-ink-muted transition-colors hover:text-ink lg:hidden"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive(item) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                  isActive(item)
                    ? 'bg-ink text-ink-inverse'
                    : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-1 border-t border-line p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              Volver al sitio
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-danger transition-colors hover:bg-red-50"
            >
              <LogOut size={18} strokeWidth={1.5} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Contenido */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Barra superior: solo en móvil, para abrir el menú */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface px-4 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
              className="-ml-2 p-2 text-ink"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            <span className="text-base font-bold uppercase tracking-[0.25em] text-ink">
              KDB
            </span>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminFeedbackProvider>
  );
}
