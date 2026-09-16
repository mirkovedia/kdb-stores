'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductFilters } from '@/types';

interface FilterBarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

const CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'supreme', label: 'Supreme' },
  { value: 'ropa-grafica', label: 'Ropa gráfica' },
  { value: 'accesorios', label: 'Accesorios' },
];

// Cada marca filtra por su `slug` (lo que espera la API), mostrando el `name`.
const BRANDS: { name: string; slug: string }[] = [
  { name: 'Nike', slug: 'nike' },
  { name: 'Jordan', slug: 'jordan' },
  { name: 'Supreme', slug: 'supreme' },
  { name: 'Bape', slug: 'bape' },
  { name: 'Stüssy', slug: 'stussy' },
  { name: 'New Balance', slug: 'new-balance' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'Off-White', slug: 'off-white' },
];

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const CLOTHING_SIZES = ['S', 'M', 'L', 'XL'];

const SORT_OPTIONS = [
  { value: 'reciente', label: 'Más reciente' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
] as const;

/** Estilos compartidos por los disparadores de filtro, para que midan igual. */
const TRIGGER_BASE =
  'flex h-10 items-center gap-2 border px-4 text-nav transition-colors';

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.busqueda ?? '');

  // Las marcas seleccionadas se derivan de la URL (sin estado duplicado).
  const selectedBrands = filters.marca ? filters.marca.split(',') : [];

  const brandRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Debounce: actualiza el filtro de búsqueda 350ms después de dejar de teclear.
  useEffect(() => {
    const current = filters.busqueda ?? '';
    if (searchValue === current) return;
    const timer = setTimeout(() => {
      onChange({ ...filters, busqueda: searchValue.trim() || undefined });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Mantiene el input en sync cuando la búsqueda cambia desde fuera (URL, limpiar).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(filters.busqueda ?? '');
  }, [filters.busqueda]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
        setBrandDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function updateFilters(partial: Partial<ProductFilters>) {
    onChange({ ...filters, ...partial });
  }

  function toggleBrand(slug: string) {
    const next = selectedBrands.includes(slug)
      ? selectedBrands.filter((b) => b !== slug)
      : [...selectedBrands, slug];
    updateFilters({ marca: next.join(',') || undefined });
  }

  function handleSizeClick(size: string) {
    updateFilters({ talla: filters.talla === size ? undefined : size });
  }

  const currentSort = SORT_OPTIONS.find(
    (o) => o.value === (filters.ordenar || 'reciente'),
  );

  const hasActiveFilters = Boolean(
    filters.categoria ||
      filters.marca ||
      filters.talla ||
      filters.busqueda ||
      filters.soloDisponibles ||
      (filters.ordenar && filters.ordenar !== 'reciente'),
  );

  return (
    <div className="border-y border-line bg-surface">
      <div className="container-kdb space-y-5 py-5">
        {/* Buscador */}
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-subtle">
            <Search size={16} strokeWidth={1.5} />
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar por nombre, marca o modelo"
            aria-label="Buscar productos"
            className="h-12 w-full border border-line bg-surface pl-11 pr-11 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-subtle transition-colors hover:text-ink"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Categorías: pestañas subrayadas, no botones rellenos */}
        <div className="scrollbar-none flex items-center gap-7 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const active = (filters.categoria || '') === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => updateFilters({ categoria: cat.value || undefined })}
                className={cn(
                  'whitespace-nowrap border-b-2 pb-2 text-nav transition-colors',
                  active
                    ? 'border-ink text-ink'
                    : 'border-transparent text-ink-muted hover:text-ink',
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Marca, talla, disponibilidad y orden */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Marcas (multi-select) */}
          <div ref={brandRef} className="relative">
            <button
              type="button"
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              aria-expanded={brandDropdownOpen}
              className={cn(
                TRIGGER_BASE,
                selectedBrands.length > 0
                  ? 'border-ink text-ink'
                  : 'border-line text-ink-muted hover:border-ink hover:text-ink',
              )}
            >
              <span>
                {selectedBrands.length > 0
                  ? `Marcas (${selectedBrands.length})`
                  : 'Marcas'}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={cn('transition-transform duration-200', brandDropdownOpen && 'rotate-180')}
              />
            </button>

            {brandDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-60 border border-line bg-surface">
                {BRANDS.map((brand) => {
                  const checked = selectedBrands.includes(brand.slug);
                  return (
                    <button
                      key={brand.slug}
                      type="button"
                      onClick={() => toggleBrand(brand.slug)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-nav text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center border',
                          checked ? 'border-ink bg-ink' : 'border-line',
                        )}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 10 8"
                            className="h-2 w-2.5 fill-none stroke-white stroke-2"
                            aria-hidden="true"
                          >
                            <path d="M1 4l2.5 2.5L9 1" />
                          </svg>
                        )}
                      </span>
                      {brand.name}
                    </button>
                  );
                })}

                {selectedBrands.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateFilters({ marca: undefined })}
                    className="w-full border-t border-line px-4 py-3 text-left text-nav text-ink-subtle transition-colors hover:text-ink"
                  >
                    Limpiar marcas
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Talla */}
          <button
            type="button"
            onClick={() => setShowSizes(!showSizes)}
            aria-expanded={showSizes}
            className={cn(
              TRIGGER_BASE,
              filters.talla
                ? 'border-ink text-ink'
                : 'border-line text-ink-muted hover:border-ink hover:text-ink',
            )}
          >
            <span>Talla{filters.talla ? `: ${filters.talla}` : ''}</span>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className={cn('transition-transform duration-200', showSizes && 'rotate-180')}
            />
          </button>

          {/* Disponibilidad */}
          <button
            type="button"
            onClick={() => updateFilters({ soloDisponibles: !filters.soloDisponibles })}
            aria-pressed={Boolean(filters.soloDisponibles)}
            className={cn(
              TRIGGER_BASE,
              filters.soloDisponibles
                ? 'border-ink bg-ink text-ink-inverse'
                : 'border-line text-ink-muted hover:border-ink hover:text-ink',
            )}
          >
            Solo disponibles
          </button>

          <div className="flex-1" />

          {/* Orden */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              aria-expanded={sortDropdownOpen}
              className={cn(TRIGGER_BASE, 'border-line text-ink-muted hover:border-ink hover:text-ink')}
            >
              <span>{currentSort?.label ?? 'Ordenar'}</span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={cn('transition-transform duration-200', sortDropdownOpen && 'rotate-180')}
              />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-56 border border-line bg-surface">
                {SORT_OPTIONS.map((option) => {
                  const active =
                    filters.ordenar === option.value ||
                    (!filters.ordenar && option.value === 'reciente');
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        updateFilters({ ordenar: option.value });
                        setSortDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-4 py-3 text-left text-nav transition-colors hover:bg-surface-muted',
                        active ? 'text-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                onChange({});
              }}
              className="text-nav link-underline text-ink-muted transition-colors hover:text-ink"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Tallas (desplegable) */}
        {showSizes && (
          <div className="space-y-5 border-t border-line pt-5">
            <div>
              <p className="text-eyebrow mb-3 text-ink-muted">Calzado</p>
              <div className="flex flex-wrap gap-2">
                {SHOE_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeClick(size)}
                    aria-pressed={filters.talla === size}
                    className={cn(
                      'flex h-10 min-w-[2.75rem] items-center justify-center border px-2 text-nav transition-colors',
                      filters.talla === size
                        ? 'border-ink bg-ink text-ink-inverse'
                        : 'border-line text-ink-muted hover:border-ink hover:text-ink',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-eyebrow mb-3 text-ink-muted">Ropa</p>
              <div className="flex flex-wrap gap-2">
                {CLOTHING_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeClick(size)}
                    aria-pressed={filters.talla === size}
                    className={cn(
                      'flex h-10 min-w-[2.75rem] items-center justify-center border px-3 text-nav transition-colors',
                      filters.talla === size
                        ? 'border-ink bg-ink text-ink-inverse'
                        : 'border-line text-ink-muted hover:border-ink hover:text-ink',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
