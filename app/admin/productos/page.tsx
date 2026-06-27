import type { Producto } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { ProductosManager } from '@/components/admin/ProductosManager';

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('productos')
    .select('*, categoria:categorias(nombre), marca:marcas(nombre)')
    .order('created_at', { ascending: false });

  return <ProductosManager initialProductos={(data as Producto[]) || []} />;
}
