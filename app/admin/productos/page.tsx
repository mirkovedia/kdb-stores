'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  StarOff,
  Loader2,
} from 'lucide-react';
import { cn, formatPrice, PLACEHOLDER_IMAGES } from '@/lib/utils';
import type { Producto } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadProductos = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('productos')
        .select('*, categoria:categorias(nombre), marca:marcas(nombre)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error('Error loading products for admin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProductos();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProductos]);

  const filteredProductos = useMemo(() => {
    if (!search.trim()) return productos;
    const term = search.toLowerCase();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(term))
    );
  }, [search, productos]);

  async function toggleDisponible(id: string, currentVal: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('productos')
        .update({ disponible: !currentVal })
        .eq('id', id);

      if (error) throw error;
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, disponible: !currentVal } : p))
      );
    } catch (err) {
      alert('Error al actualizar disponibilidad');
      console.error(err);
    }
  }

  async function toggleDestacado(id: string, currentVal: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('productos')
        .update({ destacado: !currentVal })
        .eq('id', id);

      if (error) throw error;
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, destacado: !currentVal } : p))
      );
    } catch (err) {
      alert('Error al actualizar destacado');
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('productos').delete().eq('id', id);
        if (error) throw error;
        setProductos((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert('Error al eliminar producto');
        console.error(err);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
            Productos
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-kdb-bg font-semibold rounded-md hover:bg-gold-light transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-kdb-card border border-kdb-border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-kdb-card border border-kdb-border rounded-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-kdb-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                Imagen
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                Nombre
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden sm:table-cell">
                Precio
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden md:table-cell">
                Categoría
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden lg:table-cell">
                Tallas
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden md:table-cell">
                Stock
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                Disponible
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden sm:table-cell">
                Destacado
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-kdb-border">
            {filteredProductos.map((producto) => (
              <tr
                key={producto.id}
                className="hover:bg-kdb-elevated transition-colors"
              >
                {/* Image */}
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-kdb-elevated">
                    <Image
                      src={producto.imagenes[0] || PLACEHOLDER_IMAGES[0]}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-text-primary line-clamp-2 max-w-[200px]">
                    {producto.nombre}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap hidden sm:table-cell">
                  {formatPrice(producto.precio)}
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">
                  {producto.categoria?.nombre || 'Sin categoría'}
                </td>

                {/* Sizes */}
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {producto.tallas_disponibles.slice(0, 4).map((talla) => (
                      <span
                        key={talla}
                        className="inline-block px-1.5 py-0.5 text-xs bg-kdb-elevated text-text-secondary rounded"
                      >
                        {talla}
                      </span>
                    ))}
                    {producto.tallas_disponibles.length > 4 && (
                      <span className="text-xs text-text-muted">
                        +{producto.tallas_disponibles.length - 4}
                      </span>
                    )}
                  </div>
                </td>

                {/* Stock */}
                <td className="px-4 py-3 text-sm hidden md:table-cell">
                  <span
                    className={cn(
                      producto.stock > 0
                        ? 'text-text-secondary'
                        : 'text-danger font-medium'
                    )}
                  >
                    {producto.stock}
                  </span>
                </td>

                {/* Available toggle */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleDisponible(producto.id, producto.disponible)}
                    className={cn(
                      'relative w-10 h-5 rounded-full transition-colors',
                      producto.disponible ? 'bg-success' : 'bg-kdb-elevated'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                        producto.disponible ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </td>

                {/* Featured */}
                <td className="px-4 py-3 hidden sm:table-cell">
                  <button
                    onClick={() => toggleDestacado(producto.id, producto.destacado)}
                    className="text-text-muted hover:text-gold transition-colors"
                  >
                    {producto.destacado ? (
                      <Star className="w-5 h-5 text-gold fill-gold" />
                    ) : (
                      <StarOff className="w-5 h-5" />
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/productos/${producto.id}`}
                      className="p-1.5 text-text-secondary hover:text-gold transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="p-1.5 text-text-secondary hover:text-danger transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProductos.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-text-muted text-sm">
              No se encontraron productos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
