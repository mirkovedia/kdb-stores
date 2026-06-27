'use client';

import { useState, useMemo } from 'react';
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
import { useAdminFeedback } from '@/components/admin/AdminFeedback';
import { Pagination } from '@/components/admin/Pagination';
import { ToggleSwitch } from '@/components/admin/ToggleSwitch';
import {
  SortableHeader,
  nextSort,
  type SortState,
} from '@/components/admin/SortableHeader';

const PAGE_SIZE = 10;

export function ProductosManager({
  initialProductos,
}: {
  initialProductos: Producto[];
}) {
  const { toast, confirm } = useAdminFeedback();
  const [productos, setProductos] = useState<Producto[]>(initialProductos);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>(null);
  // Acciones en vuelo, por clave `accion:id` (evita doble-disparo).
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const filteredProductos = useMemo(() => {
    if (!search.trim()) return productos;
    const term = search.toLowerCase();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(term))
    );
  }, [search, productos]);

  const sortedProductos = useMemo(() => {
    if (!sort) return filteredProductos;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filteredProductos].sort((a, b) => {
      switch (sort.key) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre) * dir;
        case 'precio':
          return (a.precio - b.precio) * dir;
        case 'stock':
          return (a.stock - b.stock) * dir;
        default:
          return 0;
      }
    });
  }, [filteredProductos, sort]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1); // Volver a la primera página al cambiar la búsqueda.
  }

  function handleSort(key: string) {
    setSort((prev) => nextSort(prev, key));
    setPage(1);
  }

  const pagedProductos = useMemo(
    () => sortedProductos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedProductos, page]
  );

  async function toggleDisponible(id: string, currentVal: boolean) {
    const key = `disp:${id}`;
    if (busy[key]) return;
    setBusy((b) => ({ ...b, [key]: true }));
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
      toast('Error al actualizar disponibilidad', 'error');
      console.error(err);
    } finally {
      setBusy((b) => ({ ...b, [key]: false }));
    }
  }

  async function toggleDestacado(id: string, currentVal: boolean) {
    const key = `dest:${id}`;
    if (busy[key]) return;
    setBusy((b) => ({ ...b, [key]: true }));
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
      toast('Error al actualizar destacado', 'error');
      console.error(err);
    } finally {
      setBusy((b) => ({ ...b, [key]: false }));
    }
  }

  async function handleDelete(producto: Producto) {
    const key = `del:${producto.id}`;
    if (busy[key]) return;
    const ok = await confirm({
      title: 'Eliminar producto',
      message: `¿Seguro que querés eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      danger: true,
    });
    if (!ok) return;
    setBusy((b) => ({ ...b, [key]: true }));
    try {
      const supabase = createClient();
      const { error } = await supabase.from('productos').delete().eq('id', producto.id);
      if (error) throw error;
      setProductos((prev) => prev.filter((p) => p.id !== producto.id));
      toast('Producto eliminado', 'success');
    } catch (err) {
      toast('Error al eliminar producto', 'error');
      console.error(err);
      setBusy((b) => ({ ...b, [key]: false }));
    }
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
          onChange={(e) => handleSearchChange(e.target.value)}
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
              <SortableHeader label="Nombre" sortKey="nombre" sort={sort} onSort={handleSort} />
              <SortableHeader
                label="Precio"
                sortKey="precio"
                sort={sort}
                onSort={handleSort}
                className="hidden sm:table-cell"
              />
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden md:table-cell">
                Categoría
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gold uppercase tracking-wider hidden lg:table-cell">
                Tallas
              </th>
              <SortableHeader
                label="Stock"
                sortKey="stock"
                sort={sort}
                onSort={handleSort}
                className="hidden md:table-cell"
              />
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
            {pagedProductos.map((producto) => (
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
                  <ToggleSwitch
                    checked={producto.disponible}
                    onChange={() => toggleDisponible(producto.id, producto.disponible)}
                    disabled={busy[`disp:${producto.id}`]}
                    activeColor="bg-success"
                    label={`${producto.disponible ? 'Ocultar' : 'Mostrar'} "${producto.nombre}" en la tienda`}
                  />
                </td>

                {/* Featured */}
                <td className="px-4 py-3 hidden sm:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleDestacado(producto.id, producto.destacado)}
                    disabled={busy[`dest:${producto.id}`]}
                    aria-pressed={producto.destacado}
                    aria-label={`${producto.destacado ? 'Quitar de' : 'Marcar como'} destacado: "${producto.nombre}"`}
                    className="text-text-muted hover:text-gold rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="p-1.5 text-text-secondary hover:text-gold rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
                      aria-label={`Editar "${producto.nombre}"`}
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(producto)}
                      disabled={busy[`del:${producto.id}`]}
                      aria-label={`Eliminar "${producto.nombre}"`}
                      title="Eliminar"
                      className="p-1.5 text-text-secondary hover:text-danger rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-danger transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {busy[`del:${producto.id}`] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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

      <Pagination
        currentPage={page}
        totalItems={filteredProductos.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="producto"
      />
    </div>
  );
}
