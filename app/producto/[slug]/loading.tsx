/*
  Esqueleto de la ficha de producto.

  Replica el layout real (grilla de dos columnas, imagen 4/5, líneas del
  panel) en lugar de mostrar un spinner: si el placeholder no coincide con la
  forma final, la página salta al terminar de cargar.
*/
export default function Loading() {
  return (
    <div className="py-8 md:py-12">
      <div className="container-kdb">
        {/* Ruta de navegación */}
        <div className="mb-8 flex gap-2">
          <div className="skeleton h-3 w-12" />
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-32" />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Galería */}
          <div className="lg:col-span-7">
            <div className="skeleton aspect-[4/5] w-full" />
          </div>

          {/* Panel de compra */}
          <div className="lg:col-span-5">
            <div className="skeleton h-3 w-20" />
            <div className="mt-5 space-y-3">
              <div className="skeleton h-7 w-full" />
              <div className="skeleton h-7 w-2/3" />
            </div>

            <div className="skeleton mt-6 h-5 w-28" />

            <div className="mt-7 space-y-2">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
            </div>

            {/* Tallas */}
            <div className="mt-9">
              <div className="skeleton h-3 w-16" />
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-12 w-12" />
                ))}
              </div>
            </div>

            <div className="skeleton mt-10 h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
