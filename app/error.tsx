'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/*
  Pantalla de error de la aplicación.

  Va con 'use client' porque Next le pasa `reset()`, la función que reintenta
  el render: es uno de los pocos casos donde el framework lo exige.

  Sin este archivo, un fallo de la API mostraba la pantalla genérica de Next
  —sin diseño y casi sin texto—, y el cliente asumía que la tienda estaba
  caída en lugar de reintentar.
*/
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // El digest identifica el error en los logs del servidor sin exponer
    // detalles internos al cliente.
    console.error('Error en la aplicación:', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="container-kdb py-24 text-center md:py-32">
      <p className="text-eyebrow text-ink-muted">Algo salió mal</p>

      <h1 className="text-section mx-auto mt-6 max-w-lg text-ink">
        No pudimos cargar esta página
      </h1>

      <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
        Puede ser un problema momentáneo de conexión. Probá de nuevo; si sigue
        pasando, escribinos y lo resolvemos.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={reset} variant="primary" size="md">
          Reintentar
        </Button>
        <Button href="/catalogo" variant="outline" size="md">
          Ir al catálogo
        </Button>
      </div>

      <p className="mt-10 text-xs text-ink-subtle">
        ¿Necesitás ayuda?{' '}
        <Link href="/nosotros" className="link-underline text-ink-muted">
          Contactanos
        </Link>
      </p>
    </div>
  );
}
