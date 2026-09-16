'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

/*
  El verde de WhatsApp es la única excepción al monocromo del sitio: no es
  decoración, es el color de marca de un servicio que el usuario reconoce de
  inmediato. Sin animación de entrada ni pulso.
*/
export function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href={getWhatsAppLink('Hola, me interesa un producto de KDB Stores.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors duration-200 hover:bg-[#1FAE55]"
      style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <MessageCircle size={22} strokeWidth={0} fill="currentColor" />
    </a>
  );
}
