'use client';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn, TH_CLASSES } from '@/lib/utils';

export type SortDir = 'asc' | 'desc';
export interface SortState {
  key: string;
  dir: SortDir;
}

/** Devuelve el próximo estado de orden al clickear una columna (alterna asc/desc). */
export function nextSort(prev: SortState | null, key: string): SortState {
  if (prev?.key === key) {
    return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
  }
  return { key, dir: 'asc' };
}

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  sort: SortState | null;
  onSort: (key: string) => void;
  /** Clases extra del <th> (ej. responsive `hidden md:table-cell`). */
  className?: string;
}

const thBase = TH_CLASSES;

/** Encabezado de tabla ordenable, con aria-sort para lectores de pantalla. */
export function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: SortableHeaderProps) {
  const active = sort?.key === sortKey;
  const ariaSort = active
    ? sort!.dir === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  return (
    <th aria-sort={ariaSort} className={cn(thBase, className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 rounded-sm uppercase tracking-[0.12em] transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        {label}
        {active ? (
          sort!.dir === 'asc' ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-40" />
        )}
      </button>
    </th>
  );
}
