'use client';

import { useState, useCallback } from 'react';
import type { Pedido, PedidoHistorial } from '@/types';
import type { PedidoFormData } from '@/lib/validations';

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Pedido | null>(null);

  const createOrder = useCallback(async (formData: PedidoFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      return data as { success: boolean; pedido_id: string; numero_pedido: string };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pedidos/${orderId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Pedido no encontrado');
      }
      const data = await response.json();
      setOrder(data.pedido);
      return data as { pedido: Pedido; historial: PedidoHistorial[] };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error de seguimiento';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createOrder,
    trackOrder,
    loading,
    error,
    order,
  };
}
