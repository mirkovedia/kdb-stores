'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  Package,
  CalendarDays,
  Eye,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { EstadoPedido, Pedido } from '@/types';
import { createClient } from '@/lib/supabase/client';

const estadoColors: Record<EstadoPedido, { bg: string; text: string }> = {
  pendiente: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  confirmado: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  en_proceso: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  listo: { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  enviado: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  entregado: { bg: 'bg-green-500/15', text: 'text-green-400' },
  cancelado: { bg: 'bg-red-500/15', text: 'text-red-400' },
};

const estadoLabels: Record<EstadoPedido, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_proceso: 'En Proceso',
  listo: 'Listo',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function AdminDashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    productosActivos: 0,
    pedidosMes: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const supabase = createClient();

        // Obtener cantidad de pedidos
        const { count: totalPedidos } = await supabase
          .from('pedidos')
          .select('*', { count: 'exact', head: true });

        // Obtener cantidad de pedidos pendientes
        const { count: pedidosPendientes } = await supabase
          .from('pedidos')
          .select('*', { count: 'exact', head: true })
          .eq('estado', 'pendiente');

        // Obtener cantidad de productos activos
        const { count: productosActivos } = await supabase
          .from('productos')
          .select('*', { count: 'exact', head: true })
          .eq('disponible', true);

        // Obtener cantidad de pedidos del mes
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const { count: pedidosMes } = await supabase
          .from('pedidos')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString());

        setStats({
          totalPedidos: totalPedidos || 0,
          pedidosPendientes: pedidosPendientes || 0,
          productosActivos: productosActivos || 0,
          pedidosMes: pedidosMes || 0
        });

        // Obtener los últimos 10 pedidos
        const { data: recentOrders, error } = await supabase
          .from('pedidos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && recentOrders) {
          setPedidos(recentOrders);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const displayCards = [
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Cargando datos del panel...</p>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                const color = estadoColors[pedido.estado];
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
                        {estadoLabels[pedido.estado]}
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
