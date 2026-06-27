-- ============================================================
-- 003 — Carrito multi-producto: ítems de pedido
-- ============================================================

-- La tabla pedidos sigue siendo la "cabecera" del pedido. Para soportar
-- pedidos con varios productos, los detalles viven en pedido_items.
-- Para pedidos de un solo producto, las columnas de cabecera siguen
-- guardando un snapshot legible (compatibilidad con el flujo directo).

-- Permitir cabeceras de pedidos multi-ítem sin un único producto/talla.
ALTER TABLE pedidos ALTER COLUMN talla DROP NOT NULL;

CREATE TABLE IF NOT EXISTS pedido_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  producto_nombre TEXT NOT NULL,      -- Snapshot del nombre al momento del pedido
  producto_precio DECIMAL(10,2) NOT NULL,
  talla TEXT,
  cantidad INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido_id ON pedido_items(pedido_id);

-- RLS
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cliente puede insertar items" ON pedido_items;
CREATE POLICY "Cliente puede insertar items" ON pedido_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Items visibles" ON pedido_items;
CREATE POLICY "Items visibles" ON pedido_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin puede todo en items" ON pedido_items;
CREATE POLICY "Admin puede todo en items" ON pedido_items
  FOR ALL USING (auth.role() = 'authenticated');
