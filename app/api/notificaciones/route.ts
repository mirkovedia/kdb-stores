import { NextResponse } from 'next/server';
import { notifyStockSchema } from '@/lib/validations';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

/*
  Este endpoint es público, escribe en la base y alimenta envíos de email, así
  que es el más expuesto del sitio: sin límite, un script puede llenar la
  tabla de suscripciones y quemar la cuota de Resend en minutos.

  5 por minuto es holgado para una persona —suscribirse a varios productos
  seguidos— y corta en seco el uso automatizado.
*/
const LIMIT = 5;
const WINDOW_MS = 60_000;

// POST /api/notificaciones — suscribirse al aviso de restock de un producto
export async function POST(request: Request) {
  try {
    const limit = rateLimit(
      `notificaciones:${getClientIp(request)}`,
      LIMIT,
      WINDOW_MS,
    );

    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intentá de nuevo en un momento.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
      );
    }

    const body = await request.json();
    const validation = notifyStockSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { producto_id, email, talla } = validation.data;
    const supabase = await createClient();

    const { error } = await supabase.from('notificaciones_stock').insert({
      producto_id,
      email,
      talla: talla || null,
    });

    // Código 23505 = violación de índice único → ya estaba suscrito
    if (error && error.code !== '23505') {
      console.error('Error subscribing to restock:', error);
      return NextResponse.json({ error: 'No se pudo registrar el aviso' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in notificaciones API:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
