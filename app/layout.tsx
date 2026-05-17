import type { Metadata } from "next";
import { Playfair_Display, Caveat, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Diffy — Sua Copilota Estratégica",
  description:
    "A copilota estratégica que faltava no seu negócio. Mora no seu WhatsApp. Cuida do financeiro, do conteúdo, dos clientes e dos contratos. R$ 88 por mês.",
  openGraph: {
    title: "Diffy — Sua Copilota Estratégica",
    description:
      "A primeira plataforma do Brasil pensada pra empreendedora solo. Funciona no WhatsApp. R$ 88/mês.",
    siteName: "Diffy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${caveat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
