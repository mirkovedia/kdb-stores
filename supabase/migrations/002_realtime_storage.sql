-- ============================================================
-- 002 — Realtime para seguimiento de pedidos + Storage de imágenes
-- ============================================================

-- 1. Habilitar Realtime en las tablas del tracker de pedidos.
--    Se envuelve en DO para que sea idempotente (no falla si ya están añadidas).
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE pedido_historial;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Asegura que las filas emitan el registro completo en UPDATE/DELETE.
ALTER TABLE pedidos REPLICA IDENTITY FULL;
ALTER TABLE pedido_historial REPLICA IDENTITY FULL;

-- 2. Bucket público para imágenes de productos.
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de Storage para el bucket "productos".
-- Lectura pública.
DROP POLICY IF EXISTS "Imagenes productos lectura publica" ON storage.objects;
CREATE POLICY "Imagenes productos lectura publica" ON storage.objects
  FOR SELECT USING (bucket_id = 'productos');

-- Subida / actualización / borrado solo para usuarios autenticados (admin).
DROP POLICY IF EXISTS "Admin sube imagenes productos" ON storage.objects;
CREATE POLICY "Admin sube imagenes productos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'productos');

DROP POLICY IF EXISTS "Admin actualiza imagenes productos" ON storage.objects;
CREATE POLICY "Admin actualiza imagenes productos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'productos');

DROP POLICY IF EXISTS "Admin borra imagenes productos" ON storage.objects;
CREATE POLICY "Admin borra imagenes productos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'productos');
