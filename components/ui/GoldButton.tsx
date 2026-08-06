import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GoldButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  external?: boolean;
}

export function GoldButton({
  children,
  href,
  variant = 'filled',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  external = false,
}: GoldButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs tracking-wider',
    md: 'px-6 py-3 text-sm tracking-wider',
    lg: 'px-8 py-4 text-base tracking-widest',
  };

  const variantClasses = {
    filled: cn(
      'bg-gold text-black font-semibold',
      'hover:bg-gold-light',
      'active:bg-gold-dark',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ),
    outline: cn(
      'bg-transparent text-gold border border-gold font-semibold',
      'hover:bg-gold hover:text-black',
      'active:bg-gold-dark active:border-gold-dark',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ),
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2',
    'uppercase font-[family-name:var(--font-bebas-neue)] text-lg',
    'transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-kdb-bg',
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
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={baseClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
