'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  /** Página actual (1-indexed). */
  currentPage: number;
  /** Total de ítems (ya filtrados). */
  totalItems: number;
  /** Ítems por página. */
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Sustantivo para el resumen ("producto", "pedido"). */
  itemLabel?: string;
}

/**
 * Calcula los números de página a mostrar, con elipsis (…) cuando hay muchas.
 * Ej: 1 … 4 5 [6] 7 8 … 20
 */
function getPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('…');

  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = 'ítem',
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  // Con una sola página (o ninguna) no hace falta el control.
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  const pages = getPageRange(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm text-text-muted">
        Mostrando <span className="text-text-secondary">{from}</span>–
        <span className="text-text-secondary">{to}</span> de{' '}
        <span className="text-text-secondary">{totalItems}</span> {itemLabel}
        {totalItems !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-kdb-elevated transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-2 text-text-muted select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={cn(
                'min-w-9 h-9 px-2 rounded-md text-sm font-medium transition-colors',
                p === currentPage
                  ? 'bg-gold text-kdb-bg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-kdb-elevated'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-kdb-elevated transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
