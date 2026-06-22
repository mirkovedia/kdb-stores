'use client';

import { OrderForm } from '@/components/pedidos/OrderForm';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function PedidosPage() {
  return (
    <div className="py-12 md:py-20 bg-kdb-bg min-h-screen">
      <div className="container-kdb">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <SectionTitle
            title="Hacer un Pedido"
            subtitle="¿No encuentras tu talla en stock? ¿Buscas un modelo exclusivo? Importamos tus zapatillas favoritas directamente desde Nueva York o Lima."
          />
          <div className="mt-6 p-4 bg-kdb-card border border-kdb-border rounded-sm text-left max-w-lg mx-auto">
            <h4 className="font-semibold text-gold mb-2 text-sm uppercase tracking-wider">ℹ️ Proceso de Importación:</h4>
            <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4">
              <li>Elige el modelo y talla deseada en el formulario.</li>
              <li>Registra tus datos de contacto (sin crear cuenta).</li>
              <li>Nos contactaremos contigo por WhatsApp para coordinar el pago inicial.</li>
              <li>Tu pedido llegará en un estimado de 2 a 3 semanas. ¡Listo para envío a todo el Perú!</li>
            </ul>
          </div>
        </div>

        <div className="bg-kdb-card border border-kdb-border p-6 md:p-10 rounded-sm max-w-2xl mx-auto shadow-gold">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
