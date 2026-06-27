import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  Package,
  CalendarDays,
  Eye,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { cn, formatPrice, ESTADO_COLORS, ESTADO_LABELS } from '@/lib/utils';
import type { Pedido } from '@/types';
import { createClient } from '@/lib/supabase/server';

interface PedidoMetric {
  total: number | null;
  estado: string;
  producto_nombre: string;
  cantidad: number | null;
  created_at: string;
}

async function getDashboardData() {
  const supabase = await createClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: totalPedidos },
    { count: pedidosPendientes },
    { count: productosActivos },
    { count: pedidosMes },
    { data: allPedidos },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('pedidos').select('*', { count: 'exact', head: true }),
    supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'pendiente'),
    supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('disponible', true),
    supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()),
    supabase
      .from('pedidos')
      .select('total, estado, producto_nombre, cantidad, created_at'),
    supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const validos = ((allPedidos as PedidoMetric[]) || []).filter(
    (p) => p.estado !== 'cancelado'
  );

  // Ingresos del mes en curso
  const ingresosMes = validos
    .filter((p) => new Date(p.created_at) >= startOfMonth)
    .reduce((sum, p) => sum + Number(p.total || 0), 0);

  // Ingresos de los últimos 6 meses
  const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const buckets: { label: string; total: number; key: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      label: monthLabels[d.getMonth()],
      total: 0,
      key: `${d.getFullYear()}-${d.getMonth()}`,
    });
  }
  for (const p of validos) {
    const d = new Date(p.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.total += Number(p.total || 0);
  }
  const monthlySales = buckets.map(({ label, total }) => ({ label, total }));

  // Top 5 productos más pedidos (por cantidad)
  const productMap = new Map<string, number>();
  for (const p of validos) {
    const qty = Number(p.cantidad || 1);
    productMap.set(p.producto_nombre, (productMap.get(p.producto_nombre) || 0) + qty);
  }
  const topProducts = [...productMap.entries()]
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return {
    stats: {
      totalPedidos: totalPedidos || 0,
      pedidosPendientes: pedidosPendientes || 0,
      productosActivos: productosActivos || 0,
      pedidosMes: pedidosMes || 0,
      ingresosMes,
    },
    monthlySales,
    topProducts,
    pedidos: (recentOrders as Pedido[]) || [],
  };
}

export default async function AdminDashboardPage() {
  const { stats, monthlySales, topProducts, pedidos } = await getDashboardData();

  const displayCards: { label: string; value: string | number; icon: React.ReactNode }[] = [
    {
      label: 'Ingresos del Mes',
      value: formatPrice(stats.ingresosMes),
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      label: 'Total Pedidos',
      value: stats.totalPedidos,
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      label: 'Pedidos Pendientes',
      value: stats.pedidosPendientes,
      icon: <Clock className="w-6 h-6" />,
    },
    {
      label: 'Productos Activos',
      value: stats.productosActivos,
      icon: <Package className="w-6 h-6" />,
    },
    {
      label: 'Pedidos del Mes',
      value: stats.pedidosMes,
      icon: <CalendarDays className="w-6 h-6" />,
    },
  ];

  const maxMonthly = Math.max(1, ...monthlySales.map((m) => m.total));
  const maxTop = Math.max(1, ...topProducts.map((p) => p.cantidad));

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
          Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Resumen general de KDB Stores
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {displayCards.map((card) => (
          <div
            key={card.label}
            className="bg-kdb-card border border-kdb-border rounded-md p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-gold">{card.icon}</div>
            </div>
            <div className="text-3xl font-[family-name:var(--font-bebas-neue)] text-text-primary">
              {card.value}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ventas por mes */}
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-gold" />
            <h2 className="text-xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
              Ingresos — Últimos 6 meses
            </h2>
          </div>
          {monthlySales.every((m) => m.total === 0) ? (
            <p className="text-sm text-text-muted py-12 text-center">
              Aún no hay ventas registradas.
            </p>
          ) : (
            <div className="flex items-end justify-between gap-3 h-48">
              {monthlySales.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-text-secondary">
                    {m.total > 0 ? formatPrice(m.total).replace('.00', '') : ''}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-gold-dark to-gold rounded-sm transition-all"
                    style={{ height: `${(m.total / maxMonthly) * 100}%`, minHeight: m.total > 0 ? '4px' : '0' }}
                  />
                  <span className="text-xs text-text-muted">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top productos */}
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6">
          <h2 className="text-xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide mb-6">
            Productos más pedidos
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-text-muted py-12 text-center">Sin datos todavía.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p) => (
                <div key={p.nombre}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary truncate pr-2">{p.nombre}</span>
                    <span className="text-gold font-medium shrink-0">{p.cantidad}</span>
                  </div>
                  <div className="h-1.5 bg-kdb-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${(p.cantidad / maxTop) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-kdb-card border border-kdb-border rounded-md">
        <div className="px-6 py-4 border-b border-kdb-border flex items-center justify-between">
          <h2 className="text-xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
            Últimos Pedidos
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-sm text-gold hover:text-gold-light transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-kdb-border">
                <th className="text-left px-6 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                  Número
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden md:table-cell">
                  Producto
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden lg:table-cell">
                  Talla
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden sm:table-cell">
                  Fecha
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kdb-border">
              {pedidos.map((pedido) => {
                const color = ESTADO_COLORS[pedido.estado];
                return (
                  <tr
                    key={pedido.id}
                    className="hover:bg-kdb-elevated transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-text-primary whitespace-nowrap">
                      {pedido.numero_pedido}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                      {pedido.cliente_nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap hidden md:table-cell max-w-[200px] truncate">
                      {pedido.producto_nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap hidden lg:table-cell">
                      {pedido.talla}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          color.bg,
                          color.text
                        )}
                      >
                        {ESTADO_LABELS[pedido.estado]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap hidden sm:table-cell">
                      {pedido.created_at.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/pedidos?id=${pedido.id}`}
                        className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
