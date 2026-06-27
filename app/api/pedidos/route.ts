import { NextResponse } from 'next/server';
import { pedidoSchema, checkoutSchema } from '@/lib/validations';
import { createClient } from '@/lib/supabase/server';
import {
  resend,
  FROM_EMAIL,
  ADMIN_EMAIL,
  generateOrderConfirmationHTML,
  generateAdminNotificationHTML,
  type OrderEmailItem,
} from '@/lib/resend';

interface ResolvedItem {
  producto_id: string;
  producto_nombre: string;
  producto_precio: number;
  talla: string | null;
  cantidad: number;
  subtotal: number;
  imagen_url: string | null;
}

async function sendEmails(args: {
  cliente_email: string;
  cliente_nombre: string;
  numero_pedido: string;
  pedido_id: string;
  producto_nombre: string;
  talla: string;
  cantidad: number;
  total: number;
  items?: OrderEmailItem[];
}) {
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxx') {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: args.cliente_email,
        subject: `Tu pedido ${args.numero_pedido} fue recibido 🔥`,
        html: generateOrderConfirmationHTML(args),
      });
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🔔 Nuevo Pedido: ${args.numero_pedido}`,
        html: generateAdminNotificationHTML(args),
      });
    }
  } catch (emailErr) {
    console.error('Error sending Resend emails:', emailErr);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // ----- Camino 1: checkout del carrito (múltiples ítems) -----
    if (Array.isArray(body.items)) {
      const validation = checkoutSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos de pedido inválidos', details: validation.error.format() },
          { status: 400 }
        );
      }
      const data = validation.data;
      const ids = [...new Set(data.items.map((i) => i.producto_id))];

      const { data: productos, error: prodError } = await supabase
        .from('productos')
        .select('id, nombre, precio, imagenes')
        .in('id', ids);

      if (prodError || !productos || productos.length === 0) {
        return NextResponse.json({ error: 'Productos no encontrados' }, { status: 404 });
      }

      const resolved: ResolvedItem[] = [];
      for (const item of data.items) {
        const prod = productos.find((p) => p.id === item.producto_id);
        if (!prod) continue;
        const precio = Number(prod.precio);
        resolved.push({
          producto_id: prod.id,
          producto_nombre: prod.nombre,
          producto_precio: precio,
          talla: item.talla || null,
          cantidad: item.cantidad,
          subtotal: precio * item.cantidad,
          imagen_url: prod.imagenes?.[0] ?? null,
        });
      }

      if (resolved.length === 0) {
        return NextResponse.json({ error: 'Productos no encontrados' }, { status: 404 });
      }

      const total = resolved.reduce((sum, i) => sum + i.subtotal, 0);
      const totalCantidad = resolved.reduce((sum, i) => sum + i.cantidad, 0);
      const esMulti = resolved.length > 1;
      const headerNombre = esMulti
        ? `${resolved.length} productos (${totalCantidad} uds.)`
        : resolved[0].producto_nombre;

      const { data: newOrder, error: orderError } = await supabase
        .from('pedidos')
        .insert({
          cliente_nombre: data.cliente_nombre,
          cliente_email: data.cliente_email,
          cliente_whatsapp: data.cliente_whatsapp,
          cliente_direccion: data.cliente_direccion,
          cliente_ciudad: data.cliente_ciudad,
          producto_id: resolved[0].producto_id,
          producto_nombre: headerNombre,
          producto_precio: resolved[0].producto_precio,
          talla: esMulti ? 'Varios' : resolved[0].talla,
          cantidad: totalCantidad,
          notas: data.notas,
          estado: 'pendiente',
          total,
        })
        .select('id, numero_pedido')
        .single();

      if (orderError || !newOrder) {
        console.error('Error inserting cart order:', orderError);
        return NextResponse.json({ error: 'Error al registrar pedido' }, { status: 500 });
      }

      const { error: itemsError } = await supabase.from('pedido_items').insert(
        resolved.map((i) => ({ ...i, pedido_id: newOrder.id }))
      );
      if (itemsError) {
        console.error('Error inserting pedido_items:', itemsError);
      }

      await supabase.from('pedido_historial').insert({
        pedido_id: newOrder.id,
        estado: 'pendiente',
        nota: 'Pedido recibido por la tienda.',
      });

      await sendEmails({
        cliente_email: data.cliente_email,
        cliente_nombre: data.cliente_nombre,
        numero_pedido: newOrder.numero_pedido,
        pedido_id: newOrder.id,
        producto_nombre: headerNombre,
        talla: esMulti ? 'Varios' : resolved[0].talla ?? '—',
        cantidad: totalCantidad,
        total,
        items: resolved.map((i) => ({
          producto_nombre: i.producto_nombre,
          talla: i.talla,
          cantidad: i.cantidad,
          subtotal: i.subtotal,
        })),
      });

      return NextResponse.json({
        success: true,
        pedido_id: newOrder.id,
        numero_pedido: newOrder.numero_pedido,
      });
    }

    // ----- Camino 2 (legacy): pedido directo de un solo producto -----
    const validation = pedidoSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de pedido inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      cliente_nombre,
      cliente_email,
      cliente_whatsapp,
      cliente_direccion,
      cliente_ciudad,
      producto_id,
      talla,
      cantidad,
      notas,
    } = validation.data;

    const { data: product, error: productError } = await supabase
      .from('productos')
      .select('nombre, precio, imagenes')
      .eq('id', producto_id)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const total = Number(product.precio) * cantidad;

    const { data: newOrder, error: orderError } = await supabase
      .from('pedidos')
      .insert({
        cliente_nombre,
        cliente_email,
        cliente_whatsapp,
        cliente_direccion,
        cliente_ciudad,
        producto_id,
        producto_nombre: product.nombre,
        producto_precio: product.precio,
        talla,
        cantidad,
        notas,
        estado: 'pendiente',
        total,
      })
      .select('id, numero_pedido')
      .single();

    if (orderError || !newOrder) {
      console.error('Error inserting order in Supabase:', orderError);
      return NextResponse.json({ error: 'Error al registrar pedido' }, { status: 500 });
    }

    // Guarda también el ítem para consistencia con el modelo multi-ítem
    await supabase.from('pedido_items').insert({
      pedido_id: newOrder.id,
      producto_id,
      producto_nombre: product.nombre,
      producto_precio: product.precio,
      talla,
      cantidad,
      subtotal: total,
      imagen_url: product.imagenes?.[0] ?? null,
    });

    await supabase.from('pedido_historial').insert({
      pedido_id: newOrder.id,
      estado: 'pendiente',
      nota: 'Pedido recibido por la tienda.',
    });

    await sendEmails({
      cliente_email,
      cliente_nombre,
      numero_pedido: newOrder.numero_pedido,
      pedido_id: newOrder.id,
      producto_nombre: product.nombre,
      talla,
      cantidad,
      total,
    });

    return NextResponse.json({
      success: true,
      pedido_id: newOrder.id,
      numero_pedido: newOrder.numero_pedido,
    });
  } catch (err) {
    console.error('Error in pedidos API:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
