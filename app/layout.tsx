import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { SITE_URL } from "@/lib/utils";

// Familia única del sitio: la jerarquía se construye con peso y tracking.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KDB Stores | KicksD'Barrio — Sneakers & Streetwear Premium",
    template: "%s | KDB Stores",
  },
  description:
    "Sneakers exclusivos y streetwear premium importado desde New York y Lima. Nike, Jordan, Supreme, Bape y más. Originales. Exclusivos. A tu puerta. Envíos a todo Perú.",
  keywords: [
    "sneakers",
    "streetwear",
    "zapatillas",
    "supreme",
    "jordan",
    "nike",
    "peru",
    "lima",
    "kdb stores",
    "kicks d barrio",
  ],
  openGraph: {
    title: "KDB Stores | KicksD'Barrio",
    description:
      "Sneakers & Streetwear Premium — Originales. Exclusivos. A tu puerta.",
    type: "website",
    url: SITE_URL,
    siteName: "KDB Stores",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "KDB Stores | KicksD'Barrio",
    description:
      "Sneakers & Streetwear Premium — Originales. Exclusivos. A tu puerta.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
    JSON-LD de la tienda como entidad. El de la ficha de producto responde
    "qué es esto"; este responde "quién vende". Google los combina, y
    `areaServed` le dice que operamos en Perú, lo que ayuda en búsquedas
    locales frente a tiendas que no lo declaran.
  */
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "KDB Stores",
    alternateName: "KicksD'Barrio",
    description:
      "Sneakers y streetwear originales importados desde Nueva York y Lima.",
    url: SITE_URL,
    areaServed: { "@type": "Country", name: "PE" },
    currenciesAccepted: "PEN",
    paymentAccepted: "Yape, Plin, Transferencia, Contra entrega",
    sameAs: [
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
        "https://www.instagram.com/kdb.stores",
      "https://www.tiktok.com/@kdb.pee",
    ],
  };

  return (
    <html lang="es" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
