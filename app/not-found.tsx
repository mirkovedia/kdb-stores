import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-kdb py-24 text-center md:py-32">
      <p className="text-eyebrow text-ink-muted">Error 404</p>

      <h1 className="text-section mx-auto mt-6 max-w-lg text-ink">
        Esta página no existe
      </h1>

      <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
        El enlace puede estar roto o el producto que buscabas ya no está en el
        catálogo.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/catalogo" variant="primary" size="md">
          Ver catálogo
        </Button>
        <Button href="/" variant="outline" size="md">
          Ir al inicio
        </Button>
      </div>
    </div>
  );
}
