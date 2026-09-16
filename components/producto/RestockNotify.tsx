'use client';

import { useState } from 'react';

interface RestockNotifyProps {
  productoId: string;
  talla?: string;
}

export function RestockNotify({ productoId, talla }: RestockNotifyProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresá un email válido.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: productoId,
          email,
          talla: talla || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo registrar el aviso');
      }

      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  return (
    <div className="border border-line p-6">
      <span className="border border-danger/40 px-2 py-1 text-[0.625rem] font-medium uppercase leading-none tracking-[0.15em] text-danger">
        Agotado
      </span>

      <h3 className="text-product mt-5 text-ink">Avisame cuando llegue</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Dejanos tu email y te escribimos en cuanto vuelva a stock
        {talla ? ` en talla ${talla}` : ''}.
      </p>

      {status === 'done' ? (
        <p className="mt-5 border-l-2 border-ink pl-4 text-sm text-ink">
          Listo. Te avisamos por email cuando esté disponible.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="restock-email" className="sr-only">
            Tu email
          </label>
          <input
            id="restock-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-12 w-full border border-line bg-surface px-4 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none"
          />

          {error && (
            <p role="alert" className="mt-3 text-xs text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-solid mt-3 h-12 w-full"
          >
            {status === 'loading' ? 'Registrando…' : 'Avisame'}
          </button>
        </form>
      )}
    </div>
  );
}
