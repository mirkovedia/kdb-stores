import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase sin cookies para lecturas públicas (catálogo, productos,
 * sitemap). Al no depender de `cookies()`, permite que las páginas/servidores
 * que solo leen datos públicos se rendericen de forma estática.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
