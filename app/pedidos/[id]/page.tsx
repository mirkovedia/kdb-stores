'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderTracker } from '@/components/pedidos/OrderTracker';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Pedido, PedidoHistorial, PedidoItem } from '@/types';
import { Search } from 'lucide-react';

interface TrackingPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: TrackingPageProps) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<{ pedido: Pedido; historial: PedidoHistorial[]; items?: PedidoItem[] } | null>(null);
  const [live, setLive] = useState(false);

  const loadOrder = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      try {
        const response = await fetch(`/api/pedidos/${orderId}`);
        if (!response.ok) throw new Error('Pedido no encontrado');
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error('Error fetching order status:', err);
        if (showSpinner) setOrderData(null);
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    // Carga inicial del pedido al montar (patrón estándar de fetch en efecto).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (orderId) loadOrder();
  }, [orderId, loadOrder]);

  // Suscripción en tiempo real: refresca cuando el pedido o su historial cambian
  const pedidoId = orderData?.pedido.id;
  useEffect(() => {
    if (!pedidoId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`pedido-${pedidoId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos', filter: `id=eq.${pedidoId}` },
        () => loadOrder(false)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedido_historial', filter: `pedido_id=eq.${pedidoId}` },
        () => loadOrder(false)
      )
      .subscribe((status) => {
        setLive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setLive(false);
    };
  }, [pedidoId, loadOrder]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/pedidos/${searchQuery.trim()}`);
    }
  }

  return (
    <div className="container-kdb py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-nav link-underline text-ink-muted transition-colors hover:text-ink"
        >
          Volver al inicio
        </Link>

        {/* Buscar otro pedido */}
        <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="buscar-pedido" className="sr-only">
              Número de pedido
            </label>
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-subtle">
              <Search size={16} strokeWidth={1.5} />
            </span>
            <input
              id="buscar-pedido"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar otro pedido (ej. KDB-2026-001)"
              className="h-12 w-full border border-line bg-surface pl-11 pr-4 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-12 shrink-0 border border-ink bg-ink px-7 text-xs font-medium uppercase tracking-[0.15em] text-ink-inverse transition-colors hover:bg-ink-muted hover:border-ink-muted"
          >
            Buscar
          </button>
        </form>

        {loading ? (
          <p className="py-24 text-center text-sm text-ink-muted">
            Obteniendo estado del pedido…
          </p>
        ) : orderData ? (
          <div className="mt-14">
            <div className="text-center">
              <h1 className="text-section text-ink">Seguimiento de pedido</h1>
              {live && (
                <p className="mt-4 text-xs uppercase tracking-[0.15em] text-ink-muted">
                  Actualización en vivo
                </p>
              )}
            </div>

            <div className="mt-12">
              <OrderTracker
                pedido={orderData.pedido}
                historial={orderData.historial}
                items={orderData.items}
              />
            </div>
          </div>
        ) : (
          <div className="mt-14 border border-line p-12 text-center">
            <h2 className="text-product text-ink">Pedido no encontrado</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              No encontramos ningún pedido con ese número. Verificá el código e
              intentá de nuevo.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/catalogo" variant="primary" size="md">
                Ir al catálogo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
