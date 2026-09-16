import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'disponible'
  | 'agotado'
  | 'pedido'
  | 'nuevo'
  | 'oferta';

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

/*
  Badges monocromos. Solo "agotado" rompe la regla —es información que el
  cliente no debe pasar por alto— y lo hace en un rojo sobrio, no en alerta.
*/
const variantStyles: Record<BadgeVariant, string> = {
  disponible: 'border-line text-ink-muted',
  agotado: 'border-danger/40 text-danger',
  pedido: 'border-ink text-ink',
  nuevo: 'border-ink bg-ink text-ink-inverse',
  oferta: 'border-ink bg-ink text-ink-inverse',
};

const variantLabels: Record<BadgeVariant, string> = {
  disponible: 'Disponible',
  agotado: 'Agotado',
  pedido: 'Por pedido',
  nuevo: 'Nuevo',
  oferta: 'Oferta',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border bg-surface px-2 py-1 text-[0.625rem] font-medium uppercase leading-none tracking-[0.15em]',
        variantStyles[variant],
        className,
      )}
    >
      {children ?? variantLabels[variant]}
    </span>
  );
}
