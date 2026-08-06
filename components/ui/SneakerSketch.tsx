'use client';

import { motion } from 'framer-motion';

const PATHS = [
  // Suela
  'M22 266 C16 290 40 304 72 304 L448 304 C490 304 506 286 498 264 C492 248 468 242 438 242 L100 250 C64 252 28 250 22 266 Z',
  // Silueta superior (punta baja adelante, caña alta hacia el talón)
  'M26 258 C24 222 46 204 84 196 C140 184 196 166 240 134 C268 114 288 88 316 72 C336 60 356 58 368 74 C382 92 402 104 424 112 C452 122 468 148 472 186 C474 212 464 242 438 242',
  // Cuello / abertura del tobillo
  'M316 74 C330 92 352 100 372 98',
  // Pasadores
  'M156 196 L228 164 M172 182 L244 150 M188 168 L260 136 M204 154 L276 122',
  // Lengüeta
  'M120 226 C180 212 236 188 282 152',
  // Puntera
  'M26 256 C60 244 88 228 106 202',
  // Panel lateral
  'M118 240 C190 232 268 208 336 164 C352 154 368 148 384 150 C366 170 336 192 296 212 C248 234 178 244 118 240',
  // Refuerzo del talón
  'M438 242 C446 214 444 186 428 164',
  // Textura de suela
  'M70 302 L76 282 M130 302 L136 280 M190 301 L196 279 M250 301 L256 279 M310 301 L316 279 M370 302 L376 280 M430 302 L436 280',
];

interface SneakerSketchProps {
  className?: string;
}

/** Sneaker en line-art dorado que se dibuja solo al entrar en viewport. */
export function SneakerSketch({ className }: SneakerSketchProps) {
  return (
    <svg
      viewBox="0 0 520 340"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {PATHS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            pathLength: { duration: 1.4, delay: i * 0.22, ease: 'easeInOut' },
            opacity: { duration: 0.3, delay: i * 0.22 },
          }}
        />
      ))}
    </svg>
  );
}
