-- ============================================================
-- 004 — "Avísame cuando llegue": notificaciones de restock
-- ============================================================

CREATE TABLE IF NOT EXISTS notificaciones_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  talla TEXT,
  notificado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notificado_at TIMESTAMPTZ
);

-- Evita suscripciones duplicadas del mismo email al mismo producto/talla
CREATE UNIQUE INDEX IF NOT EXISTS uniq_notif_stock
  ON notificaciones_stock (producto_id, email, COALESCE(talla, ''));

CREATE INDEX IF NOT EXISTS idx_notif_stock_producto
  ON notificaciones_stock (producto_id) WHERE notificado = false;

ALTER TABLE notificaciones_stock ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede suscribirse (insertar).
DROP POLICY IF EXISTS "Suscribirse a restock" ON notificaciones_stock;
CREATE POLICY "Suscribirse a restock" ON notificaciones_stock
  FOR INSERT WITH CHECK (true);

-- Solo el admin (autenticado) puede leer/gestionar las suscripciones.
DROP POLICY IF EXISTS "Admin lee restock" ON notificaciones_stock;
CREATE POLICY "Admin lee restock" ON notificaciones_stock
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin actualiza restock" ON notificaciones_stock;
CREATE POLICY "Admin actualiza restock" ON notificaciones_stock
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin borra restock" ON notificaciones_stock;
CREATE POLICY "Admin borra restock" ON notificaciones_stock
  FOR DELETE USING (auth.role() = 'authenticated');
