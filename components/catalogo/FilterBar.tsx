'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
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
  { value: 'ropa-grafica', label: 'Ropa Gráfica' },
  { value: 'accesorios', label: 'Accesorios' },
];

const BRANDS = [
  'Nike',
  'Jordan',
  'Supreme',
  'Bape',
  'Stüssy',
  'New Balance',
  'Adidas',
  'Off-White',
];

const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const CLOTHING_SIZES = ['S', 'M', 'L', 'XL'];

const SORT_OPTIONS = [
  { value: 'reciente', label: 'Más reciente' },
  { value: 'precio_asc', label: 'Precio ↑' },
  { value: 'precio_desc', label: 'Precio ↓' },
] as const;

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const brandRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

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

  function toggleBrand(brand: string) {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(next);
    updateFilters({ marca: next.join(',') || undefined });
  }

  function handleSizeClick(size: string) {
    updateFilters({ talla: filters.talla === size ? undefined : size });
  }

  const currentSort = SORT_OPTIONS.find((o) => o.value === (filters.ordenar || 'reciente'));

  return (
    <div className="sticky top-0 z-40 bg-kdb-bg/95 backdrop-blur-md border-b border-kdb-border">
      <div className="container-kdb py-4 space-y-4">
        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilters({ categoria: cat.value || undefined })}
              className={cn(
                'px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-sm',
                (filters.categoria || '') === cat.value
                  ? 'bg-gold text-black'
                  : 'text-text-secondary hover:text-gold hover:bg-kdb-elevated'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Second row: Brand, Size toggle, Availability, Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand multi-select dropdown */}
          <div ref={brandRef} className="relative">
            <button
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm border rounded-sm transition-colors',
                selectedBrands.length > 0
                  ? 'border-gold text-gold'
                  : 'border-kdb-border text-text-secondary hover:border-gold/50'
              )}
            >
              <SlidersHorizontal size={14} />
              <span>
                {selectedBrands.length > 0
                  ? `Marcas (${selectedBrands.length})`
                  : 'Marcas'}
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  'transition-transform duration-200',
                  brandDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {brandDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-kdb-elevated border border-kdb-border rounded-sm shadow-xl z-50">
                <div className="p-2 space-y-1">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors text-left',
                        selectedBrands.includes(brand)
                          ? 'bg-gold/10 text-gold'
                          : 'text-text-secondary hover:bg-kdb-card hover:text-text-primary'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 border rounded-sm flex items-center justify-center text-[10px]',
                          selectedBrands.includes(brand)
                            ? 'bg-gold border-gold text-black'
                            : 'border-kdb-border'
                        )}
                      >
                        {selectedBrands.includes(brand) && '✓'}
                      </div>
                      {brand}
                    </button>
                  ))}
                </div>
                {selectedBrands.length > 0 && (
                  <div className="border-t border-kdb-border p-2">
                    <button
                      onClick={() => {
                        setSelectedBrands([]);
                        updateFilters({ marca: undefined });
                      }}
                      className="w-full text-xs text-text-muted hover:text-danger transition-colors py-1"
                    >
                      Limpiar marcas
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Size toggle button */}
          <button
            onClick={() => setShowSizes(!showSizes)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm border rounded-sm transition-colors',
              filters.talla
                ? 'border-gold text-gold'
                : 'border-kdb-border text-text-secondary hover:border-gold/50'
            )}
          >
            <span>Talla{filters.talla ? `: ${filters.talla}` : ''}</span>
            <ChevronDown
              size={14}
              className={cn(
                'transition-transform duration-200',
                showSizes && 'rotate-180'
              )}
            />
          </button>

          {/* Availability toggle */}
          <button
            onClick={() => updateFilters({ soloDisponibles: !filters.soloDisponibles })}
            className={cn(
              'px-3 py-2 text-sm border rounded-sm transition-colors',
              filters.soloDisponibles
                ? 'border-gold text-gold bg-gold/10'
                : 'border-kdb-border text-text-secondary hover:border-gold/50'
            )}
          >
            {filters.soloDisponibles ? 'Solo disponibles' : 'Incluir pedidos'}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-kdb-border text-text-secondary rounded-sm hover:border-gold/50 transition-colors"
            >
              <span>{currentSort?.label || 'Ordenar'}</span>
              <ChevronDown
                size={14}
                className={cn(
                  'transition-transform duration-200',
                  sortDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {sortDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-kdb-elevated border border-kdb-border rounded-sm shadow-xl z-50">
                <div className="p-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        updateFilters({ ordenar: option.value });
                        setSortDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-sm text-left rounded-sm transition-colors',
                        filters.ordenar === option.value || (!filters.ordenar && option.value === 'reciente')
                          ? 'text-gold bg-gold/10'
                          : 'text-text-secondary hover:bg-kdb-card hover:text-text-primary'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear all filters */}
          {(filters.categoria || filters.marca || filters.talla || filters.soloDisponibles || (filters.ordenar && filters.ordenar !== 'reciente')) && (
            <button
              onClick={() => {
                setSelectedBrands([]);
                onChange({});
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-danger hover:text-danger/80 transition-colors"
            >
              <X size={14} />
              Limpiar
            </button>
          )}
        </div>

        {/* Size grid (expandable) */}
        {showSizes && (
          <div className="pt-2 pb-1 space-y-3">
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Calzado</p>
              <div className="flex flex-wrap gap-2">
                {SHOE_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={cn(
                      'min-w-[44px] h-9 px-2 text-sm border rounded-sm transition-all duration-200 flex items-center justify-center',
                      filters.talla === size
                        ? 'bg-gold text-black border-gold'
                        : 'border-kdb-border text-text-secondary hover:border-gold hover:text-text-primary'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Ropa</p>
              <div className="flex flex-wrap gap-2">
                {CLOTHING_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={cn(
                      'min-w-[44px] h-9 px-3 text-sm border rounded-sm transition-all duration-200 flex items-center justify-center',
                      filters.talla === size
                        ? 'bg-gold text-black border-gold'
                        : 'border-kdb-border text-text-secondary hover:border-gold hover:text-text-primary'
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
