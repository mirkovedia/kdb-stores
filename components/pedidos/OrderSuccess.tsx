import { getWhatsAppLink } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface OrderSuccessProps {
  pedidoId: string;
  numeroPedido: string;
  /** Nombre del producto, si el pedido salió de una ficha concreta. */
  productoNombre?: string;
}

/*
  Confirmación de pedido. Compartida por los dos formularios (ficha de producto
  y /pedidos) para que la experiencia de cierre sea idéntica en ambos caminos.
*/
export function OrderSuccess({
  pedidoId,
  numeroPedido,
  productoNombre,
}: OrderSuccessProps) {
  const whatsappMessage = productoNombre
    ? `Hola, acabo de hacer el pedido ${numeroPedido} de ${productoNombre}. Quiero confirmar mi orden.`
    : `Hola, acabo de hacer el pedido ${numeroPedido}. Quiero confirmar mi orden.`;

  return (
    <div className="border border-line p-8 text-center md:p-10">
      <p className="text-eyebrow text-ink-muted">Pedido recibido</p>
      <h3 className="text-section mt-5 text-ink">Gracias por tu compra</h3>
      <p className="mt-5 text-sm leading-relaxed text-ink-muted">
        Registramos tu pedido. Te contactamos en breve para confirmar el pago y
        la entrega.
      </p>

      <div className="mt-8 border-y border-line py-5">
        <p className="text-eyebrow text-ink-muted">Número de pedido</p>
        <p className="mt-3 text-lg tracking-[0.15em] text-ink">{numeroPedido}</p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button href={`/pedidos/${pedidoId}`} variant="primary" size="md" fullWidth>
          Seguir mi pedido
        </Button>
        <Button
          href={getWhatsAppLink(whatsappMessage)}
          variant="outline"
          size="md"
          external
          fullWidth
        >
          Confirmar por WhatsApp
        </Button>
      </div>
    </div>
  );
}
