import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = 'left',
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-10',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <h2
        className={cn(
          'font-[family-name:var(--font-bebas-neue)] text-4xl md:text-5xl uppercase tracking-wider text-gold-gradient inline-block',
        )}
      >
        {title}
      </h2>

      <div
        className={cn(
          'mt-3 h-[2px] w-24',
          align === 'center'
            ? 'mx-auto bg-gradient-to-r from-transparent via-gold to-transparent'
            : 'bg-gradient-to-r from-gold via-gold/20 to-transparent',
        )}
      />

      {subtitle && (
        <p className="mt-4 max-w-xl text-sm md:text-base text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
