import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KDB Stores | KicksD'Barrio — Sneakers & Streetwear Premium",
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
    description: "Sneakers & Streetwear Premium — Originales. Exclusivos. A tu puerta.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
