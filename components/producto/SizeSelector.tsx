'use client';

import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) {
    return <p className="text-sm text-ink-muted">Talla única</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          // Botón de dos estados: sin aria-pressed, un lector de pantalla no
          // anuncia cuál talla está elegida.
          aria-pressed={selectedSize === size}
          className={cn(
            'flex h-12 min-w-[3rem] items-center justify-center border px-3 text-nav transition-colors',
            selectedSize === size
              ? 'border-ink bg-ink text-ink-inverse'
              : 'border-line text-ink hover:border-ink',
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
