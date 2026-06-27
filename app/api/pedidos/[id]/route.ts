import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verify if parameter is a UUID or a custom serial number (e.g. KDB-2026-001)
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

    let query = supabase.from('pedidos').select('*');
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      // Perform case-insensitive search by numero_pedido
      query = query.ilike('numero_pedido', id);
    }

    const { data: pedido, error: pedidoError } = await query.maybeSingle();

    if (pedidoError) {
      console.error('Error fetching order from Supabase:', pedidoError);
      return NextResponse.json({ error: pedidoError.message }, { status: 500 });
    }

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Retrieve order status logs sorted by date ascending
    const { data: historial, error: historialError } = await supabase
      .from('pedido_historial')
      .select('*')
      .eq('pedido_id', pedido.id)
      .order('created_at', { ascending: true });

    if (historialError) {
      console.error('Error fetching order status history from Supabase:', historialError);
      return NextResponse.json({ error: historialError.message }, { status: 500 });
    }

    // Ítems del pedido (carrito multi-producto)
    const { data: items } = await supabase
      .from('pedido_items')
      .select('*')
      .eq('pedido_id', pedido.id)
      .order('created_at', { ascending: true });

    return NextResponse.json({ pedido, historial, items: items || [] });
  } catch (err) {
    console.error('Error fetching order:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
