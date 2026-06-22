'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderTracker } from '@/components/pedidos/OrderTracker';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { Pedido, PedidoHistorial, EstadoPedido } from '@/types';
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
  const [orderData, setOrderData] = useState<{ pedido: Pedido; historial: PedidoHistorial[] } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      setLoading(true);
      try {
        const response = await fetch(`/api/pedidos/${orderId}`);
        if (!response.ok) {
          throw new Error('Pedido no encontrado');
        }
        const data = await response.json();
        if (active) {
          setOrderData(data);
        }
      } catch (err) {
        console.error('Error fetching order status:', err);
        if (active) {
          setOrderData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (orderId) {
      loadOrder();
    }
    
    return () => {
      active = false;
    };
  }, [orderId]);

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
            </div>
            <OrderTracker pedido={orderData.pedido} historial={orderData.historial} />
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
