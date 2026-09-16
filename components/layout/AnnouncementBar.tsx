/*
  Barra de anuncio: franja negra fija arriba del navbar.
  Es el patrón de las tres referencias del rubro — comunica la promesa de
  envío antes de que el cliente vea un solo producto.
*/
export function AnnouncementBar() {
  return (
    <div className="bg-surface-inverse">
      <div className="container-kdb flex h-9 items-center justify-center">
        <p className="text-eyebrow text-ink-inverse">
          Envíos a todo el Perú — Originales garantizados
        </p>
      </div>
    </div>
  );
}
