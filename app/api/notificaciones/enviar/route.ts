import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, generateRestockHTML } from '@/lib/resend';

// POST /api/notificaciones/enviar — (solo admin) avisa a los interesados de un
// producto que volvió a stock y los marca como notificados.
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Solo administradores autenticados
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { producto_id } = await request.json();
    if (!producto_id) {
      return NextResponse.json({ error: 'producto_id requerido' }, { status: 400 });
    }

    const { data: producto, error: prodError } = await supabase
      .from('productos')
      .select('nombre, slug, imagenes')
      .eq('id', producto_id)
      .single();

    if (prodError || !producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const { data: subs, error: subsError } = await supabase
      .from('notificaciones_stock')
      .select('id, email')
      .eq('producto_id', producto_id)
      .eq('notificado', false);

    if (subsError) {
      return NextResponse.json({ error: subsError.message }, { status: 500 });
    }
    if (!subs || subs.length === 0) {
      return NextResponse.json({ success: true, enviados: 0 });
    }

    const html = generateRestockHTML({
      producto_nombre: producto.nombre,
      slug: producto.slug,
      imagen_url: producto.imagenes?.[0] ?? null,
    });

    let enviados = 0;
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxx') {
      for (const sub of subs) {
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: sub.email,
            subject: `${producto.nombre} volvió a stock 🔥`,
            html,
          });
          enviados++;
        } catch (emailErr) {
          console.error('Error sending restock email:', emailErr);
        }
      }
    }

    // Marca como notificados (aunque Resend no esté configurado, para no re-enviar)
    await supabase
      .from('notificaciones_stock')
      .update({ notificado: true, notificado_at: new Date().toISOString() })
      .eq('producto_id', producto_id)
      .eq('notificado', false);

    return NextResponse.json({ success: true, enviados, total: subs.length });
  } catch (err) {
    console.error('Error in enviar notificaciones API:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
