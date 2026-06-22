-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categorías
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  imagen_url TEXT,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marcas
CREATE TABLE marcas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productos
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  precio_original DECIMAL(10,2),
  categoria_id UUID REFERENCES categorias(id),
  marca_id UUID REFERENCES marcas(id),
  imagenes TEXT[] DEFAULT '{}',
  tallas_disponibles TEXT[] DEFAULT '{}',
  es_pedido BOOLEAN DEFAULT false,
  disponible BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_pedido TEXT UNIQUE NOT NULL,
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_whatsapp TEXT NOT NULL,
  cliente_direccion TEXT,
  cliente_ciudad TEXT,
  producto_id UUID REFERENCES productos(id),
  producto_nombre TEXT NOT NULL,
  producto_precio DECIMAL(10,2) NOT NULL,
  talla TEXT NOT NULL,
  cantidad INTEGER DEFAULT 1,
  notas TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN (
    'pendiente',
    'confirmado',
    'en_proceso',
    'listo',
    'enviado',
    'entregado',
    'cancelado'
  )),
  metodo_pago TEXT,
  total DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historial de estados del pedido (para el tracker)
CREATE TABLE pedido_historial (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  estado TEXT NOT NULL,
  nota TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función para auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER productos_updated_at BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER pedidos_updated_at BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Función para generar número de pedido
CREATE OR REPLACE FUNCTION generar_numero_pedido()
RETURNS TRIGGER AS $$
DECLARE
  ultimo_numero INTEGER;
  nuevo_numero TEXT;
BEGIN
  SELECT COUNT(*) INTO ultimo_numero FROM pedidos;
  nuevo_numero := 'KDB-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((ultimo_numero + 1)::TEXT, 3, '0');
  NEW.numero_pedido := nuevo_numero;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_numero_pedido BEFORE INSERT ON pedidos
  FOR EACH ROW EXECUTE FUNCTION generar_numero_pedido();

-- RLS (Row Level Security)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_historial ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (lectura)
CREATE POLICY "Categorias públicas" ON categorias FOR SELECT USING (true);
CREATE POLICY "Marcas públicas" ON marcas FOR SELECT USING (true);
CREATE POLICY "Productos públicos" ON productos FOR SELECT USING (disponible = true);

-- Políticas pedidos (el cliente puede ver su propio pedido)
CREATE POLICY "Cliente puede insertar pedido" ON pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Cliente puede ver su pedido" ON pedidos FOR SELECT USING (true);
CREATE POLICY "Historial público" ON pedido_historial FOR SELECT USING (true);

-- Políticas admin (autenticado puede hacer todo)
CREATE POLICY "Admin puede todo en productos" ON productos
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede todo en pedidos" ON pedidos
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin puede todo en historial" ON pedido_historial
  FOR ALL USING (auth.role() = 'authenticated');

-- DATA SEED (categorías y marcas iniciales)
INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
  ('Sneakers', 'sneakers', 'Zapatillas exclusivas de las mejores marcas', 1),
  ('Supreme', 'supreme', 'Drops semanales de Supreme New York', 2),
  ('Ropa Gráfica', 'ropa-grafica', 'Streetwear con diseños exclusivos', 3),
  ('Accesorios', 'accesorios', 'Gorras, medias y más', 4);

INSERT INTO marcas (nombre, slug) VALUES
  ('Nike', 'nike'),
  ('Jordan', 'jordan'),
  ('Supreme', 'supreme'),
  ('Bape', 'bape'),
  ('Off-White', 'off-white'),
  ('Adidas', 'adidas');
