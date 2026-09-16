import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
  /** Link opcional a la derecha del título (ej. "Ver todo"). */
  action?: { label: string; href: string };
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = 'center',
  action,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-3 md:mb-14',
        align === 'center'
          ? 'items-center text-center'
          : 'items-start md:flex-row md:items-baseline md:justify-between',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-3',
          align === 'center' && 'items-center',
        )}
      >
        <h2 className="text-section text-ink">{title}</h2>

        {subtitle && (
          <p
            className={cn(
              'max-w-xl text-sm leading-relaxed text-ink-muted',
              align === 'center' && 'mx-auto',
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="text-nav link-underline shrink-0 text-ink-muted transition-colors hover:text-ink"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
