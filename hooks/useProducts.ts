'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Producto, ProductFilters } from '@/types';

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();

      if (filters.categoria) {
        queryParams.append('categoria', filters.categoria);
      }
      if (filters.marca) {
        queryParams.append('marca', filters.marca);
      }
      if (filters.talla) {
        queryParams.append('talla', filters.talla);
      }
      if (filters.soloDisponibles) {
        queryParams.append('disponible', 'true');
      }
      if (filters.ordenar) {
        queryParams.append('ordenar', filters.ordenar);
      }
      if (filters.busqueda) {
        queryParams.append('busqueda', filters.busqueda);
      }

      const response = await fetch(`/api/productos?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [
    filters.categoria,
    filters.marca,
    filters.talla,
    filters.soloDisponibles,
    filters.ordenar,
    filters.busqueda,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
