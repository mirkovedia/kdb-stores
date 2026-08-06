# KDB Stores

Tienda online de zapatillas con catálogo, carrito, pedidos por encargo y panel de administración. Construida con Next.js 16 (App Router), Supabase y Tailwind CSS v4.

El cliente arma su pedido sin registrarse, recibe un correo con el detalle y sigue el estado de su compra en tiempo real. El administrador gestiona productos, stock y pedidos desde un panel protegido.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.9 (App Router, React 19.2) |
| Lenguaje | TypeScript 5 |
| Base de datos | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (solo administradores) |
| Storage | Supabase Storage (bucket `productos`) |
| Tiempo real | Supabase Realtime (`postgres_changes`) |
| Email | Resend |
| Estilos | Tailwind CSS v4 |
| Animación | Framer Motion |
| Formularios | React Hook Form + Zod |
| Deploy | Vercel (región `gru1`) |

---

## Funcionalidades

**Público**
- Catálogo con filtros por categoría, marca y talla, ordenamiento por precio o novedad, y buscador.
- Ficha de producto con galería, tallas disponibles y distinción entre stock inmediato y producto por encargo (`es_pedido`).
- Carrito multi-producto persistido en `localStorage`.
- Checkout sin registro: el pedido se crea con nombre, email y WhatsApp.
- Seguimiento del pedido en `/pedidos/[id]` que se actualiza en vivo vía Supabase Realtime, sin recargar.
- Email transaccional con el desglose de ítems al confirmar el pedido.
- "Avísame cuando llegue": suscripción a restock de un producto agotado.
- SEO dinámico con metadata y OpenGraph por producto, más `sitemap.ts` y `robots.ts` generados.

**Panel de administración** (`/admin`)
- Dashboard con métricas y ventas por mes.
- CRUD de productos con subida de imágenes a Supabase Storage.
- Gestión de pedidos con cambio de estado e historial.
- Tablas paginadas, toasts y diálogos de confirmación propios.
- Envío manual de avisos de restock a los suscriptores de un producto.

---

## Arquitectura

### Protección del panel

El archivo `proxy.ts` en la raíz protege `/admin/*` **antes** de renderizar cualquier ruta. Sin sesión válida redirige a `/admin/login`; con sesión, saca al usuario del login hacia el dashboard. El `matcher` está acotado a `/admin` y `/admin/:path*`, así que no impacta el rendimiento del sitio público.

> En Next.js 16 este archivo se llama `proxy.ts` y exporta `proxy()`, no `middleware.ts`/`middleware()`.

### Clientes de Supabase

Hay cuatro, cada uno para un contexto distinto — usar el que corresponde importa, porque de eso depende qué políticas RLS se aplican:

| Archivo | Contexto | Clave |
|---|---|---|
| `lib/supabase/client.ts` | Componentes de cliente | `anon` |
| `lib/supabase/server.ts` | Server Components y rutas API | `anon` + cookies de sesión |
| `lib/supabase/proxy.ts` | `proxy.ts` (refresco de sesión) | `anon` + cookies |
| `lib/supabase/public.ts` | Lecturas públicas sin sesión | `anon` |

La `SUPABASE_SERVICE_ROLE_KEY` se usa solo en servidor y **nunca** se expone al cliente.

### Rutas API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Listado con filtros |
| `POST` | `/api/pedidos` | Crea un pedido con sus ítems y dispara el email |
| `GET` | `/api/pedidos/[id]` | Detalle de un pedido |
| `POST` | `/api/notificaciones` | Suscribe un email al restock de un producto |
| `POST` | `/api/notificaciones/enviar` | *(admin)* Notifica a los suscriptores y los marca como avisados |

### Esquema de datos

`categorias`, `marcas`, `productos`, `pedidos`, `pedido_items`, `pedido_historial` y `notificaciones_stock`.

RLS activo en todas las tablas: lectura pública de catálogo (solo productos con `disponible = true`), inserción libre de pedidos y suscripciones, y escritura completa restringida a usuarios autenticados.

---

## Puesta en marcha

### Requisitos

- Node.js 20 o superior
- Un proyecto de [Supabase](https://supabase.com)
- Una cuenta de [Resend](https://resend.com) con un dominio verificado

### 1. Instalar

```bash
git clone https://github.com/mirkovedia/kdb-stores.git
cd kdb-stores
npm install
```

### 2. Base de datos

En el SQL Editor de Supabase, ejecutá las migraciones **en orden**:

```
supabase/migrations/001_initial.sql              # tablas, índices y RLS
supabase/migrations/002_realtime_storage.sql     # realtime + bucket "productos"
supabase/migrations/003_pedido_items.sql         # carrito multi-producto
supabase/migrations/004_notificaciones_stock.sql # avisos de restock
```

La migración `002` crea el bucket `productos` y sus políticas. Si la subida de imágenes falla en el panel, ese es el primer lugar donde mirar.

### 3. Crear el usuario administrador

No hay registro público. Creá el usuario a mano en **Authentication → Users → Add user** en el dashboard de Supabase; con esas credenciales se entra a `/admin/login`.

### 4. Variables de entorno

Copiá el ejemplo y completá los valores:

```bash
cp .env.local.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública, protegida por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio. **Solo servidor — nunca la publiques** |
| `RESEND_API_KEY` | API key de Resend |
| `RESEND_FROM_EMAIL` | Remitente de los correos (dominio verificado) |
| `ADMIN_EMAIL` | Destino de las notificaciones de pedido nuevo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de contacto, con código de país y sin `+` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Perfil de Instagram |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, usada en metadata, OpenGraph, sitemap y robots |

### 5. Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). El panel está en `/admin`.

---

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run lint` | ESLint |

---

## Deploy

Pensado para Vercel. Importá el repo, cargá las variables de entorno y listo — `vercel.json` ya fija la región `gru1` y las cabeceras de seguridad (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

En `next.config.ts` están permitidos los dominios remotos de imágenes: `*.supabase.co` e `images.unsplash.com`. Si servís imágenes desde otro lado, agregalo ahí.

---

## Estructura

```
app/
  admin/          Panel: dashboard, productos, pedidos, login
  api/            Rutas API (productos, pedidos, notificaciones)
  carrito/        Carrito y checkout
  catalogo/       Listado con filtros y búsqueda
  producto/[slug] Ficha de producto
  pedidos/[id]    Seguimiento en tiempo real
  sitemap.ts      SEO
  robots.ts
components/       UI por dominio (home, catalogo, admin, layout, ui)
context/          CartContext (carrito en localStorage)
hooks/            useProducts, useOrder
lib/              Clientes de Supabase, Resend, validaciones Zod, utilidades
supabase/         Migraciones SQL
types/            Tipos compartidos
proxy.ts          Protección de /admin (Next 16)
```

---

## Nota sobre Next.js 16

Esta versión introduce cambios importantes respecto de versiones anteriores: `middleware.ts` pasó a ser `proxy.ts`, y varias APIs y convenciones cambiaron. Antes de modificar nada del framework, conviene leer las guías en `node_modules/next/dist/docs/` — es lo que indica el `AGENTS.md` del repo.
