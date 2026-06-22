'use client';

import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) {
    return (
      <p className="text-sm text-text-muted italic">Talla única</p>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={cn(
            'min-w-[48px] h-12 flex items-center justify-center text-sm font-medium border rounded-sm transition-all duration-200',
            selectedSize === size
              ? 'bg-gold text-black border-gold'
              : 'border-kdb-border text-text-primary hover:border-gold hover:text-gold'
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
