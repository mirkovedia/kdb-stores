'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pedidoSchema, type PedidoFormData } from '@/lib/validations';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { GoldButton } from '@/components/ui/GoldButton';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Package,
} from 'lucide-react';
import type { Producto } from '@/types';

interface OrderFormProps {
  product: Producto;
  selectedSize: string;
}

interface OrderSuccessData {
  pedido_id: string;
  numero_pedido: string;
}

export function OrderForm({ product, selectedSize }: OrderFormProps) {
  const [success, setSuccess] = useState<OrderSuccessData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      producto_id: product.id,
      talla: selectedSize || '',
      cantidad: 1,
    },
  });

  // Sync selectedSize prop with React Hook Form
  useEffect(() => {
    setValue('talla', selectedSize, { shouldValidate: !!selectedSize });
  }, [selectedSize, setValue]);

  // Sync product.id if it changes
  useEffect(() => {
    setValue('producto_id', product.id);
  }, [product.id, setValue]);

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
    <div className="w-full">
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
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A84C]/10 flex items-center justify-center border border-gold/25"
            >
              <CheckCircle2 className="w-8 h-8 text-[#C9A84C]" />
            </motion.div>

            <h3 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-gold-gradient mb-2 tracking-wider">
              ¡PEDIDO RECIBIDO!
            </h3>

            <p className="text-sm text-text-secondary mb-6">
              Tu pedido fue registrado exitosamente. En breve te contactamos para confirmar.
            </p>

            <div className="bg-[#121212] border border-kdb-border p-4 mb-6 inline-block rounded-sm shadow-inner">
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1 font-bold">Número de pedido</p>
              <p className="font-[family-name:var(--font-bebas-neue)] text-2xl text-gold tracking-widest">
                {success.numero_pedido}
              </p>
            </div>

            <div className="flex flex-col gap-3 justify-center">
              <Link
                href={`/pedidos/${success.pedido_id}`}
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-3 font-semibold text-sm tracking-wide hover:bg-[#E4C06A] transition-colors duration-200 rounded-sm"
              >
                <Package className="w-4 h-4" />
                SEGUIR MI PEDIDO
              </Link>

              <a
                href={getWhatsAppLink(
                  `Hola! Acabo de hacer el pedido ${success.numero_pedido} para el producto ${product.nombre}. Quiero confirmar mi orden.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#C9A84C] text-[#C9A84C] px-6 py-3 font-semibold text-sm tracking-wide hover:bg-[#C9A84C]/10 transition-colors duration-200 rounded-sm"
              >
                CONFIRMAR POR WHATSAPP 📱
              </a>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl text-gold-gradient uppercase tracking-widest mb-2 border-b border-kdb-border pb-2">
              Datos para el Pedido
            </h3>

            {/* Error alerts */}
            {serverError && (
              <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/20 text-[#E53E3E] p-4 text-sm flex items-start gap-2 rounded-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {!selectedSize && (
              <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#E4C06A] p-4 text-xs flex items-start gap-2 rounded-sm shadow-glow-gold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
                <span className="font-medium tracking-wide">Por favor, selecciona una talla antes de completar el pedido.</span>
              </div>
            )}

            <div>
              <label htmlFor="cliente_nombre" className={labelClasses}>
                Nombre Completo *
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted group-focus-within:text-gold transition-colors duration-300">
                  <User className="w-5 h-5" />
                </span>
                <input
                  id="cliente_nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className={`${inputClasses} pl-11`}
                  {...register('cliente_nombre')}
                />
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
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted group-focus-within:text-gold transition-colors duration-300">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    id="cliente_whatsapp"
                    type="tel"
                    placeholder="Ej: 999888777"
                    className={`${inputClasses} pl-11`}
                    {...register('cliente_whatsapp')}
                  />
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
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted group-focus-within:text-gold transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    id="cliente_email"
                    type="email"
                    placeholder="Ej: juan@gmail.com"
                    className={`${inputClasses} pl-11`}
                    {...register('cliente_email')}
                  />
                </div>
                {errors.cliente_email && (
                  <p className={errorClasses}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cliente_email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cliente_direccion" className={labelClasses}>
                  Dirección de entrega (Opcional)
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted group-focus-within:text-gold transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <input
                    id="cliente_direccion"
                    type="text"
                    placeholder="Dirección completa"
                    className={`${inputClasses} pl-11`}
                    {...register('cliente_direccion')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cliente_ciudad" className={labelClasses}>
                  Ciudad (Opcional)
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted group-focus-within:text-gold transition-colors duration-300">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <input
                    id="cliente_ciudad"
                    type="text"
                    placeholder="Ej: Lima, Arequipa"
                    className={`${inputClasses} pl-11`}
                    {...register('cliente_ciudad')}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notas" className={labelClasses}>
                Notas adicionales (Opcional)
              </label>
              <div className="relative group">
                <span className="absolute top-3 left-3.5 text-text-muted group-focus-within:text-gold transition-colors duration-300">
                  <FileText className="w-5 h-5" />
                </span>
                <textarea
                  id="notas"
                  rows={2}
                  placeholder="Ej: Talla equivalente en US, horario de entrega, etc."
                  className={`${inputClasses} pl-11 resize-none`}
                  {...register('notas')}
                />
              </div>
            </div>

            {errors.talla && (
              <p className="text-sm text-[#E53E3E] font-medium text-center">
                {errors.talla.message}
              </p>
            )}

            <div className="pt-2">
              <GoldButton
                type="submit"
                disabled={isSubmitting || !selectedSize}
                className="w-full flex justify-center items-center gap-2 rounded-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    PROCESANDO...
                  </>
                ) : (
                  <>HACER PEDIDO — {formatPrice(product.precio)}</>
                )}
              </GoldButton>

              <a
                href={getWhatsAppLink(
                  `Hola! Estoy interesado en el producto: ${product.nombre} en talla ${selectedSize || '(no seleccionada)'}. Me gustaría más información.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex justify-center items-center gap-2 bg-[#25D366] text-[#0A0A0A] font-semibold tracking-wider text-sm hover:bg-[#20ba56] py-3 px-6 transition-colors duration-200 rounded-sm"
              >
                CONSULTAR POR WHATSAPP 💬
              </a>
            </div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
