'use client';

import { OrderForm } from '@/components/pedidos/OrderForm';

const STEPS = [
  'Elegí el modelo y la talla que querés.',
  'Dejá tus datos de contacto, sin crear cuenta.',
  'Te escribimos por WhatsApp para coordinar el pago.',
  'Tu pedido llega en 2 a 3 semanas, listo para envío.',
];

export default function PedidosPage() {
  return (
    <div className="container-kdb py-12 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-section text-ink">Hacer un pedido</h1>
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">
          ¿No encontrás tu talla en stock o buscás un modelo exclusivo?
          Importamos lo que necesités desde Nueva York o Lima.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-xl">
        <h2 className="text-eyebrow border-b border-line pb-4 text-ink">
          Cómo es el proceso
        </h2>
        <ol className="mt-6 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-4 text-sm leading-relaxed text-ink-muted">
              <span className="text-eyebrow shrink-0 pt-0.5 text-ink-subtle">
                {String(i + 1).padStart(2, '0')}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-14 max-w-xl border-t border-line pt-12">
        <OrderForm />
      </div>
    </div>
  );
}
