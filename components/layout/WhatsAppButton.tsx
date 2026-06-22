'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

export function WhatsAppButton() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <motion.a
      href={getWhatsAppLink('Hola! Me interesa un producto de KDB Stores 🔥')}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg hover:bg-[#20BD5A] transition-colors duration-200 animate-pulse-gold"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={20} fill="white" strokeWidth={0} />
      <span className="text-sm font-semibold tracking-wide hidden sm:inline">
        Consultar
      </span>
    </motion.a>
  );
}
