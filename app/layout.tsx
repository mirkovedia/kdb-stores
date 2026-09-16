import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";

// Familia única del sitio: la jerarquía se construye con peso y tracking.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kdb-stores.vercel.app";

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
  return (
    <html lang="es" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-ink">
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
