import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  external?: boolean;
  fullWidth?: boolean;
  'aria-label'?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-5 text-[0.6875rem] tracking-[0.15em]',
  md: 'h-11 px-7 text-xs tracking-[0.15em]',
  lg: 'h-14 px-10 text-xs tracking-[0.2em]',
};

// El borde va en las tres variantes —aunque sea del color del fondo— para que
// todas midan exactamente lo mismo y se alineen al ponerlas lado a lado.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-ink bg-ink text-ink-inverse hover:bg-ink-muted hover:border-ink-muted',
  outline:
    'border border-ink bg-transparent text-ink hover:bg-ink hover:text-ink-inverse',
  ghost:
    'border border-line bg-transparent text-ink hover:border-ink',
};

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  external = false,
  fullWidth = false,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 uppercase font-medium',
    'transition-colors duration-200',
    // Deshabilitado por color, no por opacidad: ver .btn-solid en globals.css.
    'disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:text-ink-subtle',
    'disabled:hover:border-line disabled:hover:bg-surface-muted disabled:hover:text-ink-subtle',
    fullWidth && 'w-full',
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
