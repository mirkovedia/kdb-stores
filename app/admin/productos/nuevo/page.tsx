'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { productoSchema, type ProductoFormData } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useAdminFeedback } from '@/components/admin/AdminFeedback';
import { ToggleSwitch } from '@/components/admin/ToggleSwitch';

const TALLAS_ROPA = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TALLAS_CALZADO = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function NuevoProductoPage() {
  const router = useRouter();
  const { toast } = useAdminFeedback();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);
  const [marcas, setMarcas] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const supabase = createClient();
        const { data: catData } = await supabase.from('categorias').select('id, nombre').order('orden');
        const { data: brandData } = await supabase.from('marcas').select('id, nombre').order('nombre');
        
        if (catData) setCategorias(catData);
        if (brandData) setMarcas(brandData);
      } catch (err) {
        console.error('Error loading metadata for new product form:', err);
      }
    }
    loadMetadata();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: '',
      slug: '',
      descripcion: '',
      precio: 0,
      precio_original: null,
      categoria_id: null,
      marca_id: null,
      imagenes: [],
      tallas_disponibles: [],
      es_pedido: false,
      disponible: true,
      destacado: false,
      stock: 0,
    },
  });

  const tallasValue = watch('tallas_disponibles') || [];
  const esPedido = watch('es_pedido');
  const disponible = watch('disponible');
  const destacado = watch('destacado');

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

  async function onSubmit(data: ProductoFormData) {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const finalData = {
        ...data,
        imagenes: imageUrls.filter((url) => url.trim() !== ''),
      };

      const { error } = await supabase.from('productos').insert(finalData);
      if (error) throw error;

      toast('Producto guardado exitosamente', 'success');
      router.push('/admin/productos');
    } catch (err) {
      toast(
        'Error al guardar el producto: ' +
          (err instanceof Error ? err.message : 'Error desconocido'),
        'error'
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses =
    'w-full px-4 py-3 bg-kdb-elevated border border-kdb-border rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors';
  const labelClasses = 'block text-sm font-medium text-text-secondary mb-2';
  const errorClasses = 'mt-1.5 text-xs text-danger';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/productos"
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-kdb-elevated rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-bebas-neue)] text-text-primary tracking-wide">
            Nuevo Producto
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Completa los datos del producto
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6 space-y-5">
          <h2 className="text-lg font-[family-name:var(--font-bebas-neue)] text-gold tracking-wide">
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
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6 space-y-5">
          <h2 className="text-lg font-[family-name:var(--font-bebas-neue)] text-gold tracking-wide">
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
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6 space-y-5">
          <h2 className="text-lg font-[family-name:var(--font-bebas-neue)] text-gold tracking-wide">
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
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6 space-y-5">
          <h2 className="text-lg font-[family-name:var(--font-bebas-neue)] text-gold tracking-wide">
            Tallas Disponibles
          </h2>

          {/* Clothing sizes */}
          <div>
            <p className="text-sm text-text-secondary mb-3">Ropa</p>
            <div className="flex flex-wrap gap-2">
              {TALLAS_ROPA.map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => toggleTalla(talla)}
                  className={
                    tallasValue.includes(talla)
                      ? 'px-3 py-1.5 rounded-md text-sm font-medium bg-gold text-kdb-bg transition-colors'
                      : 'px-3 py-1.5 rounded-md text-sm font-medium bg-kdb-elevated border border-kdb-border text-text-secondary hover:border-gold hover:text-gold transition-colors'
                  }
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>

          {/* Shoe sizes */}
          <div>
            <p className="text-sm text-text-secondary mb-3">Calzado</p>
            <div className="flex flex-wrap gap-2">
              {TALLAS_CALZADO.map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => toggleTalla(talla)}
                  className={
                    tallasValue.includes(talla)
                      ? 'px-3 py-1.5 rounded-md text-sm font-medium bg-gold text-kdb-bg transition-colors'
                      : 'px-3 py-1.5 rounded-md text-sm font-medium bg-kdb-elevated border border-kdb-border text-text-secondary hover:border-gold hover:text-gold transition-colors'
                  }
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6 space-y-5">
          <h2 className="text-lg font-[family-name:var(--font-bebas-neue)] text-gold tracking-wide">
            Imágenes
          </h2>

          <ImageUploader images={imageUrls} onChange={setImageUrls} />
        </div>

        {/* Toggles & Stock */}
        <div className="bg-kdb-card border border-kdb-border rounded-md p-6 space-y-5">
          <h2 className="text-lg font-[family-name:var(--font-bebas-neue)] text-gold tracking-wide">
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
            <div className="flex items-center justify-between sm:col-span-2 p-4 bg-kdb-elevated rounded-md">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Producto por Pedido
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  El producto se importa por encargo
                </p>
              </div>
              <ToggleSwitch
                checked={esPedido}
                onChange={(v) => setValue('es_pedido', v)}
                label="Producto por pedido"
                activeColor="bg-gold"
              />
            </div>

            {/* Disponible */}
            <div className="flex items-center justify-between sm:col-span-2 p-4 bg-kdb-elevated rounded-md">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Disponible
                </p>
                <p className="text-xs text-text-muted mt-0.5">
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
            <div className="flex items-center justify-between sm:col-span-2 p-4 bg-kdb-elevated rounded-md">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Destacado
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Aparece en la sección de productos destacados
                </p>
              </div>
              <ToggleSwitch
                checked={destacado}
                onChange={(v) => setValue('destacado', v)}
                label="Producto destacado"
                activeColor="bg-gold"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/productos"
            className="px-6 py-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-kdb-bg font-semibold rounded-md hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-kdb-bg/30 border-t-kdb-bg rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
