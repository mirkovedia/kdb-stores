import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_build_placeholder');

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'pedidos@kdb.stores';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@kdb.stores';

export interface OrderEmailItem {
  producto_nombre: string;
  talla: string | null;
  cantidad: number;
  subtotal: number;
}

interface OrderEmailData {
  numero_pedido: string;
  cliente_nombre: string;
  producto_nombre: string;
  talla: string;
  cantidad: number;
  total: number;
  pedido_id: string;
  items?: OrderEmailItem[];
}

const PEN = (n: number) => `S/ ${n.toFixed(2)}`;

function renderItemsRows(items: OrderEmailItem[]): string {
  return items
    .map(
      (i) => `
      <tr>
        <td style="color:#F5F5F5;padding:8px 0;font-size:14px;">
          ${i.cantidad}× ${i.producto_nombre}${i.talla ? ` <span style="color:#A0A0A0;">(Talla ${i.talla})</span>` : ''}
        </td>
        <td style="color:#F5F5F5;padding:8px 0;font-size:14px;text-align:right;">${PEN(i.subtotal)}</td>
      </tr>`
    )
    .join('');
}

export function generateOrderConfirmationHTML(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Inter',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#111111;border:1px solid #222222;">
        <!-- Header -->
        <div style="padding:32px;text-align:center;border-bottom:1px solid #222222;">
          <h1 style="font-family:'Bebas Neue',Arial,sans-serif;font-size:36px;color:#C9A84C;margin:0;letter-spacing:2px;">
            KDB STORES
          </h1>
          <p style="color:#A0A0A0;margin:8px 0 0;font-size:12px;letter-spacing:1px;">
            KICKS D'BARRIO
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding:32px;">
          <h2 style="color:#F5F5F5;font-size:24px;margin:0 0 8px;">
            ¡Hola ${data.cliente_nombre}!
          </h2>
          <p style="color:#A0A0A0;font-size:16px;margin:0 0 24px;">
            Tu pedido fue recibido exitosamente 🔥
          </p>
          
          <!-- Order Details -->
          <div style="background-color:#1A1A1A;border:1px solid #222222;padding:24px;margin-bottom:24px;">
            <p style="color:#C9A84C;font-size:14px;font-weight:600;margin:0 0 16px;letter-spacing:1px;">
              DETALLE DEL PEDIDO
            </p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#A0A0A0;padding:8px 0;font-size:14px;">Número de pedido</td>
                <td style="color:#F5F5F5;padding:8px 0;font-size:14px;text-align:right;font-weight:600;">
                  ${data.numero_pedido}
                </td>
              </tr>
              ${
                data.items && data.items.length > 0
                  ? `<tr><td colspan="2" style="padding:8px 0 0;"><div style="border-top:1px solid #222222;margin-bottom:4px;"></div></td></tr>
                     ${renderItemsRows(data.items)}`
                  : `<tr>
                       <td style="color:#A0A0A0;padding:8px 0;font-size:14px;">Producto</td>
                       <td style="color:#F5F5F5;padding:8px 0;font-size:14px;text-align:right;">${data.producto_nombre}</td>
                     </tr>
                     <tr>
                       <td style="color:#A0A0A0;padding:8px 0;font-size:14px;">Talla</td>
                       <td style="color:#F5F5F5;padding:8px 0;font-size:14px;text-align:right;">${data.talla}</td>
                     </tr>
                     <tr>
                       <td style="color:#A0A0A0;padding:8px 0;font-size:14px;">Cantidad</td>
                       <td style="color:#F5F5F5;padding:8px 0;font-size:14px;text-align:right;">${data.cantidad}</td>
                     </tr>`
              }
              <tr style="border-top:1px solid #222222;">
                <td style="color:#C9A84C;padding:12px 0 0;font-size:16px;font-weight:600;">Total</td>
                <td style="color:#C9A84C;padding:12px 0 0;font-size:16px;text-align:right;font-weight:600;">
                  S/ ${data.total.toFixed(2)}
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Track Button -->
          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://kdb.stores/pedidos/${data.pedido_id}" 
               style="display:inline-block;background-color:#C9A84C;color:#0A0A0A;padding:14px 32px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:1px;">
              SEGUIR MI PEDIDO →
            </a>
          </div>
          
          <p style="color:#A0A0A0;font-size:14px;text-align:center;margin:0 0 16px;">
            En breve te contactamos para confirmar tu pedido 📱
          </p>
          
          <!-- WhatsApp -->
          <div style="text-align:center;">
            <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999'}" 
               style="color:#C9A84C;font-size:14px;text-decoration:none;">
              Contactar por WhatsApp →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding:24px;border-top:1px solid #222222;text-align:center;">
          <p style="color:#555555;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} KicksD'Barrio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateRestockHTML(data: {
  producto_nombre: string;
  slug: string;
  imagen_url?: string | null;
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kdb-stores.vercel.app';
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Inter',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#111111;border:1px solid #222222;">
        <div style="padding:32px;text-align:center;border-bottom:1px solid #222222;">
          <h1 style="font-family:'Bebas Neue',Arial,sans-serif;font-size:36px;color:#C9A84C;margin:0;letter-spacing:2px;">KDB STORES</h1>
        </div>
        <div style="padding:32px;text-align:center;">
          <h2 style="color:#F5F5F5;font-size:24px;margin:0 0 8px;">¡Volvió a stock! 🔥</h2>
          <p style="color:#A0A0A0;font-size:16px;margin:0 0 24px;">
            El producto que estabas esperando ya está disponible:
          </p>
          ${
            data.imagen_url
              ? `<img src="${data.imagen_url}" alt="${data.producto_nombre}" style="width:100%;max-width:320px;height:auto;border:1px solid #222222;margin-bottom:16px;" />`
              : ''
          }
          <p style="color:#F5F5F5;font-size:18px;font-weight:600;margin:0 0 24px;">${data.producto_nombre}</p>
          <a href="${siteUrl}/producto/${data.slug}"
             style="display:inline-block;background-color:#C9A84C;color:#0A0A0A;padding:14px 32px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:1px;">
            VER PRODUCTO →
          </a>
          <p style="color:#555555;font-size:12px;margin:24px 0 0;">Stock limitado. ¡No te quedes sin el tuyo!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateAdminNotificationHTML(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#111111;padding:32px;border:1px solid #222222;">
        <h1 style="color:#C9A84C;font-size:24px;margin:0 0 16px;">🔔 Nuevo Pedido Recibido</h1>
        <p style="color:#F5F5F5;font-size:16px;margin:0 0 8px;">
          <strong>${data.numero_pedido}</strong>
        </p>
        <p style="color:#A0A0A0;margin:0 0 4px;">Cliente: ${data.cliente_nombre}</p>
        ${
          data.items && data.items.length > 0
            ? `<p style="color:#A0A0A0;margin:8px 0 4px;">Productos:</p>
               <ul style="color:#A0A0A0;margin:0 0 8px;padding-left:18px;">
                 ${data.items
                   .map(
                     (i) =>
                       `<li>${i.cantidad}× ${i.producto_nombre}${i.talla ? ` (${i.talla})` : ''} — ${PEN(i.subtotal)}</li>`
                   )
                   .join('')}
               </ul>`
            : `<p style="color:#A0A0A0;margin:0 0 4px;">Producto: ${data.producto_nombre}</p>
               <p style="color:#A0A0A0;margin:0 0 4px;">Talla: ${data.talla} | Cantidad: ${data.cantidad}</p>`
        }
        <p style="color:#C9A84C;font-size:18px;margin:16px 0 0;">Total: S/ ${data.total.toFixed(2)}</p>
      </div>
    </body>
    </html>
  `;
}
