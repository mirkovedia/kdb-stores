'use client';

import { useState, useEffect } from 'react';

/**
 * Mensajes de la barra. Cada uno debe ser verificable: son promesas
 * comerciales, no copy de relleno.
 */
const MESSAGES = [
  'Envíos a todo el Perú',
  'Pago contra entrega',
  'Autenticidad verificada',
] as const;

const ROTATION_MS = 4000;

/*
  Barra de anuncio: franja negra fija arriba del navbar.

  Rota entre mensajes con un crossfade en lugar de un marquee lateral. Un
  marquee obliga a esperar a que el texto pase para leerlo y se corta en
  móvil; así cada mensaje se ve completo y centrado.

  Con prefers-reduced-motion la rotación se detiene en el primer mensaje.
*/
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced || MESSAGES.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, ROTATION_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-surface-inverse">
      {/*
        La altura es fija y los mensajes se apilan en la misma celda, así la
        barra no salta de alto al cambiar a un texto más largo.
      */}
      <div className="container-kdb relative flex h-9 items-center justify-center overflow-hidden">
        {MESSAGES.map((message, i) => (
          <p
            key={message}
            aria-hidden={i !== index}
            className="text-eyebrow absolute inset-0 flex items-center justify-center text-center text-ink-inverse transition-opacity duration-500 ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}
