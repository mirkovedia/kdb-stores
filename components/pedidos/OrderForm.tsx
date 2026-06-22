'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pedidoSchema, type PedidoFormData } from '@/lib/validations';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Producto } from '@/types';
import {
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Ruler,
} from 'lucide-react';

interface OrderSuccessData {
  pedido_id: string;
  numero_pedido: string;
}

export function OrderForm() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [success, setSuccess] = useState<OrderSuccessData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const response = await fetch('/api/productos');
        if (response.ok) {
          const data = await response.json();
          // Solo mostrar productos disponibles para compra
          setProducts(data.filter((p: Producto) => p.disponible) || []);
        }
      } catch (err) {
        console.error('Error loading products for checkout form:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      cantidad: 1,
    },
  });

  const watchedProductId = watch('producto_id');

  function handleProductChange(productId: string) {
    const product = products.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
    setValue('producto_id', productId, { shouldValidate: true });
    setValue('talla', '', { shouldValidate: false });
  }

  async function onSubmit(data: PedidoFormData) {
    setServerError(null);
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el pedido');
      }

      setSuccess({
        pedido_id: result.pedido_id,
        numero_pedido: result.numero_pedido,
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  const inputClasses =
    'w-full bg-[#121212] border border-kdb-border text-text-primary px-4 py-3 ' +
    'hover:bg-[#181818] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 focus:shadow-[0_0_15px_rgba(201,168,76,0.15)] ' +
    'transition-all duration-300 placeholder:text-text-muted rounded-sm';

  const labelClasses = 'block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2';

  const errorClasses = 'mt-1.5 text-xs text-danger flex items-center gap-1 font-medium';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-kdb-card border border-kdb-border p-8 text-center rounded-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C9A84C]/10 flex items-center justify-center border border-gold/25 shadow-sm"
            >
              <CheckCircle2 className="w-10 h-10 text-[#C9A84C]" />
            </motion.div>

            <h3 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-gold-gradient mb-2 tracking-wider">
              ¡PEDIDO RECIBIDO!
            </h3>

            <p className="text-sm text-text-secondary mb-6">
              Tu pedido fue registrado exitosamente. En breve te contactamos para confirmar.
            </p>

            <div className="bg-[#121212] border border-kdb-border p-6 mb-6 inline-block rounded-sm shadow-inner">
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1 font-bold">Número de pedido</p>
              <p className="font-[family-name:var(--font-bebas-neue)] text-2xl text-gold tracking-widest">
                {success.numero_pedido}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/pedidos/${success.pedido_id}`}
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-3 font-semibold text-sm tracking-wide hover:bg-[#E4C06A] transition-all duration-200 rounded-sm"
              >
                <Package className="w-4 h-4" />
                SEGUIR MI PEDIDO
              </Link>

              <a
                href={getWhatsAppLink(
                  `Hola! Acabo de hacer el pedido ${success.numero_pedido}. Quiero confirmar mi orden.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#C9A84C] text-[#C9A84C] px-6 py-3 font-semibold text-sm tracking-wide hover:bg-[#C9A84C]/10 transition-all duration-200 rounded-sm"
              >
                <Phone className="w-4 h-4" />
                CONTACTAR POR WHATSAPP
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Product Selection */}
            <div className="bg-kdb-card/35 backdrop-blur-md border border-kdb-border p-6 rounded-sm">
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl text-gold-gradient mb-4 flex items-center gap-2 border-b border-kdb-border pb-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                PRODUCTO
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="producto_id" className={labelClasses}>
                    Selecciona un producto *
                  </label>
                  <div className="relative group">
                    <select
                      id="producto_id"
                      className={`${inputClasses} appearance-none cursor-pointer pr-10 pl-11`}
                      onChange={(e) => handleProductChange(e.target.value)}
                      value={watchedProductId || ''}
                    >
                      <option value="" disabled>
                        {loadingProducts ? '— Cargando productos... —' : '— Elige un producto —'}
                      </option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nombre} — {formatPrice(product.precio)}
                        </option>
                      ))}
                    </select>
                    <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors duration-300 pointer-events-none" />
                  </div>
                  {errors.producto_id && (
                    <p className={errorClasses}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.producto_id.message}
                    </p>
                  )}
                </div>

                {selectedProduct && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#121212] border border-kdb-border p-4 flex items-center justify-between rounded-sm">
                      <div>
                        <p className="text-text-primary font-semibold text-sm">{selectedProduct.nombre}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          Tallas disponibles: {selectedProduct.tallas_disponibles.join(', ')}
                        </p>
                      </div>
                      <p className="text-gold font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide select-none">
                        {formatPrice(selectedProduct.precio)}
                      </p>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label htmlFor="talla" className={labelClasses}>
                    Talla *
                  </label>
                  <div className="relative group">
                    <select
                      id="talla"
                      className={`${inputClasses} appearance-none cursor-pointer pr-10 pl-11`}
                      {...register('talla')}
                      disabled={!selectedProduct}
                    >
                      <option value="" disabled>
                        {selectedProduct ? '— Selecciona tu talla —' : '— Primero elige un producto —'}
                      </option>
                      {selectedProduct?.tallas_disponibles.map((talla) => (
                        <option key={talla} value={talla}>
                          {talla}
                        </option>
                      ))}
                    </select>
                    <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors duration-300 pointer-events-none" />
                  </div>
                  {errors.talla && (
                    <p className={errorClasses}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.talla.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-kdb-card/35 backdrop-blur-md border border-kdb-border p-6 rounded-sm">
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl text-gold-gradient mb-4 flex items-center gap-2 border-b border-kdb-border pb-2">
                <User className="w-5 h-5 text-gold" />
                DATOS DEL CLIENTE
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="cliente_nombre" className={labelClasses}>
                    Nombre completo *
                  </label>
                  <div className="relative group">
                    <input
                      id="cliente_nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      className={`${inputClasses} pl-11`}
                      {...register('cliente_nombre')}
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  {errors.cliente_nombre && (
                    <p className={errorClasses}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.cliente_nombre.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cliente_whatsapp" className={labelClasses}>
                      WhatsApp *
                    </label>
                    <div className="relative group">
                      <input
                        id="cliente_whatsapp"
                        type="tel"
                        placeholder="999 888 777"
                        className={`${inputClasses} pl-11`}
                        {...register('cliente_whatsapp')}
                      />
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors duration-300" />
                    </div>
                    {errors.cliente_whatsapp && (
                      <p className={errorClasses}>
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.cliente_whatsapp.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cliente_email" className={labelClasses}>
                      Email *
                    </label>
                    <div className="relative group">
                      <input
                        id="cliente_email"
                        type="email"
                        placeholder="tu@email.com"
                        className={`${inputClasses} pl-11`}
                        {...register('cliente_email')}
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors duration-300" />
                    </div>
                    {errors.cliente_email && (
                      <p className={errorClasses}>
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.cliente_email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="cliente_direccion" className={labelClasses}>
                    Dirección de envío
                  </label>
                  <div className="relative group">
                    <input
                      id="cliente_direccion"
                      type="text"
                      placeholder="Av. Ejemplo 123, Dpto. 4B"
                      className={`${inputClasses} pl-11`}
                      {...register('cliente_direccion')}
                    />
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                </div>

                <div>
                  <label htmlFor="cliente_ciudad" className={labelClasses}>
                    Ciudad
                  </label>
                  <div className="relative group">
                    <input
                      id="cliente_ciudad"
                      type="text"
                      placeholder="Lima, Arequipa, Trujillo..."
                      className={`${inputClasses} pl-11`}
                      {...register('cliente_ciudad')}
                    />
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-kdb-card/35 backdrop-blur-md border border-kdb-border p-6 rounded-sm">
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl text-gold-gradient mb-4 flex items-center gap-2 border-b border-kdb-border pb-2">
                <FileText className="w-5 h-5 text-gold" />
                NOTAS ADICIONALES
              </h3>

              <textarea
                id="notas"
                rows={4}
                placeholder="¿Algún detalle extra? Preferencias, urgencia, etc."
                className={`${inputClasses} resize-none`}
                {...register('notas')}
              />
            </div>

            {/* Hidden quantity */}
            <input type="hidden" {...register('cantidad', { valueAsNumber: true })} />

            {/* Error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#E53E3E]/10 border border-[#E53E3E]/30 p-4 flex items-center gap-3 rounded-sm"
              >
                <AlertCircle className="w-5 h-5 text-[#E53E3E] shrink-0" />
                <p className="text-[#E53E3E] text-sm">{serverError}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] py-4 font-semibold text-sm tracking-wider uppercase hover:bg-[#E4C06A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-sm cursor-pointer hover:shadow-glow-gold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PROCESANDO...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  ENVIAR PEDIDO
                </>
              )}
            </button>

            <p className="text-center text-xs text-text-muted tracking-wider uppercase">
              Al enviar, aceptas que nos contactemos por WhatsApp para confirmar tu pedido.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
