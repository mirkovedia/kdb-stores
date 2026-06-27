import { NextResponse } from 'next/server';
import { notifyStockSchema } from '@/lib/validations';
import { createClient } from '@/lib/supabase/server';

// POST /api/notificaciones — suscribirse al aviso de restock de un producto
export async function POST(request: Request) {
  try {
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
