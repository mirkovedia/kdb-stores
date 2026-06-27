'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderTracker } from '@/components/pedidos/OrderTracker';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { createClient } from '@/lib/supabase/client';
import type { Pedido, PedidoHistorial, PedidoItem } from '@/types';
import { Search, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

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
    <div className="py-12 md:py-20 min-h-screen bg-kdb-bg">
      <div className="container-kdb max-w-4xl mx-auto">

        {/* Navigation back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>

        {/* Search Bar at top */}
        <div className="bg-kdb-card border border-kdb-border p-4 md:p-6 rounded-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#555555]">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca otro pedido por número (ej: KDB-2026-001)"
                className="w-full bg-[#1A1A1A] border border-[#222222] text-[#F5F5F5] px-4 py-3 pl-11 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-200 placeholder:text-[#555555] rounded-sm text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#E4C06A] transition-colors py-3 px-6 font-semibold text-sm tracking-wide rounded-sm shrink-0 uppercase"
            >
              Buscar Pedido
            </button>
          </form>
        </div>

        {/* Loader state */}
        {loading ? (
          <div className="text-center py-20 bg-kdb-card border border-kdb-border rounded-sm">
            <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
            <p className="text-text-secondary text-sm">Obteniendo estado del pedido...</p>
          </div>
        ) : orderData ? (
          <div>
            <div className="text-center mb-8">
              <SectionTitle title="Seguimiento de Pedido" subtitle="Revisa el estado de tu pedido en tiempo real." />
              {live && (
                <span className="inline-flex items-center gap-2 mt-3 text-xs text-success">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  Actualización en vivo
                </span>
              )}
            </div>
            <OrderTracker pedido={orderData.pedido} historial={orderData.historial} items={orderData.items} />
          </div>
        ) : (
          <div className="bg-kdb-card border border-kdb-border p-12 text-center rounded-sm">
            <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
            <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-text-primary tracking-wider mb-2">
              ID DE PEDIDO INVÁLIDO
            </h3>
            <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
              No pudimos encontrar ningún pedido con el número ingresado. Verifica tu número e intenta de nuevo.
            </p>
            <Link
              href="/catalogo"
              className="bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#E4C06A] px-6 py-3 font-semibold text-sm rounded-sm tracking-wide"
            >
              IR AL CATÁLOGO
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
