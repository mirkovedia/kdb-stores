'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Bell, Send } from 'lucide-react';
import { productoSchema, type ProductoFormData } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useAdminFeedback } from '@/components/admin/AdminFeedback';
import { ToggleSwitch } from '@/components/admin/ToggleSwitch';
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_ERROR,
  ADMIN_CARD,
} from '@/components/admin/formClasses';

const TALLAS_ROPA = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TALLAS_CALZADO = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditarProductoPage({ params }: EditProductPageProps) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const router = useRouter();
  const { toast, confirm } = useAdminFeedback();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingNotifs, setPendingNotifs] = useState(0);
  const [sendingNotifs, setSendingNotifs] = useState(false);
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);
  const [marcas, setMarcas] = useState<{ id: string; nombre: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
  });

  const tallasValue = watch('tallas_disponibles') || [];
  const esPedido = watch('es_pedido');
  const disponible = watch('disponible');
  const destacado = watch('destacado');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const supabase = createClient();

        // Load categories and brands
        const { data: catData } = await supabase.from('categorias').select('id, nombre').order('orden');
        const { data: brandData } = await supabase.from('marcas').select('id, nombre').order('nombre');

        if (catData) setCategorias(catData);
        if (brandData) setMarcas(brandData);

        // Load current product data
        const { data: product, error } = await supabase
          .from('productos')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;

        if (product) {
          reset({
            nombre: product.nombre,
            slug: product.slug,
            descripcion: product.descripcion || '',
            precio: Number(product.precio),
            precio_original: product.precio_original ? Number(product.precio_original) : null,
            categoria_id: product.categoria_id,
            marca_id: product.marca_id,
            imagenes: product.imagenes || [],
            tallas_disponibles: product.tallas_disponibles || [],
            es_pedido: product.es_pedido,
            disponible: product.disponible,
            destacado: product.destacado,
            stock: product.stock,
          });

          setImageUrls(product.imagenes && product.imagenes.length > 0 ? product.imagenes : []);
        }

        // Interesados pendientes de aviso de restock
        const { count } = await supabase
          .from('notificaciones_stock')
          .select('*', { count: 'exact', head: true })
          .eq('producto_id', productId)
          .eq('notificado', false);
        setPendingNotifs(count || 0);
      } catch (err) {
        console.error('Error loading product for editing:', err);
        toast('Error al cargar datos del producto', 'error');
        router.push('/admin/productos');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId, reset, router, toast]);

  function handleNombreChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nombre = e.target.value;
    setValue('nombre', nombre);
    setValue('slug', slugify(nombre));
  }

  function toggleTalla(talla: string) {
    const current = tallasValue;
    if (current.includes(talla)) {
      setValue(
        'tallas_disponibles',
        current.filter((t) => t !== talla)
      );
    } else {
      setValue('tallas_disponibles', [...current, talla]);
    }
  }

  async function handleSendNotifs() {
    if (pendingNotifs === 0) return;
    const ok = await confirm({
      title: 'Notificar restock',
      message: `¿Enviar el aviso de que el producto llegó a ${pendingNotifs} interesado(s)?`,
      confirmLabel: 'Enviar avisos',
    });
    if (!ok) return;
    setSendingNotifs(true);
    try {
      const res = await fetch('/api/notificaciones/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto_id: productId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al enviar');
      toast(`Avisos enviados: ${result.enviados} de ${result.total ?? pendingNotifs}`, 'success');
      setPendingNotifs(0);
    } catch (err) {
      toast(
        'Error al enviar los avisos: ' +
          (err instanceof Error ? err.message : 'desconocido'),
        'error'
      );
    } finally {
      setSendingNotifs(false);
    }
  }

  async function onSubmit(data: ProductoFormData) {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const finalData = {
        ...data,
        imagenes: imageUrls.filter((url) => url.trim() !== ''),
      };

      const { error } = await supabase
        .from('productos')
        .update(finalData)
        .eq('id', productId);

      if (error) throw error;

      toast('Producto actualizado exitosamente', 'success');
      router.push('/admin/productos');
    } catch (err) {
      toast(
        'Error al actualizar el producto: ' +
          (err instanceof Error ? err.message : 'Error desconocido'),
        'error'
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses = ADMIN_INPUT;
  const labelClasses = ADMIN_LABEL;
  const errorClasses = ADMIN_ERROR;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-7 w-7 animate-spin text-ink-muted" strokeWidth={1.5} />
          <p className="text-sm text-ink-muted">Cargando datos del producto…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/productos"
          className="rounded-md p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold uppercase tracking-[0.15em] text-ink">
            Editar Producto
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Modifica la información de tu inventario
          </p>
        </div>
      </div>

      {/* Interesados en restock */}
      {pendingNotifs > 0 && (
        <div className="flex flex-col justify-between gap-3 rounded-md border border-ink bg-surface-muted p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 shrink-0 text-ink" strokeWidth={1.5} />
            <p className="text-sm text-ink">
              <span className="font-semibold text-ink">{pendingNotifs}</span> persona
              {pendingNotifs !== 1 ? 's' : ''} esperando este producto.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSendNotifs}
            disabled={sendingNotifs}
            className="btn-solid h-11 shrink-0 rounded-md px-5"
          >
            {sendingNotifs ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
            ) : (
              <><Send className="w-4 h-4" /> Notificar que llegó</>
            )}
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className={`${ADMIN_CARD} space-y-5`}>
          <h2 className="text-eyebrow text-ink">
            Información Básica
          </h2>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className={labelClasses}>
              Nombre del Producto *
            </label>
            <input
              id="nombre"
              type="text"
              {...register('nombre')}
              onChange={handleNombreChange}
              className={inputClasses}
              placeholder="Nike Air Jordan 1 Retro High OG"
            />
            {errors.nombre && (
              <p className={errorClasses}>{errors.nombre.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className={labelClasses}>
              Slug (URL) *
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className={inputClasses}
              placeholder="nike-air-jordan-1-retro-high-og"
            />
            {errors.slug && (
              <p className={errorClasses}>{errors.slug.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className={labelClasses}>
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={4}
              {...register('descripcion')}
              className={inputClasses + ' resize-y'}
              placeholder="Descripción detallada del producto..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className={`${ADMIN_CARD} space-y-5`}>
          <h2 className="text-eyebrow text-ink">
            Precios
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Precio */}
            <div>
              <label htmlFor="precio" className={labelClasses}>
                Precio (S/) *
              </label>
              <input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                {...register('precio', { valueAsNumber: true })}
                className={inputClasses}
                placeholder="450.00"
              />
              {errors.precio && (
                <p className={errorClasses}>{errors.precio.message}</p>
              )}
            </div>

            {/* Precio Original */}
            <div>
              <label htmlFor="precio_original" className={labelClasses}>
                Precio Original (S/) — opcional
              </label>
              <input
                id="precio_original"
                type="number"
                step="0.01"
                min="0"
                {...register('precio_original', {
                  setValueAs: (v) => {
                    if (v === '' || v === null || v === undefined) return null;
                    const n = parseFloat(v);
                    return Number.isNaN(n) ? null : n;
                  },
                })}
                className={inputClasses}
                placeholder="550.00"
              />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className={`${ADMIN_CARD} space-y-5`}>
          <h2 className="text-eyebrow text-ink">
            Clasificación
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Categoría */}
            <div>
              <label htmlFor="categoria_id" className={labelClasses}>
                Categoría
              </label>
              <select
                id="categoria_id"
                {...register('categoria_id', { setValueAs: (v) => (v === '' ? null : v) })}
                className={inputClasses}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label htmlFor="marca_id" className={labelClasses}>
                Marca
              </label>
              <select
                id="marca_id"
                {...register('marca_id', { setValueAs: (v) => (v === '' ? null : v) })}
                className={inputClasses}
              >
                <option value="">Seleccionar marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className={`${ADMIN_CARD} space-y-5`}>
          <h2 className="text-eyebrow text-ink">
            Tallas Disponibles
          </h2>

          {/* Clothing sizes */}
          <div>
            <p className="mb-3 text-sm text-ink-muted">Ropa</p>
            <div className="flex flex-wrap gap-2">
              {TALLAS_ROPA.map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => toggleTalla(talla)}
                  className={
                    tallasValue.includes(talla)
                      ? 'rounded-md border border-ink bg-ink px-3 py-1.5 text-sm transition-colors text-ink-inverse'
                      : 'rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink'
                  }
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>

          {/* Shoe sizes */}
          <div>
            <p className="mb-3 text-sm text-ink-muted">Calzado</p>
            <div className="flex flex-wrap gap-2">
              {TALLAS_CALZADO.map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => toggleTalla(talla)}
                  className={
                    tallasValue.includes(talla)
                      ? 'rounded-md border border-ink bg-ink px-3 py-1.5 text-sm transition-colors text-ink-inverse'
                      : 'rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink'
                  }
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={`${ADMIN_CARD} space-y-5`}>
          <h2 className="text-eyebrow text-ink">
            Imágenes
          </h2>

          <ImageUploader images={imageUrls} onChange={setImageUrls} />
        </div>

        {/* Toggles & Stock */}
        <div className={`${ADMIN_CARD} space-y-5`}>
          <h2 className="text-eyebrow text-ink">
            Opciones
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Stock */}
            <div>
              <label htmlFor="stock" className={labelClasses}>
                Stock
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                {...register('stock', {
                  setValueAs: (v) => {
                    const n = parseInt(v, 10);
                    return Number.isNaN(n) ? 0 : n;
                  },
                })}
                className={inputClasses}
                placeholder="0"
              />
            </div>

            {/* Spacer for grid alignment */}
            <div className="hidden sm:block" />

            {/* Es pedido */}
            <div className="flex items-center justify-between rounded-md bg-surface-muted p-4 sm:col-span-2">
              <div>
                <p className="text-sm font-medium text-ink">
                  Producto por Pedido
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  El producto se importa por encargo
                </p>
              </div>
              <ToggleSwitch
                checked={esPedido}
                onChange={(v) => setValue('es_pedido', v)}
                label="Producto por pedido"
                activeColor="bg-ink"
              />
            </div>

            {/* Disponible */}
            <div className="flex items-center justify-between rounded-md bg-surface-muted p-4 sm:col-span-2">
              <div>
                <p className="text-sm font-medium text-ink">
                  Disponible
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Visible en la tienda para los clientes
                </p>
              </div>
              <ToggleSwitch
                checked={disponible}
                onChange={(v) => setValue('disponible', v)}
                label="Disponible en la tienda"
                activeColor="bg-success"
              />
            </div>

            {/* Destacado */}
            <div className="flex items-center justify-between rounded-md bg-surface-muted p-4 sm:col-span-2">
              <div>
                <p className="text-sm font-medium text-ink">
                  Destacado
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Aparece en la sección de productos destacados
                </p>
              </div>
              <ToggleSwitch
                checked={destacado}
                onChange={(v) => setValue('destacado', v)}
                label="Producto destacado"
                activeColor="bg-ink"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/productos"
            className="px-6 py-3 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-solid h-12 rounded-md px-8"
          >
            {!isSubmitting && <Save size={17} strokeWidth={1.5} />}
            {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
