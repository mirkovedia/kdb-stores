/**
 * Limitador de frecuencia por IP para las rutas API públicas.
 *
 * Usa una ventana deslizante en memoria del proceso. Es deliberadamente
 * simple: cero dependencias y cero latencia, y detiene el caso real que nos
 * afecta hoy —un formulario enviado en bucle, un script ingenuo, un bot que
 * descubre el endpoint de notificaciones y lo inunda—.
 *
 * Limitación conocida: en Vercel cada invocación puede correr en una
 * instancia distinta, así que el contador NO es global. Alguien con muchas
 * peticiones paralelas puede repartirse entre instancias y evadirlo en
 * parte. Si el abuso se vuelve un problema real, el reemplazo es un contador
 * compartido (Upstash Redis o similar) manteniendo esta misma interfaz.
 */

interface Entry {
  /** Marcas de tiempo de las peticiones dentro de la ventana actual. */
  hits: number[];
}

const buckets = new Map<string, Entry>();

/** Cada cuánto se limpian las entradas vencidas, para que el Map no crezca. */
const CLEANUP_EVERY = 500;
let callsSinceCleanup = 0;

function cleanup(windowMs: number) {
  const cutoff = Date.now() - windowMs;
  for (const [key, entry] of buckets) {
    const fresh = entry.hits.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      buckets.delete(key);
    } else {
      entry.hits = fresh;
    }
  }
}

export interface RateLimitResult {
  /** true si la petición está dentro del límite. */
  ok: boolean;
  /** Peticiones que quedan en la ventana actual. */
  remaining: number;
  /** Segundos hasta que se libere un cupo, para la cabecera Retry-After. */
  retryAfter: number;
}

/**
 * Registra una petición y dice si está permitida.
 *
 * @param key    Identificador del solicitante, normalmente `ruta:ip`.
 * @param limit  Peticiones permitidas por ventana.
 * @param windowMs Duración de la ventana en milisegundos.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  if (++callsSinceCleanup >= CLEANUP_EVERY) {
    callsSinceCleanup = 0;
    cleanup(windowMs);
  }

  const entry = buckets.get(key) ?? { hits: [] };
  // Ventana deslizante: solo cuentan las peticiones dentro del intervalo.
  entry.hits = entry.hits.filter((t) => t > cutoff);

  if (entry.hits.length >= limit) {
    const oldest = entry.hits[0];
    buckets.set(key, entry);
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  entry.hits.push(now);
  buckets.set(key, entry);

  return {
    ok: true,
    remaining: limit - entry.hits.length,
    retryAfter: 0,
  };
}

/**
 * Obtiene la IP del solicitante detrás del proxy de Vercel.
 *
 * `x-forwarded-for` puede traer una cadena de IPs; la primera es la del
 * cliente original. Si no hay cabecera, se agrupa todo bajo 'unknown': es
 * más seguro limitar de más que dejar pasar sin control.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
