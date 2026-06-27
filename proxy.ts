import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

/**
 * Protección server-side del panel de administración.
 * Se ejecuta antes de renderizar cualquier ruta /admin/* (ver matcher):
 * - Sin sesión válida -> redirige a /admin/login.
 * - Con sesión y visitando /admin/login -> redirige al dashboard /admin.
 */
export async function proxy(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isLogin = path === '/admin/login';

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // Solo corre en el panel admin (no impacta el resto del sitio ni su performance).
  matcher: ['/admin', '/admin/:path*'],
};
