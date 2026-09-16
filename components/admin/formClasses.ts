/**
 * Clases de formulario del panel de administración.
 *
 * Los formularios de crear y editar producto son casi idénticos; tener las
 * clases acá evita que se desincronicen al ajustar uno solo.
 *
 * A diferencia del sitio público, el admin usa esquinas redondeadas (rounded-md):
 * es una herramienta de trabajo, y ahí la densidad y la familiaridad de los
 * controles importan más que la severidad visual de la tienda.
 */
export const ADMIN_INPUT =
  'w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none';

export const ADMIN_LABEL = 'mb-2 block text-sm font-medium text-ink';

export const ADMIN_ERROR = 'mt-2 text-xs text-danger';

/** Tarjeta contenedora de una sección del formulario. */
export const ADMIN_CARD = 'rounded-md border border-line bg-surface p-6';
