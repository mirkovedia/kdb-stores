import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'disponible' | 'agotado' | 'pedido' | 'nuevo';

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  disponible:
    'bg-success/15 text-success border-success/30',
  agotado:
    'bg-danger/15 text-danger border-danger/30',
  pedido:
    'bg-gold/15 text-gold border-gold/30',
  nuevo:
    'bg-info/15 text-info border-info/30',
};

const variantLabels: Record<BadgeVariant, string> = {
  disponible: 'Disponible',
  agotado: 'Agotado',
  pedido: 'Por pedido',
  nuevo: 'Nuevo',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest leading-none',
        variantStyles[variant],
        className,
      )}
    >
      {children ?? variantLabels[variant]}
    </span>
  );
}
