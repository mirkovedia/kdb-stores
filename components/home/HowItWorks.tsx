import { SectionTitle } from '@/components/ui/SectionTitle';
import { getWhatsAppLink } from '@/lib/utils';

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Elegí tu producto',
    description:
      'Navegá el catálogo y seleccioná el modelo y la talla que buscás.',
  },
  {
    number: '02',
    title: 'Hacé tu pedido',
    description:
      'Completá el formulario con tus datos. No necesitás crear una cuenta.',
  },
  {
    number: '03',
    title: 'Lo traemos para vos',
    description:
      'Importamos tu pedido y te avisamos por WhatsApp en cada paso.',
  },
];

/*
  Tres pasos numerados sobre gris, sin tarjetas ni iconos. El número grande
  es el único elemento gráfico que hace falta para ordenar la lectura.
  Server Component: la sección no tiene estado ni animación.
*/
export function HowItWorks() {
  return (
    <section id="como-funciona" className="section-y bg-surface-muted">
      <div className="container-kdb">
        <SectionTitle
          title="Cómo funciona"
          subtitle="Tres pasos entre elegir tu par y tenerlo en la puerta."
          align="center"
        />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="border-t border-ink pt-6">
              <span className="text-eyebrow text-ink-muted">{step.number}</span>
              <h3 className="text-product mt-4 text-ink">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href={getWhatsAppLink('Hola, me interesa hacer un pedido.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nav link-underline text-ink"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
