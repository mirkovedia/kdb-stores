'use client';

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PedidoFormData } from '@/lib/validations';

interface CustomerFieldsProps {
  register: UseFormRegister<PedidoFormData>;
  errors: FieldErrors<PedidoFormData>;
}

/* Estilos compartidos de formulario en todo el sitio. */
export const INPUT_CLASSES =
  'h-12 w-full border border-line bg-surface px-4 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none';
export const LABEL_CLASSES = 'text-eyebrow mb-2 block text-ink';
export const ERROR_CLASSES = 'mt-2 text-xs text-danger';

/*
  Campos de datos del cliente, compartidos por los dos formularios de pedido.
  Cada label va asociado con htmlFor/id, y los errores se enlazan con
  aria-describedby para que un lector de pantalla los anuncie al enfocar.
*/
export function CustomerFields({ register, errors }: CustomerFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="cliente_nombre" className={LABEL_CLASSES}>
          Nombre completo *
        </label>
        <input
          id="cliente_nombre"
          type="text"
          placeholder="Juan Pérez"
          className={INPUT_CLASSES}
          aria-invalid={Boolean(errors.cliente_nombre)}
          aria-describedby={errors.cliente_nombre ? 'err-nombre' : undefined}
          {...register('cliente_nombre')}
        />
        {errors.cliente_nombre && (
          <p id="err-nombre" className={ERROR_CLASSES}>
            {errors.cliente_nombre.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cliente_whatsapp" className={LABEL_CLASSES}>
            WhatsApp *
          </label>
          <input
            id="cliente_whatsapp"
            type="tel"
            placeholder="999888777"
            className={INPUT_CLASSES}
            aria-invalid={Boolean(errors.cliente_whatsapp)}
            aria-describedby={errors.cliente_whatsapp ? 'err-whatsapp' : undefined}
            {...register('cliente_whatsapp')}
          />
          {errors.cliente_whatsapp && (
            <p id="err-whatsapp" className={ERROR_CLASSES}>
              {errors.cliente_whatsapp.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cliente_email" className={LABEL_CLASSES}>
            Email *
          </label>
          <input
            id="cliente_email"
            type="email"
            placeholder="juan@gmail.com"
            className={INPUT_CLASSES}
            aria-invalid={Boolean(errors.cliente_email)}
            aria-describedby={errors.cliente_email ? 'err-email' : undefined}
            {...register('cliente_email')}
          />
          {errors.cliente_email && (
            <p id="err-email" className={ERROR_CLASSES}>
              {errors.cliente_email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cliente_direccion" className={LABEL_CLASSES}>
            Dirección de entrega
          </label>
          <input
            id="cliente_direccion"
            type="text"
            placeholder="Av. Ejemplo 123, Dpto. 4B"
            className={INPUT_CLASSES}
            {...register('cliente_direccion')}
          />
        </div>

        <div>
          <label htmlFor="cliente_ciudad" className={LABEL_CLASSES}>
            Ciudad
          </label>
          <input
            id="cliente_ciudad"
            type="text"
            placeholder="Lima"
            className={INPUT_CLASSES}
            {...register('cliente_ciudad')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notas" className={LABEL_CLASSES}>
          Notas adicionales
        </label>
        <textarea
          id="notas"
          rows={3}
          placeholder="Talla equivalente en US, horario de entrega, etc."
          className="w-full resize-none border border-line bg-surface px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none"
          {...register('notas')}
        />
      </div>
    </>
  );
}
