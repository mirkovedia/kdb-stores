import type { Pedido } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { PedidosManager } from '@/components/admin/PedidosManager';

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  return <PedidosManager initialPedidos={(data as Pedido[]) || []} />;
}
