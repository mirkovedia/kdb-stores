'use client';

import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Texto para lectores de pantalla (obligatorio: el switch no tiene texto visible). */
  label: string;
  /** Clase de color cuando está activo (ej. 'bg-gold', 'bg-success'). */
  activeColor?: string;
  disabled?: boolean;
}

/**
 * Switch accesible: role="switch" + aria-checked, foco visible y manejo de
 * teclado nativo (Enter/Espacio al ser un <button>).
 */
export function ToggleSwitch({
  checked,
  onChange,
  label,
  activeColor = 'bg-gold',
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-5 rounded-full transition-colors shrink-0',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-kdb-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? activeColor : 'bg-kdb-elevated'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}
