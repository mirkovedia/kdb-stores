import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getWhatsAppLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'KDB Stores importa sneakers y streetwear originales desde Nueva York y Lima. Conocé cómo trabajamos y nuestras garantías.',
};

const STATS = [
  { value: '3,486', label: 'Seguidores en Instagram' },
  { value: '35+', label: 'Drops exclusivos' },
  { value: '100%', label: 'Envíos asegurados en Perú' },
];

const VALUES = [
  {
    title: 'Autenticidad absoluta',
    desc: 'Todo se verifica antes de viajar. Cero réplicas, sin excepciones.',
  },
  {
    title: 'Transparencia',
    desc: 'Te informamos cada movimiento de tu pedido, desde Nueva York hasta tu puerta.',
  },
  {
    title: 'Trato personal',
    desc: 'No somos una corporación: te atendemos de coleccionista a coleccionista.',
  },
];

const GUARANTEES = [
  {
    title: 'Originales 100%',
    desc: 'Nuestros productos vienen de tiendas oficiales y distribuidores autorizados en Nueva York y Lima.',
  },
  {
    title: 'Seguimiento en tiempo real',
    desc: 'Seguí la importación y la entrega de tu pedido desde el tracker online, sin recargar la página.',
  },
  {
    title: 'Soporte por WhatsApp',
    desc: 'Coordinación directa para asegurar que la talla y el modelo sean los correctos.',
  },
];

const PAYMENTS = [
  { name: 'Yape / Plin', desc: 'Pago inmediato sin comisiones' },
  { name: 'Transferencia', desc: 'BCP, BBVA, Interbank y Scotiabank' },
  { name: 'Efectivo', desc: 'Previa coordinación, en Lima' },
];

export default function NosotrosPage() {
  const whatsappUrl = getWhatsAppLink(
    'Hola KDB, me gustaría recibir asesoría sobre sus drops e importaciones.',
  );

  return (
    <div>
      {/* Portada */}
      <section className="container-kdb py-16 text-center md:py-24">
        <p className="text-eyebrow text-ink-muted">Nuestra conexión</p>
        <h1 className="text-display mx-auto mt-6 max-w-3xl text-ink">
          Somos KDB
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ink-muted">
          Importamos desde Nueva York y Lima lo que no se consigue en Perú. La
          conexión directa con el streetwear más exclusivo y los sneakers más
          limitados de la cultura.
        </p>
      </section>

      {/* Cifras */}
      <section className="border-y border-line bg-surface-muted">
        <div className="container-kdb grid grid-cols-1 divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-6 py-10 text-center">
              <p className="text-2xl font-bold tracking-[0.05em] text-ink md:text-3xl">
                {stat.value}
              </p>
              <p className="text-eyebrow mt-3 text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historia y valores */}
      <section className="container-kdb py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-section text-ink">Nuestra historia</h2>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink-muted">
              <p>
                KicksD&apos;Barrio nació del amor por la cultura urbana y de la
                frustración de no encontrar lanzamientos exclusivos en el
                mercado local. Lo que empezó como una cuenta de Instagram
                compartiendo drops limitados se volvió un hub confiable de
                importación directa.
              </p>
              <p>
                Trabajamos con personal shoppers en Nueva York para rastrear y
                conseguir lanzamientos de Supreme, Nike SB, Jordan, Off-White y
                Essentials, asegurando autenticidad total en cada producto que
                viaja al país.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section text-ink">Nuestros valores</h2>
            <ol className="mt-8">
              {VALUES.map((value, i) => (
                <li key={value.title} className="border-t border-line py-6">
                  <div className="flex gap-5">
                    <span className="text-eyebrow shrink-0 pt-0.5 text-ink-subtle">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-product text-ink">{value.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {value.desc}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Garantías */}
      <section className="border-t border-line bg-surface-muted py-16 md:py-24">
        <div className="container-kdb">
          <SectionTitle
            title="Nuestras garantías"
            subtitle="Comprá con respaldo en cada paso del proceso."
            align="center"
          />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="border-t border-ink pt-6">
                <h3 className="text-product text-ink">{g.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medios de pago */}
      <section className="container-kdb py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
          <div>
            <h2 className="text-section text-ink">Medios de pago</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">
              Coordinamos el pago de forma rápida y segura, sin pasarela en
              línea.
            </p>
          </div>

          <dl className="md:col-span-2 md:grid md:grid-cols-3 md:gap-8">
            {PAYMENTS.map((p) => (
              <div key={p.name} className="border-t border-line py-5 md:py-0 md:pt-6">
                <dt className="text-product text-ink">{p.name}</dt>
                <dd className="mt-2 text-sm text-ink-muted">{p.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Cierre */}
      <section className="border-t border-line">
        <div className="container-kdb py-16 text-center md:py-24">
          <h2 className="text-section text-ink">¿Listo para tu próximo par?</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-muted">
            Explorá el catálogo actual o escribinos para cotizar ese modelo que
            venís buscando.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/catalogo" variant="primary" size="lg">
              Explorar catálogo
            </Button>
            <Button href={whatsappUrl} variant="outline" size="lg" external>
              Pedir por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
