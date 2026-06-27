'use client';

import { useState } from 'react';
import { Bell, Check, Loader2, AlertCircle } from 'lucide-react';

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
      setError('Ingresa un email válido.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto_id: productoId, email, talla: talla || undefined }),
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
    <div className="border border-kdb-border bg-kdb-card rounded-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-danger/15 text-danger text-[11px] font-bold uppercase tracking-wider">
          Agotado
        </span>
      </div>
      <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl text-text-primary tracking-wide mt-2">
        Avísame cuando llegue
      </h3>
      <p className="text-xs text-text-secondary mt-1 mb-4">
        Déjanos tu email y te avisamos apenas vuelva a stock
        {talla ? ` (talla ${talla})` : ''}.
      </p>

      {status === 'done' ? (
        <div className="flex items-center gap-2 text-success text-sm bg-success/10 border border-success/20 rounded-sm p-3">
          <Check className="w-4 h-4 shrink-0" />
          ¡Listo! Te avisaremos por email cuando esté disponible.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
              <Bell className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-[#121212] border border-kdb-border text-text-primary text-sm pl-9 pr-3 py-3 rounded-sm placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
            />
          </div>
          {error && (
            <p className="text-xs text-danger flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-gold text-black font-semibold text-sm tracking-wide uppercase py-3 rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</>
            ) : (
              <><Bell className="w-4 h-4" /> Avísame</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
